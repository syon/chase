import Vue from 'vue';
import Vuex from 'vuex';
import Debug from 'debug';

import ChaseUtil from '@/lib/ChaseUtil';
import LambdaLibra from '@/lib/LambdaLibra';
import LambdaPocket from '@/lib/LambdaPocket';

const debug = Debug('chase:store');
Vue.use(Vuex);

const initialState = {
  login: {
    accessToken: '',
    username: '',
  },
  entries: {},
  libraInfo: {},
  hatebuCntSet: {},
  activeEid: '',
  myscenes: {},
};

/* eslint-disable operator-assignment, no-param-reassign */
export default new Vuex.Store({
  state: JSON.parse(JSON.stringify(initialState)),
  getters: {
    catalog(state) {
      const p = state.entries;
      const l = state.libraInfo;
      const h = state.hatebuCntSet;
      return ChaseUtil.makeCatalog(p, l, h);
    },
    filteredCatalog: (state, getters) => (route, tag) => {
      const arr = getters.catalog;
      let result = arr;
      if (route === 'Inbox') {
        result = arr.filter(d => Object.keys(d.tags).length === 0);
      } else if (route === 'Favorite') {
        result = arr.filter(d => d.favorite);
      } else if (route === 'Tag') {
        const tagged = arr.filter(d => Object.keys(d.tags).length > 0);
        result = tagged.filter(d => Object.keys(d.tags).includes(tag));
      }
      return result;
    },
    catalogCount(state, getters) {
      return getters.catalog.length;
    },
    activeEntry(state, getters) {
      const eid = state.activeEid;
      if (!eid) {
        return {};
      }
      return getters.catalog.find(e => e.eid === eid) || {};
    },
    recentTags(state) {
      let tags = [];
      const list = state.entries;
      Object.keys(list).forEach((key) => {
        const entry = list[key];
        tags = tags.concat(Object.keys(entry.tags));
      });
      tags = tags.filter(t => !t.match(/^chase:/));
      return [...new Set(tags)];
    },
    myScenesTags(state) {
      return [
        { tag: 'chase:a', label: state.myscenes.a },
        { tag: 'chase:b', label: state.myscenes.b },
        { tag: 'chase:c', label: state.myscenes.c },
      ];
    },
  },
  mutations: {
    increment(state) {
      state.count = state.count + 1;
    },
    updateEntries(state, newEntries) {
      state.entries = newEntries;
    },
    mergeEntries(state, newEntries) {
      state.entries = { ...state.entries, ...newEntries };
    },
    setLogin(state, payload) {
      state.login.accessToken = payload.access_token;
      state.login.username = payload.username;
    },
    logout(state) {
      Object.keys(initialState).forEach((key) => {
        state[key] = initialState[key];
      });
    },
    myscenes(state, myscenes) {
      state.myscenes = myscenes;
    },
    addLibraInfo(state, { eid, pageinfo }) {
      state.libraInfo = { ...state.libraInfo, [eid]: pageinfo };
    },
    addHatebuCnt(state, { eid, hatebuCnt }) {
      state.hatebuCntSet = { ...state.hatebuCntSet, [eid]: hatebuCnt };
    },
    activate(state, payload) {
      const { eid } = payload;
      state.activeEid = eid;
    },
    archive(state, payload) {
      const { eid } = payload;
      const entry = state.entries[eid];
      entry.archived = true;
      state.entries = { ...state.entries, [eid]: entry };
    },
    favorite(state, payload) {
      const { eid } = payload;
      const entry = state.entries[eid];
      entry.favorite = true;
      state.entries = { ...state.entries, [eid]: entry };
    },
    unfavorite(state, payload) {
      const { eid } = payload;
      const entry = state.entries[eid];
      entry.favorite = false;
      state.entries = { ...state.entries, [eid]: entry };
    },
    addTag(state, payload) {
      const { eid, tag } = payload;
      const entry = state.entries[eid];
      entry.tags = { ...entry.tags, [tag]: { item_id: eid, tag } };
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
    restoreLogin({ commit }, $cookie) {
      const at = $cookie.get('pocket_access_token');
      const un = $cookie.get('pocket_username');
      commit('setLogin', { access_token: at, username: un });
    },
    logout({ commit }, $cookie) {
      $cookie.delete('phase');
      $cookie.delete('pocket_access_token');
      $cookie.delete('pocket_username');
      commit('logout');
    },
    updateEntries(context, payload) {
      const newEntries = ChaseUtil.makeEntries(payload.list);
      context.commit('mergeEntries', newEntries);
      Object.keys(newEntries).forEach((key) => {
        const entry = newEntries[key];
        if (!entry.ready) {
          context.dispatch('fetchLibraS3', entry);
          context.dispatch('fetchHatebuCnt', entry);
        }
      });
    },
    doSceneEdit({ commit, dispatch }, { $cookie, scenes }) {
      debug('doSceneEdit', $cookie, scenes);
      $cookie.set('chase:a', scenes.a);
      $cookie.set('chase:b', scenes.b);
      $cookie.set('chase:c', scenes.c);
      dispatch('restoreScenes', $cookie);
    },
    restoreScenes({ commit, dispatch }, $cookie) {
      commit('myscenes', {
        a: $cookie.get('chase:a'),
        b: $cookie.get('chase:b'),
        c: $cookie.get('chase:c'),
      });
    },
    async actByPhase({ commit, dispatch }, $cookie) {
      const ph = $cookie.get('phase');
      const at = $cookie.get('pocket_access_token');
      debug('[actByPhase]', ph);
      if (ph === 'READY' && at) {
        dispatch('restoreLogin', $cookie);
        dispatch('fetchEntries');
        dispatch('restoreScenes', $cookie);
      } else if (ph === 'WAITING_ACCESSTOKEN') {
        await dispatch('getAccessToken', $cookie);
        await dispatch('fetchEntries');
        dispatch('restoreScenes', $cookie);
      } else {
        dispatch('logout', $cookie);
      }
    },
    async getRequestToken({ commit }, $cookie) {
      const json = await LambdaPocket.getRequestToken();
      $cookie.set('pocket_request_token', json.request_token, { expires: '3M' });
      $cookie.set('phase', 'WAITING_ACCESSTOKEN', { expires: '3M' });
      $cookie.set('chase:a', 'Scene A');
      $cookie.set('chase:b', 'Scene B');
      $cookie.set('chase:c', 'Scene C');
      return json.auth_uri;
    },
    async getAccessToken({ commit, state }, $cookie) {
      const rt = $cookie.get('pocket_request_token');
      const json = await LambdaPocket.getAccessToken(rt);
      commit('setLogin', json);
      $cookie.delete('pocket_request_token');
      $cookie.set('phase', 'READY', { expires: '3M' });
      $cookie.set('pocket_access_token', json.access_token, { expires: '3M' });
      $cookie.set('pocket_username', json.username, { expires: '3M' });
    },
    async fetchEntries({ state, dispatch }) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.get(at);
      dispatch('updateEntries', json);
    },
    async activate({ commit }, eid) {
      commit('activate', { eid });
    },
    async archive({ commit, state, dispatch }, eid) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.archive(at, eid);
      debug(json.status === 1);
      commit('archive', { eid });
    },
    async addTag({ commit, state, dispatch }, { eid, tag }) {
      const at = state.login.accessToken;
      await LambdaPocket.addTag(at, eid, tag);
      commit('addTag', { eid, tag });
    },
    async favorite({ commit, state, dispatch }, eid) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.favorite(at, eid);
      debug('[favorite]', json);
      commit('favorite', { eid });
    },
    async unfavorite({ commit, state, dispatch }, eid) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.unfavorite(at, eid);
      debug('[unfavorite]', json);
      commit('unfavorite', { eid });
    },
    async fetchLibraS3(context, entry) {
      const { eid } = entry;
      ChaseUtil.fetchLibraS3(eid)
        .then((pageinfo) => {
          context.commit('addLibraInfo', { eid, pageinfo });
        })
        .catch(() => {
          debug('First scraping for S3...', eid);
          context.dispatch('fetchLibraInfo', entry);
        });
    },
    async fetchLibraInfo(context, payload) {
      const { eid, url } = payload;
      const pageinfo = await LambdaLibra.info({ eid, url });
      context.commit('addLibraInfo', { eid, pageinfo });
    },
    async fetchLibraThumb(context, payload) {
      const { eid, url, image_suggested } = payload;
      debug('[fetchLibraThumb]>>>>');
      return LambdaLibra.thumb({ eid, url, image_suggested })
        .then((r) => {
          debug('[fetchLibraThumb]<<<<', r);
          return r.ETag;
        });
    },
    async fetchHatebuCnt(context, entry) {
      const { eid, url } = entry;
      const hatebuCnt = await ChaseUtil.fetchHatebuCnt(url);
      context.commit('addHatebuCnt', { eid, hatebuCnt });
    },
  },
});

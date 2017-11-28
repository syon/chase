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
  activeEid: '',
  mytags: [],
  myscenes: {},
};

/* eslint-disable operator-assignment, no-param-reassign */
export default new Vuex.Store({
  state: JSON.parse(JSON.stringify(initialState)),
  getters: {
    catalog(state) {
      const list = state.entries;
      const arr = Object.keys(list).map((key) => {
        const info = state.libraInfo[key];
        const entry = list[key];
        entry.ready = !!info;
        return { ...entry, ...info };
      });
      return arr.sort((a, b) => {
        if (a.sortId > b.sortId) return 1;
        if (a.sortId < b.sortId) return -1;
        return 0;
      });
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
    mytags(state, mytags) {
      state.mytags = mytags;
    },
    myscenes(state, myscenes) {
      state.myscenes = myscenes;
    },
    addLibraInfo(state, { eid, pageinfo }) {
      state.libraInfo = { ...state.libraInfo, [eid]: pageinfo };
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
      context.commit('updateEntries', newEntries);
      Object.keys(newEntries).forEach((key) => {
        const entry = newEntries[key];
        if (!entry.ready) {
          context.dispatch('fetchLibraInfo', entry);
        }
      });
    },
    restoreMyTags({ commit, dispatch }, $cookie) {
      const tags = JSON.parse($cookie.get('mytags'));
      debug('restoreMyTags', tags);
      commit('mytags', tags);
      // 3 Scenes
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
        dispatch('restoreMyTags', $cookie);
      } else if (ph === 'WAITING_ACCESSTOKEN') {
        dispatch('getAccessToken', $cookie);
      } else {
        dispatch('logout', $cookie);
      }
    },
    async getRequestToken({ commit }, $cookie) {
      const json = await LambdaPocket.getRequestToken();
      // commit('setRequestToken', json);
      $cookie.set('pocket_request_token', json.request_token, { expires: '3M' });
      $cookie.set('phase', 'WAITING_ACCESSTOKEN', { expires: '3M' });
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
    async fetchFavorites({ state, dispatch }) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.getFavorites(at);
      dispatch('updateEntries', json);
    },
    async fetchByTag({ state, dispatch }, tag) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.getByTag(at, tag);
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
  },
});

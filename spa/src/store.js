import Vue from 'vue';
import Vuex from 'vuex';
import Debug from 'debug';

import ChaseUtil from '@/lib/ChaseUtil';
import Hatebu from '@/lib/Hatebu';
import LambdaShot from '@/lib/LambdaShot';
import LambdaLibra from '@/lib/LambdaLibra';
import LambdaPocket from '@/lib/LambdaPocket';
import LambdaUser from '@/lib/LambdaUser';

const debug = Debug('chase:store');
Vue.use(Vuex);

const initialState = {
  login: {
    accessToken: '',
    username: '',
  },
  progress: {
    unread: 0,
    archive: 0,
    all: 0,
  },
  entries: {},
  libraInfo: {},
  hatebuCntSet: {},
  shotSet: {},
  hatebuSet: {},
  hatebuStarSet: {},
  hatebuStarLoading: false,
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
      const s = state.shotSet;
      return ChaseUtil.makeCatalog(p, l, h, s);
    },
    filteredCatalog: (state, getters) => (route, tag, filterTxt) => {
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
      if (filterTxt) {
        result = result.filter((d) => {
          const tgt = `${d.title}${d.excerpt}${d.description}${d.site_name}${d.fqdn}`;
          return tgt.toUpperCase().includes(filterTxt.toUpperCase());
        });
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
    updateEntries(state, newEntries) {
      state.entries = newEntries;
    },
    mergeEntries(state, newEntries) {
      state.entries = { ...state.entries, ...newEntries };
    },
    setLogin(state, payload) {
      const { access_token: accesstoken, username } = payload;
      state.login.accessToken = accesstoken;
      state.login.username = username;
    },
    logout(state) {
      Object.keys(initialState).forEach((key) => {
        state[key] = initialState[key];
      });
    },
    setProgress(state, payload) {
      const { unread, archive } = payload;
      state.progress = { unread, archive, all: unread + archive };
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
    addShot(state, { eid }) {
      state.shotSet = { ...state.shotSet, [eid]: 'ordered' };
    },
    addHatebu(state, { eid, hatebu }) {
      state.hatebuSet = { ...state.hatebuSet, [eid]: hatebu };
    },
    addHatebuStar(state, { eid, starSet }) {
      state.hatebuStarSet = { ...state.hatebuStarSet, [eid]: starSet };
    },
    setHatebuStarLoading(state, judge) {
      state.hatebuStarLoading = judge;
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
        dispatch('fetchProgress');
        dispatch('fetchEntries');
        dispatch('restoreScenes', $cookie);
      } else if (ph === 'WAITING_ACCESSTOKEN') {
        await dispatch('getAccessToken', $cookie);
        await dispatch('actByPhase', $cookie);
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
      LambdaUser.login(json);
      commit('setLogin', json);
      $cookie.delete('pocket_request_token');
      $cookie.set('phase', 'READY', { expires: '3M' });
      $cookie.set('pocket_access_token', json.access_token, { expires: '3M' });
      $cookie.set('pocket_username', json.username, { expires: '3M' });
    },
    async fetchProgress({ state, commit }) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.progress(at);
      commit('setProgress', json);
    },
    async fetchEntries({ state, dispatch }) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.get(at);
      dispatch('updateEntries', json);
    },
    async activate({ commit, dispatch }, entry) {
      const { eid } = entry;
      commit('activate', { eid });
      await dispatch('fetchHatebu', entry);
      await dispatch('makeHatebuRanking', entry);
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
    async fetchShot(context, payload) {
      const { eid, url } = payload;
      if (!eid) return;
      context.commit('addShot', { eid });
      await LambdaShot.shot({ eid, url });
    },
    async fetchHatebu(context, payload) {
      const { eid, url } = payload;
      const hatebu = await Hatebu.fetch(url);
      context.commit('addHatebu', { eid, hatebu });
    },
    async makeHatebuRanking({ state, commit }, payload) {
      debug('makeHatebuRanking', payload);
      const { eid, force } = payload;
      const hatebu = state.hatebuSet[eid];
      if (!hatebu) return;
      const comments = hatebu.bookmarks.filter(d => d.comment.length !== 0);
      let needsFetch = false;
      if (comments.length < 100) {
        const starSet = state.hatebuStarSet[eid];
        if (starSet) {
          debug('Already fetched stars.');
        } else {
          debug('Auto fetching stars...');
          needsFetch = true;
        }
      }
      if (force) needsFetch = true;
      if (needsFetch) {
        commit('setHatebuStarLoading', true);
        const set = await Hatebu.fetchStarSet(hatebu);
        commit('addHatebuStar', { eid, starSet: set });
        commit('setHatebuStarLoading', false);
      }
    },
  },
});

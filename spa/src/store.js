import Vue from 'vue';
import Vuex from 'vuex';
import Debug from 'debug';

import ChaseUtil from '@/lib/ChaseUtil';
import LambdaLibra from '@/lib/LambdaLibra';
import LambdaPocket from '@/lib/LambdaPocket';

const debug = Debug('chase:store');
Vue.use(Vuex);

/* eslint-disable operator-assignment, no-param-reassign */
export default new Vuex.Store({
  state: {
    count: 777,
    login: {
      requestToken: '',
      authUri: '',
      accessToken: '',
      username: '',
    },
    entries: {},
    libraInfo: {},
  },
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
    setRequestToken(state, payload) {
      state.login.requestToken = payload.request_token;
      state.login.authUri = payload.auth_uri;
    },
    setLogin(state, payload) {
      state.login.accessToken = payload.access_token;
      state.login.username = payload.username;
    },
    addLibraInfo(state, { eid, pageinfo }) {
      state.libraInfo = { ...state.libraInfo, [eid]: pageinfo };
    },
    archive(state, payload) {
      const { eid } = payload;
      const entry = state.entries[eid];
      entry.archived = true;
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
    async getRequestToken({ commit }) {
      const json = await LambdaPocket.getRequestToken();
      commit('setRequestToken', json);
    },
    async getAccessToken({ commit, state }) {
      const rt = state.login.requestToken;
      const json = await LambdaPocket.getAccessToken(rt);
      commit('setLogin', json);
      return json;
    },
    async fetchEntries({ state, dispatch }) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.get(at);
      dispatch('updateEntries', json);
    },
    async archive({ commit, state, dispatch }, eid) {
      const at = state.login.accessToken;
      const json = await LambdaPocket.archive(at, eid);
      debug(json.status === 1);
      commit('archive', { eid });
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

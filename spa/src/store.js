import Vue from 'vue';
import Vuex from 'vuex';
import Debug from 'debug';

import Libra from '@/adaptors/LibraAdaptor';
import ChaseUtil from '@/lib/ChaseUtil';
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
        return { ...list[key], ...info };
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
    setAccessToken(state, payload) {
      state.login.accessToken = payload.access_token;
      state.login.username = payload.username;
    },
    addLibraInfo(state, { eid, pageinfo }) {
      state.libraInfo = { ...state.libraInfo, [eid]: pageinfo };
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
    updateEntries(context, payload) {
      const newEntries = ChaseUtil.makeEntries(payload.list);
      context.commit('updateEntries', newEntries);
      Object.keys(newEntries).forEach((key) => {
        context.dispatch('fetchLibraInfo', newEntries[key]);
      });
    },
    async getRequestToken({ commit }) {
      const json = await LambdaPocket.getRequestToken();
      commit('setRequestToken', json);
    },
    async getAccessToken({ commit, state }) {
      const rt = state.login.requestToken;
      const json = await LambdaPocket.getAccessToken(rt);
      commit('setAccessToken', json);
      return json;
    },
    async fetchLibraInfo(context, payload) {
      const { eid, url } = payload;
      const pageinfo = await Libra.info({ eid, url });
      context.commit('addLibraInfo', { eid, pageinfo });
    },
    async fetchLibraThumb(context, payload) {
      const { eid, url, image_suggested } = payload;
      debug('[fetchLibraThumb]>>>>');
      return Libra.thumb({ eid, url, image_suggested })
        .then((r) => {
          debug('[fetchLibraThumb]<<<<', r);
          return r.ETag;
        });
    },
  },
});

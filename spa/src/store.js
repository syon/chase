import Vue from 'vue';
import Vuex from 'vuex';

import Libra from '@/adaptors/LibraAdaptor';
import ChaseUtil from '@/lib/ChaseUtil';

Vue.use(Vuex);

/* eslint-disable operator-assignment, no-param-reassign */
export default new Vuex.Store({
  state: {
    count: 777,
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
    async fetchLibraInfo(context, payload) {
      const { eid, url } = payload;
      const pageinfo = Libra.info({ eid, url });
      context.commit('addLibraInfo', { eid, pageinfo });
    },
  },
});

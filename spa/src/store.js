import Vue from 'vue';
import Vuex from 'vuex';

const CHASE_API_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

Vue.use(Vuex);

function getDate(time10) {
  const dt = new Date(time10 * 1000);
  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  return `${y}.${m}.${d}`;
}

function moldRawItem(pocketRawItem) {
  const m = pocketRawItem;
  const url = m.resolved_url ? m.resolved_url : m.given_url;
  const title = m.resolved_title ? m.resolved_title : m.given_title;
  return {
    eid: m.item_id,
    url,
    image_suggested: (m.has_image === '1') ? m.image.src : '',
    title,
    excerpt: m.excerpt,
    fqdn: `${url}/`.match(/\/\/(.*?)\//)[1],
    sortId: m.sort_id,
    tags: m.tags || {},
    date: getDate(m.time_added),
  };
}

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
      const newEntries = {};
      const listFromPocket = payload.list;
      Object.keys(listFromPocket).forEach((key) => {
        newEntries[key] = moldRawItem(listFromPocket[key]);
      });
      context.commit('updateEntries', newEntries);
      Object.keys(newEntries).forEach((key) => {
        context.dispatch('fetchLibraInfo', newEntries[key]);
      });
    },
    async fetchLibraInfo(context, payload) {
      const eid = payload.eid;
      const url = payload.url;
      const pageinfo = await fetch(`${CHASE_API_ENDPOINT}/libra/info?url=${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return {};
      });
      context.commit('addLibraInfo', { eid, pageinfo });
    },
  },
});

import Vue from 'vue';
import Vuex from 'vuex';

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
    },
  },
});

import Vue from 'vue';
import Vuex from 'vuex';

import Libra from '@/adaptors/LibraAdaptor';

const CHASE_S3_BASE_URL = 'https://s3.amazonaws.com/syon-chase';

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
  const item10Id = `0000000000${m.item_id}`.substr(-10, 10);
  const itemId3 = item10Id.slice(0, 3);
  const s3path = `items/thumbs/${itemId3}/${item10Id}.jpg`;
  return {
    eid: m.item_id,
    url,
    image_suggested: (m.has_image === '1') ? m.image.src : '',
    image_s3_url: `${CHASE_S3_BASE_URL}/${s3path}`,
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
      const { eid, url } = payload;
      const pageinfo = Libra.info({ eid, url });
      context.commit('addLibraInfo', { eid, pageinfo });
    },
  },
});

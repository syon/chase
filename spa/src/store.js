import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/* eslint-disable operator-assignment, no-param-reassign */
export default new Vuex.Store({
  state: {
    count: 777,
    apiResult: {},
  },
  mutations: {
    increment(state) {
      state.count = state.count + 1;
    },
    setApiResult(state, payload) {
      state.apiResult = payload;
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
    setApiResult(context, payload) {
      context.commit('setApiResult', payload);
    },
  },
});

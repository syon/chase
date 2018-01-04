// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import { sync } from 'vuex-router-sync';
import VueAnalytics from 'vue-analytics';
import 'babel-polyfill';
import 'whatwg-fetch';
import 'css-browser-selector';

import App from './App';
import router from './router';
import store from './store';

sync(store, router);

Vue.config.productionTip = false;
Vue.use(VueCookie);
Vue.use(VueAnalytics, {
  id: 'UA-37634759-14',
  router,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});

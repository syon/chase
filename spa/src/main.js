import Vue from "vue";
import VueCookie from "vue-cookie";
import { sync } from "vuex-router-sync";
import VueAnalytics from "vue-analytics";
import "babel-polyfill";
import "whatwg-fetch";
import "css-browser-selector";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/app.stylus";

sync(store, router);

Vue.config.productionTip = false;
Vue.use(VueCookie);
Vue.use(VueAnalytics, {
  id: "UA-37634759-14",
  router
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

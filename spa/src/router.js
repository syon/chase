import Vue from "vue";
import Router from "vue-router";
import Welcome from "@/screens/Welcome";
import Catalog from "@/screens/Catalog";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/welcome",
      name: "Welcome",
      component: Welcome
    },
    {
      path: "/",
      name: "Inbox",
      component: Catalog
    },
    {
      path: "/favorite",
      name: "Favorite",
      component: Catalog
    },
    {
      path: "/tag/:tag",
      name: "Tag",
      component: Catalog
    },
    {
      path: "/config",
      name: "Config",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "@/screens/Config")
    }
  ]
});

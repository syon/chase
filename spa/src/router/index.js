import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/screens/Welcome';
import Catalog from '@/screens/Catalog';
import Config from '@/screens/Config';

import '@/assets/app.stylus';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
    },
    {
      path: '/',
      name: 'Inbox',
      component: Catalog,
    },
    {
      path: '/favorite',
      name: 'Favorite',
      component: Catalog,
    },
    {
      path: '/tag/:tag',
      name: 'Tag',
      component: Catalog,
    },
    {
      path: '/config',
      name: 'Config',
      component: Config,
    },
  ],
});

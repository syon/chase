import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/screens/Welcome';
import HelloWorld from '@/screens/HelloWorld';
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
      component: HelloWorld,
    },
    {
      path: '/favorite',
      name: 'Favorite',
      component: HelloWorld,
    },
    {
      path: '/tag/:tag',
      name: 'Tag',
      component: HelloWorld,
    },
    {
      path: '/config',
      name: 'Config',
      component: Config,
    },
  ],
});

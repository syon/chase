import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import '@/assets/app.stylus';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Recent',
      component: HelloWorld,
    },
    {
      path: '/inbox',
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
  ],
});

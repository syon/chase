<template lang="pug">
#app.page-container
  nav.page-nav
    sidebar
  article.page-content
    router-view
  section.page-interlude
    interlude
</template>

<script>
import Sidebar from '@/components/Sidebar';
import Interlude from '@/components/Interlude';

export default {
  name: 'app',
  components: {
    Sidebar,
    Interlude,
  },
};
</script>

<style lang="stylus" scoped>
.page-container
  width 100%
  display flex
  .page-nav
    width 180px
  .page-content
    flex 1
    padding 0 15px
  .page-interlude
    width 320px
</style>

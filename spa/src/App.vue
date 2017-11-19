<template lang="pug">
#app.page-container
  nav.page-nav
    sidebar
  article.page-content
    router-view
</template>

<script>
import Sidebar from '@/components/Sidebar';

export default {
  name: 'app',
  components: {
    Sidebar,
  },
};
</script>

<style lang="stylus" scoped>
.page-container
  display flex
  .page-nav
    width 240px
  .page-content
    width 900px
</style>

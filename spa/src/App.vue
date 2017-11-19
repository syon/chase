<template lang="pug">
  #app.page-container
    nav.page-nav
      h1 Chase
    article.page-content
      router-view
</template>

<script>
export default {
  name: 'app',
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

<template lang="pug">
.entry
  dl.meta
    dt eid
    dd {{ obj.eid }}
    dt fqdn
    dd {{ obj.fqdn }}
    dt sortId
    dd {{ obj.sortId }}
    dt date
    dd {{ obj.date }}
  dl
    dt title
    dd {{ obj.title }}
    dt url
    dd {{ obj.url }}
    dt image_suggested
    dd {{ obj.image_suggested }}
    dt excerpt
    dd {{ obj.excerpt }}
    dt tags
    dd {{ obj.tags }}
</template>

<script>
export default {
  props: ['obj'],
};
</script>

<style lang="stylus" scoped>
.entry
  dl
    dt
      font-size 12px
  dl.meta
    dt, dd
      display inline-block
      padding 0 8px
    dt
      background-color black
      color white
    dd
      margin 0 1em 0 0
</style>

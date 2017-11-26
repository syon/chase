<template lang="pug">
.interlude
  template(v-if="entry.ready")
    figure
      img(:src="entry.image_s3_url")
    .title
      a(:href="entry.url" target="_blank") {{ entry.title }}
    .meta
      div.desc {{ entry.description }}
      div {{ entry.site_name }}
      div {{ Object.keys(entry.tags) }}
      div {{ entry.archived }}
      div {{ entry.fqdn }}
      div {{ entry.added }} 追加
      div {{ entry.updated }} 更新
      div
        button(@click="archive(entry.eid)") 既読
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      entry: 'activeEntry',
    }),
  },
  methods: {
    ...mapActions([
      'archive',
    ]),
  },
};
</script>

<style lang="stylus" scoped>
.interlude
  figure
    margin 0
    img
      width 100%
  .meta
    font-size 0.75em
</style>

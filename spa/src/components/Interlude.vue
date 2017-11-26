<template lang="pug">
.interlude
  template(v-if="entry.ready")
    figure
      img(:src="entry.image_s3_url")
    dl.meta
      dt article
      dd
        a(:href="entry.url" target="_blank") {{ entry.title }}
      dt description
      dd.desc {{ entry.description }}
      dt site_name
      dd {{ entry.site_name }}
      dt tags
      dd {{ Object.keys(entry.tags) }}
      dt archived
      dd {{ entry.archived }}
      dt fqdn
      dd {{ entry.fqdn }}
      dt added
      dd {{ entry.added }}
      dt updated
      dd {{ entry.updated }}
      dt send
      dd
        button(@click="archive(entry.eid)") archive
  template(v-else)
    p Loading...
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
  .desc
    font-size 0.75em
</style>

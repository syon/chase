<template lang="pug">
.entry
  template(v-if="obj.ready")
    dl.meta
      dt eid
      dd {{ obj.eid }}
      dt ready
      dd {{ obj.ready }}
      dt archived
      dd {{ obj.archived }}
      dt fqdn
      dd {{ obj.fqdn }}
      dt sortId
      dd {{ obj.sortId }}
      dt added
      dd {{ obj.added }}
      dt updated
      dd {{ obj.updated }}
      dt send
      dd
        button(@click="archive(obj.eid)") archive
    dl
      dt title
      dd {{ obj.title }}
      dt site_name
      dd {{ obj.site_name }}
      dt url
      dd {{ obj.url }}
      dt image_suggested
      dd {{ obj.image_suggested }}
      dt image_s3_url
      dd {{ obj.image_s3_url }}
      img(:src="imgSrc" @error="onLoadImageError")
      dt excerpt
      dd {{ obj.excerpt }}
      dt description
      dd {{ obj.description }}
      dt tags
      dd {{ Object.keys(obj.tags) }}
  template(v-else)
    p Loading...
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['obj'],
  data() {
    return {
      imgSrc: this.obj.image_s3_url,
    };
  },
  methods: {
    ...mapActions([
      'archive',
    ]),
    onLoadImageError() {
      this.$store.dispatch('fetchLibraThumb', this.obj)
        .then((ETag) => {
          this.imgSrc = `${this.imgSrc}?etag=${ETag}`;
        });
    },
  },
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

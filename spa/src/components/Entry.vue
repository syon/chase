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
      dt send
      dd
        button(@click="archive(obj.eid)") archive
      dt
      dd
        button(@click="activate(obj.eid)") activate
    dl
      dt article
      dd
        a(:href="obj.url" target="_blank") {{ obj.title }}
      dt site_name
      dd {{ obj.site_name }}
      img.thumb(:src="imgSrc" @error="onLoadImageError")
      dt excerpt
      dd.excerpt {{ obj.excerpt }}
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
      'activate',
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
  .thumb
    width 100px
    height 80px
  .excerpt
    font-size 0.75em
</style>

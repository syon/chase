<template lang="pug">
.entry(:data-eid="obj.eid" :class="{ archived: obj.archived }")
  template(v-if="obj.ready")
    .pnl
      .pnl-thumb
        figure
          img.thumb(:src="imgSrc" @error="onLoadImageError")
      .pnl-body
        .link
          a(:href="obj.url" target="_blank") {{ obj.title }}
        .excerpt {{ obj.excerpt }}
        .meta
          span.site {{ obj.site_name }}
          span.fqdn {{ obj.fqdn }}
        .tags
          span(v-for="tag in Object.keys(obj.tags)") {{ tag }}
      .pnl-action
        button(@click="archive(obj.eid)") 既読
        button(@click="activate(obj.eid)") 詳細
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
.pnl
  display flex
  .pnl-thumb
    figure
      margin 0 15px 0 0
  .pnl-body
    flex 1
  .pnl-action
    width 60px
    display flex
    flex-direction column
    align-items center
    justify-content space-around

.entry
  &.archived
    background-color #ddd
  .thumb
    width 100px
    height 80px
  .excerpt
    font-size 0.75em
  .meta
    font-size 0.75em
    span
      margin-right 1em
</style>

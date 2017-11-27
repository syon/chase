<template lang="pug">
.compo(:data-eid="obj.eid" :class="{ archived: obj.archived }")
  template(v-if="obj.ready")
    .pnl
      .pnl-thumb
        figure
          img.thumb(:src="imgSrc" @error="onLoadImageError")
      .pnl-body
        .link
          a(:href="obj.url" target="_blank") {{ linkTitle }}
        .excerpt {{ obj.excerpt }}
        .meta
          span.site(v-if="obj.site_name") {{ obj.site_name }}
          span.fqdn {{ obj.fqdn }}
        template(v-if="obj.tags[0]")
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
  computed: {
    linkTitle() {
      return this.obj.title ? this.obj.title : this.obj.url;
    },
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
      display flex
      margin 0 15px 0 0
      width 100px
      height 80px
      overflow hidden
      align-items center
      justify-content center
  .pnl-body
    flex 1
    display flex
    flex-direction column
  .pnl-action
    width 60px
    display flex
    flex-direction column
    align-items center
    justify-content space-around

.compo
  min-height 80px
  padding 5px 0
  color #757575
  &.archived
    background-color #ddd
  .thumb
    width 100px
    height 80px
  .link
    margin 0 0 .25em
    line-height 1.3
    word-break break-word
    a
      font-weight bold
      text-decoration none
  .excerpt
    font-size 0.67em
    -webkit-line-clamp 2
    display -webkit-box
    -webkit-box-orient vertical
    overflow hidden
  .meta
    font-size 0.75em
    span
      margin-right 1em
</style>

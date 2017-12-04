<template lang="pug">
.interlude
  template(v-if="entry.ready")
    figure
      img(:src="entry.image_s3_url")
    .link
      a(:href="entry.url" target="_blank") {{ linkTitle }}
    .meta
      div {{ entry.site_name }} ({{ entry.fqdn }})
    .desc {{ entry.description }}
    hr
    .action
      button(@click="archive(entry.eid)") 既読
      div {{ entry.added }}
    hr
    .addscenes
      button.scene(v-for="sce in scenes" @click="addTag({ eid: entry.eid, tag: sce.tag })") {{ sce.label }}
    hr
    .tags
      .tag(v-for="tag in recentTags" @click="addTag({ eid: entry.eid, tag })" :class="{ applied: Object.keys(entry.tags).includes(tag) }") {{ tag }}

  hr

  section
    .todo
      em ToDo:
      ul
        li Google Analytics
        li merge master
        li Capture
        li はてブ パネル
        li タグ編集
        li 消化進捗
        li /etc/hosts
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      mytags: 'mytags',
    }),
    ...mapGetters({
      entry: 'activeEntry',
      scenes: 'myScenesTags',
      recentTags: 'recentTags',
    }),
    linkTitle() {
      return this.entry.title ? this.entry.title : this.entry.url;
    },
  },
  methods: {
    ...mapActions([
      'archive',
      'addTag',
    ]),
  },
};
</script>

<style lang="stylus" scoped>
.interlude
  position fixed
  width inherit
  padding 0 15px
  figure
    margin 0
    display flex
    align-items center
    justify-content center
    overflow hidden
    img
      height 280px
  .link
    margin .5em 0
    line-height 1.3
    word-break break-word
    a
      font-weight bold
      text-decoration none
      color #24292e
      &:hover
        text-decoration underline
  .desc
    margin 1em 0 .5em
    display -webkit-box
    -webkit-line-clamp 5
    -webkit-box-orient vertical
    overflow hidden
    font-size .75em
  .meta
    font-size .75em
    color #757575
  .action
    display flex
    align-items center
    justify-content space-between
    font-size .75em
    color #757575
  .addscenes
    display flex
    align-items center
    justify-content space-between
    .scene
      flex 1

.tags
  .tag
    display inline-flex
    margin 0 .5em .5em 0
    padding 0 .5em
    font-weight bold
    font-size .75em
    border-radius 2px
    align-items center
    line-height 1.5
    color #9ea8b3
    background-color transparent
    border 1px solid #9ea8b3
    &.applied
      color #fff
      background-color #9ea8b3

.todo
  font-size 0.75rem
</style>

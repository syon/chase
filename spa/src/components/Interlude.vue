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
    hr
    .addscenes
      button(v-for="sce in scenes" @click="addTag({ eid: entry.eid, tag: sce.tag })") {{ sce.label }}
    hr
    .tags
      .tag(v-for="tag in recentTags" @click="addTag({ eid: entry.eid, tag })" :class="{ applied: Object.keys(entry.tags).includes(tag) }") {{ tag }}

  hr

  section
    .todo
      em ToDo:
      ul
        li 切替は表示ON/OFFで(matched)
        li More 100
        li IE11 fetch
        li Google Analytics
        li はてブカウント
        li タグ編集
        li 消化進捗
        li /etc/hosts
        li Dark Theme
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
    img
      width 100%
  .meta
    font-size 0.75em

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

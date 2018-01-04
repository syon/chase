<template lang="pug">
.interlude
  template(v-if="entry.ready")
    fit-image.thumbnail(:src="entry.image_s3_url" w="290" h="193" size="cover")
    section
      .link
        a(:href="entry.url" target="_blank") {{ linkTitle }}
    section
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
        clickable.tag(v-for="tag in recentTags" key="tag" @click.native="handleTagClick(tag)" :class="{ applied: Object.keys(entry.tags).includes(tag) }") {{ tag }}
      .newtag
        input(v-model="newtag" @keyup.enter="handleNewTag" placeholder="New Tag")

  section.mobile-screenshot
    template(v-if="entry.ready")
      fit-image(:src="shotMobileSrc" w="214" h="380" size="cover" :onloaderror="() => onShotError(entry)")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Clickable from '@/components/Clickable';
import FitImage from '@/components/FitImage';

export default {
  components: {
    Clickable,
    FitImage,
  },
  data() {
    return {
      newtag: '',
    };
  },
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
    shotMobileSrc() {
      if (!this.entry) return '';
      const { eid } = this.entry;
      return `https://s3.amazonaws.com/syon-chase/shots/${eid}/mobile.png`;
    },
  },
  methods: {
    ...mapActions([
      'archive',
      'addTag',
    ]),
    handleTagClick(tag) {
      if (Object.keys(this.entry.tags).includes(tag)) {
        return;
      }
      const eid = this.entry.eid;
      this.$store.dispatch('addTag', { eid, tag })
        .then(() => {
          this.entry.tags[tag] = { item_id: eid, tag };
        });
    },
    handleNewTag() {
      this.handleTagClick(this.newtag);
    },
    onShotSuccess() {
      // console.log(entry.eid);
    },
    onShotError(entry) {
      if (entry.shotOrdered) return;
      this.$store.dispatch('fetchShot', entry);
    },
  },
};
</script>

<style lang="stylus" scoped>
.interlude
  position fixed
  width inherit
  height 100vh
  padding 0 15px
  overflow auto
  -webkit-overflow-scrolling touch
  overflow-scrolling touch
  .thumbnail
    border 1px solid #eee
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
  .mobile-screenshot
    display flex
    align-items center
    justify-content center
    margin 30px 0
    padding 8px
    border 1px solid #eee

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
      cursor auto
      text-decoration none

.todo
  font-size 0.75rem

.showcase
  display flex
  justify-content space-between
  background-color #eee
  border 4px solid #eee
</style>

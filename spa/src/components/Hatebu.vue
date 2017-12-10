<template lang="pug">
.hatebu
  header
    screenshot.imageframe
    h4 {{ hatebu.count }}
  .bookmarks
    .voice(v-for="b in voices")
      span {{ b.comment }}
</template>

<script>
import { mapGetters } from 'vuex';
import Screenshot from '@/components/Screenshot';

export default {
  components: {
    Screenshot,
  },
  computed: {
    ...mapGetters({
      entry: 'activeEntry',
    }),
    hatebu() {
      const eid = this.entry.eid;
      return this.$store.state.hatebuSet[eid] || {};
    },
    voices() {
      if (!this.hatebu.bookmarks) return [];
      return this.hatebu.bookmarks.filter(d => d.comment.length !== 0);
    },
  },
};
</script>

<style lang="stylus" scoped>
.hatebu
  position fixed
  width inherit
  height 100vh
  display flex
  flex-direction column
  padding 0 15px

.imageframe
  padding 2px
  border 1px solid #eee

.bookmarks
  flex 1
  overflow auto
  .voice
    padding 0 0 .5em
    font-size .8rem
</style>

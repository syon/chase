<template lang="pug">
.hatebu
  header
    screenshot.imageframe
    h4
      span {{ hatebu.count }}
      button(@click="makeRanking") makeRanking
      span(v-if="loadingRank") Loading...
  .bookmarks
    .voice(v-for="b in voices")
      .meta
        .meta-left
          img.avatar(:src="avatarUrl(b)")
          .username {{ b.user }}
        .meta-right
          .star {{ starCount(b) }}
          .date {{ commentDate(b) }}
      .comment {{ b.comment }}
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Screenshot from '@/components/Screenshot';

export default {
  components: {
    Screenshot,
  },
  data() {
    return {
      loadingRank: false,
    };
  },
  computed: {
    ...mapState([
      'hatebuStarSet',
    ]),
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
  methods: {
    avatarUrl(b) {
      return `//cdn1.www.st-hatena.com/users/${b.user}/profile_l.gif`;
    },
    commentDate(b) {
      const ymd = b.timestamp.match(/^(20..\/..\/..)/)[1];
      return ymd.replace(/\//g, '.');
    },
    starCount(b) {
      const starSet = this.hatebuStarSet[this.entry.eid];
      if (!starSet) return '';
      const cnt = starSet[b.user];
      return cnt > 0 ? `★${cnt}` : '';
    },
    async makeRanking() {
      this.loadingRank = true;
      await this.$store.dispatch('makeHatebuRanking', { eid: this.entry.eid });
      this.loadingRank = false;
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
  padding-bottom 100px
  .voice
    padding 0 0 .75em
    font-size .8rem
    word-break break-all
    .meta
      display flex
      align-items center
      justify-content space-between
      font-size 0.6rem
      color #757575
      .meta-left, .meta-right
        display flex
        align-items center
      .avatar
        width 16px
        height 16px
        border-radius 1.5px
      .username
        padding 0 0.5em
      .star
        padding 0 0.5em
        color orange
        font-size 0.8rem
        font-weight bold
    .comment
      margin .25em 0 .5em
</style>

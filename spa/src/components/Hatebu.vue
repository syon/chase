<template lang="pug">
.hatebu
  header
    screenshot(target="desktop").imageframe
    h4
      span {{ hatebu.count }}
      span &nbsp;({{ comments.length }} comments)
      button(v-if="!hatebuStarSet[entry.eid] && !hatebuStarLoading" @click="makeRanking") makeRanking
      span(v-if="hatebuStarLoading") Loading...
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
      mode: 'recent',
    };
  },
  computed: {
    ...mapState([
      'hatebuStarSet',
      'hatebuStarLoading',
    ]),
    ...mapGetters({
      entry: 'activeEntry',
    }),
    hatebu() {
      const eid = this.entry.eid;
      return this.$store.state.hatebuSet[eid] || {};
    },
    comments() {
      if (!this.hatebu.bookmarks) return [];
      return this.hatebu.bookmarks.filter(d => d.comment.length !== 0);
    },
    voices() {
      if (!this.hatebu.bookmarks) return [];
      const eid = this.entry.eid;
      const starSet = this.$store.state.hatebuStarSet[eid] || {};
      const voices = this.comments;
      voices.sort((a, b) => {
        const aStar = isNaN(Number(starSet[a.user])) ? 0 : Number(starSet[a.user]);
        const bStar = isNaN(Number(starSet[b.user])) ? 0 : Number(starSet[b.user]);
        if (aStar > bStar) return -1;
        if (aStar < bStar) return 1;
        if (a.timestamp > b.timestamp) return -1;
        if (a.timestamp < b.timestamp) return 1;
        return 0;
      });
      return voices;
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
      const eid = this.entry.eid;
      await this.$store.dispatch('makeHatebuRanking', { eid, force: true });
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
  border 1px solid #eee

.bookmarks
  flex 1
  overflow auto
  -webkit-overflow-scrolling touch
  overflow-scrolling touch
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

<template lang="pug">
.screen.page-container
  nav.page-nav
    sidebar
  article.page-content
    h2 Config
    section.scene
      label
        span chase:a
        input(v-model="chaseA")
      hr
      label
        span chase:b
        input(v-model="chaseB")
      hr
      label
        span chase:c
        input(v-model="chaseC")
      hr
      button(@click="doSceneEdit") OK
    section
      h3 You
      p
        span.username {{ login.username }}
      p
        code {{ login.accessToken }}
    section
      h3 About
      .meta
        a.author(href="https://github.com/syon").
          <img src="../assets/syon.png" alt="syon" target="_blank"><span>syon</span></a>
        .repo
          a(href="https://github.com/syon/chase" target="_blank" style="font-size:24px;")
            i.ion-social-github
          a.wercker-badge(href="https://app.wercker.com/project/byKey/a85109629f315de1a3cf4e0521775121")
            img(alt="Wercker status" src="https://app.wercker.com/status/a85109629f315de1a3cf4e0521775121/s/master")
        .twitter-btn.
          <a href="https://twitter.com/intent/tweet?screen_name=syonxv&ref_src=twsrc%5Etfw" class="twitter-mention-button" data-show-count="false">Tweet to @syonxv</a>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Sidebar from '@/components/Sidebar';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      sceneEditing: false,
      chaseA: null,
      chaseB: null,
      chaseC: null,
    };
  },
  mounted() {
    this.chaseA = this.myScenesTags[0].label;
    this.chaseB = this.myScenesTags[1].label;
    this.chaseC = this.myScenesTags[2].label;
  },
  computed: {
    ...mapState({
      login: 'login',
    }),
    ...mapGetters([
      'myScenesTags',
    ]),
    mode() {
      return this.$route.name;
    },
  },
  methods: {
    doSceneEdit() {
      const scenes = { a: this.chaseA, b: this.chaseB, c: this.chaseC };
      this.$store.dispatch('doSceneEdit', { $cookie: this.$cookie, scenes });
      this.sceneEditing = false;
      this.$router.push({ name: 'Inbox' });
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-container
  width 100%
  display flex
  .page-nav
    width 180px
  .page-content
    flex 1
    padding 0 15px

.twitter-btn
  padding 16px
  line-height 1
.meta
  display flex
  align-items center
  // justify-content space-between
  padding 8px 16px
  height 50px
  font-size 12px
  font-family sans-serif
  color #7e888b
.author
  display flex
  align-items center
  text-decoration none
  color inherit
  img
    width 30px
    height 30px
    margin-right .4rem
    border-radius 100%
.repo
  display flex
  a
    margin-left 15px
    color #7e888b
    text-decoration none
  .wercker-badge
    align-self center
    line-height 1
</style>

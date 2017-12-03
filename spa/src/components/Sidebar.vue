<template lang="pug">
.sidebar
  section
    button(@click="fetchMoreEntries") fetchMoreEntries
    h1.logo
      a(href="/chase/")
        img(src="../assets/logo.png" alt="Chase")

  section.menu(v-if="login.accessToken")
    .flex-aic-jcsb
      em Recent {{ catalogCount }}
      clickable.refresh(@click.native="fetchEntries")
        i.ion-ios-refresh-empty
    .link-item
      router-link(to="/") Recent 100
    .link-item
      router-link(:to="{ name: 'Inbox' }") Inbox
    .link-item
      router-link(:to="{ name: 'Favorite' }") Favorite

  section.menu.all
    em All
    .link-item
      clickable(@click.native="fetchFavorites")
        i.ion-ios-star-outline
        span お気に入り

  section.myscenes
    em My Scenes:
    template(v-if="sceneEditing")
      button(@click="doSceneEdit") OK
      hr
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
    template(v-else)
      button(@click="showScenesEditor") edit
      .link-item(v-for="sce in myScenesTags")
        router-link(:to="{ name: 'Tag', params: { tag: sce.tag } }") {{ sce.label }}

  section.tags
    template(v-for="tag in recentTags")
      .link-item
        router-link(:to="{ name: 'Tag', params: { tag } }")
          clickable
            i.ion-ios-pricetags-outline
            span {{ tag }}

  section.userinfo
    template(v-if="login.accessToken")
      span.username {{ login.username }}
      clickable.disconnect(@click.native="logout")
        i.ion-ios-close-empty
    template(v-else)
      button(@click="getRequestToken") Connect to Pocket
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Clickable from '@/components/Clickable';

export default {
  name: 'Sidebar',
  components: {
    Clickable,
  },
  data() {
    return {
      sceneEditing: false,
      chaseA: null,
      chaseB: null,
      chaseC: null,
    };
  },
  computed: {
    ...mapState({
      login: 'login',
      mytags: 'mytags',
      myscenes: 'myscenes',
    }),
    ...mapGetters([
      'catalogCount',
      'recentTags',
      'myScenesTags',
    ]),
  },
  mounted() {
    this.$store.dispatch('actByPhase', this.$cookie);
    this.chaseA = this.myScenesTags[0].label;
    this.chaseB = this.myScenesTags[1].label;
    this.chaseC = this.myScenesTags[2].label;
  },
  methods: {
    ...mapActions({
      fetchEntries: 'fetchEntries',
      fetchMoreEntries: 'fetchMoreEntries',
      fetchFavorites: 'fetchFavorites',
    }),
    getRequestToken() {
      this.$store.dispatch('getRequestToken', this.$cookie)
        .then((authUri) => {
          window.location = authUri;
        });
    },
    getAccessToken() {
      this.$store.dispatch('getAccessToken', this.$cookie);
    },
    showScenesEditor() {
      this.sceneEditing = true;
    },
    doSceneEdit() {
      const scenes = { a: this.chaseA, b: this.chaseB, c: this.chaseC };
      this.$store.dispatch('doSceneEdit', { $cookie: this.$cookie, scenes });
      this.sceneEditing = false;
    },
    logout() {
      this.$store.dispatch('logout', this.$cookie);
    },
  },
};
</script>

<style lang="stylus" scoped>
.sidebar
  position fixed
  width inherit
  height 100vh
  display flex
  flex-direction column
  justify-content space-between
  padding 15px
  font-size 0.75rem

.flex-aic-jcsb
  display flex
  align-items center
  justify-content space-between

.refresh i
  font-size 1.5rem

.menu
  margin 1rem 0

.link-item
  height 2rem
  display flex
  align-items center
  font-size 1rem
  i
    margin-right .5em
  > a
    flex 1
    height inherit
    display flex

.logo
  display flex
  align-items center
  margin 0
  font-size 100%
  img
    width 32px
    height 32px

.tags
  .link-item
    height 1.5rem
    font-size 0.75rem

.userinfo
  display flex
  align-items center
  .username
    margin-right 1em
  .disconnect
    font-size 1.5rem
</style>

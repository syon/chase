<template lang="pug">
.sidebar
  section
    h1.logo Chase

  section.menu(v-if="login.accessToken")
    em {{ catalogCount }}
    .link-item(@click="getGet") Inbox
    .link-item(@click="fetchFavorites") お気に入り

  section.tags
    em Tags:
    template(v-for="tag in recentTags")
      .link-item(@click="fetchByTag(tag)") {{ tag }}

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
      ul
        li(v-for="sce in myscenes") {{ sce }}

  section.userinfo
    template(v-if="login.accessToken")
      span.username {{ login.username }}
      a(href="#" @click="logout") ✕
    template(v-else)
      button(@click="getRequestToken") Connect to Pocket
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Sidebar',
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
      fetchFavorites: 'fetchFavorites',
      fetchByTag: 'fetchByTag',
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
    getGet() {
      this.$store.dispatch('fetchEntries');
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

.menu
  margin 1rem 0

.link-item
  height 2rem
  display flex
  align-items center
  font-size 1rem
  color #0366d6
  cursor pointer
  border-top 1px solid #f5f5f5
  &:last-child
    border-bottom 1px solid #f5f5f5

.logo
  margin 0
  font-size 100%

.userinfo
  .username
    margin-right 1em
</style>

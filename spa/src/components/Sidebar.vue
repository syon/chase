<template lang="pug">
.sidebar
  section
    h1.logo Chase

  section(v-if="login.accessToken")
    button(@click="getGet") Inbox
    hr
    button(@click="fetchFavorites") お気に入り
    hr
    em {{ catalogCount }}
    hr
    em Tags:
    ul
      li(v-for="tag in recentTags")
        button(@click="fetchByTag(tag)") {{ tag }}

  section.myscenes
    em My Scenes:
    ul
      li(v-for="sce in myscenes") {{ sce }}
    em Edit:
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

  section.mytags
    em My Tags:
    ul
      li(v-for="tag in mytags") {{ tag }}

  section
    .todo
      em ToDo:
      ul
        li ★
        li タグ付与
        li Inbox (Un-Tagged)
        li chase ３シーン
        li はてブカウント
        li /etc/hosts
        li 消化進捗
        li Count → Since

  section.userinfo
    template(v-if="login.accessToken")
      .username {{ login.username }}
      button(@click="logout") logout
    template(v-else)
      button(@click="getRequestToken") Connect to Pocket
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Sidebar',
  data() {
    return {
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
    this.$cookie.set('mytags', JSON.stringify(['りんご', 'ばなな', 'めろん']));
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
    doSceneEdit() {
      const scenes = { a: this.chaseA, b: this.chaseB, c: this.chaseC };
      this.$store.dispatch('doSceneEdit', { $cookie: this.$cookie, scenes });
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

.logo
  margin 0
  font-size 100%
</style>

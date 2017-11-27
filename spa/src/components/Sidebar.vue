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
  computed: {
    ...mapState({
      login: 'login',
    }),
    ...mapGetters([
      'catalogCount',
      'recentTags',
    ]),
  },
  mounted() {
    this.$store.dispatch('actByPhase', this.$cookie);
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

.logo
  margin 0
  font-size 100%
.username
  font-size 0.75em
.todo
  font-size 0.75em
</style>

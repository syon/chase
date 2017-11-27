<template lang="pug">
.sidebar
  h1.logo Chase

  template(v-if="login.accessToken")
    .username {{ login.username }}
    button(@click="logout") logout
  template(v-else)
    button(@click="getRequestToken") Request Token
    hr
    em Request Token
    pre
      code {{ login.requestToken }}
    hr
    template(v-if="login.authUri")
      a(:href="login.authUri" target="_blank") クリックして認証…
      hr
      button(@click="getAccessToken") アクセストークンを入手

  hr
  button(@click="getGet") リストを表示
  hr
  button(@click="fetchFavorites") お気に入り
  hr
  em {{ catalogCount }}
  hr
  ul
    li(v-for="tag in recentTags")
      button(@click="fetchByTag(tag)") {{ tag }}
  hr
  .todo
    em ToDo:
    ul
      li ★
      li タグ付与
      li chase ３シーン
      li はてブカウント
      li パネルハイライト
      li リスト縦幅固定
      li /etc/hosts
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
  padding 0 15px 0 0

.logo
  margin 0
  font-size 100%
.username
  font-size 0.75em
.todo
  font-size 0.75em
</style>

<template lang="pug">
.screen
  h1 Chase
  em {{ login.username }} {{ countAlias }}
  pre
    code {{ login.accessToken }}
  hr
  button(@click="getRequestToken") Request Token
  hr
  pre
    code {{ login.requestToken }}
  hr
  a(:href="login.authUri") {{ login.authUri }}
  hr
  button(@click="getAccessToken") Access Token
  hr
  button(@click="getGet") Get
  hr
  button(@click="doIncrement") Increment
  hr
  button(@click="fetchFavorites") fetchFavorites
  hr
  em {{ catalogCount }}
  hr
  ul
    li(v-for="tag in recentTags")
      button(@click="fetchByTag(tag)") {{ tag }}
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Sidebar',
  computed: {
    ...mapState({
      countAlias: 'count',
      login: 'login',
    }),
    ...mapGetters([
      'catalogCount',
      'recentTags',
    ]),
  },
  mounted() {
    this.$store.dispatch('restoreLogin', this.$cookie);
  },
  methods: {
    ...mapActions({
      doIncrement: 'increment',
      fetchFavorites: 'fetchFavorites',
      fetchByTag: 'fetchByTag',
    }),
    getRequestToken() {
      this.$store.dispatch('getRequestToken');
    },
    getAccessToken() {
      this.$store.dispatch('getAccessToken')
        .then((json) => {
          this.$cookie.set('pocket_access_token', json.access_token, { expires: '3M' });
          this.$cookie.set('pocket_username', json.username, { expires: '3M' });
        });
    },
    getGet() {
      this.$store.dispatch('fetchEntries');
    },
  },
};
</script>

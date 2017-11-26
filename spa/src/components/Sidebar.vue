<template lang="pug">
.screen
  h1 Chase
  em {{ pocketUsername }} {{ countAlias }}
  pre
    code {{ pocketAccessToken }}
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
</template>

<script>
import { mapState, mapActions } from 'vuex';

const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

export default {
  name: 'Sidebar',
  computed: {
    ...mapState({
      countAlias: 'count',
      login: 'login',
    }),
    pocketAccessToken() {
      return this.$cookie.get('pocket_access_token');
    },
    pocketUsername() {
      return this.$cookie.get('pocket_username');
    },
  },
  methods: {
    ...mapActions({
      doIncrement: 'increment',
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
      fetch(`${LAMBDA_ENDPOINT}/pocket/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: this.pocketAccessToken,
          count: 20,
          detailType: 'complete',
        }),
      })
        .then(res => res.json()).then((json) => {
          this.$store.dispatch('updateEntries', json);
        }).catch((ex) => {
          // eslint-disable-next-line
          console.log(ex);
        });
    },
  },
};
</script>

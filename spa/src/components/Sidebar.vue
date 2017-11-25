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
    code {{ requestToken }}
  hr
  a(:href="authUri") {{ authUri }}
  hr
  button(@click="getAccessToken") Access Token
  hr
  button(@click="getGet") Get
  hr
  button(@click="doIncrement") Increment
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Debug from 'debug';

const debug = Debug('chase');
const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

export default {
  name: 'Sidebar',
  data() {
    return {
      requestToken: '',
      authUri: '',
      getResult: '',
    };
  },
  computed: {
    ...mapState({
      countAlias: 'count',
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
      debug('★getRequestToken()★');
      fetch(`${LAMBDA_ENDPOINT}/pocket/oauth/request`, {
        method: 'POST',
      })
        .then(res => res.json()).then((json) => {
          this.requestToken = json.request_token;
          this.authUri = json.auth_uri;
        }).catch((ex) => {
          // eslint-disable-next-line
          console.log(ex);
        });
    },
    getAccessToken() {
      fetch(`${LAMBDA_ENDPOINT}/pocket/oauth/authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: this.requestToken,
        }),
      })
        .then(res => res.json()).then((json) => {
          this.$cookie.set('pocket_access_token', json.access_token, { expires: '3M' });
          this.$cookie.set('pocket_username', json.username, { expires: '3M' });
        }).catch((ex) => {
          // eslint-disable-next-line
          console.log(ex);
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
          this.getResult = json;
          this.$store.dispatch('updateEntries', json);
        }).catch((ex) => {
          // eslint-disable-next-line
          console.log(ex);
        });
    },
  },
};
</script>

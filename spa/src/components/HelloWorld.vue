<template lang="pug">
.screen
  em {{ pocketUsername }}
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
  pre
    code {{ getResult }}
</template>

<script>
const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

export default {
  name: 'HelloWorld',
  data() {
    return {
      requestToken: '',
      authUri: '',
      getResult: '',
    };
  },
  computed: {
    pocketAccessToken() {
      return this.$cookie.get('pocket_access_token');
    },
    pocketUsername() {
      return this.$cookie.get('pocket_username');
    },
  },
  methods: {
    getRequestToken() {
      fetch(`${LAMBDA_ENDPOINT}/pocket/oauth/request`, {
        method: 'POST',
      })
        .then(res => res.json()).then((json) => {
          this.requestToken = json.request_token;
          this.authUri = json.auth_uri;
        }).catch((ex) => {
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
          count: 10,
        }),
      })
        .then(res => res.json()).then((json) => {
          this.getResult = json;
        }).catch((ex) => {
          console.log(ex);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

import Debug from 'debug';

const debug = Debug('chase:lambda-pocket');
const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

async function requestToken() {
  return fetch(`${LAMBDA_ENDPOINT}/pocket/oauth/request`, {
    method: 'POST',
  })
    /* eslint-disable arrow-body-style */
    .then(res => res.json()).then((json) => {
      return {
        request_token: json.request_token,
        auth_uri: json.auth_uri,
      };
    }).catch((ex) => {
      debug(ex);
    });
}

export default {
  requestToken,
};

const axios = require('axios');

const CONSUMER_KEY = process.env.POCKET_CONSUMER_KEY;

const HTTP_POST_CONFIG = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json',
  },
};

module.exports.oauth = {
  async request(ru) {
    const reqd = {
      consumer_key: CONSUMER_KEY,
      redirect_uri: ru,
    };
    const data = JSON.stringify(reqd);
    const endpoint = 'https://getpocket.com/v3/oauth/request';
    const res = await axios.post(endpoint, data, HTTP_POST_CONFIG);
    const rt = res.data.code;
    const authorize = 'https://getpocket.com/auth/authorize';
    const authUri = `${authorize}?request_token=${rt}&redirect_uri=${ru}`;
    return {
      request_token: rt,
      auth_uri: authUri,
    };
  },
};

module.exports.get = (at, params) => {
  const reqd = {
    consumer_key: CONSUMER_KEY,
    access_token: at,
  };
  const data = JSON.stringify(Object.assign(reqd, params));
  const endpoint = 'https://getpocket.com/v3/get';
  return axios.post(endpoint, data, HTTP_POST_CONFIG)
    .then(res => res.data);
};

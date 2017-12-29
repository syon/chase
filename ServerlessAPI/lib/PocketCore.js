const axios = require('axios');

const HTTP_POST_CONFIG = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json',
  },
};

module.exports.get = (ck, at, params) => {
  const reqd = {
    consumer_key: ck,
    access_token: at,
  };
  const data = JSON.stringify(Object.assign(reqd, params));
  const endpoint = 'https://getpocket.com/v3/get';
  return axios.post(endpoint, data, HTTP_POST_CONFIG)
    .then(res => res.data);
};

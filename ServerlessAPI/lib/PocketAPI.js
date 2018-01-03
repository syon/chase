const axios = require('axios');
const URLSearchParams = require('url-search-params');

const CONSUMER_KEY = process.env.POCKET_CONSUMER_KEY;

const HTTP_POST_CONFIG = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json',
  },
};

const HTTP_GET_CONFIG = {
  headers: {
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

  async authorize(code) {
    const reqd = {
      consumer_key: CONSUMER_KEY,
      code,
    };
    const data = JSON.stringify(reqd);
    const endpoint = 'https://getpocket.com/v3/oauth/authorize';
    return axios.post(endpoint, data, HTTP_POST_CONFIG)
      .then((res) => {
        const { data: d } = res;
        return {
          access_token: d.access_token,
          username: d.username,
        };
      });
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

module.exports.send = {
  async archive(at, params) {
    const reqd = {
      consumer_key: CONSUMER_KEY,
      access_token: at,
    };
    const q = new URLSearchParams();
    q.append('consumer_key', reqd.consumer_key);
    q.append('access_token', reqd.access_token);
    q.append('actions', `[{"action":"archive","item_id":${params.item_id}}]`);
    const endpoint = `https://getpocket.com/v3/send?${q.toString()}`;
    return axios.get(endpoint, HTTP_GET_CONFIG)
      .then(res => res.data);
  },

  async favorite(at, params) {
    const reqd = {
      consumer_key: CONSUMER_KEY,
      access_token: at,
    };
    const q = new URLSearchParams();
    q.append('consumer_key', reqd.consumer_key);
    q.append('access_token', reqd.access_token);
    q.append('actions', `[{"action":"favorite","item_id":${params.item_id}}]`);
    const endpoint = `https://getpocket.com/v3/send?${q.toString()}`;
    return axios.get(endpoint, HTTP_GET_CONFIG)
      .then(res => res.data);
  },

  async unfavorite(at, params) {
    const reqd = {
      consumer_key: CONSUMER_KEY,
      access_token: at,
    };
    const q = new URLSearchParams();
    q.append('consumer_key', reqd.consumer_key);
    q.append('access_token', reqd.access_token);
    q.append('actions', `[{"action":"unfavorite","item_id":${params.item_id}}]`);
    const endpoint = `https://getpocket.com/v3/send?${q.toString()}`;
    return axios.get(endpoint, HTTP_GET_CONFIG)
      .then(res => res.data);
  },

  async tagsAdd(at, params) {
    const reqd = {
      consumer_key: CONSUMER_KEY,
      access_token: at,
    };
    const q = new URLSearchParams();
    q.append('consumer_key', reqd.consumer_key);
    q.append('access_token', reqd.access_token);
    q.append('actions', `[{"action":"tags_add","item_id":${params.item_id}}]`);
    const endpoint = `https://getpocket.com/v3/send?${q.toString()}`;
    return axios.get(endpoint, HTTP_GET_CONFIG)
      .then(res => res.data);
  },
};

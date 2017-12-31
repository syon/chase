const axios = require('axios');
const URLSearchParams = require('url-search-params');
const debug = require('debug')('chase:pocket-adaptor');

const Pocket = require('./PocketAPI');

const HTTP_GET_CONFIG = {
  headers: {
    'X-Accept': 'application/json',
  },
};

const HTTP_POST_CONFIG = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json',
  },
};

function successResponseBuilder(bodyObj) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(bodyObj),
  };
}

function errorResponseBuilder(error) {
  const res = error.response || { headers: {} };
  debug(res);
  const response = {
    statusCode: res.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'x-error-code': res.headers['x-error-code'],
      'x-error': res.headers['x-error'],
    },
    body: JSON.stringify({
      message: res.statusText,
    }),
  };
  return response;
}

module.exports.pocketOauthRequest = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const reqd = {
    consumer_key: process.env.POCKET_CONSUMER_KEY,
    redirect_uri: params.redirect_uri,
  };
  const data = JSON.stringify(reqd);
  axios.post('https://getpocket.com/v3/oauth/request', data, HTTP_POST_CONFIG)
    .then((res) => {
      const requestToken = res.data.code;
      const authUri = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${params.redirect_uri}`;
      const bodyObj = {
        request_token: requestToken,
        auth_uri: authUri,
      };
      callback(null, successResponseBuilder(bodyObj));
    })
    .catch((error) => {
      debug(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketOauthAuthorize = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const reqd = {
    consumer_key: process.env.POCKET_CONSUMER_KEY,
    code: params.code,
  };
  const data = JSON.stringify(reqd);
  axios.post('https://getpocket.com/v3/oauth/authorize', data, HTTP_POST_CONFIG)
    .then((res) => {
      const bodyObj = {
        access_token: res.data.access_token,
        username: res.data.username,
      };
      callback(null, successResponseBuilder(bodyObj));
    })
    .catch((error) => {
      debug(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketGet = (event, context, callback) => {
  const params = JSON.parse(event.body);
  Pocket.get(params.access_token, params)
    .then((res) => {
      callback(null, successResponseBuilder(res));
    })
    .catch((error) => {
      debug(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketProgress = (params) => {
  const funcU = Pocket.get(params.access_token, { state: 'unread' });
  const funcA = Pocket.get(params.access_token, { state: 'archive' });
  return Promise.all([
    funcU.then(r => Object.keys(r.list).length),
    funcA.then(r => Object.keys(r.list).length),
  ]).then(([unread, archive]) => {
    debug({ unread, archive });
    return { unread, archive };
  });
};

module.exports.pocketSendArchive = (event, context, callback) => {
  const params = event.queryStringParameters;
  const q = new URLSearchParams();
  q.append('consumer_key', process.env.POCKET_CONSUMER_KEY);
  q.append('access_token', params.access_token);
  q.append('actions', `[{"action":"archive","item_id":${params.item_id}}]`);
  axios.get(`https://getpocket.com/v3/send?${q.toString()}`, HTTP_GET_CONFIG)
    .then((res) => {
      const bodyObj = res.data;
      callback(null, successResponseBuilder(bodyObj));
    })
    .catch((error) => {
      debug(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketSendFavorite = (event, context, callback) => {
  const params = event.queryStringParameters;
  const q = new URLSearchParams();
  q.append('consumer_key', process.env.POCKET_CONSUMER_KEY);
  q.append('access_token', params.access_token);
  q.append('actions', `[{"action":"favorite","item_id":${params.item_id}}]`);
  axios.get(`https://getpocket.com/v3/send?${q.toString()}`, HTTP_GET_CONFIG)
    .then((res) => {
      const bodyObj = res.data;
      callback(null, successResponseBuilder(bodyObj));
    })
    .catch((error) => {
      debug(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketSendUnfavorite = (event, context, callback) => {
  const params = event.queryStringParameters;
  const q = new URLSearchParams();
  q.append('consumer_key', process.env.POCKET_CONSUMER_KEY);
  q.append('access_token', params.access_token);
  q.append('actions', `[{"action":"unfavorite","item_id":${params.item_id}}]`);
  axios.get(`https://getpocket.com/v3/send?${q.toString()}`, HTTP_GET_CONFIG)
    .then((res) => {
      const bodyObj = res.data;
      callback(null, successResponseBuilder(bodyObj));
    })
    .catch((error) => {
      debug(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketSendTagsAdd = (event, context, callback) => {
  const params = event.queryStringParameters;
  const q = new URLSearchParams();
  q.append('consumer_key', process.env.POCKET_CONSUMER_KEY);
  q.append('access_token', params.access_token);
  q.append('actions', `[{"action":"tags_add","item_id":${params.item_id},"tags":"${params.tag}"}]`);
  axios.get(`https://getpocket.com/v3/send?${q.toString()}`, HTTP_GET_CONFIG)
    .then((res) => {
      const bodyObj = res.data;
      callback(null, successResponseBuilder(bodyObj));
    })
    .catch((error) => {
      debug(error);
      callback(null, errorResponseBuilder(error));
    });
};

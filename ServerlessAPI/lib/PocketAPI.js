require('dotenv').config();
const axios = require('axios');
const URLSearchParams = require('url-search-params');

const redirectUri = 'https://syon.github.io/chase/';

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
      "Access-Control-Allow-Origin" : "*",
    },
    body: JSON.stringify(bodyObj),
  };
}

function errorResponseBuilder(error) {
  const res = error.response || { headers: {} };
  console.log(res);
  const response = {
    statusCode: res.status,
    headers: {
      "Access-Control-Allow-Origin" : "*",
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
  const reqd = {
    'consumer_key': process.env.POCKET_CONSUMER_KEY,
    'redirect_uri': 'https://syon-chase.herokuapp.com?redirected',
  };
  const data = JSON.stringify(reqd);
  axios.post('https://getpocket.com/v3/oauth/request', data, HTTP_POST_CONFIG)
    .then(function (res) {
      const requestToken = res.data.code;
      const authUri = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify({
          request_token: requestToken,
          auth_uri: authUri,
        }),
      };
      callback(null, response);
    })
    .catch(function (error) {
      console.log(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketOauthAuthorize = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const reqd = {
    'consumer_key': process.env.POCKET_CONSUMER_KEY,
    'code': params.code,
  };
  const data = JSON.stringify(reqd);
  axios.post('https://getpocket.com/v3/oauth/authorize', data, HTTP_POST_CONFIG)
    .then(function (res) {
      const at = res.data.access_token;
      const un = res.data.username;
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify({
          access_token: at,
          username: un,
        }),
      };
      callback(null, response);
    })
    .catch(function (error) {
      console.log(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketGet = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const reqd = {
    'consumer_key': process.env.POCKET_CONSUMER_KEY,
    'access_token': params.access_token,
  };
  const data = JSON.stringify(Object.assign(reqd, params));
  axios.post('https://getpocket.com/v3/get', data, HTTP_POST_CONFIG)
    .then(function (res) {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify(res.data),
      };
      callback(null, response);
    })
    .catch(function (error) {
      console.log(error);
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.pocketSendArchive = (event, context, callback) => {
  const params = event.queryStringParameters;
  const q = new URLSearchParams();
  q.append('consumer_key', process.env.POCKET_CONSUMER_KEY);
  q.append('access_token', params.access_token);
  q.append('actions', `[{"action":"archive","item_id":${params.item_id}}]`);
  axios.get(`https://getpocket.com/v3/send?${q.toString()}`, HTTP_GET_CONFIG)
    .then(function (res) {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify(res.data),
      };
      callback(null, response);
    })
    .catch(function (error) {
      console.log(error);
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
    .then(function (res) {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify(res.data),
      };
      callback(null, response);
    })
    .catch(function (error) {
      console.log(error);
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
    .then(function (res) {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify(res.data),
      };
      callback(null, response);
    })
    .catch(function (error) {
      console.log(error);
      callback(null, errorResponseBuilder(error));
    });
};

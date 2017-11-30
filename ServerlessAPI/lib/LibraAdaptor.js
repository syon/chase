const debug = require('debug')('chase:libra-adaptor');
const Libra = require('./Libra');

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
  debug(error);
  const res = error.response || { headers: {} };
  const response = {
    statusCode: res.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: res.statusText,
    }),
  };
  return response;
}

module.exports.libraInfo = (event, context, callback) => {
  const params = event.queryStringParameters;
  debug('[libraInfo]>>>>', params);
  const libra = new Libra(params.url);
  libra.getInfo()
    .then((info) => {
      debug('[libraInfo]<<<<', info);
      callback(null, successResponseBuilder(info));
    })
    .catch((error) => {
      callback(null, errorResponseBuilder(error));
    });
};

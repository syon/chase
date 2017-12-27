const debug = require('debug')('chase:user-adaptor');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

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

module.exports.register = (event, context, callback) => {
  const params = JSON.parse(event.body);
  debug('[register]>>>>', params);
  if (!params.accesstoken.match(/^[a-z0-9-]+$/)) {
    errorResponseBuilder('Invalid access token.');
  }
  const obj = {
    Bucket: process.env.BUCKET,
    Key: `accesstokens/${params.accesstoken}.json`,
    Body: JSON.stringify('', null, 2),
  };
  s3.putObject(obj, (err, data) => {
    if (err) {
      callback(null, errorResponseBuilder(err));
    } else {
      callback(null, successResponseBuilder(data));
    }
  });
};

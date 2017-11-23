const AWS = require('aws-sdk');
const gm = require('gm').subClass({ imageMagick: true });
const axios = require('axios');

const Libra = require('./Libra');
const s3 = new AWS.S3();

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
  console.log(error);
  const res = error.response || { headers: {} };
  const response = {
    statusCode: res.status,
    headers: {
      "Access-Control-Allow-Origin" : "*",
    },
    body: JSON.stringify({
      message: res.statusText,
    }),
  };
  return response;
}

module.exports.libraInfo = (event, context, callback) => {
  const params = event.queryStringParameters;
  console.log('[libraInfo]>>>>', params);
  const libra = new Libra(params.url);
  libra.getInfo()
    .then(info => {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify(info),
      };
      callback(null, response);
    })
    .catch(error => {
      callback(null, errorResponseBuilder(error));
    });
};

module.exports.libraThumb = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const itemId = params.pocket_id;
  const suggestedImgUrl = params.image_suggested;
  const item10Id = `0000000000${itemId}`.substr(-10, 10);
  const itemId3 = item10Id.slice(0, 3);
  const s3path = `items/thumbs/${itemId3}/${item10Id}.jpg`;
  console.log('S3 Path --', s3path);
  try {
    if (isValidSuggestedUrl(suggestedImgUrl)) {
      fetchAndConvertAndPut(s3path, suggestedImgUrl, callback);
    } else {
      const libra = new Libra(params.url);
      libra.getInfo().then(info => {
        console.log(info);
        fetchAndConvertAndPut(s3path, info.image, callback);
      });
    }
  } catch (error) {
    putBlankImage(s3path);
    callback(null, errorResponseBuilder(error));
  }
};

function isValidSuggestedUrl(suggestedImgUrl) {
  if (typeof suggestedImgUrl === 'undefined') {
    return false;
  }
  return true;
}

function fetchAndConvertAndPut(s3path, imageUrl, callback) {
  console.log('Detected image URL --', imageUrl);
  axios(imageUrl, {
    responseType: 'arraybuffer'
  })
    .then(res => res.data)
    .then(buffer => {
      return new Promise((rv, rj) => {
        gm(buffer)
          .resize(420)
          .background('#fff')
          .flatten()
          .toBuffer('jpg', (err, buf) => {
            if (err) { throw err; }
            rv(buf);
          });
      });
    }).then(buf => {
      putImage(s3path, buf)
        .promise()
        .then(v => callback(null, successResponseBuilder(v)));
    }).catch(error => {
      putBlankImage(s3path);
      callback(null, errorResponseBuilder(error));
    });
}

function putBlankImage(s3path) {
  console.log('Fetch failed. Using blank image.');
  gm('./blank.jpg').toBuffer('jpg', (err, buf) => {
    console.log('Blank image Buffer --', buf);
    putImage(s3path, buf);
  });
}

function putImage(s3path, buffer) {
  console.log(`Putting image on S3 (${s3path}):`, buffer);
  return s3.putObject({
    Bucket: process.env.BUCKET,
    Key: s3path,
    Body: buffer,
  }, (err, data) => {
    if (err) { console.log('Error:', err); }
    if (data) { console.log('Success:', data); }
  });
}

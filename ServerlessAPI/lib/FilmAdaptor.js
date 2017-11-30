const AWS = require('aws-sdk');
const gm = require('gm').subClass({ imageMagick: true });
const axios = require('axios');

const debug = require('debug')('chase:film')
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
  debug(error);
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

module.exports.main = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const url = params.url;
  const itemId = params.pocket_id;
  const suggestedImgUrl = params.image_suggested;
  const item10Id = `0000000000${itemId}`.substr(-10, 10);
  const itemId3 = item10Id.slice(0, 3);
  const s3path = `items/thumbs/${itemId3}/${item10Id}.jpg`;
  debug('[main] S3 Path --', s3path);
  try {
    getImgUrl(url, suggestedImgUrl).then((imgUrl) => {
      debug('[main] Detected image URL --', imgUrl);
      return fetchImageBuffer(imgUrl);
    }).then((buf) => {
      return convertImage(buf);
    }).then((img) => {
      return putImage(s3path, img).promise();
    }).then((v) => {
      callback(null, successResponseBuilder(v));
    }).catch((error) => {
      debug('[main:catch]', error)
      putBlankImage(s3path);
      callback(null, errorResponseBuilder(error));
    });
  } catch (error) {
    putBlankImage(s3path);
    callback(null, errorResponseBuilder(error));
  }
};

function getImgUrl(url, suggestedImgUrl) {
  return new Promise((rv, rj) => {
    if (isValidSuggestedUrl(suggestedImgUrl)) {
      rv(suggestedImgUrl);
    } else {
      const libra = new Libra(url);
      libra.getInfo().then(info => {
        debug(info);
        rv(info.image);
      });
    }
  });
}

function isValidSuggestedUrl(suggestedImgUrl) {
  if (typeof suggestedImgUrl === 'undefined') {
    return false;
  }
  return true;
}

function fetchImageBuffer(imageUrl) {
  return new Promise((rv, rj) => {
    axios(imageUrl, {
      responseType: 'arraybuffer'
    })
      .then(res => res.data)
      .then(buffer => {
        rv(buffer);
      }).catch(error => {
        debug('[fetchImageBuffer:catch] Error');
        rj(error);
      });
  });
}

function convertImage(buf) {
  return new Promise((rv, rj) => {
    gm(buf)
      .resize(420)
      .background('#fff')
      .flatten()
      .toBuffer('jpg', (err, buf) => {
        if (err) { rj(err); }
        rv(buf);
      });
  }).catch((error) => {
    debug('[convertImage:catch] Error');
    throw error;
  });
}

function putBlankImage(s3path) {
  debug('Fetch failed. Using blank image.');
  gm('./blank.jpg').toBuffer('jpg', (err, buf) => {
    debug('Blank image Buffer --', buf);
    putImage(s3path, buf);
  });
}

function putImage(s3path, buffer) {
  debug(`Putting image on S3 (${s3path}):`, buffer);
  return s3.putObject({
    Bucket: process.env.BUCKET,
    Key: s3path,
    Body: buffer,
  }, (err, data) => {
    if (err) { debug('Error:', err); }
    if (data) { debug('Success:', data); }
  });
}

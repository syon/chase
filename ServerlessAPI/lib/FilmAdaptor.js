const AWS = require('aws-sdk');
const gm = require('gm').subClass({ imageMagick: true });
const axios = require('axios');
const debug = require('debug')('chase:film');
const Libra = require('./Libra');

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

function isValidSuggestedUrl(suggestedImgUrl) {
  if (typeof suggestedImgUrl === 'undefined') {
    return false;
  }
  if (suggestedImgUrl.trim() === '') {
    return false;
  }
  return true;
}

function getImgUrl(url, itemId, suggestedImgUrl) {
  return new Promise((rv) => {
    if (isValidSuggestedUrl(suggestedImgUrl)) {
      debug('Using suggested image...');
      rv(suggestedImgUrl);
    } else {
      debug('No suggested image found.');
      debug('Fetching the site og:image...');
      const libra = new Libra({ url, pocketId: itemId });
      libra.getInfo().then((info) => {
        debug(info);
        rv(info.image);
      });
    }
  });
}

function fetchImageBuffer(imageUrl) {
  return new Promise((rv, rj) => {
    axios(imageUrl, {
      responseType: 'arraybuffer',
    })
      .then(res => res.data)
      .then((buffer) => {
        rv(buffer);
      }).catch((error) => {
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
      .toBuffer('jpg', (err, buffer) => {
        if (err) { rj(err); }
        rv(buffer);
      });
  }).catch((error) => {
    debug('[convertImage:catch] Error');
    throw error;
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

function putBlankImage(s3path) {
  debug('Fetch failed. Using blank image.');
  gm('./blank.jpg').toBuffer('jpg', (err, buf) => {
    debug('Blank image Buffer --', buf);
    putImage(s3path, buf);
  });
}

module.exports.main = (event, context, callback) => {
  const params = JSON.parse(event.body);
  debug('[main] params', params);
  const { url, pocket_id: itemId, image_suggested } = params;
  const item10Id = `0000000000${itemId}`.substr(-10, 10);
  const itemId3 = item10Id.slice(0, 3);
  const s3path = `items/thumbs/${itemId3}/${item10Id}.jpg`;
  debug('[main] S3 Path --', s3path);
  try {
    getImgUrl(url, itemId, image_suggested).then((imgUrl) => {
      debug('[main] Detected image URL --', imgUrl);
      return fetchImageBuffer(imgUrl);
    })
      .then(buf => convertImage(buf))
      .then(img => putImage(s3path, img).promise())
      .then(v => callback(null, successResponseBuilder(v)))
      .catch((error) => {
        debug('[main:catch]', error);
        putBlankImage(s3path);
        callback(null, errorResponseBuilder(error));
      });
  } catch (error) {
    debug('[main] error', event.body);
    putBlankImage(s3path);
    callback(null, errorResponseBuilder(error));
  }
};

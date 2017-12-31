const AWS = require('aws-sdk');
const gm = require('gm').subClass({ imageMagick: true });
const axios = require('axios');
const debug = require('debug')('chase:film');
const Libra = require('./Libra');

const s3 = new AWS.S3();

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
  debug('[getImgUrl]');
  return new Promise((rv, rj) => {
    debug('Fetching the site og:image...');
    const libra = new Libra({ url, pocketId: itemId });
    libra.getInfo().then((info) => {
      debug(info);
      if (info.image) rv(info.image);
      if (isValidSuggestedUrl(suggestedImgUrl)) {
        debug('Using suggested image...');
        rv(suggestedImgUrl);
      } else {
        rj(new Error('No image found.'));
      }
    });
  });
}

function fetchImageBuffer(imageUrl) {
  debug('[fetchImageBuffer]');
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
  debug('[convertImage]-->>');
  return new Promise((rv, rj) => {
    try {
      gm(buf)
        .resize(420)
        .background('#fff')
        .flatten()
        .toBuffer('jpg', (err, buffer) => {
          if (err) { rj(err); }
          debug('[convertImage]<<--');
          rv(buffer);
        });
    } catch (error) {
      debug('[convertImage:catch] Error');
      rj(error);
    }
  });
}

function s3Head(s3path) {
  return new Promise((rv) => {
    const obj = {
      Bucket: process.env.BUCKET,
      Key: s3path,
    };
    debug(obj);
    s3.headObject(obj, (err, data) => {
      if (err) {
        debug('Not found in S3');
        rv(false);
      }
      if (data) {
        debug('Already exists in S3');
        rv(true);
      }
    });
  });
}

function putImage(s3path, buffer) {
  debug(`[putImage] S3 (${s3path}):`, buffer);
  return s3.putObject({
    Bucket: process.env.BUCKET,
    Key: s3path,
    Body: buffer,
  }, (err, data) => {
    if (err) { debug('[putImage] Error:', err); }
    if (data) { debug('[putImage] Success:', data); }
  });
}

function putBlankImage(s3path) {
  debug('Fetch failed. Using blank image.');
  gm('./assets/blank.jpg').toBuffer('jpg', (err, buf) => {
    if (err) {
      debug(err);
      return;
    }
    debug('Blank image Buffer --', buf);
    putImage(s3path, buf);
  });
}

module.exports.main = (params) => {
  debug('[main] params', params);
  const { url, pocket_id: itemId, image_suggested } = params;
  const item10Id = `0000000000${itemId}`.substr(-10, 10);
  const itemId3 = item10Id.slice(0, 3);
  const s3path = `items/thumbs/${itemId3}/${item10Id}.jpg`;
  return s3Head(s3path).then((judge) => {
    if (judge) return '(Skipped) Already exists.';
    debug('[main] S3 Path --', s3path);
    try {
      return getImgUrl(url, itemId, image_suggested).then((imgUrl) => {
        debug('[main] Detected image URL --', imgUrl);
        return fetchImageBuffer(imgUrl);
      })
        .then(buf => convertImage(buf))
        .then(img => putImage(s3path, img).promise())
        .catch((error) => {
          debug('[main:catch]', error);
          putBlankImage(s3path);
        });
    } catch (error) {
      putBlankImage(s3path);
      throw new Error(error);
    }
  });
};

require('dotenv').config();
const debug = require('debug')('chase:user-adaptor');
const AWS = require('aws-sdk');

const Pocket = require('./PocketAPI');
const LibraAdaptor = require('./LibraAdaptor');
const FilmAdaptor = require('./FilmAdaptor');
const ShotAdaptor = require('./ShotAdaptor');

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

function extractAccesstokens() {
  return new Promise((rv, rj) => {
    const opts = {
      Bucket: process.env.BUCKET,
      Prefix: 'accesstokens/',
      MaxKeys: 10,
    };
    s3.listObjectsV2(opts, (err, data) => {
      if (err) {
        rj(err.stack);
      } else {
        const files = data.Contents.filter(d => d.Key.match(/\.json$/));
        const tokens = files.map(d => d.Key.match(/^accesstokens\/([a-z0-9-]+)\.json$/)[1]);
        rv(tokens);
      }
    });
  });
}

function getPocketEntrySet(at) {
  const ck = process.env.POCKET_CONSUMER_KEY;
  const params = { count: 5, detailType: 'complete' };
  return Pocket.get(ck, at, params).then((d) => {
    debug(`GET RESULT of ${at} IS:`, Object.keys(d.list).length);
    return d.list;
  }).catch((err) => {
    debug('(Skipped) Failed to get with Access Token:', at);
    debug(err);
  });
}

function moldEntry(pocketRawItem) {
  const m = pocketRawItem;
  const url = m.resolved_url ? m.resolved_url : m.given_url;
  const is = (m.has_image === '1') ? m.image.src : '';
  return { pocket_id: m.item_id, url, image_suggested: is };
}

module.exports.prepare = async () => {
  const tokens = await extractAccesstokens();
  await Promise.all(tokens.map(at => getPocketEntrySet(at).then((set) => {
    const items = Object.keys(set).map(id => moldEntry(set[id]));
    return items;
  }).then(async (items) => {
    await Promise.all(items.map(async (params) => {
      LibraAdaptor.libraInfo(params);
      FilmAdaptor.main(params);
      ShotAdaptor.main(params);
    }));
  })));
};

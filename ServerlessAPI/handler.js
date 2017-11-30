/* eslint-disable arrow-body-style */

// Pocket API
// https://getpocket.com/developer/docs/overview
//
//   [Rule]
//   https://getpocket.com/v3/oauth/request
//   ||
//   https://<API Gateway>/pocket/oauth/request

// http://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/how-to-cors.html
// https://qiita.com/maaz118/items/e20b64f088fbead07206

const PocketAPI = require('./lib/PocketAPI');
const FilmAdaptor = require('./lib/FilmAdaptor');
const LibraAdaptor = require('./lib/LibraAdaptor');

module.exports.pocketOauthRequest = (event, context, callback) => {
  return PocketAPI.pocketOauthRequest(event, context, callback);
};

module.exports.pocketOauthAuthorize = (event, context, callback) => {
  return PocketAPI.pocketOauthAuthorize(event, context, callback);
};

module.exports.pocketGet = (event, context, callback) => {
  return PocketAPI.pocketGet(event, context, callback);
};

module.exports.pocketSendArchive = (event, context, callback) => {
  return PocketAPI.pocketSendArchive(event, context, callback);
};

module.exports.pocketSendFavorite = (event, context, callback) => {
  return PocketAPI.pocketSendFavorite(event, context, callback);
};

module.exports.pocketSendUnfavorite = (event, context, callback) => {
  return PocketAPI.pocketSendUnfavorite(event, context, callback);
};

module.exports.pocketSendTagsAdd = (event, context, callback) => {
  return PocketAPI.pocketSendTagsAdd(event, context, callback);
};

module.exports.libraInfo = (event, context, callback) => {
  return LibraAdaptor.libraInfo(event, context, callback);
};

module.exports.libraThumb = (event, context, callback) => {
  return FilmAdaptor.main(event, context, callback);
};

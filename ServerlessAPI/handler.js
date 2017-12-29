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

const PocketAdaptor = require('./lib/PocketAdaptor');
const UserAdaptor = require('./lib/UserAdaptor');
const FilmAdaptor = require('./lib/FilmAdaptor');
const LibraAdaptor = require('./lib/LibraAdaptor');

module.exports.pocketOauthRequest = (event, context, callback) => {
  return PocketAdaptor.pocketOauthRequest(event, context, callback);
};

module.exports.pocketOauthAuthorize = (event, context, callback) => {
  return PocketAdaptor.pocketOauthAuthorize(event, context, callback);
};

module.exports.pocketGet = (event, context, callback) => {
  return PocketAdaptor.pocketGet(event, context, callback);
};

module.exports.pocketSendArchive = (event, context, callback) => {
  return PocketAdaptor.pocketSendArchive(event, context, callback);
};

module.exports.pocketSendFavorite = (event, context, callback) => {
  return PocketAdaptor.pocketSendFavorite(event, context, callback);
};

module.exports.pocketSendUnfavorite = (event, context, callback) => {
  return PocketAdaptor.pocketSendUnfavorite(event, context, callback);
};

module.exports.pocketSendTagsAdd = (event, context, callback) => {
  return PocketAdaptor.pocketSendTagsAdd(event, context, callback);
};

module.exports.userregister = (event, context, callback) => {
  return UserAdaptor.register(event, context, callback);
};

module.exports.userprepare = (event, context, callback) => {
  return UserAdaptor.prepare(event, context, callback);
};

module.exports.libraInfo = (event, context, callback) => {
  return LibraAdaptor.libraInfo(event, context, callback);
};

module.exports.libraThumb = (event, context, callback) => {
  return FilmAdaptor.main(event, context, callback);
};

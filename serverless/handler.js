// Pocket API
// https://getpocket.com/developer/docs/overview
//
//   [Rule]
//   https://getpocket.com/v3/oauth/request
//   ||
//   https://<API Gateway>/pocket/oauth/request

const debug = require('debug')('chase:sls-handler')

const PocketAdaptor = require('./lib/PocketAdaptor')
const UserAdaptor = require('./lib/UserAdaptor')
const FilmAdaptor = require('./lib/FilmAdaptor')
const LibraAdaptor = require('./lib/LibraAdaptor')

function success(bodyObj) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(bodyObj),
  }
}

function failure(error) {
  debug('======== Failure in handler.js ========')
  let res
  if (error.status && error.headers) {
    // axios error
    res = error.response
  } else {
    // other error
    debug(error)
    res = { headers: {} }
  }
  const response = {
    statusCode: res.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'x-error-code': res.headers['x-error-code'],
      'x-error': res.headers['x-error'],
    },
    body: JSON.stringify({
      message: res.statusText,
    }),
  }
  return response
}

module.exports.pocketOauthRequest = (event, context, callback) => {
  const params = JSON.parse(event.body)
  return PocketAdaptor.pocketOauthRequest(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.pocketOauthAuthorize = (event, context, callback) => {
  const params = JSON.parse(event.body)
  return PocketAdaptor.pocketOauthAuthorize(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.pocketGet = (event, context, callback) => {
  const params = JSON.parse(event.body)
  return PocketAdaptor.pocketGet(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.pocketProgress = (event, context, callback) => {
  const params = JSON.parse(event.body)
  return PocketAdaptor.pocketProgress(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.pocketSendArchive = (event, context, callback) => {
  const params = event.queryStringParameters
  return PocketAdaptor.pocketSendArchive(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.pocketSendFavorite = (event, context, callback) => {
  const params = event.queryStringParameters
  return PocketAdaptor.pocketSendFavorite(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.pocketSendUnfavorite = (event, context, callback) => {
  const params = event.queryStringParameters
  return PocketAdaptor.pocketSendUnfavorite(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.pocketSendTagsAdd = (event, context, callback) => {
  const params = event.queryStringParameters
  return PocketAdaptor.pocketSendTagsAdd(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.pocketSendTagsClear = (event, context, callback) => {
  const params = event.queryStringParameters
  return PocketAdaptor.pocketSendTagsClear(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.userlogin = (event, context, callback) => {
  const params = JSON.parse(event.body)
  return UserAdaptor.login(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.userprepare = (event, context, callback) => {
  const params = JSON.parse(event.body)
  return UserAdaptor.prepare(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.libraInfo = (event, context, callback) => {
  const params = event.queryStringParameters
  return LibraAdaptor.libraInfo(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

module.exports.libraThumb = (event, context, callback) => {
  const params = JSON.parse(event.body)
  return FilmAdaptor.main(params)
    .then((r) => callback(null, success(r)))
    .catch((e) => callback(null, failure(e)))
}

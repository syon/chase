const debug = require('debug')('chase:pocket-adaptor')

const Pocket = require('./PocketAPI')

module.exports.pocketOauthRequest = (params) => {
  return Pocket.oauth.request(params.redirect_uri)
}

module.exports.pocketOauthAuthorize = (params) => {
  return Pocket.oauth.authorize(params.code)
}

module.exports.pocketGet = (params) => {
  return Pocket.get(params.access_token, params)
}

module.exports.pocketSendArchive = (params) => {
  return Pocket.send.archive(params.access_token, params)
}

module.exports.pocketSendFavorite = (params) => {
  return Pocket.send.favorite(params.access_token, params)
}

module.exports.pocketSendUnfavorite = (params) => {
  return Pocket.send.unfavorite(params.access_token, params)
}

module.exports.pocketSendTagsAdd = (params) => {
  return Pocket.send.tagsAdd(params.access_token, params)
}

module.exports.pocketSendTagsClear = (params) => {
  return Pocket.send.tagsClear(params.access_token, params)
}

module.exports.pocketProgress = (params) => {
  const funcU = Pocket.get(params.access_token, { state: 'unread' })
  const funcA = Pocket.get(params.access_token, { state: 'archive' })
  return Promise.all([
    funcU.then((r) => Object.keys(r.list).length),
    funcA.then((r) => Object.keys(r.list).length)
  ]).then(([unread, archive]) => {
    debug({ unread, archive })
    return { unread, archive }
  })
}

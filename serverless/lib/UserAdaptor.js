const debug = require('debug')('chase:user-adaptor')
const AWS = require('aws-sdk')

const Pocket = require('./PocketAPI')
const LibraAdaptor = require('./LibraAdaptor')
const FilmAdaptor = require('./FilmAdaptor')
const ShotAdaptor = require('./ShotAdaptor')

const s3 = new AWS.S3()

module.exports.login = (params) => {
  return new Promise((rv, rj) => {
    debug('[login]>>>>', params)
    const { access_token: token } = params.user
    if (!token || !token.match(/^[a-z0-9-]+$/)) {
      rj(new Error('Invalid access token.'))
    }
    const timestamp = Math.floor(new Date().getTime() / 1000)
    const filename = `${timestamp}-${token}.json`
    const obj = {
      Bucket: process.env.BUCKET,
      Key: `logs/${filename}`,
      Body: JSON.stringify(params, null, 2),
    }
    s3.putObject(obj, (err, data) => {
      if (err) rj(err)
      rv(data)
    })
  })
}

function getPocketEntrySet(at) {
  const params = { count: 5, detailType: 'complete' }
  return Pocket.get(at, params)
    .then((d) => {
      debug(`GET RESULT of ${at} IS:`, Object.keys(d.list).length)
      return d.list
    })
    .catch((err) => {
      debug('(Skipped) Failed to get with Access Token:', at)
      debug(err)
    })
}

function moldEntry(pocketRawItem) {
  const m = pocketRawItem
  const url = m.resolved_url ? m.resolved_url : m.given_url
  const is = m.has_image === '1' ? m.image.src : ''
  return { pocket_id: m.item_id, url, image_suggested: is }
}

module.exports.prepare = async (args) => {
  debug('[args]', args)
  const { token } = args
  return getPocketEntrySet(token)
    .then((set) => {
      const items = Object.keys(set).map((id) => moldEntry(set[id]))
      return items
    })
    .then(async (items) => {
      await Promise.all(
        items.map(async (params) => {
          await LibraAdaptor.libraInfo(params)
          await FilmAdaptor.main(params)
          await ShotAdaptor.main(params)
        })
      )
    })
}

const debug = require('debug')('chase:libra-adaptor')
const Libra = require('./Libra')

module.exports.libraInfo = (params) => {
  debug('[libraInfo]>>>>', params)
  const libra = new Libra({ url: params.url, pocketId: params.pocket_id })
  return libra.getInfo().then((info) => {
    debug('[libraInfo]<<<<', info)
    return info
  })
}

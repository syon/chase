import debug from 'debug'

const dg = debug('@:Utils')

export default class Utils {
  static async isHeadSuccess(url) {
    dg('[#isHeadSuccess]', url)
    return await fetch(url, {
      method: 'HEAD',
      headers: { Origin: location.origin },
    })
      .then((r) => {
        return r.ok
      })
      .catch((e) => {
        dg('[#isHeadSuccess<catch>]', url, e)
        return false
      })
  }
}

import Debug from 'debug'
import DB from '@/lib/DB'
import ChaseUtil from '@/lib/ChaseUtil'
import LambdaPocket from '@/lib/LambdaPocket'
import Hatebu from '@/lib/Hatebu'

const dg = Debug('@:ChaseDuty')
const $cache = new DB()

export default class ChaseDuty {
  constructor() {
    this.accessToken = null
  }

  setAccessToken(accessToken) {
    dg('[#setAccessToken]', accessToken)
    this.accessToken = accessToken
  }

  async retrieveRecent() {
    dg('[#retrieveRecent]', this.accessToken)
    if (!this.accessToken) return
    const options = { state: 'unread', count: 100, detailType: 'complete' }
    const json = await LambdaPocket.get(this.accessToken, options)
    const pktDict = ChaseUtil.makeEntries(json.list)
    await $cache.renewPocket(pktDict)
  }

  async getHatebu({ eid, url }) {
    dg('[#getHatebu] >>', { eid, url })
    const hatebu = await Hatebu.getEntry(url)
    return hatebu
  }
}

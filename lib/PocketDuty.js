import Debug from 'debug'

import CacheDB from '@/lib/DB'
import ChaseUtil from '@/lib/ChaseUtil'
import LambdaPocket from '@/lib/LambdaPocket'

const dg = Debug('@:PocketDuty')
const $cache = new CacheDB()

export default class PocketDuty {
  static async fetchAllUnreadItems({ at, entryCount, isPremium }) {
    dg('[#fetchAllUnreadItems]>>')
    let offset = 0 // entryCount
    while (true) {
      const options = {
        state: 'unread',
        count: 1000,
        detailType: 'simple',
        offset,
      }
      const json = await LambdaPocket.get(at, options)
      const resultCount = Object.keys(json.list).length
      const entries = ChaseUtil.makeEntries(json.list)
      await $cache.renewPocket(entries)
      if (resultCount < 1000) {
        dg('[#fetchAllUnreadItems]', { resultCount })
        break
      }
      if (!isPremium) {
        // break
      }
      offset = offset + resultCount
    }
    dg('[#fetchAllUnreadItems]<<')
  }
}

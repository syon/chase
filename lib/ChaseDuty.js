import Debug from 'debug'
import CacheDB from '@/lib/DB'
import ChaseUtil from '@/lib/ChaseUtil'
import LambdaPocket from '@/lib/LambdaPocket'
import Hatebu from '@/lib/Hatebu'
import HatenaAPI from '@/lib/HatenaAPI'
import Promise from 'bluebird'

const dg = Debug('@:ChaseDuty')
const $cache = new CacheDB()

export default class ChaseDuty {
  constructor() {
    this.accessToken = null
    this.hatebuTasks = []
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

  async fetchHatebuCacheTasks() {
    dg('[#fetchHatebuCacheTasks] >>')
    const allEntries = await $cache.selectAllPocketUnread()
    const targets = await CacheDB.asyncFilter(allEntries, async (x) => {
      const rec = await $cache.hatebuTable.get({ eid: x.eid })
      return !rec
    })
    this.hatebuTasks = targets
    dg('[#fetchHatebuCacheTasks] length', targets.length)
    return targets.length
  }

  async doHatebuCacheTaskPartly() {
    dg('[#doHatebuCacheTaskPartly] >>')
    const targets = this.hatebuTasks.splice(0, 3)
    const func = async (entry) => {
      const { eid, url, title } = entry
      const wid = await $cache.getWidByEid(eid)
      if (!wid) return
      const cnt = await HatenaAPI.Bookmark.getEntryCount(url)
      const at = new Date().getTime()
      dg(`[Hatebu CNT: ${cnt}] ${title}`)
      return await $cache.hatebuTable.put({ eid, wid, cnt, at }, eid)
    }
    await Promise.map(targets, func, { concurrency: 3 })
    dg('[#doHatebuCacheTaskPartly] << remain:', this.hatebuTasks.length)
  }
}

import Debug from 'debug'
import Dexie from 'dexie'
import Promise from 'bluebird'
import LobineAPI from '@/lib/LobineAPI'
import HatenaAPI from '@/lib/HatenaAPI'

const dg = Debug('@:CacheDB')

export default class CacheDB extends Dexie {
  constructor() {
    super('Chase')

    this.version(9).stores({
      pocketTable: '&eid,status,time_updated',
      digTable: '&eid,wid,dig',
      hatebuTable: '&eid,wid,cnt',
    })

    this.pocketTable = this.table('pocketTable')
    this.digTable = this.table('digTable')
    this.hatebuTable = this.table('hatebuTable')
  }

  /** 内容豊富なdigTableを検索できていない。 */
  async filterPocket(keyword) {
    const allEntries = await this.pocketTable
      .where('status')
      .equals('0')
      .filter((x) => {
        const kwd = String(keyword)
        if (kwd.length === 0) return true
        if (x.title.includes(kwd)) return true
        if (x.excerpt.includes(kwd)) return true
        if (x.fqdn.includes(kwd)) return true
        if (Object.keys(x.tags).includes(kwd)) return true
        return false
      })
      .reverse()
      .sortBy('time_updated')
    dg('Search Result:', allEntries)
    return allEntries
  }

  async selectAllPocketUnread() {
    const allEntries = await this.pocketTable
      .where('status')
      .equals('0')
      .reverse()
      .sortBy('time_updated')
    return allEntries
  }

  async selectCachedPocketRecent() {
    dg('[#selectCachedPocketRecent] >>')
    const allEntries = await this.selectAllPocketUnread()
    const arr = allEntries.slice(0, 20)
    dg('[#selectCachedPocketRecent] <<', arr)
    return arr
  }

  async selectCachedPocketAll() {
    dg('[#selectCachedPocketAll]')
    const arr = await this.pocketTable
      .where('status')
      .equals('0')
      .reverse()
      .sortBy('time_updated')
    return arr
  }

  async countPocketAllUnread() {
    dg('[#countPocketAllUnread]')
    const c = await this.pocketTable.where('status').equals('0').count()
    dg('[#countPocketAllUnread]', c)
    return c
  }

  async renewPocket(pocketDict) {
    dg('[#renewPocket] >>', Object.keys(pocketDict).length)
    const promises = Object.entries(pocketDict).map(([eid, item]) => {
      return Promise.all([
        this.pocketTable.put({ ...item }, eid),
        this.putDigIfNeed(item),
      ])
    })
    await Promise.all(promises)
    dg('[#renewPocket] <<', Object.keys(pocketDict).length)
  }

  async putDigIfNeed(item) {
    const { eid, url } = item
    const tgt = await this.digTable.get(eid)
    if (tgt) return
    dg('[#putDigIfNeed] >> [NEED]', eid)
    const { wid, dig } = await LobineAPI.postWid(url)
    return await this.digTable.put({ eid, wid, dig }, eid).catch((e) => {
      dg('!catch!', { eid, wid, dig }, e)
    })
  }

  async totalSyncDigTable() {
    const arr = await this.pocketTable.toArray()
    const promises = arr.map(this.putDigIfNeed)
    dg('[#totalSyncDigTable] promises.length', promises.length)
    return Promise.all(promises)
  }

  async getWidByEid(eid) {
    const obj = await this.digTable.get({ eid })
    return obj ? obj.wid : null
  }

  async getDigByWid(wid) {
    const obj = (await this.digTable.get({ wid })) || {}
    return obj.dig
  }

  static async asyncFilter(array, asyncCallback) {
    const bits = await Promise.all(array.map(asyncCallback))
    return array.filter((_, i) => bits[i])
  }

  async prepareHatebuTable() {
    dg('[#prepareHatebuTable] >>')
    const allEntries = await this.selectAllPocketUnread()
    const latestEntries = allEntries.slice(0, 20)
    const oneHourAgo = new Date().getTime() - 3600 * 1000
    const targets = await CacheDB.asyncFilter(latestEntries, async (x) => {
      const rec = await this.hatebuTable.get({ eid: x.eid })
      return !rec || rec.at < oneHourAgo
    })
    dg('[#prepareHatebuTable] length', targets.length)
    const promises = await targets.map(async (entry) => {
      const { eid, url, title } = entry
      const wid = await this.getWidByEid(eid)
      if (!wid) return
      const cnt = await HatenaAPI.Bookmark.getEntryCount(url)
      const at = new Date().getTime()
      dg(`[Hatebu CNT: ${cnt}] ${title}`)
      return await this.hatebuTable.put({ eid, wid, cnt, at }, eid)
    })
    await Promise.all(promises)
  }

  async prepareHatebuTableFull() {
    dg('[#prepareHatebuTableFull] >>')
    const allEntries = await this.selectAllPocketUnread()
    const targets = await CacheDB.asyncFilter(allEntries, async (x) => {
      const rec = await this.hatebuTable.get({ eid: x.eid })
      return !rec
    })
    dg('[#prepareHatebuTableFull] length', targets.length)
    const func = async (entry) => {
      const { eid, url, title } = entry
      const wid = await this.getWidByEid(eid)
      if (!wid) return
      const cnt = await HatenaAPI.Bookmark.getEntryCount(url)
      const at = new Date().getTime()
      dg(`[Hatebu CNT: ${cnt}] ${title}`)
      return await this.hatebuTable.put({ eid, wid, cnt, at }, eid)
    }
    await Promise.map(targets, func, { concurrency: 5 })
  }

  async getHatebuTable() {
    return await this.hatebuTable.toArray()
  }

  async getHatebuCntByEid(eid) {
    const j = await this.digTable.get({ eid })
    if (!j) return null
    const rec = await this.hatebuTable.get({ wid: j.wid })
    return rec ? rec.cnt : null
  }

  async getHatebuCntSet() {
    dg('[#getHatebuCntSet]')
    const records = await this.hatebuTable.toArray()
    return Object.fromEntries(records.map((rec) => [rec.eid, rec.cnt]))
  }

  async archive(eid) {
    dg('[#archive]', eid)
    const obj = await this.pocketTable.get({ eid })
    obj.status = '1'
    await this.pocketTable.put(obj, eid)
  }
}

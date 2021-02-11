import Debug from 'debug'
import Dexie from 'dexie'
import LobineAPI from '@/lib/LobineAPI'
import HatenaAPI from '@/lib/HatenaAPI'

const dg = Debug('@:CacheDB')

export default class CacheDB extends Dexie {
  constructor() {
    super('Chase')

    this.version(8).stores({
      pocketTable: '&eid,status,time_updated',
      digTable: '&eid,wid,dig',
      stream: '&eid,status,time_updated',
      junction: '&eid,wid,dig',
      hatebu: '&eid,wid,cnt',
    })

    this.pocketTable = this.table('pocketTable')
    this.digTable = this.table('digTable')
    this.stream = this.table('stream')
    this.junction = this.table('junction')
    this.hatebu = this.table('hatebu')
  }

  async selectCachedPocketLatest100() {
    dg('[#selectCachedPocketLatest100] start')
    const allEntries = await this.pocketTable
      .where('status')
      .equals('0')
      .reverse()
      .sortBy('time_updated')
    const arr = allEntries.slice(0, 100)
    dg('[#selectCachedPocketLatest100] >>', arr)
    return arr
  }

  async selectAll() {
    dg('[#selectAll]')
    const arr = await this.stream.where('status').equals('0').toArray()
    return Object.fromEntries(arr.map((x) => [x.eid, x]))
  }

  async putPocketDict(pocketDict) {
    dg('[#putPocketDict]')
    const promises = await Object.entries(pocketDict).map(
      async ([eid, entry]) => {
        return await this.pocketTable.put({ ...entry }, eid)
      }
    )
    await Promise.all(promises)
  }

  async putBulk(entries) {
    dg('[#putBulk]')
    const promises = await Object.entries(entries).map(async ([eid, entry]) => {
      return await this.stream.put({ ...entry }, eid)
    })
    return Promise.all(promises)
  }

  async prepareDigTable() {
    const arr = await this.pocketTable.toArray()
    const promises = arr.map(async (entry) => {
      const { eid } = entry
      const need = (await this.digTable.where({ eid }).count()) === 0
      if (!need) return
      const { wid, dig } = await LobineAPI.postWid(entry.url)
      return await this.digTable.put({ eid, wid, dig }, eid).catch((e) => {
        dg('!catch!', { eid, wid, dig }, e)
      })
    })
    dg('[#prepareDigTable] promises.length', promises.length)
    return Promise.all(promises)
  }

  async getWidByEid(eid) {
    const obj = await this.digTable.get({ eid })
    return obj ? obj.wid : null
  }

  async getDigByWid(wid) {
    const obj = await this.digTable.get({ wid })
    return obj.dig
  }

  static async asyncFilter(array, asyncCallback) {
    const bits = await Promise.all(array.map(asyncCallback))
    return array.filter((_, i) => bits[i])
  }

  async putHatebuBulk() {
    dg('[#putHatebuBulk]')
    const latestEntries = await this.stream
      .reverse()
      .limit(100)
      .sortBy('time_updated')
    const oneHourAgo = new Date().getTime() - 3600 * 1000
    const targets = await CacheDB.asyncFilter(latestEntries, async (x) => {
      const rec = await this.hatebu.get({ eid: x.eid })
      return !rec || rec.at < oneHourAgo
    })
    const promises = await targets.map(async (entry) => {
      const { eid, url } = entry
      const wid = await this.getWidByEid(eid)
      if (!wid) return
      const cnt = await HatenaAPI.getEntryCount(url)
      const at = new Date().getTime()
      return await this.hatebu.put({ eid, wid, cnt, at }, eid)
    })
    await Promise.all(promises)
  }

  async getHatebuCntByEid(eid) {
    const j = await this.junction.get({ eid })
    if (!j) return null
    const rec = await this.hatebu.get({ wid: j.wid })
    return rec ? rec.cnt : null
  }

  async getHatebuCntSet() {
    dg('[#getHatebuCntSet]')
    const arr = await this.hatebu.toArray()
    return Object.fromEntries(arr.map((x) => [x.eid, x]))
  }

  async archive(eid) {
    dg('[#archive]', eid)
    const obj = await this.stream.get({ eid })
    obj.status = '1'
    await this.stream.put(obj, eid)
  }
}

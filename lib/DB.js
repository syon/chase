import consola from 'consola/src/browser'

import Dexie from 'dexie'
import LobineAPI from '@/lib/LobineAPI'
import HatenaAPI from '@/lib/HatenaAPI'

export default class CacheDB extends Dexie {
  constructor() {
    super('Chase')

    this.version(7).stores({
      stream: '&eid,status,time_updated',
      junction: '&eid,wid,dig',
      hatebu: '&eid,wid,cnt',
    })

    this.stream = this.table('stream')
    this.junction = this.table('junction')
    this.hatebu = this.table('hatebu')
  }

  async selectCachedLatest100() {
    consola.info('[#selectCachedLatest100]')
    const allEntries = await this.stream
      .where('status')
      .equals('0')
      .reverse()
      .sortBy('time_updated')
    const arr = allEntries.slice(0, 100)
    return Object.fromEntries(arr.map((x) => [x.eid, x]))
  }

  async selectAll() {
    consola.info('[#selectAll]')
    const arr = await this.stream.where('status').equals('0').toArray()
    return Object.fromEntries(arr.map((x) => [x.eid, x]))
  }

  async put(entry) {
    consola.info('[#put]')
    const { eid } = entry
    return await this.transaction('rw', this.stream, async () => {
      await this.stream.put({ ...entry }, eid)
    }).catch((e) => {
      consola.error(e.stack || e)
    })
  }

  async putBulk(entries) {
    consola.info('[#putBulk]')
    const promises = await Object.entries(entries).map(async ([eid, entry]) => {
      return await this.stream.put({ ...entry }, eid)
    })
    return Promise.all(promises)
  }

  async prepareJunction() {
    const arr = await this.stream.toArray()
    const promises = arr.map(async (entry) => {
      const { eid } = entry
      const need = (await this.junction.where({ eid }).count()) === 0
      if (!need) return
      const { wid, dig } = await LobineAPI.postWid(entry.url)
      consola.log({ eid, wid, dig })
      return await this.junction.put({ eid, wid, dig }, eid).catch((e) => {
        consola.error({ eid, wid, dig }, e)
      })
    })
    consola.info('[#prepareJunction] promises.length', promises.length)
    return Promise.all(promises)
  }

  async getWidByEid(eid) {
    consola.info('[#getWidByEid]')
    const obj = await this.junction.get({ eid })
    return obj ? obj.wid : null
  }

  async getDigByWid(wid) {
    consola.info('[#getDigByWid]')
    const obj = await this.junction.get({ wid })
    return obj.dig
  }

  static async asyncFilter(array, asyncCallback) {
    const bits = await Promise.all(array.map(asyncCallback))
    return array.filter((_, i) => bits[i])
  }

  async putHatebuBulk() {
    consola.info('[#putHatebuBulk]')
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
    consola.info('[#getHatebuCntSet]')
    const arr = await this.hatebu.toArray()
    return Object.fromEntries(arr.map((x) => [x.eid, x]))
  }

  async archive(eid) {
    consola.info('[#archive]', eid)
    const obj = await this.stream.get({ eid })
    obj.status = '1'
    await this.stream.put(obj, eid)
  }
}

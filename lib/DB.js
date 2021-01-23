import consola from 'consola/src/browser'

import Dexie from 'dexie'
import LobineAPI from '@/lib/LobineAPI'
import HatenaAPI from '@/lib/HatenaAPI'

export default class CacheDB extends Dexie {
  constructor() {
    super('Chase')

    this.version(3).stores({
      stream: '&eid',
      junction: '&eid,&wid,dig',
      hatebu: '&wid,cnt',
    })

    this.stream = this.table('stream')
    this.junction = this.table('junction')
    this.hatebu = this.table('hatebu')
  }

  async selectAll() {
    consola.debug('[#selectAll]')
    const arr = await this.stream.toArray()
    return Object.fromEntries(arr.map((x) => [x.eid, x]))
  }

  async put(entry) {
    consola.debug('[#put]')
    const { eid } = entry
    return await this.transaction('rw', this.stream, async () => {
      await this.stream.put({ ...entry }, eid)
    }).catch((e) => {
      consola.error(e.stack || e)
    })
  }

  async putEidWidBulk(entries) {
    consola.debug('[#putEidWidBulk]')
    const promises = await Object.entries(entries).map(async ([eid, entry]) => {
      const { url } = entry
      const need = (await this.junction.where({ eid }).count()) === 0
      if (!need) return
      const { wid, dig } = await LobineAPI.postWid(url)
      return await this.junction.put({ eid, wid, dig }, eid)
    })
    return Promise.all(promises)
  }

  async getWidByEid(eid) {
    consola.debug('[#getWidByEid]')
    const obj = await this.junction.get({ eid })
    return obj.wid
  }

  async getDigByWid(wid) {
    consola.debug('[#getDigByWid]')
    const obj = await this.junction.get({ wid })
    return obj.dig
  }

  async putHatebuBulk() {
    consola.debug('[#putHatebuBulk]')
    const latestEntries = await this.stream
      .reverse()
      .limit(20)
      .sortBy('time_updated')
    const promises = await latestEntries.map(async (entry) => {
      const { eid, url } = entry
      const wid = await this.getWidByEid(eid)
      if (!wid) return
      const cnt = await HatenaAPI.getEntryCount(url)
      return await this.hatebu.put({ wid, cnt }, wid)
    })
    return Promise.all(promises)
  }

  async getHatebuCntByEid(eid) {
    const { wid } = await this.junction.get({ eid })
    const rec = await this.hatebu.get({ wid })
    return rec.cnt
  }
}

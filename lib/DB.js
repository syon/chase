import consola from 'consola/src/browser'

import Dexie from 'dexie'
import LobineAPI from '@/lib/LobineAPI'

export default class DB extends Dexie {
  constructor() {
    super('Chase')

    this.version(2).stores({
      stream: '&eid',
      junction: '&eid,&wid,dig',
    })

    this.stream = this.table('stream')
    this.junction = this.table('junction')
  }

  async selectAll() {
    consola.info('[#selectAll]')
    const arr = await this.stream.toArray()
    return Object.fromEntries(arr.map((x) => [x.eid, x]))
  }

  async put(entry) {
    consola.info('[#put]', entry)
    const { eid } = entry
    return await this.transaction('rw', this.stream, async () => {
      const id = await this.stream.put({ ...entry }, eid)
      consola.info(`Putted with id ${id}`)
    }).catch((e) => {
      consola.error(e.stack || e)
    })
  }

  async putEidWidBulk(entries) {
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
    const obj = await this.junction.get({ eid })
    consola.info(`[#getWidByEid] ${eid} ==> ${obj.wid}`)
    return obj.wid
  }

  async getDigByWid(wid) {
    const obj = await this.junction.get({ wid })
    consola.info(`[#getDigByWid]`, obj)
    return obj.dig
  }
}

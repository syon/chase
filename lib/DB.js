import Debug from 'debug'
import Dexie from 'dexie'
import LobineAPI from '@/lib/LobineAPI'

const dg = Debug('@:DB')

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
    dg('[#selectAll]')
    return await this.stream.toArray()
  }

  async put(entry) {
    dg('[#put]', entry)
    const { eid } = entry
    return await this.transaction('rw', this.stream, async () => {
      const id = await this.stream.put({ ...entry }, eid)
      console.log(`Putted with id ${id}`)
    }).catch((e) => {
      console.log(e.stack || e)
    })
  }

  async putEidWid({ eid, url }) {
    dg('[#putEidWid]', { eid, url })
    const need = (await this.junction.where({ eid }).count()) === 0
    if (!need) return
    const { wid, dig } = await LobineAPI.postWid(url)
    return await this.transaction('rw', this.junction, async () => {
      const id = await this.junction.put({ eid, wid, dig }, eid)
      console.log(`[#putEidWid] Putted with id ${id}`)
    }).catch((e) => {
      console.log(e.stack || e)
    })
  }

  async getWidByEid(eid) {
    const obj = await this.junction.get({ eid })
    console.log(`[#getWidByEid] ${eid} ==> ${obj.wid}`)
    return obj.wid
  }
}

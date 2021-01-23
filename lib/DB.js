import Debug from 'debug'
import Dexie from 'dexie'

const dg = Debug('@:DB')

export default class DB extends Dexie {
  constructor() {
    super('Chase')

    this.version(1).stores({
      stream: '&eid,url,&wid',
    })

    this.stream = this.table('stream')
  }

  async selectAll() {
    dg('[#selectAll]')
    return await this.stream.toArray()
  }

  add(entry) {
    dg('[#add]', entry)
    const { eid } = entry
    this.transaction('rw', this.stream, async () => {
      const canAdd = (await this.stream.where({ eid }).count()) === 0
      if (canAdd) {
        const id = await this.stream.add({ ...entry })
        console.log(`Addded with id ${id}`)
      }
    }).catch((e) => {
      console.log(e.stack || e)
    })
  }

  put(entry) {
    dg('[#put]', entry)
    const { eid } = entry
    this.transaction('rw', this.stream, async () => {
      const id = await this.stream.put({ ...entry }, eid)
      console.log(`Putted with id ${id}`)
    }).catch((e) => {
      console.log(e.stack || e)
    })
  }
}

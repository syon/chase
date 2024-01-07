import Debug from 'debug'
import DB from '@/lib/DB'

const $cache = new DB()

const dg = Debug('@:ChaseUtil')
const CHASE_S3_BASE_URL = 'https://s3.amazonaws.com/syon-chase'

function getDate(time10) {
  const dt = new Date(time10 * 1000)
  const y = dt.getFullYear()
  const m = dt.getMonth() + 1
  const d = dt.getDate()
  return `${y}.${m}.${d}`
}

function moldRawItem(pocketRawItem) {
  const m = pocketRawItem
  const url = m.resolved_url ? m.resolved_url : m.given_url
  const title = m.resolved_title ? m.resolved_title : m.given_title
  const item10Id = `0000000000${m.item_id}`.substr(-10, 10)
  const itemId3 = item10Id.slice(0, 3)
  const s3path = `items/thumbs/${itemId3}/${item10Id}.jpg`
  const img = () => {
    if (m.has_image === '1') {
      if (m.image) return m.image.src
      if (m.images) return m.images['1']
    }
    return ''
  }
  return {
    eid: m.item_id,
    status: m.status, // "0": unread, "1": archived, "2": deleted
    url,
    image_suggested: img(),
    image_s3_url: `${CHASE_S3_BASE_URL}/${s3path}`,
    title,
    excerpt: m.excerpt,
    fqdn: `${url}/`.match(/\/\/(.*?)\//)[1],
    sortId: m.sort_id,
    favorite: m.favorite === '1',
    tags: m.tags || {},
    added: getDate(m.time_added),
    updated: getDate(m.time_updated),
    time_added: Number(m.time_added),
    time_updated: Number(m.time_updated),
  }
}

function makeEntries(listFromPocket) {
  const newEntries = {}
  Object.keys(listFromPocket).forEach((key) => {
    newEntries[key] = moldRawItem(listFromPocket[key])
  })
  return newEntries
}

function makeCatalog(dict, hatebuCntSet) {
  dg('[#makeCatalog] >>')
  if (!dict) return []
  const arr = Object.entries(dict).map(([eid, item]) => {
    const hatebuCnt = hatebuCntSet[eid]
    return { ...item, hatebuCnt }
  })
  arr.sort((a, b) => {
    if (a.time_added < b.time_added) return 1
    if (a.time_added > b.time_added) return -1
    return 0
  })
  dg('[#makeCatalog] <<', arr.length)
  return arr
}

function makeS3Path(pocketId) {
  if (!pocketId) return null
  const item10Id = `0000000000${pocketId}`.substr(-10, 10)
  const itemId3 = item10Id.slice(0, 3)
  return `items/libra/${itemId3}/${item10Id}.json`
}

async function fetchLibraS3(pocketId) {
  dg('[fetchLibraS3]>>>>')
  const s3Path = makeS3Path(pocketId)
  const result = await fetch(`${CHASE_S3_BASE_URL}/${s3Path}`, {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw response
    })
    .catch((e) => {
      dg(pocketId, e)
      throw e
    })
  dg('[fetchLibraS3]<<<<', result)
  return result
}

async function coordinateRecentCatalog() {
  dg('[#coordinateRecentCatalog] start')
  const pkt100Arr = await $cache.selectCachedPocketRecent()
  const newArr = await Promise.all(
    pkt100Arr.map(async (item) => {
      // if Twitter
      const { eid } = item
      const { dig, wid } = await $cache.digTable.get({ eid })
      const hRec = await $cache.hatebuTable.get({ eid })
      const { cnt: hatebuCnt } = hRec || {}
      return { ...item, ...dig, wid, hatebuCnt }
    })
  )
  const dict = Object.fromEntries(newArr.map((x) => [x.eid, x]))
  return dict
}

async function mixDig(item) {
  const { eid } = item
  const { dig, wid } = (await $cache.digTable.get({ eid })) || {}
  return { ...item, ...dig, wid }
}

async function coordinateAllCatalog() {
  dg('[#coordinateAllCatalog] start')
  const all = await $cache.selectCachedPocketAll()
  const pkt100Arr = all.slice(0, 100)
  const newArr = await Promise.all(pkt100Arr.map(mixDig))
  const dict = Object.fromEntries(newArr.map((x) => [x.eid, x]))
  return dict
}

async function calcCachedCount() {
  dg('[#calcCachedCount] start')
  return await $cache.countPocketAllUnread()
}

async function getFilteredCatalog({ keyword, limit }) {
  const list = await $cache.filterPocket(keyword)
  const sliced = list.slice(0, limit)
  const mixed = await Promise.all(sliced.map(mixDig))
  const dict = Object.fromEntries(mixed.map((x) => [x.eid, x]))
  return dict
}

export default {
  makeEntries,
  makeCatalog,
  fetchLibraS3,
  coordinateRecentCatalog,
  coordinateAllCatalog,
  calcCachedCount,
  getFilteredCatalog,
}

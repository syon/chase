import Debug from 'debug'

const debug = Debug('@:util')
const CHASE_S3_BASE_URL = 'https://s3.amazonaws.com/syon-chase'

function pickFallback(a, b, c) {
  if (a) {
    return a
  }
  if (b) {
    return b
  }
  if (c) {
    return c
  }
  return null
}

function makeCatalog(pocketItemSet, libraSet, hatebuCntSet, shotSet) {
  const arr = Object.keys(pocketItemSet).map((eid) => {
    const item = pocketItemSet[eid]
    // const libra = libraSet[eid]
    // const shot = shotSet[eid]
    // const ready = !!libra
    // if (!ready) return item
    const hatebuCnt = (hatebuCntSet[eid] || {}).cnt
    const override = {
      // ready,
      // title: pickFallback(libra.title, item.title, item.url),
      // site_name: pickFallback(libra.site_name, item.fqdn),
      // excerpt: pickFallback(item.excerpt, libra.description),
      // description: pickFallback(libra.description, item.excerpt),
      hatebuCnt: hatebuCnt > 0 ? hatebuCnt : '',
      // shotOrdered: shot === 'ordered',
    }
    return { ...item, ...override }
  })
  arr.sort((a, b) => {
    if (a.time_added < b.time_added) return 1
    if (a.time_added > b.time_added) return -1
    return 0
  })
  return arr
}

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

function makeS3Path(pocketId) {
  if (!pocketId) return null
  const item10Id = `0000000000${pocketId}`.substr(-10, 10)
  const itemId3 = item10Id.slice(0, 3)
  return `items/libra/${itemId3}/${item10Id}.json`
}

async function fetchLibraS3(pocketId) {
  debug('[fetchLibraS3]>>>>')
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
      debug(pocketId, e)
      throw e
    })
  debug('[fetchLibraS3]<<<<', result)
  return result
}

export default {
  makeCatalog,
  makeEntries,
  fetchLibraS3,
}

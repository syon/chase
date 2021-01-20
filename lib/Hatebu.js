import Debug from 'debug'
import fetchJsonp from 'fetch-jsonp'

const debug = Debug('chase:hatebu')

async function fetch(targetUrl) {
  debug('[fetch]>>>>', targetUrl)
  const url = `https://b.hatena.ne.jp/entry/jsonlite/?url=${targetUrl}`
  const b = await fetchJsonp(url).then((r) => {
    if (r.ok) return r.json()
    return null
  })
  debug('[fetch]<<<<', b)
  return b
}

/* eslint-disable no-restricted-syntax, no-await-in-loop */
async function fetchStarSet(data) {
  debug('[fetchStar]>>>>', data)
  const comments = data.bookmarks.filter((d) => d.comment)
  const hatebuStarSet = {}
  for (const c of comments) {
    const ymd = c.timestamp.match(/^(20..\/..\/..)/)[1]
    const yyyymmdd = ymd.replace(/\//g, '')
    const uri = `http://b.hatena.ne.jp/${c.user}/${yyyymmdd}%23bookmark-${data.eid}`
    const url = `https://s.hatena.com/entry.json?uri=${uri}`
    const item = await fetchJsonp(url).then((r) => {
      if (r.ok) return r.json()
      return null
    })
    if (item.entries.length > 0) {
      const cnt = item.entries[0].stars.length
      if (cnt > 0) hatebuStarSet[c.user] = cnt
    }
  }
  debug('[fetchStar]<<<<', hatebuStarSet)
  return hatebuStarSet
}

export default {
  fetch,
  fetchStarSet,
}

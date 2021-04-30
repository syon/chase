import Debug from 'debug'

const dg = Debug('@:Hatebu')

async function getEntry(targetUrl) {
  dg('[#getEntry] >>', targetUrl)
  const url = `https://hatena.vercel.app/api/bookmark/getEntryWithStar?url=${targetUrl}`
  const b = await fetch(url).then((r) => {
    if (r.ok) return r.json()
    return {}
  })
  const msg = `count:${b.count} bookmarks:${(b.bookmarks || {}).length}`
  dg('[#getEntry] <<', msg)
  return b
}

/* eslint-disable no-restricted-syntax, no-await-in-loop */
async function fetchStarSet(data) {
  dg('[fetchStar]>>>>', data)
  const comments = data.bookmarks.filter((d) => d.comment)
  const hatebuStarSet = {}
  for (const c of comments) {
    const ymd = c.timestamp.match(/^(20..\/..\/..)/)[1]
    const yyyymmdd = ymd.replace(/\//g, '')
    const uri = `http://b.hatena.ne.jp/${c.user}/${yyyymmdd}%23bookmark-${data.eid}`
    const url = `https://s.hatena.com/entry.json?uri=${uri}`
    const item = await fetch(url).then((r) => {
      if (r.ok) return r.json()
      return {}
    })
    if (item.entries.length > 0) {
      const cnt = item.entries[0].stars.length
      if (cnt > 0) hatebuStarSet[c.user] = cnt
    }
  }
  dg('[fetchStar]<<<<', hatebuStarSet)
  return hatebuStarSet
}

export default {
  getEntry,
  fetchStarSet,
}

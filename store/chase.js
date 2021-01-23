import consola from 'consola/src/browser'

import ChaseUtil from '@/lib/ChaseUtil'
import Hatebu from '@/lib/Hatebu'
import LambdaShot from '@/lib/LambdaShot'
import LambdaLibra from '@/lib/LambdaLibra'
import LambdaPocket from '@/lib/LambdaPocket'
import DB from '@/lib/DB'

const db = new DB()

const initialState = {
  progress: {
    unread: 0,
    archive: 0,
    all: 0,
  },
  entries: {},
  libraInfo: {},
  hatebuCntSet: {},
  shotSet: {},
  hatebuSet: {},
  hatebuStarSet: {},
  activeEid: '',
  activeWid: '',
  myscenes: {},
}

export const state = () => JSON.parse(JSON.stringify(initialState))

export const getters = {
  catalog(state) {
    const p = state.entries
    const l = state.libraInfo
    const h = state.hatebuCntSet
    const s = state.shotSet
    return ChaseUtil.makeCatalog(p, l, h, s)
  },
  filteredCatalog: (state, getters) => (route, tag, filterTxt) => {
    const arr = getters.catalog
    let result = arr
    if (route === 'index') {
      result = arr.filter((d) => Object.keys(d.tags).length === 0)
    } else if (route === 'favorite') {
      result = arr.filter((d) => d.favorite)
    } else if (route === 'tag') {
      const tagged = arr.filter((d) => Object.keys(d.tags).length > 0)
      result = tagged.filter((d) => Object.keys(d.tags).includes(tag))
    }
    if (filterTxt) {
      result = result.filter((d) => {
        const tgt = `${d.title}${d.excerpt}${d.description}${d.site_name}${d.fqdn}`
        return tgt.toUpperCase().includes(filterTxt.toUpperCase())
      })
    }
    return result.slice(0, 100)
  },
  catalogCount(state, getters) {
    return getters.catalog.length
  },
  activeInfo(state) {
    const { activeEid, activeWid } = state
    return { eid: activeEid, wid: activeWid }
  },
  activeEntry(state, getters) {
    const eid = state.activeEid
    if (!eid) {
      return {}
    }
    return getters.catalog.find((e) => e.eid === eid) || {}
  },
  recentTags(state) {
    let tags = []
    const list = state.entries
    Object.keys(list).forEach((key) => {
      const entry = list[key]
      tags = tags.concat(Object.keys(entry.tags))
    })
    tags = tags.filter((t) => !t.startsWith('chase:'))
    return [...new Set(tags)]
  },
  myScenesTags(state) {
    return [
      { tag: 'chase:a', label: state.myscenes.a },
      { tag: 'chase:b', label: state.myscenes.b },
      { tag: 'chase:c', label: state.myscenes.c },
    ]
  },
}

export const mutations = {
  SET_Entries(state, newEntries) {
    state.entries = newEntries
  },
  MERGE_Entries(state, newEntries) {
    state.entries = { ...state.entries, ...newEntries }
  },
  logout(state) {
    Object.keys(initialState).forEach((key) => {
      state[key] = initialState[key]
    })
  },
  setProgress(state, payload) {
    const { unread, archive } = payload
    state.progress = { unread, archive, all: unread + archive }
  },
  myscenes(state, myscenes) {
    state.myscenes = myscenes
  },
  addLibraInfo(state, { eid, pageinfo }) {
    state.libraInfo = { ...state.libraInfo, [eid]: pageinfo }
  },
  addHatebuCnt(state, { eid, hatebuCnt }) {
    state.hatebuCntSet = { ...state.hatebuCntSet, [eid]: hatebuCnt }
  },
  addShot(state, { eid }) {
    state.shotSet = { ...state.shotSet, [eid]: 'ordered' }
  },
  addHatebu(state, { eid, hatebu }) {
    state.hatebuSet = { ...state.hatebuSet, [eid]: hatebu }
  },
  addHatebuStar(state, { eid, starSet }) {
    state.hatebuStarSet = { ...state.hatebuStarSet, [eid]: starSet }
  },
  activate(state, payload) {
    const { eid, wid } = payload
    state.activeEid = eid
    state.activeWid = wid
  },
  archive(state, payload) {
    const { eid } = payload
    const entry = state.entries[eid]
    entry.archived = true
    state.entries = { ...state.entries, [eid]: entry }
  },
  favorite(state, payload) {
    const { eid } = payload
    const entry = state.entries[eid]
    entry.favorite = true
    state.entries = { ...state.entries, [eid]: entry }
  },
  unfavorite(state, payload) {
    const { eid } = payload
    const entry = state.entries[eid]
    entry.favorite = false
    state.entries = { ...state.entries, [eid]: entry }
  },
  addTag(state, payload) {
    const { eid, tag } = payload
    const entry = state.entries[eid]
    entry.tags = { ...entry.tags, [tag]: { item_id: eid, tag } }
  },
}

export const actions = {
  logout({ commit }, $cookie) {
    $cookie.delete('phase')
    $cookie.delete('pocket_access_token')
    $cookie.delete('pocket_username')
    commit('logout')
  },
  doSceneEdit({ commit, dispatch }, { $cookie, scenes }) {
    consola.info('doSceneEdit', $cookie, scenes)
    $cookie.set('chase:a', scenes.a)
    $cookie.set('chase:b', scenes.b)
    $cookie.set('chase:c', scenes.c)
    dispatch('restoreScenes', $cookie)
  },
  restoreScenes({ commit, dispatch }, $cookie) {
    commit('myscenes', {
      a: $cookie.get('chase:a'),
      b: $cookie.get('chase:b'),
      c: $cookie.get('chase:c'),
    })
  },
  async actByPhase({ dispatch }, $cookie) {
    const ph = $cookie.get('phase')
    const at = $cookie.get('pocket_access_token')
    consola.info('[actByPhase]', ph)
    if (ph === 'READY' && at) {
      dispatch('pocket/auth/restoreLogin', $cookie, { root: true })
      await dispatch('restoreEntries')
      await dispatch('fetchEntries')
      dispatch('fetchProgress')
      dispatch('restoreScenes', $cookie)
    } else if (ph === 'WAITING_ACCESSTOKEN') {
      await dispatch('getAccessToken', $cookie)
      await dispatch('actByPhase', $cookie)
    } else {
      dispatch('logout', $cookie)
    }
  },
  async fetchProgress({ rootState, commit }) {
    const at = rootState.pocket.auth.login.accessToken
    const json = await LambdaPocket.progress(at)
    commit('setProgress', json)
  },
  async restoreEntries({ commit }) {
    const entries = await db.selectAll()
    commit('MERGE_Entries', entries)
  },
  async fetchEntries({ rootState, dispatch }) {
    const at = rootState.pocket.auth.login.accessToken
    const options = { count: 100, detailType: 'complete' }
    const json = await LambdaPocket.get(at, options)
    const entries = ChaseUtil.makeEntries(json.list)
    Object.keys(entries).forEach(async (key) => {
      const entry = entries[key]
      if (!entry.ready) {
        // dispatch('fetchLibraS3', entry)
        // dispatch('fetchHatebuCnt', entry)
      }
      await db.put(entry)
    })
    dispatch('restoreEntries')
    dispatch('prepareWid')
  },
  async activate({ commit, dispatch }, entry) {
    const { eid } = entry
    const wid = await db.getWidByEid(eid)
    commit('activate', { eid, wid })
    await dispatch('fetchHatebu', entry)
  },
  async archive({ commit, state }, eid) {
    const at = state.login.accessToken
    const json = await LambdaPocket.archive(at, eid)
    consola.info(json.status === 1)
    commit('archive', { eid })
  },
  async addTag({ commit, state }, { eid, tag }) {
    const at = state.login.accessToken
    await LambdaPocket.addTag(at, eid, tag)
    commit('addTag', { eid, tag })
  },
  async favorite({ commit, state }, eid) {
    const at = state.login.accessToken
    const json = await LambdaPocket.favorite(at, eid)
    consola.info('[favorite]', json)
    commit('favorite', { eid })
  },
  async unfavorite({ commit, state }, eid) {
    const at = state.login.accessToken
    const json = await LambdaPocket.unfavorite(at, eid)
    consola.info('[unfavorite]', json)
    commit('unfavorite', { eid })
  },
  fetchLibraS3(context, entry) {
    const { eid } = entry
    ChaseUtil.fetchLibraS3(eid)
      .then((pageinfo) => {
        context.commit('addLibraInfo', { eid, pageinfo })
      })
      .catch(() => {
        consola.info('First scraping for S3...', eid)
        context.dispatch('fetchLibraInfo', entry)
      })
  },
  async fetchLibraInfo(context, payload) {
    const { eid, url } = payload
    const pageinfo = await LambdaLibra.info({ eid, url })
    context.commit('addLibraInfo', { eid, pageinfo })
  },
  fetchLibraThumb(context, payload) {
    // eslint-disable-next-line camelcase
    const { eid, url, image_suggested } = payload
    consola.info('[fetchLibraThumb]>>>>')
    return LambdaLibra.thumb({ eid, url, image_suggested }).then((r) => {
      consola.info('[fetchLibraThumb]<<<<', r)
      return r.ETag
    })
  },
  async fetchHatebuCnt(context, entry) {
    const { eid, url } = entry
    const hatebuCnt = await ChaseUtil.fetchHatebuCnt(url)
    context.commit('addHatebuCnt', { eid, hatebuCnt })
  },
  async fetchShot(context, payload) {
    const { eid, url } = payload
    if (!eid) return
    context.commit('addShot', { eid })
    await LambdaShot.shot({ eid, url })
  },
  async fetchHatebu(context, payload) {
    const { eid, url } = payload
    const hatebu = await Hatebu.getEntry(url)
    context.commit('addHatebu', { eid, hatebu })
  },
  async prepareWid({ state }) {
    await db.putEidWidBulk(state.entries)
  },
  async getWidByEid(_, eid) {
    return await db.getWidByEid(eid)
  },
}

import Debug from 'debug'

import ChaseUtil from '@/lib/ChaseUtil'
import LambdaShot from '@/lib/LambdaShot'
import LambdaLibra from '@/lib/LambdaLibra'
import LambdaPocket from '@/lib/LambdaPocket'

const dg = Debug('@:$:chase')

const initialState = {
  isPremium: false,
  ping: 0,
  entries: {},
  libraInfo: {},
  hatebuCntSet: {},
  shotSet: {},
  hatebuSet: {},
  hatebuStarSet: {},
  activeEid: '',
  activeWid: '',
}

export const state = () => JSON.parse(JSON.stringify(initialState))

export const getters = {
  catalog(state) {
    if (state.ping);
    // const dict = { ...state.entries }
    return ChaseUtil.makeCatalog(state.entries, state.hatebuCntSet)
  },
  gPreparedCatalog: (state, getters) => (query) => {
    const arr = getters.catalog
    let result = arr
    const { isFav, tag } = query || {}
    if (isFav) {
      result = arr.filter((d) => d.favorite)
    } else if (tag) {
      const tagged = arr.filter((d) => Object.keys(d.tags).length > 0)
      result = tagged.filter((d) => Object.keys(d.tags).includes(tag))
    }
    return result
  },
  filteredCatalog(state, getters, rootState) {
    let arr = getters.catalog
    const query = {
      spell: rootState.stream.filter.spell,
      isFav: rootState.stream.filter.isFav,
      tags: rootState.stream.filter.tags,
    }
    if (query.spell) {
      arr = arr.filter((d) => {
        const tgt = `${d.title}${d.excerpt}${d.description}${d.site_name}${d.fqdn}`
        return tgt.toUpperCase().includes(query.spell.toUpperCase())
      })
    }
    if (query.isFav) {
      arr = arr.filter((d) => d.favorite)
    }
    if (query.tags) {
      for (const tag of query.tags) {
        const tagged = arr.filter((d) => Object.keys(d.tags).length > 0)
        arr = tagged.filter((d) => Object.keys(d.tags).includes(tag))
      }
    }
    return arr
  },
  gShowingCatalog(state, getters) {
    return getters.filteredCatalog.slice(0, 100)
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
  gHatebuCntSet(state) {
    return state.hatebuCntSet
  },
}

export const mutations = {
  SET_Ping(state) {
    dg('[#PING]')
    state.ping = new Date().getTime()
  },
  SET_Entries(state, newEntries) {
    state.entries = newEntries
  },
  MERGE_Entries(state, newEntries) {
    state.entries = { ...state.entries, ...newEntries }
    state.ping = new Date().getTime()
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
  addLibraInfo(state, { eid, pageinfo }) {
    state.libraInfo = { ...state.libraInfo, [eid]: pageinfo }
  },
  SET_HatebuCntSet(state, hatebuCntSet) {
    state.hatebuCntSet = hatebuCntSet
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
  clearTags(state, payload) {
    const { eid } = payload
    const entry = state.entries[eid]
    entry.tags = {}
  },
}

export const actions = {
  logout({ commit }, $cookie) {
    $cookie.delete('phase')
    $cookie.delete('pocket_access_token')
    $cookie.delete('pocket_username')
    commit('logout')
  },
  async actByPhase({ dispatch }, $cookie) {
    const ph = $cookie.get('phase')
    const at = $cookie.get('pocket_access_token')
    dg('[actByPhase]', ph)
    if (ph === 'READY' && at) {
      dispatch('pocket/auth/restoreLogin', $cookie, { root: true })
      await dispatch('restoreRecentEntries')
      dispatch('backgroundProcess')
    } else if (ph === 'WAITING_ACCESSTOKEN') {
      await dispatch('pocket/auth/getAccessToken', $cookie, { root: true })
      await dispatch('actByPhase', $cookie)
    } else {
      dispatch('logout', $cookie)
    }
  },
  async restoreRecentEntries({ commit }) {
    dg('[#restoreRecentEntries]')
    const catalog = await ChaseUtil.coordinateRecentCatalog()
    commit('MERGE_Entries', catalog)
  },
  backgroundProcess({ dispatch }) {
    dg('[#backgroundProcess]')
    dispatch('fetchEntries').then(() => {
      dispatch('updateHatebuCnt')
      dispatch('restoreAllEntries')
    })
  },
  async restoreAllEntries({ commit }) {
    dg('[#restoreAllEntries]')
    const catalog = await ChaseUtil.coordinateAllCatalog()
    commit('MERGE_Entries', catalog)
  },
  async fetchEntries({ dispatch }) {
    dg('[#fetchEntries]')
    await this.$duty.retrieveRecent()
  },
  async fetchAllEntries({ state, rootState, dispatch }) {
    const at = rootState.pocket.auth.login.accessToken
    let offset = Object.keys(state.entries).length
    while (true) {
      const options = {
        state: 'unread',
        count: 1000,
        detailType: 'complete',
        offset,
      }
      const json = await LambdaPocket.get(at, options)
      const resultCount = Object.keys(json.list).length
      const entries = ChaseUtil.makeEntries(json.list)
      await this.$cache.renewPocket(entries)
      if (resultCount < 1000) {
        break
      }
      if (!state.isPremium) {
        break
      }
      offset = offset + resultCount
    }
    dispatch('restoreAllEntries')
  },
  async moreEntries({ state, rootState, dispatch }) {
    const at = rootState.pocket.auth.login.accessToken
    const offset = Object.keys(state.entries).length
    const options = {
      state: 'unread',
      count: 1000,
      detailType: 'complete',
      offset,
    }
    const json = await LambdaPocket.get(at, options)
    const entries = ChaseUtil.makeEntries(json.list)
    await this.$cache.renewPocket(entries)
    dispatch('restoreAllEntries')
    dispatch('updateHatebuCnt')
  },
  async activate({ commit, dispatch }, entry) {
    const { eid } = entry
    dg('[#activate]', eid)
    const wid = await this.$cache.getWidByEid(eid)
    commit('activate', { eid, wid })
    await dispatch('lobine/lounge/setup', { wid, entry }, { root: true })
  },
  async archive({ commit, rootState }, eid) {
    const at = rootState.pocket.auth.login.accessToken
    await LambdaPocket.archive(at, eid)
    commit('archive', { eid })
    await this.$cache.archive(eid)
  },
  async addTag({ commit, rootState }, { eid, tags }) {
    const at = rootState.pocket.auth.login.accessToken
    await LambdaPocket.addTag(at, eid, tags)
    for (const tag of tags) {
      commit('addTag', { eid, tag })
    }
  },
  async clearTags({ commit, rootState }, { eid }) {
    const at = rootState.pocket.auth.login.accessToken
    await LambdaPocket.clearTags(at, eid)
    commit('clearTags', { eid })
  },
  async favorite({ commit, rootState }, eid) {
    const at = rootState.pocket.auth.login.accessToken
    const json = await LambdaPocket.favorite(at, eid)
    dg('[favorite]', json)
    commit('favorite', { eid })
  },
  async unfavorite({ commit, rootState }, eid) {
    const at = rootState.pocket.auth.login.accessToken
    const json = await LambdaPocket.unfavorite(at, eid)
    dg('[unfavorite]', json)
    commit('unfavorite', { eid })
  },
  fetchLibraS3(context, entry) {
    const { eid } = entry
    ChaseUtil.fetchLibraS3(eid)
      .then((pageinfo) => {
        context.commit('addLibraInfo', { eid, pageinfo })
      })
      .catch(() => {
        dg('First scraping for S3...', eid)
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
    dg('[fetchLibraThumb]>>>>')
    return LambdaLibra.thumb({ eid, url, image_suggested }).then((r) => {
      dg('[fetchLibraThumb]<<<<', r)
      return r.ETag
    })
  },
  async fetchShot(context, payload) {
    const { eid, url } = payload
    if (!eid) return
    context.commit('addShot', { eid })
    await LambdaShot.shot({ eid, url })
  },
  async updateHatebuCnt({ commit }) {
    await this.$cache.prepareHatebuTable()
    const hatebuCntSet = await this.$cache.getHatebuCntSet()
    commit('SET_HatebuCntSet', hatebuCntSet)
    commit('SET_Ping')
  },
  async getWidByEid(_, eid) {
    return await this.$cache.getWidByEid(eid)
  },
  async deleteDB() {
    await this.$cache.delete()
  },
}

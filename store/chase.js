import consola from 'consola/src/browser'

import ChaseUtil from '@/lib/ChaseUtil'
import Hatebu from '@/lib/Hatebu'
import LambdaShot from '@/lib/LambdaShot'
import LambdaLibra from '@/lib/LambdaLibra'
import LambdaPocket from '@/lib/LambdaPocket'

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
  gPreparedCatalog: (state, getters) => (query) => {
    const arr = getters.catalog
    let result = arr
    const { isFav, tag } = query || {}
    if (!isFav && !tag) {
      result = arr.filter((d) => Object.keys(d.tags).length === 0)
    } else if (isFav) {
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
    if (query.spell && query.spell.length >= 3) {
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
    return arr.slice(0, 200)
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
    consola.info('[actByPhase]', ph)
    if (ph === 'READY' && at) {
      dispatch('pocket/auth/restoreLogin', $cookie, { root: true })
      await dispatch('fetchEntries')
      await dispatch('restoreEntries')
      dispatch('fetchProgress')
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
    const entries = await this.$cache.selectAll()
    commit('MERGE_Entries', entries)
  },
  async fetchEntries({ rootState, dispatch }) {
    const at = rootState.pocket.auth.login.accessToken
    const options = { count: 100, detailType: 'complete' }
    const json = await LambdaPocket.get(at, options)
    const entries = ChaseUtil.makeEntries(json.list)
    await this.$cache.putBulk(entries)
    dispatch('syncDB')
  },
  async moreEntries({ rootState, dispatch }) {
    const at = rootState.pocket.auth.login.accessToken
    const options = { count: 1000, detailType: 'complete' }
    const json = await LambdaPocket.get(at, options)
    const entries = ChaseUtil.makeEntries(json.list)
    await this.$cache.putBulk(entries)
    dispatch('restoreEntries')
    dispatch('syncDB')
  },
  async activate({ commit, dispatch }, entry) {
    const { eid } = entry
    const wid = await this.$cache.getWidByEid(eid)
    commit('activate', { eid, wid })
    await dispatch('fetchHatebu', entry)
  },
  async archive({ commit, rootState }, eid) {
    const at = rootState.pocket.auth.login.accessToken
    const json = await LambdaPocket.archive(at, eid)
    consola.info(json.status === 1)
    commit('archive', { eid })
  },
  async addTag({ commit, rootState }, { eid, tag }) {
    const at = rootState.pocket.auth.login.accessToken
    await LambdaPocket.addTag(at, eid, tag)
    commit('addTag', { eid, tag })
  },
  async favorite({ commit, rootState }, eid) {
    const at = rootState.pocket.auth.login.accessToken
    const json = await LambdaPocket.favorite(at, eid)
    consola.info('[favorite]', json)
    commit('favorite', { eid })
  },
  async unfavorite({ commit, rootState }, eid) {
    const at = rootState.pocket.auth.login.accessToken
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
  async syncDB({ commit }) {
    await this.$cache.prepareJunction()
    await this.$cache.putHatebuBulk()
    const hatebuCntSet = await this.$cache.getHatebuCntSet()
    commit('SET_HatebuCntSet', hatebuCntSet)
  },
  async getWidByEid(_, eid) {
    return await this.$cache.getWidByEid(eid)
  },
  async deleteDB() {
    await this.$cache.delete()
  },
}

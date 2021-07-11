import Debug from 'debug'
import ChaseUtil from '@/lib/ChaseUtil'
import LambdaPocket from '@/lib/LambdaPocket'

const dg = Debug('@:$:stream/filter')

export const state = () => ({
  ping: 0,
  entries: {},
  hatebuCntSet: {},
  spell: '',
  isFav: false,
  tags: [],
  showMode: 'rack',
  isFiltering: false,
  cachedCount: null,
  activeEid: '',
  activeWid: '',
})

export const getters = {
  catalog(state) {
    if (state.ping);
    return ChaseUtil.makeCatalog(state.entries, state.hatebuCntSet)
  },
  recentTags(state) {
    let tags = []
    const list = state.entries || []
    Object.keys(list).forEach((key) => {
      const entry = list[key]
      tags = tags.concat(Object.keys(entry.tags))
    })
    tags = tags.filter((t) => !t.startsWith('chase:'))
    return [...new Set(tags)]
  },
  /** これはもはや使わない。Dexieでやる。 */
  filteredCatalog(state, getters) {
    let arr = getters.catalog
    const query = {
      spell: state.spell,
      isFav: state.isFav,
      tags: state.tags,
    }
    if (query.spell) {
      arr = arr.filter((d) => {
        const tags = Object.keys(d.tags).join('#')
        const tgt = [
          d.title,
          d.excerpt,
          d.description,
          d.site_name,
          d.fqdn,
          tags,
        ].join('#')
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
  gHatebuCntSet(state) {
    return state.hatebuCntSet
  },
  activeEntry(state, getters) {
    const eid = state.activeEid
    if (!eid) {
      return {}
    }
    return getters.catalog.find((e) => e.eid === eid) || {}
  },
  gSpell(state) {
    return state.spell
  },
  gCachedCount(state) {
    return state.cachedCount
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
  SET_Spell(state, spell) {
    state.spell = spell
  },
  SET_IsFav(state, isFav) {
    state.isFav = isFav
  },
  SET_Tags(state, tags) {
    state.tags = tags
  },
  SET_ShowMode(state, showMode) {
    state.showMode = showMode
  },
  SET_IsFiltering(state, isFiltering) {
    state.isFiltering = isFiltering
  },
  SET_CachedCount(state, payload) {
    state.cachedCount = payload
  },
  SET_HatebuCntSet(state, hatebuCntSet) {
    state.hatebuCntSet = hatebuCntSet
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
  async startup({ dispatch }) {
    await Promise.all([
      dispatch('refresh'),
      dispatch('updateHatebuCnt'),
      dispatch('bgProcess'),
    ])
  },
  async refresh({ state, commit }) {
    const keyword = state.spell
    const arg = { keyword, limit: 100 }
    const catalog = await ChaseUtil.getFilteredCatalog(arg)
    commit('SET_Entries', catalog)
  },
  async updateHatebuCnt({ commit }) {
    // FIXME: all select -> on-demand
    await this.$cache.prepareHatebuTable()
    const hatebuCntSet = await this.$cache.getHatebuCntSet()
    commit('SET_HatebuCntSet', hatebuCntSet)
    commit('SET_Ping')
  },
  async bgProcess({ commit }) {
    const cachedCount = await ChaseUtil.calcCachedCount()
    commit('SET_CachedCount', cachedCount)
  },
  applySpell({ commit }, spell) {
    commit('SET_Spell', spell)
    commit('SET_IsFiltering', true)
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
    commit('SET_Ping')
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
}

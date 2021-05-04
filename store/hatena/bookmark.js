import debug from 'debug'
import axios from 'axios'
import Hatebu from '@/lib/Hatebu'
import EP from './endpoint'

const dg = debug('@:$:hatena/bookmark')

const HATENA_API_URL = EP.HATENA

export const state = () => ({
  pageUrl: null,
  entry: {},
  isFetching: false,
  isFilterNoComment: false,
  isBucomeEditor: false,
  commentText: null,
  isCommentBusy: false,
  isStarBusy: false,
  tabsStyle: {},
})

export const getters = {
  gBookmarkCount(state) {
    /* Public bookmark count */
    if (!state.entry.bookmarks) return 0
    return state.entry.bookmarks.length
  },
  gCommentCount(state) {
    if (!state.entry.bookmarks) return 0
    return state.entry.bookmarks.filter((x) => x.comment).length
  },
  gCommentRate(state, getters) {
    if (!state.entry.bookmarks) return ''
    return Math.round((getters.gCommentCount / state.entry.count) * 100)
  },
  getMyBookmark: (state) => (user) => {
    if (!user) return null
    return state.entry.bookmarks.find((x) => x.user === user)
  },
  gBookmarks(state) {
    if (!state.entry.bookmarks) return []
    return state.entry.bookmarks
  },
  commentedBookmarks: (state) => (bookmarks) => {
    if (state.isFilterNoComment) {
      return bookmarks.filter((x) => x.comment)
    }
    return bookmarks
  },
  gScores(state, getters) {
    const scores = {}
    getters.gBookmarks.forEach((b) => {
      if (!b.stars) return true
      let s = b.stars.yellow | 0
      s += (b.stars.green * 10) | 0
      s += (b.stars.red * 20) | 0
      s += (b.stars.blue * 40) | 0
      s += (b.stars.purple * 60) | 0
      scores[b.user] = s
    })
    return scores
  },
  gBookmarksPopular(state, getters) {
    const list = getters.gBookmarks
    const scores = getters.gScores
    const only = list.filter((x) => scores[x.user] >= 2)
    const filtered = getters.commentedBookmarks(only)
    const sorted = filtered.concat().sort((b1, b2) => {
      if (scores[b1.user] > scores[b2.user]) return -1
      if (scores[b1.user] < scores[b2.user]) return 1
      return 0
    })
    return sorted
  },
  gBookmarksPopularCount(state, getters) {
    return getters.gBookmarksPopular.length
  },
  gBookmarksRace(state, getters) {
    const list = getters.gBookmarks
    const filtered = getters.commentedBookmarks(list)
    const sorted = filtered.concat().sort((b1, b2) => {
      if (b1.timestamp > b2.timestamp) return 1
      if (b1.timestamp < b2.timestamp) return -1
      return 0
    })
    return sorted
  },
  gBookmarksNew(state, getters) {
    const list = getters.gBookmarks
    const filtered = getters.commentedBookmarks(list)
    const sorted = filtered.concat().sort((b1, b2) => {
      if (b1.timestamp > b2.timestamp) return -1
      if (b1.timestamp < b2.timestamp) return 1
      return 0
    })
    return sorted
  },
}

export const mutations = {
  setPageUrl(state, payload) {
    state.pageUrl = payload
  },
  setEntry(state, payload) {
    state.entry = payload
  },
  setBucomeEditor(state, payload) {
    state.isBucomeEditor = payload
  },
  setCommentText(state, payload) {
    state.commentText = payload
  },
  busyFetching(state, isBusy) {
    state.isFetching = isBusy
  },
  busyComment(state, isBusy) {
    state.isCommentBusy = isBusy
  },
  setFilterNoComment(state, bool) {
    state.isFilterNoComment = bool
  },
  setTabsStyle(state, style) {
    state.tabsStyle = style
  },
}

export const actions = {
  // async getEntryCount(context, payload) {
  //   dg('[#getEntryCount]')
  //   const { pageUrl } = payload
  //   const count = await Hatena.getEntryCount(pageUrl)
  //   return count
  // },
  async init({ dispatch, commit }, { url }) {
    dg('[#init]', url)
    if (!url) return
    commit('setPageUrl', url)
    await dispatch('refresh')
  },
  async refresh({ state, dispatch, commit, getters, rootState }) {
    dg('[#refresh] >>')
    commit('busyFetching', true)
    dispatch('hatena/bucome/jumpTabByName', { tabName: 'RACE' }, { root: true })
    const hatebu = await Hatebu.getEntry(state.pageUrl).catch((e) => {
      dg('[#refresh] !ERROR!', e)
    })
    commit('setEntry', hatebu)
    const bkmCnt = getters.gBookmarkCount
    const cmtCnt = getters.gCommentCount
    dg(`[#refresh] Bookmark: ${bkmCnt} Comment: ${cmtCnt}`)
    commit('setFilterNoComment', bkmCnt >= 15 && cmtCnt > 0)
    commit('busyFetching', false)
    const popularCnt = getters.gBookmarksPopularCount
    if (popularCnt > 0 && getters.gCommentCount > 10) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      dispatch(
        'hatena/bucome/jumpTabByName',
        { tabName: 'POPULAR' },
        { root: true }
      )
    }
    if (rootState.hatena.hatena.user.profile) {
      const b = getters.getMyBookmark(rootState.hatena.user.profile.id)
      commit('setCommentText', b ? b.comment : '')
    }
    dg('[#refresh] <<')
  },
  adjustTabsHeight() {
    // adjustTabsHeight({ commit, rootState }) {
    // const tabNth = rootState.bucome.tabIndex + 1
    // const el = document.querySelector(
    //   `.xx-audience .ivu-tabs-tabpane:nth-child(${tabNth}) .bookmarklist`
    // )
    // if (el) {
    //   setTimeout(() => {
    //     const height = el.clientHeight + 36
    //     commit('setTabsStyle', { height: `${height}px` })
    //   }, 100)
    // }
  },
  async postHatebuComment({ commit, state }, payload) {
    dg('[#postHatebuComment]', payload)
    commit('busyComment', true)
    const { isTwitter } = payload
    const bookmarkUrl = state.pageUrl
    const comment = state.commentText
    const data = { bookmarkUrl, comment, isTwitter }
    const opts = { withCredentials: true }
    const result = await axios.post(`${HATENA_API_URL}/bookmark`, data, opts)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('busyComment', false)
    commit('setBucomeEditor', false)
    dg('[#postHatebuComment]', result)
  },
}

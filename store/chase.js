import Debug from 'debug'

import LambdaLibra from '@/lib/LambdaLibra'
import PocketDuty from '@/lib/PocketDuty'

const dg = Debug('@:$:chase')

const initialState = {
  isPremium: false,
  shotSet: {},
  hatebuSet: {},
  hatebuStarSet: {},
  snackMessage: '',
  isSettingMode: false,
}

export const state = () => JSON.parse(JSON.stringify(initialState))

export const getters = {
  gSnackMessage(state) {
    return state.snackMessage
  },
}

export const mutations = {
  logout(state) {
    Object.keys(initialState).forEach((key) => {
      state[key] = initialState[key]
    })
  },
  setProgress(state, payload) {
    const { unread, archive } = payload
    state.progress = { unread, archive, all: unread + archive }
  },
  addHatebu(state, { eid, hatebu }) {
    state.hatebuSet = { ...state.hatebuSet, [eid]: hatebu }
  },
  addHatebuStar(state, { eid, starSet }) {
    state.hatebuStarSet = { ...state.hatebuStarSet, [eid]: starSet }
  },
  SET_SnackMessage(state, payload) {
    state.snackMessage = payload
  },
  SET_IsSettingMode(state, bool) {
    state.isSettingMode = bool
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
      await dispatch('stream/filter/startup', null, { root: true })
      dispatch('backgroundProcess')
    } else if (ph === 'WAITING_ACCESSTOKEN') {
      await dispatch('pocket/auth/getAccessToken', $cookie, { root: true })
      await dispatch('actByPhase', $cookie)
    } else {
      dispatch('logout', $cookie)
    }
  },
  async backgroundProcess({ commit, dispatch }) {
    dg('[#backgroundProcess]')
    commit('SET_SnackMessage', '最新データ取得中...')
    await this.$duty.retrieveRecent()
    await dispatch('stream/filter/startup', null, { root: true })
    commit('SET_SnackMessage', '')
  },
  async fetchAllEntries({ state, rootState, dispatch }) {
    const at = rootState.pocket.auth.login.accessToken
    const isPremium = state.isPremium
    await PocketDuty.fetchAllUnreadItems({ at, isPremium })
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
  async deleteDB() {
    await this.$cache.delete()
  },
}

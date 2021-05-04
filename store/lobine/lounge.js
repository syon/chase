import debug from 'debug'
import axios from 'axios'

const EP = {
  WID: `https://api.lobine.app/wid`,
  NAIL: `https://api.lobine.app/nail`,
  SHOT: `https://api.lobine.app/shot`,
  S3: 'https://s3.amazonaws.com/lobine',
  HATENA: 'https://hatena.lobine.app',
}

const dg = debug('@:$:lobine/lounge')

export const state = () => ({
  wid: null,
  dig: {},
  hatebu: {},
})

export const getters = {
  gLounge(state) {
    const { dig } = state
    if (!dig || !dig.url) return {}
    const host = dig.site_name || new URL(dig.url).host
    return {
      ...dig,
      hostLabel: host,
      loungeUrl: `https://lobine.app/lounge/${state.wid}`,
      hatebu: state.hatebu,
    }
  },
}

export const mutations = {
  SET_WIDDIG(state, { wid, dig }) {
    state.wid = wid
    state.dig = dig
  },
  SET_Hatebu(state, hatebu) {
    state.hatebu = hatebu
  },
}

export const actions = {
  async setup({ dispatch, commit }, { wid, entry }) {
    const dig = await this.$cache.getDigByWid(wid)
    commit('SET_WIDDIG', { wid, dig })
    // dispatch('prepareHatena', entry)
    dispatch('hatena/bookmark/init', entry, { root: true })
  },
  async prepareHatena({ commit }, { eid, url }) {
    const hatebu = await this.$duty.getHatebu({ eid, url })
    commit('SET_Hatebu', hatebu)
  },
  async emitDoubleshot({ state }) {
    dg('[#emitDoubleshot]')
    const { wid, dig } = state
    const { url } = dig
    if (wid && url) {
      dg('emitDoubleshot', { wid, url })
      return await axios.post(EP.SHOT, { wid, url })
    } else {
      dg('[#emitDoubleshot] (SKIP)', { wid, url })
    }
  },
}

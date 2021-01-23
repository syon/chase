import debug from 'debug'
import axios from 'axios'
import DB from '@/lib/DB'

const EP = {
  WID: `https://api.lobine.app/wid`,
  NAIL: `https://api.lobine.app/nail`,
  SHOT: `https://api.lobine.app/shot`,
  S3: 'https://s3.amazonaws.com/lobine',
  HATENA: 'https://hatena.lobine.app',
}

const dg = debug('@:store:lobine:lounge')
const db = new DB()

export const state = () => ({
  wid: null,
  dig: {},
})

export const getters = {
  gLounge(state) {
    const { dig } = state
    if (!dig || !dig.url) return {}
    const host = dig.site_name || new URL(dig.url).host
    return {
      ...dig,
      hostLabel: host,
      loungeUrl: `/lounge/${state.wid}`,
    }
  },
}

export const mutations = {
  SET_WIDDIG(state, { wid, dig }) {
    state.wid = wid
    state.dig = dig
  },
}

export const actions = {
  async setup({ commit }, { wid }) {
    const dig = await db.getDigByWid(wid)
    commit('SET_WIDDIG', { wid, dig })
  },
  async emitDoubleshot({ state }) {
    const { wid, dig } = state
    const { url } = dig
    console.log('==emitDoubleshot=============================', { wid, url })
    if (wid && url) {
      dg('emitDoubleshot', { wid, url })
      return await axios.post(EP.SHOT, { wid, url })
    }
  },
}

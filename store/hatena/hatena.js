import debug from 'debug'
import axios from 'axios'
import EP from './endpoint'

const dg = debug('~:store:hatena')

const HATENA_API_URL = EP.HATENA

export const state = () => ({
  user: {},
})

export const getters = {
  isHatenaLogin(state) {
    if (!state.user) return false
    return !!state.user.profile
  },
}

export const mutations = {
  setUser(state, { user }) {
    state.user = user
  },
}

export const actions = {
  async getPassport({ commit }) {
    dg('[#getPassport]--------')
    const user = await axios
      .get(`${HATENA_API_URL}/me`, { withCredentials: true })
      .then((res) => res.data.passport.user)
      .catch(() => ({}))
    if (user.profile) {
      dg('はてなアカウントでのログインに成功しました。', user)
    } else {
      dg('はてなAPIデータ取れませんでした。ログインしていないとみなします。')
    }
    commit('setUser', { user })
    dg('--------[#getPassport]', user)
    return user
  },
}

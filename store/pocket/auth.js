import LambdaPocket from '@/lib/LambdaPocket'
import LambdaUser from '@/lib/LambdaUser'

export const state = () => ({
  login: {
    accessToken: '',
    username: '',
  },
})

export const getters = {}

export const mutations = {
  SET_Login(state, payload) {
    const { access_token: accesstoken, username } = payload
    state.login.accessToken = accesstoken
    state.login.username = username
  },
}

export const actions = {
  restoreLogin({ commit }, $cookie) {
    const at = $cookie.get('pocket_access_token')
    const un = $cookie.get('pocket_username')
    commit('SET_Login', { access_token: at, username: un })
    this.$duty.setAccessToken(at)
  },
  async getRequestToken(_, $cookie) {
    const json = await LambdaPocket.getRequestToken()
    $cookie.set('pocket_request_token', json.request_token, {
      expires: '3M',
    })
    $cookie.set('phase', 'WAITING_ACCESSTOKEN', { expires: '3M' })
    $cookie.set('chase:a', 'Scene A')
    $cookie.set('chase:b', 'Scene B')
    $cookie.set('chase:c', 'Scene C')
    return json.auth_uri
  },
  async getAccessToken({ commit }, $cookie) {
    const rt = $cookie.get('pocket_request_token')
    const json = await LambdaPocket.getAccessToken(rt)
    LambdaUser.login(json)
    commit('SET_Login', json)
    $cookie.delete('pocket_request_token')
    $cookie.set('phase', 'READY', { expires: '3M' })
    $cookie.set('pocket_access_token', json.access_token, { expires: '3M' })
    $cookie.set('pocket_username', json.username, { expires: '3M' })
  },
}

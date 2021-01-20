import LambdaPocket from '@/lib/LambdaPocket'

export const state = () => ({
  profile: null,
})

export const getters = {}

export const mutations = {}

export const actions = {
  async getRequestToken({ commit }, $cookie) {
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
}

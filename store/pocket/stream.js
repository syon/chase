import DB from '@/lib/DB'

export const state = () => ({
  profile: null,
})

export const getters = {}

export const mutations = {}

export const actions = {
  async hello({ commit }) {
    const db = new DB()
    console.log(await db.selectAll())
  },
  async helloAdd({ commit }) {
    const db = new DB()
    console.log(await db.add())
  },
}

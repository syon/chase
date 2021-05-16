export const state = () => ({
  domainSummary: {},
})

export const getters = {
  gDomainSummary(state) {
    const list = Object.entries(state.domainSummary).map(([k, v]) => {
      return { domain: k, count: v }
    })
    list.sort((a, b) => {
      return b.count - a.count
    })
    return list
  },
}

export const mutations = {
  SET_DomainSummary(state, payload) {
    state.domainSummary = payload
  },
}

export const actions = {
  async load({ commit }) {
    const domainSummary = await this.$duty.getDomainSummary()
    commit('SET_DomainSummary', domainSummary)
  },
}

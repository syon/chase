import dayjs from 'dayjs'

export const state = () => ({
  records: [],
})

export const getters = {
  gHatebuRecords(state) {
    return state.records.map((x) => {
      const updAt = dayjs(x.at).format('YYYY-MM-DD HH:mm')
      return { ...x, update_at: updAt }
    })
  },
}

export const mutations = {
  SET_Records(state, records) {
    state.records = records
  },
}

export const actions = {
  async prepareRecords({ commit }) {
    const records = await this.$cache.getHatebuTable()
    commit('SET_Records', records)
  },
}

import dayjs from 'dayjs'

export const state = () => ({
  records: [],
})

export const getters = {
  gPocketRecords(state) {
    return state.records.map((x) => {
      const updAt = dayjs(x.time_updated * 1000).format('YYYY-MM-DD HH:mm')
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
    const unreads = await this.$cache.selectCachedPocketAll()
    commit('SET_Records', unreads)
  },
}

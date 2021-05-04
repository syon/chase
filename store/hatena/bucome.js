import debug from 'debug'

const dg = debug('~:store:bucome')

const MIN_TAB_INDEX = 0
const MAX_TAB_INDEX = 3

const tabIndex2tabName = (tabIndex) => {
  switch (tabIndex) {
    case 0:
      return 'RACE'
    case 1:
      return 'POPULAR'
    case 2:
      return 'NEW'
    case 3:
      return 'CONFIG'
    default:
      return 'RACE'
  }
}

const tabName2tabIndex = (tabName) => {
  switch (tabName) {
    case 'RACE':
      return 0
    case 'POPULAR':
      return 1
    case 'NEW':
      return 2
    case 'CONFIG':
      return 3
    default:
      return 1
  }
}

export const state = () => ({
  tabIndex: 0,
})

export const getters = {
  tabName(state) {
    return tabIndex2tabName(state.tabIndex)
  },
}

export const mutations = {
  setTabIndex(state, { tabIndex }) {
    state.tabIndex = tabIndex
  },
  setTabIndexByName(state, { tabName }) {
    state.tabIndex = tabName2tabIndex(tabName)
  },
  plusTabIndex(state) {
    if (state.tabIndex < MAX_TAB_INDEX) {
      state.tabIndex += 1
    }
  },
  minusTabIndex(state) {
    if (state.tabIndex > MIN_TAB_INDEX) {
      state.tabIndex -= 1
    }
  },
}

export const actions = {
  jumpTabByName({ commit }, { tabName }) {
    dg('[#jumpTabByName]', { tabName })
    commit('setTabIndexByName', { tabName })
  },
  nextTab({ commit }) {
    commit('plusTabIndex')
  },
  prevTab({ commit }) {
    commit('minusTabIndex')
  },
}

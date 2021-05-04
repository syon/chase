export const state = () => ({
  spell: '',
  isFav: false,
  tags: [],
  showMode: 'rack',
  isFiltering: false,
})

export const getters = {}

export const mutations = {
  SET_Spell(state, spell) {
    state.spell = spell
  },
  SET_IsFav(state, isFav) {
    state.isFav = isFav
  },
  SET_Tags(state, tags) {
    state.tags = tags
  },
  SET_ShowMode(state, showMode) {
    state.showMode = showMode
  },
  SET_IsFiltering(state, isFiltering) {
    state.isFiltering = isFiltering
  },
}

export const actions = {
  async load({ commit }, payload) {},
}

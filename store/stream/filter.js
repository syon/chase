export const state = () => ({
  spell: '',
  isFav: false,
  tags: [],
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
}

export const actions = {
  async load({ commit }, payload) {},
}

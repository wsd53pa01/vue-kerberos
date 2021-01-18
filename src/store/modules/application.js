const state = {
  id: 0
}

const mutations = {
  SET_ID: (state, value) => {
    state.id = value
  }
}

const actions = {
  setId({ commit } , value) {
    commit('SET_ID', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

const state = {
  active: 0,
  applicationId: 0
}

const mutations = {
  SET_ACTIVE: (state, value) => {
    state.active = value
  },
  SET_APPLICATION_ID: (state, value) => {
    state.applicationId = value
  }
}

const actions = {
  setActive({ commit }, value) {
    commit('SET_ACTIVE', value)
  },
  setApplicationId({ commit }, value) {
    commit('SET_APPLICATION_ID', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

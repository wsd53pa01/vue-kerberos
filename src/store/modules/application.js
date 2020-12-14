import Cookies from 'js-cookie'

const state = {
  id: Cookies.get('applicationId') || 0
}

const mutations = {
  SET_ID: (state, id) => {
    state.id = id
    Cookies.set('applicationId', id)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}

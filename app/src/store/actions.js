import mutationTypes from './mutation-types'

export default {
  switchProject: ({ commit }, payload) => {
    commit(mutationTypes.SWITCH_PROJECT, payload)
  },
  addProject: ({ commit }, payload) => {
    commit(mutationTypes.ADD_PROJECT, payload)
  },
  updateProject: ({ commit }, payload) => {
    commit(mutationTypes.UPDATE_PROJECT, payload)
  },
  destroyProject: ({ commit }, payload) => {
    commit(mutationTypes.DESTROY_PROJECT, payload)
  }
}

import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import db from './db'

Vue.use(Vuex)

const state = db.init()

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

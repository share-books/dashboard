import api from '../../api'
import * as types from '../types'


const state = {
  added: [],
  checkoutStatus: null
}

// getters
const getters = {
  checkoutStatus: state => state.checkoutStatus
}

// actions
const actions = {
  async checkout({ commit, state }, products) {
    const savedCartItems = [...state.added]
    commit(types.CHECKOUT_REQUEST)
    try {
     await api.buyProducts(products)
     commit(types.CHECKOUT_SUCCESS)
    } catch (err) {
      console.log(err)
      commit(types.CHECKOUT_FAILURE, { savedCartItems })
    }
  }
}

// mutations
const mutations = {
  [types.ADD_TO_CART](state, { id }) {
    state.lastCheckout = null
    const record = state.added.find(p => p.id === id)
    if (!record) {
      state.added.push({
        id,
        quantity: 1
      })
    } else {
      record.quantity++
    }
  },

  [types.CHECKOUT_REQUEST](state) {
    // clear cart
    state.added = []
    state.checkoutStatus = null
  },

  [types.CHECKOUT_SUCCESS](state) {

    state.checkoutStatus = 'successful'
  },

  [types.CHECKOUT_FAILURE](state, { savedCartItems }) {
    // rollback to the cart saved before sending the request
    state.added = savedCartItems
    state.checkoutStatus = 'network too slow'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

import { fetchCoinList, fetchCoinDetails } from '@/api/api'
import mapCoinCardData from '@/service/service'

const state = {
  coins: [],
  coin: null,
};

const mutations = {
  setCoins(state, coins) {
    state.coins = coins;
  },
  setCoin(state, coin) {
    state.coin = coin;
  },
};

const actions = {
  async fetchCoins({ commit }) {
    try {
      const coins = await fetchCoinList();
      commit('setCoins', coins);
    } catch (error) {
      console.error(error);
      // Handle the error case
    }
  },
  async fetchCoinDetails({ commit }, id) {
    try {
      const coin = await fetchCoinDetails(id);
      commit('setCoin', coin);
    } catch (error) {
      console.error(error);
      // Handle the error case
    }
  },
};

const getters = {
  getCoinList: state => { return state.coins },
  getCoinDetails: state => { return state.coin },
  getCoinCardData: state => { return mapCoinCardData(state.coins) }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

import { fetchCoinList, fetchCoinDetails } from '@/api/api';
import mapCoinCardData from '@/service/service';

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
  async fetchCoins({ commit, state }, page) {
    try {
      const coins = await fetchCoinList(page);
      const updatedCoins = [...state.coins, ...coins]
      commit('setCoins', updatedCoins);
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
  getCoinList: (state) => {
    return state.coins;
  },
  getCoinDetails: (state) => {
    return state.coin;
  },
  getCoinCardData: (state) => {
    return mapCoinCardData(state.coins);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

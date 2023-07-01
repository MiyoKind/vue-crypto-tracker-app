import { fetchCoinHistoricalChartData } from '@/api/api';
import { fetchCoinOverallChartData } from '@/service/service';

const state = {
  dailyChartData: [],
  weeklyChartData: [],
  monthlyChartData: [],
  yearChartData: [],
  overallChartData: [],
};

const mutations = {
  setDailyChartData(state, dailyData) {
    state.dailyChartData = dailyData;
  },
  setWeeklyChartData(state, weeklyData) {
    state.weeklyChartData = weeklyData;
  },
  setMonthlyChartData(state, monthlyData) {
    state.monthlyChartData = monthlyData;
  },
  setYearChartData(state, yearData) {
    state.yearChartData = yearData;
  },
  setOverallChartData(state, overallData) {
    state.overallChartData = overallData;
  },
};

const actions = {
  async fetchDailyData({ commit }, coinId) {
    try {
      const dailyChartData = await fetchCoinHistoricalChartData(coinId, 1);
      commit('setDailyChartData', dailyChartData);
    } catch (error) {
      // Handle error case
    }
  },
  async fetchWeeklyData({ commit }, coinId) {
    try {
      const weeklyChartData = await fetchCoinHistoricalChartData(coinId, 7);
      commit('setWeeklyChartData', weeklyChartData);
    } catch (error) {
      // Handle error case
    }
  },
  async fetchMonthlyData({ commit }, coinId) {
    try {
      const monthlyChartData = await fetchCoinHistoricalChartData(coinId, 30);
      commit('setMonthlyChartData', monthlyChartData);
    } catch (error) {
      // Handle error case
    }
  },
  async fetchYearData({ commit }, coinId) {
    try {
      const yearChartData = await fetchCoinHistoricalChartData(coinId, 365);
      commit('setYearChartData', yearChartData);
    } catch (error) {
      // Handle error case
    }
  },
  async fetchOverallChartData({ commit }, coinId) {
    try {
      // Change days later
      const overallChartData = await fetchCoinOverallChartData(coinId);
      commit('setOverallChartData', overallChartData);
    } catch (error) {
      // Handle error case
    }
  },
};

const getters = {
  getDailyChartData: (state) => state.dailyChartData,
  getWeeklyChartData: (state) => state.weeklyChartData,
  getMonthlyChartData: (state) => state.monthlyChartData,
  getYearChartData: (state) => state.yearChartData,
  getOverallChartData: (state) => state.overallChartData,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

import { fetchNews } from '@/api/api';

const state = {
  news: [],
};

const mutations = {
  setNews(state, news) {
    state.news = news;
  },
};

const actions = {
  async fetchNewsData({ commit }) {
    try {
      const news = await fetchNews();
      commit('setNews', news);
    } catch (error) {
      // Handle error case
    }
  },
};

const getters = {
  getNewsTitles: (state) => {
    return state.news.map((item) => item.title);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

// store.js

import Vue from 'vue';
import Vuex from 'vuex';
import coinModule from './modules/coinModule';
import newsModule from './modules/newsModule';
import coinDialogDataModule from './modules/coinDialogDataModule';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    coin: coinModule,
    news: newsModule,
    coinDialogData: coinDialogDataModule,
  },
});

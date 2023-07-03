<template>
  <v-app>
    <v-app-bar fixed :extension-height="25">
      <v-app-bar-nav-icon />
      <v-app-bar-title> Crypto Tracker App </v-app-bar-title>
      <template #extension>
        <div id="news-marquee-container">
          <NewsMarquee>
            <span
              class="news-title"
              v-for="newsTitle in newsTitles"
              :key="newsTitle"
              >{{ newsTitle }}</span
            >
          </NewsMarquee>
        </div>
      </template>
    </v-app-bar>
    <v-main class="mt-appbar">
      <CoinDashBoard />
    </v-main>
  </v-app>
</template>

<script>
import CoinDashBoard from '@/components/CoinDashBoard';
import NewsMarquee from './components/NewsMarquee.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    CoinDashBoard,
    NewsMarquee,
  },
  computed: {
    ...mapGetters('news', { newsTitles: 'getNewsTitles' }),
  },
  methods: {
    ...mapActions('news', ['fetchNewsData']),
  },
  mounted() {
    this.fetchNewsData();
  },
};
</script>

<style scoped>
#news-marquee-container {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 1000;
}
.mt-appbar {
  margin-top: 90px;
}

.news-title {
  margin-left: 10px;
  margin-right: 10px;
}
</style>

<template>
  <v-app>
    <NewsMarquee class="mt-25">
      <span
        class="news-title"
        v-for="newsTitle in newsTitles"
        :key="newsTitle"
        >{{ newsTitle }}</span
      >
    </NewsMarquee>
    <!--Fix margin to avoid app-bar overlapping the first components of dashboard-->
    <v-main class="mt-15">
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
.mt-appbar {
  margin-top: 56px;
}

.news-title {
  margin-left: 10px;
  margin-right: 10px;
}
</style>

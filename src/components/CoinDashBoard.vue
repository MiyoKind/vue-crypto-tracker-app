<template>
  <v-container>
    <v-row>
      <v-col v-for="(card, index) in coinCardData" :key="index" cols="12" sm="6" md="4" lg="3">
        <CoinCard :coin-data="card" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import CoinCard from './CoinCard.vue'

export default {
  name: 'CoinDashBoard',
  components: {
    CoinCard
  },
  computed: {
    ...mapGetters('coin', { coinCardData: 'getCoinCardData' }),
  },
  methods: {
    ...mapActions('coin', ['fetchCoins']),
  },
  mounted() {
    this.fetchCoins();
  },
}
</script>
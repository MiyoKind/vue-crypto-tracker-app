<template>
  <v-container>
    <v-row>
      <v-col cols="10">
        <v-autocomplete
          v-model="searchText"
          :items="coinCardData"
          item-text="name"
          auto-select-first
          chips
          clearable
          dense
          multiple
          solo-inverted
          hide-details
          hide-selected
          menu-icon=""
          append-icon=""
          label="Search for a coin..."
          prepend-inner-icon="mdi-magnify"
        >
          <template #no-data>
            <v-list-item>
              <v-list-item-title>
                Search for your favorite
                <strong>Cryptocurrency</strong>
              </v-list-item-title>
            </v-list-item>
          </template>
          <template #selection="{ attr, on, item, selected }">
            <v-chip
              v-bind="attr"
              :input-value="selected"
              color="blue-grey"
              class="white--text"
              v-on="on"
            >
              <v-icon left> mdi-bitcoin </v-icon>
              <span v-text="item.name"></span>
            </v-chip>
          </template>
          <template #item="{ item }">
            <v-list-item-avatar>
              <img :src="item.image" :alt="item.name" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon> mdi-bitcoin </v-icon>
            </v-list-item-action>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="2">
        <v-menu
          offset-y
          transition="slide-x-transition"
          bottom
          right
          rounded="b-xl"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              block
              outlined
              :plain="!isFilterSelected"
              :color="isFilterSelected ? 'primary' : ''"
              height="40"
              class="d-flex flex-row justify-center align-center"
            >
              <v-icon> mdi-filter </v-icon>
              <p class="pa-0 mb-0 mx-2">Filter</p>
            </v-btn>
          </template>
          <v-list>
            <!--<v-list-item @click="sortBy = 'trending'">-->
            <!--<v-list-item-title>Sort by trending</v-list-item-title>-->
            <!--</v-list-item>-->
            <v-list-item v-if="isFilterSelected" @click="resetFilters">
              <v-list-item-title>Reset filters</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-for="filter in filterOptions"
              :key="filter.value"
              @click="setFilter(filter.value)"
            >
              <v-list-item-title>{{ filter.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(card, index) in filteredAndSearchedCoinCardData"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <CoinCard :coin-data="card" :visible="isCardVisible(card)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import CoinCard from './CoinCard.vue';

export default {
  name: 'CoinDashBoard',
  components: {
    CoinCard,
  },
  data() {
    return {
      // Sorting option selected by user
      sortBy: null,
      // Filter option selected by user
      selectedFilter: null,
      // Text entered by user for searching
      searchText: '',
    };
  },
  computed: {
    ...mapGetters('coin', { coinCardData: 'getCoinCardData' }),
    filteredCoinCardData() {
      if (!this.sortBy) {
        return this.coinCardData;
      }

      let filteredData = [...this.coinCardData];

      if (this.selectedFilter) {
        filteredData.sort((a, b) => {
          switch (this.selectedFilter) {
            case 'volume':
              return a.volume - b.volume;
            case 'priceAsc':
              return a.price - b.price;
            case 'priceDesc':
              return b.price - a.price;
            case 'alphabet':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });
      }

      return filteredData;
    },
    filteredAndSearchedCoinCardData() {
      if (!this.searchText) {
        return this.filteredCoinCardData;
      }

      const regex = new RegExp(this.searchText.join('|'), 'gi');

      return this.filteredCoinCardData.filter(({ id, name }) => regex.test(id) || regex.test(name));
    },
    isFilterSelected() {
      return this.selectedFilter !== null;
    },
    // Add filter icons for better UX
    filterOptions() {
      return [
        { label: 'Sort by volume', value: 'volume' },
        { label: 'Sort by price ascending', value: 'priceAsc' },
        { label: 'Sort by price descending', value: 'priceDesc' },
        { label: 'Sort by alphabet', value: 'alphabet' },
      ];
    },
  },
  methods: {
    ...mapActions('coin', ['fetchCoins']),
    isCardVisible(card) {
      return card.isVisible;
    },
    resetFilters() {
      this.sortBy = null;
      this.selectedFilter = null;
    },
    setFilter(filter) {
      this.sortBy = filter;
      this.selectedFilter = filter;
    },
  },
  mounted() {
    this.fetchCoins();
  },
};
</script>

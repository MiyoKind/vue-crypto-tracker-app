<template>
  <v-container ref="dashboardContainer">
    <v-row>
      <v-col cols="10">
        <v-autocomplete
          v-model="searchText"
          :items="coinCardData"
          :loading="isLoading"
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
              <p class="pa-0 mb-0 mx-2">Filters</p>
            </v-btn>
          </template>
          <v-list>
            <!--<v-list-item @click="sortBy = 'trending'">-->
            <!--<v-list-item-title>Sort by trending</v-list-item-title>-->
            <!--</v-list-item>-->
            <v-list-item v-if="isFilterSelected" @click="resetFilters">
              <v-list-item-title>Reset filters</v-list-item-title>
              <v-list-item-action>
                <v-icon> mdi-filter-off </v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item
              v-for="filter in filterOptions"
              :key="filter.value"
              @click="setFilter(filter.value)"
            >
              <v-tooltip left>
                <template #activator="{ on }">
                  <v-list-item-title v-on="on">{{
                    truncateFilterLabel(filter.label)
                  }}</v-list-item-title>
                </template>
                <span>{{ filter.label }}</span>
              </v-tooltip>
              <v-list-item-action>
                <v-icon>
                  {{ filter.icon }}
                </v-icon>
              </v-list-item-action>
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
      isLoading: false,
      currentPage: 1,
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
            case 'volumeAsc':
              return a.volume - b.volume;
            case 'volumeDesc':
              return b.volume - a.volume;
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

      return this.filteredCoinCardData.filter(
        ({ id, name }) => regex.test(id) || regex.test(name)
      );
    },
    isFilterSelected() {
      return this.selectedFilter !== null;
    },
    // Add filter icons for better UX
    filterOptions() {
      return [
        {
          label: 'Sort by volume ascending',
          value: 'volumeAsc',
          icon: 'mdi-sort-descending',
        },
        {
          label: 'Sort by volume descending',
          value: 'volumeDesc',
          icon: 'mdi-sort-ascending',
        },
        {
          label: 'Sort by price ascending',
          value: 'priceAsc',
          icon: 'mdi-trending-up',
        },
        {
          label: 'Sort by price descending',
          value: 'priceDesc',
          icon: 'mdi-trending-down',
        },
        {
          label: 'Sort by alphabet',
          value: 'alphabet',
          icon: 'mdi-order-alphabetical-ascending',
        },
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
    truncateFilterLabel(label) {
      const maxLength = 12;
      if (label.length <= maxLength) {
        return label;
      }

      return `${label.slice(0, maxLength)}...`;
    },
    handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight) {
        this.currentPage++;
        this.fetchCoins(this.currentPage);
      }
    },
  },
  mounted() {
    this.fetchCoins(this.currentPage);
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  watch: {
    searchText(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isLoading = newVal.length > 0;
      }
    },
    filteredAndSearchedCoinCardData() {
      this.isLoading = false;
    },
  },
};
</script>

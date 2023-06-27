<template>
    <v-dialog scrollable width="800" :value="openStatus" @click:outside="$emit('closeDialog')">
        <v-card>
            <v-card-title>
                <v-layout justify-space-between align-center>
                    <div class="coin-title d-flex flex-row">
                        <img :src="coin.image" :alt="coin.name" width="35" height="35" class="mr-2">
                        <p class="pa-0 mb-0 my-auto mr-2">About {{ coin.name }}</p>
                        <p class="pa-0 mb-0 my-auto">{{ coin.symbol }}</p>
                    </div>
                    <v-btn width="30" height="30" fab text @click="$emit('closeDialog')">
                        <v-icon>
                            mdi-window-close
                        </v-icon>
                    </v-btn>
                </v-layout>
            </v-card-title>
            <v-container class="px-8 py-6">
                <v-layout flex-row justify-center class="chart-title mb-4">
                    <p class="pa-0 mb-0 font-weight-bold">Historical Price Data</p>
                </v-layout>
                <v-tabs fixed-tabs bg-color="indigo-darken-2">
                    <v-tab v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id">
                        {{ tab.label }}
                    </v-tab>
                </v-tabs>
                <CoinDialogChart :chart-data="activeData" @chartCreated="handleChartCreated" />
            </v-container>
            <v-card-text>
                <v-container class="coin-details">
                    
                </v-container>
                <!--Coin details including exchange rate-->
                <!--Market Data-->
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import CoinDialogChart from './CoinDialogChart.vue'

export default {
    name: 'CoinDialog',
    components: {
        CoinDialogChart
    },
    props: {
        openStatus: {
            type: Boolean,
            required: true
        },
        coin: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            activeTab: 'daily',
            tabs: [
                { id: 'daily', label: 'Daily Data' },
                { id: 'weekly', label: 'Weekly Data' },
                { id: 'monthly', label: 'Monthly Data' },
                { id: 'year', label: 'Year Data' },
                { id: 'overall', label: 'Overall Data' }
            ],
            activeData: [],
            chart: null
        }
    },
    computed: {
        ...mapGetters('coinDialogData', {
            dailyChartData: 'getDailyChartData',
            weeklyChartData: 'getWeeklyChartData',
            monthlyChartData: 'getMonthlyChartData',
            yearChartData: 'getYearChartData',
            overallChartData: 'getOverallChartData'
        }),
        ...mapGetters('coin', { coinDetails: 'getCoinDetails' })
    },
    methods: {
        ...mapActions('coinDialogData', [
            'fetchDailyData',
            'fetchWeeklyData',
            'fetchMonthlyData',
            'fetchYearData',
            'fetchOverallData'
        ]),
        ...mapActions('coin', ['fetchCoinDetails']),
        handleChartCreated(chart) {
            this.chart = chart
            this.updateChartData()
        },
        async updateChartData() {
            const data = await this.getDataForActiveTab()
            this.activeData = data
        },
        async getDataForActiveTab() {
            // logic for getting data with certain period of time
            switch (this.activeTab) {
                case 'daily':
                    await this.fetchDailyData(this.coin.id)
                    return this.dailyChartData
                case 'weekly':
                    await this.fetchWeeklyData(this.coin.id)
                    return this.weeklyChartData
                case 'monthly':
                    await this.fetchMonthlyData(this.coin.id)
                    return this.monthlyChartData
                case 'year':
                    await this.fetchYearData(this.coin.id)
                    return this.yearChartData
                case 'overall':
                    await this.fetchOverallData(this.coin.id)
                    return this.overallChartData
                default: return []
            }
        }
    },
    watch: {
        activeTab() {
            this.updateChartData()
        },
        openStatus: {
            handler(newVal) {
                if (newVal) {
                    this.fetchCoinDetails(this.coin.id)
                }
            }
        } 
    }
}
</script>

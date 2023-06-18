<template>
    <v-dialog width="800" :value="openStatus" @click:outside="$emit('closeDialog')">
        <v-card>
            <v-card-title>
                <v-layout justify-space-between align-center>
                    <p class="pa-0 mb-0 ml-2">About {{ coinDetails.id }}</p>
                    <v-btn width="30" height="30" fab text @click="$emit('closeDialog')">
                        <v-icon>
                            mdi-window-close
                        </v-icon>
                    </v-btn>
                </v-layout>
            </v-card-title>
            <v-container class="px-8 py-6">
                <v-tabs fixed-tabs bg-color="indigo-darken-2">
                    <v-tab v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id">
                        {{ tab.label }}
                    </v-tab>
                </v-tabs>
                <CoinDialogChart :chart-data="activeData" @chartCreated="handleChartCreated" />
            </v-container>
            <v-card-text>
                <!--Historical price data, 24h, week, month, year, all-time-->
                <!--Coin details-->
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
        coinDetails: {
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
        })
    },
    methods: {
        ...mapActions('coinDialogData', [
            'fetchDailyData',
            'fetchWeeklyData',
            'fetchMonthlyData',
            'fetchYearData',
            'fetchOverallData'
        ]),
        handleChartCreated(chart) {
            this.chart = chart
            this.updateChartData()
        },
        updateChartData() {
            const data = this.getDataForActiveTab()
            this.activeData = data
        },
        getDataForActiveTab() {
            // logic for getting data with certain period of time
            switch (this.activeTab) {
                case 'daily': return this.dailyChartData
                case 'weekly': return this.weeklyChartData
                case 'monthly': return this.monthlyChartData
                case 'year': return this.yearChartData
                case 'overall': return this.overallChartData
                default: return []
            }
        }
    },
    mounted() {
        const coinId = this.coinDetails.id
        this.fetchDailyData(coinId)
        this.fetchWeeklyData(coinId)
        this.fetchMonthlyData(coinId)
        this.fetchYearData(coinId)
        this.fetchOverallData(coinId)
    },
    watch: {
        activeTab() {
            this.updateChartData()
        }
    }
}
</script>

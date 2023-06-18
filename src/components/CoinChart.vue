<template>
    <div ref="coinChart">
        <div v-if="chartData.length === 0" class="placeholder-text">No data available</div>
    </div>
</template>

<script>
// amcharts
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import '@amcharts/amcharts4/themes/animated';
// Real-time data
import connectWebSocket from '@/api/ws'

export default {
    name: 'CoinChart',
    props: {
        coinId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            chartData: [],
            chart: null,
            placeholderLabel: null,
        }
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    },
    mounted() {
        connectWebSocket(this.handleWebSocketData);
        this.createChart();
    },
    methods: {
        handleWebSocketData(coinData) {
            const { coinId } = this;
            const filteredCoinData = coinData.filter((coin) => coin.coinName === coinId);

            if (filteredCoinData.length > 0) {
                const { coinName, currentPrice, timeStamp } = filteredCoinData[0];
                this.chartData.push({ coinName, currentPrice, timeStamp });
                this.updateChart();
            }
        },
        createChart() {
            // Create a new chart instance
            this.chart = am4core.create(this.$refs.coinChart, am4charts.XYChart);

            // Set the chart theme
            this.chart.colors.step = 2;
            this.chart.padding(20, 20, 20, 20);

            // Create and configure value axis
            const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.minWidth = 50;

            // Create and configure date axis
            const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 50;

            // Create and configure series for the data points
            const series = this.chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = 'currentPrice';
            series.dataFields.dateX = 'timeStamp';

            // Enable animations
            this.chart.animate({ easing: 'easeOutSine', duration: 1000 });

            // Set chart data
            series.data = this.chartData;

            // Create a placeholder label
            const placeholderLabel = this.chart.createChild(am4core.Label);
            placeholderLabel.text = 'No data available';
            placeholderLabel.horizontalCenter = 'middle';
            placeholderLabel.verticalCenter = 'middle';
            placeholderLabel.align = 'center'
            placeholderLabel.fontSize = 16;
            placeholderLabel.fill = am4core.color('#888');
            placeholderLabel.hide();
            this.placeholderLabel = placeholderLabel;

            this.updatePlaceholderLabelVisibility();
        },
        updateChart() {
            const series = this.chart.series.getIndex(0);

            // Animate the update of the series data
            series.animate([{ property: 'currentPrice', to: 'currentPrice' }], 1000);

            // Update the chart data
            series.data = this.chartData;

            this.updatePlaceholderLabelVisibility();
        },
        updatePlaceholderLabelVisibility() {
            if (this.chartData.length === 0) {
                this.placeholderLabel.show();
            } else {
                this.placeholderLabel.hide();
            }
        }
    }
}

</script>

<style scoped lang="scss">
.placeholder-text {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #888;
}
</style>
<template>
    <div height="200" ref="chart"></div>
</template>
<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

export default {
    name: 'CoinDialogChart',
    props: {
        chartData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            chart: null
        }
    },
    mounted() {
        this.createChart()
    },
    methods: {
        createChart() {
            am4core.useTheme(am4themes_animated);

            this.chart = am4core.create(this.$refs.chart, am4charts.XYChart);
            this.chart.data = this.chartData;

            // Create axes
            const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 60;

            this.chart.yAxes.push(new am4charts.ValueAxis());

            // Create series
            const series = this.chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = 'timestamp';
            series.dataFields.valueY = 'price';
            series.tooltipText = 'Price: {valueY.value}';
            series.strokeWidth = 2;
            series.minBulletDistance = 10;

            // Add cursor
            this.chart.cursor = new am4charts.XYCursor();

            // Add scrollbar
            this.chart.scrollbarX = new am4core.Scrollbar();

            // Add chart title
            // this.chart.title.text = 'Historical Price Chart';

            // Add legend
            this.chart.legend = new am4charts.Legend();
        }
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose()
        }
    }
}
</script>
<template>
    <v-card width="344">
        <!--Pass another data as a coin-details prop in Dialog-->
        <CoinDialog
       :open-status="coinDialogOpenStatus"
       :coin="coinData"
       @closeDialog="coinDialogOpenStatus = false"
        />
        <v-card-title class="d-flex flex-row justify-space-between">
            <div class="title d-flex flex-row">
                <img :src="coinData.image" :alt="coinData.name" width="35" height="35" class="mr-2">
            <p class="pa-0 mb-0 my-auto">{{ coinData.name }}</p>
            </div>
            <v-btn width="30" height="30" fab text @click="coinDialogOpenStatus = true">
            <v-icon>
                mdi-arrow-expand
            </v-icon>
        </v-btn>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row class="mx-auto">
                    <v-col class="pl-0 pt-0" cols="6">
                        <div class="currency-container d-flex flex-column">
                            <p class="pa-0 mr-1 mb-0">{{ coinData.symbol }} / USD</p>
                            <p class="pa-0 mb-0">{{ coinData.price }} $</p>
                        </div>
                    </v-col>
                    <v-col class="pl-0 pt-0" cols="6">
                        <div class="coin-info-container d-flex flex-column">
                            <p class="pa-0 mb-0">
                                Vol: {{ coinData.volume }}
                            </p>
                            <div class="price-chng d-flex flex-row text-no-wrap">
                                <img :src="priceChangeIcon" alt="Price Change" width="17" height="10" class="my-auto mr-2">
                                <p class="pa-0 mb-0">
                                    {{ coinData.priceChange }} %
                                </p>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <CoinChart :coinId="coinData.id" />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

import CoinChart from './CoinChart.vue';
import CoinDialog from './CoinDialog.vue';

export default {
    name: 'CoinCard',
    components: {
    CoinChart,
    CoinDialog
},
    props: {
        coinData: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            coinDialogOpenStatus: false
        }
    },
    computed: {
        ...mapGetters('coin', { coinCardData: 'getCoinCardData' }),
        priceChangeIcon() {
            return this.coinData.priceChange > 0 ?
                require('@/assets/icons/price_change_positive.svg') :
                require('@/assets/icons/price_change_negative.svg')
        }
    }
}
</script>

<style scoped lang="scss"></style>
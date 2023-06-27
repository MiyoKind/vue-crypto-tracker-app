import axios from 'axios';
import { calculateMaximumDays, extractOverallData } from '@/service/service';

// let lastCalled = 0;
// const MIN_TIME_INTERVAL = 1000; // 1 second

/**
 * Function fetching coin list
 * @returns { Array }
 */
export const fetchCoinList = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    const coins = response.data
    return coins
  } catch (err) {
    console.error('Cannot fetch coin list')
    return []
  }
}

/**
 * Function fetching details for specific coin
 * @param { String } id 
 * @returns { Object }
 */
export const fetchCoinDetails = async (id) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/list/${id}`
    );

    const coin = {
      id: response.data.id,
      name: response.data.name,
      symbol: response.data.symbol,
      marketCap: response.data.market_data.market_cap.usd,
      volume: response.data.market_data.total_volume.usd,
      circulatingSupply: response.data.market_data.circulating_supply,
      priceCharts: response.data.market_data.sparkline_7d.price,
    };

    return coin;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching coin details');
  }
};

/**
 * Function fetching historical data of specific cryptocurrency 
 * @param { String } coinId - coin ID 
 * @param { Number } days - X days before today
 * @returns { Array }
 */
export const fetchCoinHistoricalChartData = async (coinId, days) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: `${days}`
        }
      }
    );

    const chartData = response.data.prices.map(([timeStamp, historicalPrice]) => ({
      timeStamp,
      historicalPrice
    }));

    return chartData;
  } catch (error) {
    console.log('Cannot fetch coin history');
    return [];
  }
};

/**
 * Function fetching news about cryptocurrencies
 * @returns { Array }
 */
export const fetchNews = async () => {
  try {
    const response = await axios.get(`https://min-api.cryptocompare.com/data/news/?api_key=${ process.env.CRYPTOCOMPARE_API_KEY }`)
    const news = response.data
    return news
  } catch (error) {
    console.log('Cannot fetch news')
    return []
  }
}

export const fetchCoinOverallChartData = async (coinId) => {
  try {
    const maximumDays = calculateMaximumDays(); // Calculate the maximum number of days
    const chartData = fetchCoinHistoricalChartData(coinId, maximumDays);
    const overallData = extractOverallData(chartData);

    return overallData;
  } catch (error) {
    console.log('Cannot fetch coin overall data');
    return [];
  }
};
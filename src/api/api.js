import axios from 'axios';

let lastCalled = 0;
const MIN_TIME_INTERVAL = 1000; // 1 second

/**
 * Function fetching coin list
 * @returns { Array }
 */
export const fetchCoinList = async () => {
  try {
    const now = new Date().getTime();
    if (now - lastCalled < MIN_TIME_INTERVAL) {
      await new Promise((resolve) => setTimeout(() => resolve(), MIN_TIME_INTERVAL));
    }

    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      },
      withCredentials: false
    })

    lastCalled = new Date().getTime();

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
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: `${days}`
      }
    })

    const chartData = response.data.prices.map(([timeStamp, historicalPrice]) => {
      timeStamp,
      historicalPrice
    })
    
    return chartData
  } catch (error) {
    console.log('Cannot fetch coin history')
    return []
  }
}

// https://min-api.cryptocompare.com/data/news/feeds&api_key={your_api_key}

/**
 * Function fetching news about cryptocurrencies
 * @returns { Array }
 */
export const fetchNews = async () => {
  try {
    const response = await axios.get('https://min-api.cryptocompare.com/data/news/?api_key=ad0c130fb276923eb22ff24a7d4e7e61b5b4885a34c6774e300160ed104d9231')
    const news = response.data
    return news
  } catch (error) {
    console.log('Cannot fetch news')
    return []
  }
}
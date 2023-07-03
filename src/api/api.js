import axios from 'axios';
import { calculateMaximumDays, extractOverallData } from '@/service/service';

const apiHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8' 
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 429) {
      await sleep(1000);
      return axios(config);
    } else {
      return Promise.reject(error);
    }
  }
);

const fetchData = async (url, params = {}) => {
  try {
    const response = await axios.get(url, { params, headers: apiHeaders });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}`);
    throw new Error(error.message);
  }
};


/**
 * Function fetching coin list
 * @returns { Array } - Array of basic coin info
 */
export const fetchCoinList = async () => {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets';
    const params = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: false
    }

    const coins = await fetchData(url, params)

    return coins
  } catch (error) {
    console.error('Cannot fetch coin list')
    return []
  }
}

/**
 * Function fetching details for specific coin
 * @param { String } id - coinId
 * @returns { Object } - detailed information about specific coin
 */
export const fetchCoinDetails = async (id) => {
  try {
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/${id}`
    // const coinGeckoResponse = await axios.get(coinGeckoUrl, {
    //  headers: apiHeaders
    // })
    // const coinGeckoData = coinGeckoResponse.data
    const coinGeckoData = await fetchData(coinGeckoUrl)
    // console.log(`${coinGeckoData.symbol}-${coinGeckoData.id}`)
    
    // const coinPaprikaUrl = `https://api.coinpaprika.com/v1/coins/${coinGeckoData.symbol}-${coinGeckoData.id}`
    // const coinPaprikaData = await fetchData(coinPaprikaUrl)

    // const whitepaper = coinPaprikaData?.whitepaper || null
    const coin = {
      ...coinGeckoData,
      // whitepaper
    }
    
    return coin;
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching coin details')
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
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`
    const params = {
      vs_currency: 'usd',
      days: `${days}`
    }
    
    const response = await fetchData(url, params)

    const chartData = response.prices.map(([timeStamp, historicalPrice]) => ({
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
    const apiKey = process.env.CRYPTOCOMPARE_API_KEY
    const response = await axios.get(`https://min-api.cryptocompare.com/data/news/?api_key=${ apiKey }`)
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
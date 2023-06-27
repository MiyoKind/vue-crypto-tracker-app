import axios from 'axios';
import { calculateMaximumDays, extractOverallData } from '@/service/service';

const sleepRequest = (milliseconds, originalRequest) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(axios(originalRequest)), milliseconds)
  })
}

axios.interceptors.response.use(response => {
  return response
}, error => {
  const { config, response: {status} } = error
  const originalRequest = config

  if (status === 429) {
    return sleepRequest(1000, originalRequest)
  } else {
    return Promise.reject(error)
  }
})

/**
 * Function fetching coin list
 * @returns { Array } - Array of basic coin info
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
        'Content-Type': 'application/json; charset=utf-8'
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
 * @param { String } id - coinId
 * @returns { Object } - detailed information about specific coin
 */
export const fetchCoinDetails = async (id) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );

    const coin = response.data
    return coin
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
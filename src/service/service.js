export const mapCoinCardData = (data) => {
    return data.map(item => ({
        id: item.id,
        symbol: String(item.symbol.toUpperCase()),
        name: item.name,
        image: item.image,
        price: item.current_price,
        volume: (item.total_volume / 100000000).toFixed(2),
        priceChange: item.price_change_percentage_24h.toFixed(4)
    }))
}


  
  // Function to calculate the maximum number of days from the current date to the date of creation of Bitcoin
 export const calculateMaximumDays = () => {
    const currentDate = new Date();
    const bitcoinCreationDate = new Date('2009-01-03'); // Assuming Bitcoin creation date is January 3, 2009
    const timeDiff = currentDate.getTime() - bitcoinCreationDate.getTime();
    const maximumDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    return maximumDays;
  };
  
  // Function to extract the overall data by removing the part with the same prices
  export const extractOverallData = (chartData) => {
    const prices = chartData.map(dataPoint => dataPoint.historicalPrice);
    const firstUniquePriceIndex = prices.findIndex((price, index) => prices.indexOf(price) !== index);
  
    const overallData = chartData.slice(firstUniquePriceIndex);
  
    return overallData;
  };

export default mapCoinCardData
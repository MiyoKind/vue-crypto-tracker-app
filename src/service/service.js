export const mapCoinCardData = (data) => {
  return data.map((item) => {
    const volume = item.total_volume ? (item.total_volume / 100000000).toFixed(2) : 0;
    const priceChange = item.price_change_percentage_24h ? item.price_change_percentage_24h.toFixed(4) : 0;

    return {
      id: item.id,
      symbol: String(item.symbol.toUpperCase()),
      name: item.name,
      image: item.image,
      price: item.current_price,
      volume,
      priceChange
    }
  });
};

export default mapCoinCardData;

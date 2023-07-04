export const mapCoinCardData = (data) => {
  return data.map((item) => ({
    id: item.id,
    symbol: String(item.symbol.toUpperCase()),
    name: item.name,
    image: item.image,
    price: item.current_price,
    volume: (item.total_volume / 100000000).toFixed(2),
    priceChange: item.price_change_percentage_24h.toFixed(4),
  }));
};

export default mapCoinCardData;

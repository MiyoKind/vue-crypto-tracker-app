import { w3cwebsocket as W3CWebSocket } from 'websocket';

const connectWebSocket = (callback) => {
  const ws = new W3CWebSocket('wss://ws.coincap.io/prices?assets=ALL');

  ws.onopen = () => {
    console.log('WebSocket connection established.');

    ws.send(JSON.stringify({ type: 'subscribe', channel: 'prices', asset: 'ALL' }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const coinData = Object.entries(data).map(([coinName, currentPrice]) => ({
      coinName,
      currentPrice,
      timeStamp: Date.now(),
    }));
    callback(coinData);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed.');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export default connectWebSocket;

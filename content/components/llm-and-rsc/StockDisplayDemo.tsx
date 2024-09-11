import { StockDisplay } from './stock-display';

export default function StockDisplayDemo() {
  const sampleStockData = {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: '178.45',
    openingPrice: '175.30',
    highestPrice: '180.20',
    lowestPrice: '173.50',
    previousClose: '176.90',
    volume: 75230000,
    marketCap: 2830000000000,
    peRatio: '28.46',
    dividendYield: '0.55',
    lastUpdated: new Date().toISOString(),
  };
  return (
    <div className='rounded-lg mx-auto not-prose mt-6 min-w-full'>
      <StockDisplay {...sampleStockData} />
    </div>
  );
}

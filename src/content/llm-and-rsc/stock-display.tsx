'use client';

import { useState } from 'react';

interface StockDataProps {
  symbol: string;
  companyName: string;
  currentPrice: string;
  openingPrice: string;
  highestPrice: string;
  lowestPrice: string;
  previousClose: string;
  volume: number;
  marketCap: number;
  peRatio: string;
  dividendYield: string;
  lastUpdated: string;
}

export function StockDisplay({
  symbol,
  companyName,
  currentPrice,
  openingPrice,
  highestPrice,
  lowestPrice,
  previousClose,
  volume,
  marketCap,
  peRatio,
  dividendYield,
  lastUpdated,
}: StockDataProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [compareSymbol, setCompareSymbol] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  // Example function to simulate stock comparison (for demonstration purposes)
  const compareStock = (symbol: string) => {
    // Simulate fetching data for comparison
    console.log(`Comparing ${symbol} with ${compareSymbol}`);
    // Set show comparison to true (for demo purposes)
    setShowComparison(true);
  };

  return (
    <div className='mt-2 rounded-md border p-6'>
      <h2 className='mb-2 text-xl font-bold'>
        {companyName} ({symbol})
      </h2>
      <p className='mb-4 text-sm'>
        Last Updated: {new Date(lastUpdated).toLocaleString()}
      </p>

      <div className='space-y-2'>
        <p>
          <span className='font-semibold'>Current Price:</span> ${currentPrice}
        </p>
        <p>
          <span className='font-semibold'>Opening Price:</span> ${openingPrice}
        </p>
        <p>
          <span className='font-semibold'>Highest Price:</span> ${highestPrice}
        </p>
        <p>
          <span className='font-semibold'>Lowest Price:</span> ${lowestPrice}
        </p>
        <p>
          <span className='font-semibold'>Previous Close:</span> $
          {previousClose}
        </p>
        <p>
          <span className='font-semibold'>Volume:</span>{' '}
          {volume.toLocaleString()}
        </p>
        <p>
          <span className='font-semibold'>Market Cap:</span> $
          {marketCap.toLocaleString()}
        </p>
        <p>
          <span className='font-semibold'>P/E Ratio:</span> {peRatio}
        </p>
        <p>
          <span className='font-semibold'>Dividend Yield:</span> {dividendYield}
          %
        </p>
      </div>

      <div className='mt-4'>
        <button
          className='rounded bg-blue-500 px-4 py-2 text-white'
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Financial Metrics' : 'Show Additional Metrics'}
        </button>

        {showDetails && (
          <div className='text-foreground mt-4 rounded bg-gray-100 p-4 dark:bg-gray-800'>
            <h3 className='font-semibold'>Additional Financial Metrics:</h3>
            <p>
              Details about financial metrics and other insights would be
              displayed here.
            </p>
          </div>
        )}
      </div>

      <div className='mt-4'>
        <h3 className='mb-2 font-semibold'>Compare with Another Stock</h3>
        <div className='flex flex-col gap-2 md:flex-row'>
          <input
            type='text'
            value={compareSymbol}
            onChange={(e) => setCompareSymbol(e.target.value.toUpperCase())}
            placeholder='Enter stock symbol'
            className='text-foreground rounded border px-2 py-1'
          />
          <button
            className='rounded bg-green-500 px-4 py-1 text-white'
            onClick={() => compareStock(compareSymbol)}
          >
            Compare
          </button>
        </div>

        {showComparison && (
          <div className='text-primary-foreground mt-4 rounded bg-zinc-800 p-4 dark:bg-zinc-300'>
            <h4 className='font-semibold'>Comparison Results:</h4>
            <p>
              Comparison details between {symbol} and {compareSymbol} would be
              displayed here. This interaction can call the
              `continueConversation` server action and we can add one more tool
              call for stock comparison
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function StockDisplayDemo() {
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
    <div className='not-prose mx-auto mt-6 min-w-full rounded-lg'>
      <StockDisplay {...sampleStockData} />
    </div>
  );
}

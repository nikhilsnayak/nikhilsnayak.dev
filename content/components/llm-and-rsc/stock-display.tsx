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
    <div className='p-6 border mt-2 rounded-md'>
      <h2 className='text-xl font-bold mb-2'>
        {companyName} ({symbol})
      </h2>
      <p className='text-sm mb-4'>
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
          className='px-4 py-2 bg-blue-500 text-white rounded'
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Financial Metrics' : 'Show Additional Metrics'}
        </button>

        {showDetails && (
          <div className='mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded text-foreground'>
            <h3 className='font-semibold'>Additional Financial Metrics:</h3>
            <p>
              Details about financial metrics and other insights would be
              displayed here.
            </p>
          </div>
        )}
      </div>

      <div className='mt-4'>
        <h3 className='font-semibold mb-2'>Compare with Another Stock</h3>
        <div className=' flex flex-col md:flex-row gap-2'>
          <input
            type='text'
            value={compareSymbol}
            onChange={(e) => setCompareSymbol(e.target.value.toUpperCase())}
            placeholder='Enter stock symbol'
            className='border px-2 py-1 rounded text-foreground'
          />
          <button
            className='px-4 py-1 bg-green-500 text-white rounded'
            onClick={() => compareStock(compareSymbol)}
          >
            Compare
          </button>
        </div>

        {showComparison && (
          <div className='mt-4 bg-zinc-800 dark:bg-zinc-300 text-primary-foreground p-4 rounded'>
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

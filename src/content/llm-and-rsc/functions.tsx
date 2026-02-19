'use server';

import { Suspense } from 'react';
import Markdown from 'react-markdown';

import { Spinner } from '~/components/spinner';

import { askAI, getStockPrice } from './ai';
import type { Message } from './gen-ui';
import { StockDisplay } from './stock-display';

async function StockCard({ symbol }: { symbol: string }) {
  const stockDetails = await getStockPrice(symbol);

  return <StockDisplay {...stockDetails} />;
}

export async function continueConversation(query: string): Promise<Message> {
  try {
    const response = await askAI(query);
    const candidate = response?.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (part?.functionCall) {
      const functionCall = part.functionCall;
      const { symbol } = functionCall.args as { symbol: string };
      return {
        id: (Math.random() * 1000).toString(),
        role: 'bot',
        display: (
          <Suspense
            fallback={
              <div className='flex items-center gap-2'>
                <span>{`Fetching current stock price of ${symbol}`}</span>
                <Spinner />
              </div>
            }
          >
            <StockCard symbol={symbol} />
          </Suspense>
        ),
      };
    } else {
      const text =
        candidate?.content?.parts?.[0]?.text ||
        'Could not fulfill the request. Please try again.';
      return {
        id: (Math.random() * 1000).toString(),
        role: 'bot',
        display: <Markdown>{text}</Markdown>,
      };
    }
  } catch (error) {
    console.error(error);

    return {
      id: (Math.random() * 1000).toString(),
      role: 'bot',
      display: <p>Something went wrong. Please try again</p>,
    };
  }
}

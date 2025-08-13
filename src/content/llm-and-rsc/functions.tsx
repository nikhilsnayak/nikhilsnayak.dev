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
  const completion = await askAI(query);

  // Check if the response includes a function call
  //@ts-expect-error -- migrate to responses API (https://platform.openai.com/docs/guides/migrate-to-responses)
  const functionCall = completion.choices[0].message.tool_calls?.[0].function;

  if (functionCall && functionCall.name === 'getStockPrice') {
    const { symbol } = JSON.parse(functionCall.arguments);
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
    return {
      id: (Math.random() * 1000).toString(),
      role: 'bot',
      display: <Markdown>{completion.choices[0].message?.content}</Markdown>,
    };
  }
}

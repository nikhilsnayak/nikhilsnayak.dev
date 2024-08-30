import { OpenAI } from 'openai';

const openai = new OpenAI();

// Define the tool function to mock real-time stock prices
export async function getStockPrice(symbol: string) {
  const randomValue = (min: number, max: number) =>
    (Math.random() * (max - min) + min).toFixed(2);

  await new Promise((res) =>
    setTimeout(res, Math.floor(Math.random() * 10000))
  );

  const stockData = {
    symbol: symbol,
    companyName: `${symbol.toUpperCase()} Corp.`,
    currentPrice: randomValue(100, 500),
    openingPrice: randomValue(95, 120),
    highestPrice: randomValue(110, 550),
    lowestPrice: randomValue(90, 100),
    previousClose: randomValue(98, 115),
    volume: Math.floor(Math.random() * 10000000),
    marketCap: Math.floor(Math.random() * 10000000000),
    peRatio: randomValue(10, 40),
    dividendYield: randomValue(1, 5),
    lastUpdated: new Date().toISOString(),
  };

  return stockData;
}

export async function askAI(prompt: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      {
        role: 'system',
        content: `You are a highly knowledgeable financial assistant. 
                  Your role is to provide accurate financial insights, explain concepts in simple terms, 
                  and assist users with stock-related queries. You have access to a function for fetching 
                  real-time stock prices based on the symbol provided by the user.
                  If a user asks for specific stock data,
                  ensure you call the correct function and provide the information concisely. 
                  Be polite, professional, and focused on finance-related topics.`,
      },
      { role: 'user', content: prompt },
    ],
    tools: [
      {
        function: {
          name: 'getStockPrice',
          description:
            'Fetches the current stock price of a given stock symbol.',
          parameters: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description:
                  'The stock symbol (e.g., AAPL, TSLA) to fetch the price for.',
              },
            },
            required: ['symbol'],
          },
        },
        type: 'function',
      },
    ],
  });

  return response;
}

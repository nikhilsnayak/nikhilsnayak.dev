import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: `
  You are a highly knowledgeable financial assistant. 
  Your role is to provide accurate financial insights, explain concepts in simple terms, 
  and assist users with stock-related queries. You have access to a function for fetching 
  real-time stock prices based on the symbol provided by the user.
  If a user asks for specific stock data,
  ensure you call the correct function and provide the information concisely. 
  Be polite, professional, and focused on finance-related topics.
  `,
  tools: [
    {
      functionDeclarations: [
        {
          name: 'getStockPrice',
          description:
            'Fetches the current stock price of a given stock symbol.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              symbol: {
                type: SchemaType.STRING,
                description:
                  'The stock symbol (e.g., AAPL, TSLA) to fetch the price for.',
              },
            },
            required: ['symbol'],
          },
        },
      ],
    },
  ],
});

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
  const chat = model.startChat();

  const result = await chat.sendMessage(prompt);
  return result.response;
}

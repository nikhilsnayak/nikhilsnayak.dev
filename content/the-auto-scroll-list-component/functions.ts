'use server';

import { createStreamableValue } from 'ai/rsc';

const generateRandomText = (query: string) => {
  const length = Math.floor(Math.random() * 5) + 1;
  const chars = query + 'abcdefghijklmnopqrstuvwxyz' + query;
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

export async function continueConversation(query: string) {
  const streamable = createStreamableValue('');

  const intervalId = setInterval(() => {
    const randomText = generateRandomText(query);
    streamable.append(randomText + ' ');
  }, 20);

  setTimeout(() => {
    streamable.done();
    clearInterval(intervalId);
  }, 10000);

  return streamable.value;
}

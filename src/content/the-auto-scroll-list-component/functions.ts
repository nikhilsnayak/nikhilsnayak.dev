'use server';

export async function continueConversation(query: string) {
  function getRandomText() {
    const length = Math.floor(Math.random() * 5) + 1;
    const chars = query + 'abcdefghijklmnopqrstuvwxyz' + query;
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  async function* generateStreamableText() {
    let shouldContinue = true;

    setTimeout(() => {
      shouldContinue = false;
    }, 30000);

    while (shouldContinue) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      const randomText = getRandomText();
      yield randomText + ' ';
    }

    return getRandomText();
  }

  return generateStreamableText();
}

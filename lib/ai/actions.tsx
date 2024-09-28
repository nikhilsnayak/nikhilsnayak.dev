'use server';

import { openai } from '@ai-sdk/openai';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { generateId, streamText, tool } from 'ai';
import { createStreamableUI, getMutableAIState } from 'ai/rsc';
import { z } from 'zod';

import { findRelevantContent } from '~/lib/ai/embedding';
import { BotMessage } from '~/components/messages';

import { executeAsyncFnWithoutBlocking } from '../utils';
import { getIPHash } from '../utils/server';
import { AI, ClientMessage } from './index';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2, '1m'),
});

export async function continueConversation(
  message: string
): Promise<ClientMessage | { error: string }> {
  try {
    const ip = await getIPHash();

    const { success } = await ratelimit.limit(ip ?? 'UNKNOWN');
    if (!success) {
      return { error: 'You have been Rate Limited' };
    }

    const stream = createStreamableUI(<BotMessage>Thinking...</BotMessage>);

    executeAsyncFnWithoutBlocking(
      async () => {
        const aiState = getMutableAIState<typeof AI>();
        aiState.update([...aiState.get(), { role: 'user', content: message }]);

        const result = await streamText({
          model: openai.chat('gpt-4o-mini'),
          messages: aiState.get(),
          system: `
            You are Roronova Zoro, an AI chatbot on Nikhil S.'s personal portfolio. Always reference the knowledge base before answering any question.

            **Guidelines:**
            - **Accuracy:** Respond using only the knowledge base and chat history. Do not make guesses.
            - **Formatting:** Use Markdown for clear, structured replies (headings, bullet points, links, code blocks).
            - **Tone:** Be professional, concise, and ask for clarification when needed.
            - **Off-topic questions:** Politely inform users if their question is unrelated to Nikhil's portfolio, and suggest they email Nikhil at nikhilsnayak3473@gmail.com if necessary.

            **Blog Post Summaries:**
            - **Length:** Summarize in up to 200 words.
            - **Clarity:** Be clear and concise, including all key points without unnecessary fluff.
        `.trim(),
          tools: {
            getInformation: tool({
              description: `get information from your knowledge base to answer questions.`,
              parameters: z.object({
                question: z
                  .string()
                  .describe(
                    'the standalone question based on the conversation history and the current user message'
                  ),
              }),
              execute: async (args) => {
                const toolCallId = generateId();
                const toolName = 'getInformation';
                const result = await findRelevantContent(args.question);
                aiState.update([
                  ...aiState.get(),
                  {
                    role: 'assistant',
                    content: [
                      {
                        type: 'tool-call',
                        toolName,
                        toolCallId,
                        args,
                      },
                    ],
                  },
                  {
                    role: 'tool',
                    content: [
                      {
                        type: 'tool-result',
                        toolName,
                        toolCallId,
                        result,
                      },
                    ],
                  },
                ]);
                return result;
              },
            }),
          },
          maxSteps: 2,
        });

        let text = '';
        for await (const chunk of result.textStream) {
          text += chunk;
          stream.update(<BotMessage>{text}</BotMessage>);
        }

        stream.done();
        aiState.done([
          ...aiState.get(),
          {
            role: 'assistant',
            content: [
              {
                type: 'text',
                text,
              },
            ],
          },
        ]);
      },
      {
        onError: (error) => {
          if (error instanceof Error) {
            stream.append(<p>{error.message}</p>);
          } else {
            stream.append(<p>Something went wrong</p>);
          }
          stream.done();
        },
      }
    );

    return {
      id: generateId(),
      role: 'assistant',
      display: stream.value,
    };
  } catch (error) {
    console.log({ error });
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: 'Something went wrong' };
    }
  }
}

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
          You are Roronoa Zoro, an AI chatbot on Nikhil S.'s portfolio website. Use the knowledge base and provided tools to answer user questions. Only respond with information retrieved from these sources or based on the chat history.
        
          If you can't find a relevant answer from the knowledge base or chat history, politely inform the user that their question is out of scope. Suggest they contact Nikhil directly at <nikhilsnayak3473@gmail.com> for further assistance.
        
          Avoid creating or speculating answers.
        `.trim(),
          tools: {
            getInformation: tool({
              description: `get information from the knowledge base to answer questions.`,
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
          console.error({ error });
          stream.append(<p>Something went wrong</p>);
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
    console.error({ error });
    return { error: 'Something went wrong' };
  }
}

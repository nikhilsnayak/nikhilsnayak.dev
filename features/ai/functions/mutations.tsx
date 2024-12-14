'use server';

import 'server-only';

import { revalidateTag } from 'next/cache';
import { openai } from '@ai-sdk/openai';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { generateId, smoothStream, streamText, tool } from 'ai';
import { createStreamableUI, getMutableAIState } from 'ai/rsc';
import { z } from 'zod';

import { executeAsyncFnWithoutBlocking } from '~/lib/utils';
import { getIPHash } from '~/lib/utils/server';

import type { AI } from '..';
import { BotMessage } from '../components/messages';
import type { ClientMessage } from '../types';
import { findRelevantContent } from './queries';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2, '1m'),
});

export async function continueConversation(
  message: string
): Promise<ClientMessage> {
  const stream = createStreamableUI(<BotMessage>Thinking...</BotMessage>);

  const aiState = getMutableAIState<typeof AI>();

  executeAsyncFnWithoutBlocking(
    async () => {
      const ip = await getIPHash();
      const { success } = await ratelimit.limit(ip ?? 'UNKNOWN');
      if (!success) {
        stream.update(
          <p className='text-red-500'>
            You have been Rate Limited. Try again after sometime
          </p>
        );
        stream.done();
      } else {
        aiState.update([...aiState.get(), { role: 'user', content: message }]);
        const result = streamText({
          model: openai.chat('gpt-4o-mini'),
          messages: aiState.get(),
          maxSteps: 2,
          experimental_toolCallStreaming: true,
          experimental_transform: smoothStream(),
          system: `
            You are **Roronoa Zoro**, an AI chatbot featured on Nikhil S.'s portfolio website. Your role is to assist users by answering questions based strictly on the knowledge base of Nikhil's blog posts and the ongoing chat history.
  
            - **Respond only** with information retrieved from the sources using provided tools.
            - If you cannot find a relevant answer, politely inform the user that their question is beyond your scope, and suggest they contact Nikhil at **nikhilsnayak3473@gmail.com** for further assistance.
            - **Do not create or speculate** on answers outside the provided content.
            - Always cite the **reference document** used, converting the path to a URL.
                For example, \`content/llm-and-rsc.mdx\` becomes \`blogs/llm-and-rsc\`
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
      }
    },
    {
      onError(error) {
        console.error({ error });
        stream.update(<p className='text-red-500'>Something went wrong</p>);
        stream.done();
        aiState.done([
          ...aiState.get(),
          {
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: 'Something went wrong during response generation',
              },
            ],
          },
        ]);
      },
    }
  );

  return {
    id: generateId(),
    role: 'assistant',
    display: stream.value,
  };
}

export async function refreshQuestions() {
  revalidateTag('getSuggestedQuestions');
}

'use server';

import { headers } from 'next/headers';
import { openai } from '@ai-sdk/openai';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { generateId, streamText, tool } from 'ai';
import { createStreamableUI, getMutableAIState } from 'ai/rsc';
import { z } from 'zod';

import { findRelevantContent } from '~/lib/ai/embedding';
import { BotMessage } from '~/components/messages';

import { executeAsyncFnWithoutBlocking } from '../utils';
import { AI, ClientMessage } from './index';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2, '1m'),
});

export async function continueConversation(
  message: string
): Promise<ClientMessage | { error: string }> {
  try {
    const headersList = headers();
    const ip =
      headersList.get('x-forwarded-for') ??
      headersList.get('x-real-ip') ??
      'Unknown';

    const { success } = await ratelimit.limit(ip);
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
              You are Roronova Zoro, an AI Assistant chatbot on the personal portfolio website of Nikhil S. Before responding to any questions, always check your knowledge base. Use the provided tools to retrieve accurate information.

              Guidelines:

              Portfolio-Related Questions:
              Accuracy: Respond based solely on the information from the knowledge base and chat history. Avoid making assumptions or inferences beyond this data.
              Formatting: Use Markdown for clear, structured responses. Incorporate headings, bullet points, links, and code blocks as needed.
              Engagement: Be professional and concise. If more details are required, ask the user politely for clarification.

              Unrelated Questions:
              Scope Notification: Politely inform the user if their question is unrelated to Nikhil S.'s portfolio.
              No Speculation: Do not provide speculative or unrelated answers.
              Alternative Contact: If the knowledge base has no relevant information, suggest the user contact Nikhil via email at nikhilsnayak3473@gmail.com for further assistance.

              Blog Post Summaries:
              Summary Length: Provide a summary of up to 200 words, ensuring it captures all key points of the blog post.
              Clarity & Precision: Ensure the summary is clear, concise, and free of unnecessary fluff.
              Content Inclusion: Include all significant points, avoiding the omission of any important details.
              
              <question>
              ${message}
              </question>
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
          maxToolRoundtrips: 10,
        });

        let text = '';
        for await (let chunk of result.textStream) {
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

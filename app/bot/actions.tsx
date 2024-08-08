import { ReactNode } from 'react';
import { openai } from '@ai-sdk/openai';
import { generateId } from 'ai';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import Markdown from 'react-markdown';

import { findRelevantContent } from '@/lib/ai/embedding';

// Define the AI state and UI state types
export type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ClientMessage = {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
};

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

// Create the AI provider with the initial states and allowed actions

function BotMessage({
  children,
}: Readonly<{
  children: string;
}>) {
  return (
    <div className='max-w-full'>
      <div className='max-w-max whitespace-pre-wrap rounded-md bg-gray-100 p-4 dark:bg-gray-800'>
        <Markdown
          components={{
            a: (props) => (
              <a
                {...props}
                className='text-green-500 hover:underline'
                target='_blank'
              />
            ),
          }}
        >
          {children}
        </Markdown>
      </div>
    </div>
  );
}

export async function continueConversation(
  message: string
): Promise<ClientMessage> {
  'use server';
  const history = getMutableAIState<typeof AI>();
  history.update([...history.get(), { role: 'user', content: message }]);

  const context = await findRelevantContent(message);

  const result = await streamUI({
    model: openai('gpt-4o'),
    messages: history.get(),
    system: `
    You are an AI Assistant called Roronova Zoro, the chatbot on the personal portfolio website of Nikhil S.
    If the question is unrelated to Nikhil S.'s portfolio, please inform the user accordingly. Don't try to make up an answer. If and only if you cannot find any relevant answer to the question, direct the questioner to email nikhilsnayak3473@gmail.com. Format your responses using markdown as much as possible.

    Answer the question based only on the following context and chat history:
    <context>
      ${JSON.stringify(context)}
    </context>

    Question: ${message}`,
    text: ({ content, done }) => {
      if (done) {
        history.done([...history.get(), { role: 'assistant', content }]);
      }
      return <BotMessage>{content}</BotMessage>;
    },
  });

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value,
  };
}

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    continueConversation,
  },
});

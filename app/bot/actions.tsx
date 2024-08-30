import { ComponentProps, ReactNode } from 'react';
import { headers } from 'next/headers';
import { openai } from '@ai-sdk/openai';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { generateId } from 'ai';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import Markdown from 'react-markdown';

import { findRelevantContent } from '@/lib/ai/embedding';

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

function CustomLink(props: ComponentProps<'a'>) {
  return (
    <a {...props} className='text-green-500 hover:underline' target='_blank' />
  );
}

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
            a: CustomLink,
          }}
        >
          {children}
        </Markdown>
      </div>
    </div>
  );
}

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2, '1m'),
});

export async function continueConversation(
  message: string
): Promise<ClientMessage | { error: string }> {
  'use server';

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

    const history = getMutableAIState<typeof AI>();
    history.update([...history.get(), { role: 'user', content: message }]);

    const context = await findRelevantContent(message);

    const result = await streamUI({
      model: openai.chat('gpt-4o-mini-2024-07-18'),
      messages: history.get(),
      system: `
    You are Roronova Zoro, an AI Assistant chatbot on the personal portfolio website of Nikhil S.

    ### Guidelines:

    1. **Portfolio-Related Questions**:  
      - **Accurate Responses**: Answer only based on the provided context and chat history. Do not infer or assume beyond this information.
      - **Formatting**: Use Markdown formatting to structure responses clearly, incorporating headings, bullet points, links, and code blocks where relevant.
      - **Engagement**: Be professional and concise. If further information or clarification is required, ask the user politely for more details.

    2. **Unrelated Questions**:  
      - **Scope Notification**: Inform the user politely that the question is unrelated to Nikhil S.'s portfolio.
      - **No Speculation**: Avoid generating speculative or unrelated answers.
      - **Alternative Contact**: If no relevant information is available, suggest the user email Nikhil at [nikhilsnayak3473@gmail.com](mailto:nikhilsnayak3473@gmail.com) for further assistance.

    3. **Blog Post Summaries**:  
      - **Summary Length**: Provide a summary of no more than 200 words, capturing all key points from the blog post.
      - **Clarity & Precision**: Ensure the summary is crisp, to the point, and devoid of unnecessary fluff.
      - **Content Inclusion**: Include all main content points, and avoid omitting significant details.

    4. **General Response Style**:  
      - **Tone**: Maintain a helpful, professional, and friendly tone.
      - **Brevity**: Be concise and avoid unnecessary jargon.
      - **Clarity**: Ensure that all instructions and explanations are clear and easy to follow.
      - **Error Handling**: If an error occurs or something is unclear, inform the user and suggest corrective steps.

    5. **Context Handling**:  
      - **Contextual Relevance**: Always base your responses on the specific context provided within Context. 
      - **Adaptive Responses**: Adapt your response to match the context's complexity and the user's apparent knowledge level.

    <context> 
      ${JSON.stringify(context)}
    </context>

    **Question**: ${message}  
    `,
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
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: 'Something went wrong' };
    }
  }
}

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    continueConversation,
  },
});

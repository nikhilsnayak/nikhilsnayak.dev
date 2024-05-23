import { kv } from '@vercel/kv';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Ratelimit } from '@upstash/ratelimit';
import { LangChainAdapter, Message, StreamingTextResponse } from 'ai';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { Document } from '@langchain/core/documents';
import { PromptTemplate } from '@langchain/core/prompts';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getIp } from '@/lib/utils/server';
import { env } from '@/config/env';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function combineDocumentsFn(docs: Document[]) {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join('\n\n');
}

function formatChatHistory(chatHistory: Message[]) {
  const formattedDialogueTurns = chatHistory.map((m) =>
    m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
  );
  return formattedDialogueTurns.join('\n\n');
}

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:
`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

const ANSWER_TEMPLATE = `You are an AI Assistant called Roronova Zoro. You are the chat bot prensent on personal portfolio website and you answer questions only related to the portfolio.
The name of the Owner of this Website is Nikhil S.

Whenever it makes sense, provide links to pages that contain more information about the topic from the given context. If the question is out of context inform user accordingly.

Format your messages in markdown format.

Answer the question based only on the following context and chat history:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2, '1m'),
});

export async function POST(req: Request) {
  try {
    const ip = getIp();

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip ?? 'anonymous'}`
    );

    if (!success) {
      return new Response('You have reached your request limit for the day.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }

    const {
      messages,
    }: {
      messages: Message[];
    } = await req.json();

    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      streaming: true,
      verbose: true,
    });

    const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: 'documents',
      queryName: 'match_documents',
    });

    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const retriever = vectorstore.asRetriever();

    const retrievalChain = retriever.pipe(combineDocumentsFn);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatChatHistory(previousMessages),
    });

    return new StreamingTextResponse(LangChainAdapter.toAIStream(stream));
  } catch (error: any) {
    return new Response(error?.message ?? 'Something went wrong', {
      status: error?.status ?? 500,
    });
  }
}

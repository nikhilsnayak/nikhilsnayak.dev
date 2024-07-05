import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { LangChainAdapter, Message, StreamingTextResponse } from 'ai';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { vectorStoreConfig } from '@/config/vector-store';
import { env } from '@/config/env';
import { combineDocuments, formatChatHistory } from '@/lib/utils/server';
import { answerPrompt, standaloneQuestionPrompt } from './prompts';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const {
      messages,
    }: {
      messages: Message[];
    } = await req.json();

    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0,
      streaming: true,
      verbose: true,
    });

    const vectorstore = await VercelPostgres.initialize(
      new OpenAIEmbeddings(),
      {
        ...vectorStoreConfig,
        postgresConnectionOptions: {
          connectionString: env.POSTGRES_URL,
        },
      }
    );

    const retriever = vectorstore.asRetriever();

    const standaloneQuestionChain = RunnableSequence.from([
      standaloneQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const retrievalChain = RunnableSequence.from([
      ({ standalone_question }) => standalone_question,
      retriever,
      combineDocuments,
    ]);

    const answerChain = RunnableSequence.from([
      answerPrompt,
      model,
      new StringOutputParser(),
    ]);

    const conversationalRetrievalChain = RunnableSequence.from([
      {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrievalChain,
        question: ({ original_input }) => original_input.question,
        chat_history: ({ original_input }) => original_input.chat_history,
      },
      answerChain,
    ]);

    const stream = await conversationalRetrievalChain.stream({
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

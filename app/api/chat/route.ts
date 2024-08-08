// import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
// import { StringOutputParser } from '@langchain/core/output_parsers';
// import { PromptTemplate } from '@langchain/core/prompts';
// import {
//   RunnablePassthrough,
//   RunnableSequence,
// } from '@langchain/core/runnables';
// import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
// import { LangChainAdapter, Message, StreamingTextResponse } from 'ai';

// import { env } from '@/config/env';
// import { vectorStoreConfig } from '@/config/vector-store';
// import { combineDocuments, formatChatHistory } from '@/lib/utils/server';

// export const maxDuration = 60;

// const CONDENSE_QUESTION_TEMPLATE = `
// Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

// <chat_history>
//   {chat_history}
// </chat_history>

// Follow Up Input: {question}
// Standalone question:
// `;

// const ANSWER_TEMPLATE = `
// You are an AI Assistant called Roronova Zoro, the chatbot on the personal portfolio website of Nikhil S.

// If the question is unrelated to Nikhil S.'s portfolio, please inform the user accordingly. Don't try to make up an answer. If and only if you cannot find any relevant answer to the question, direct the questioner to email nikhilsnayak3473@gmail.com. Format your responses using markdown as much as possible.

// Answer the question based only on the following context and chat history:
// <context>
//   {context}
// </context>

// <chat_history>
//   {chat_history}
// </chat_history>

// Question: {question}
// `;

// const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);
// const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
//   CONDENSE_QUESTION_TEMPLATE
// );

// export async function POST(req: Request) {
//   try {
//     const {
//       messages,
//     }: {
//       messages: Message[];
//     } = await req.json();

//     const previousMessages = messages.slice(0, -1);
//     const currentMessageContent = messages[messages.length - 1].content;

//     const model = new ChatOpenAI({
//       model: 'gpt-4o',
//       temperature: 0,
//       streaming: true,
//       verbose: true,
//     });

//     const vectorstore = await VercelPostgres.initialize(
//       new OpenAIEmbeddings(),
//       {
//         ...vectorStoreConfig,
//         postgresConnectionOptions: {
//           connectionString: env.POSTGRES_URL,
//         },
//       }
//     );

//     const retriever = vectorstore.asRetriever();

//     const standaloneQuestionChain = RunnableSequence.from([
//       standaloneQuestionPrompt,
//       model,
//       new StringOutputParser(),
//     ]);

//     const retrievalChain = RunnableSequence.from([
//       ({ standalone_question }) => standalone_question,
//       retriever,
//       combineDocuments,
//     ]);

//     const answerChain = RunnableSequence.from([
//       answerPrompt,
//       model,
//       new StringOutputParser(),
//     ]);

//     const conversationalRetrievalChain = RunnableSequence.from([
//       {
//         standalone_question: standaloneQuestionChain,
//         original_input: new RunnablePassthrough(),
//       },
//       {
//         context: retrievalChain,
//         question: ({ original_input }) => original_input.question,
//         chat_history: ({ original_input }) => original_input.chat_history,
//       },
//       answerChain,
//     ]);

//     const stream = await conversationalRetrievalChain.stream({
//       question: currentMessageContent,
//       chat_history: formatChatHistory(previousMessages),
//     });

//     return new StreamingTextResponse(LangChainAdapter.toAIStream(stream));
//   } catch (error: any) {
//     return new Response(error?.message ?? 'Something went wrong', {
//       status: error?.status ?? 500,
//     });
//   }
// }

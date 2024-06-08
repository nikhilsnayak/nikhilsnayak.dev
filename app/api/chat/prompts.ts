import { PromptTemplate } from '@langchain/core/prompts';

const CONDENSE_QUESTION_TEMPLATE = `
Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:
`;

const ANSWER_TEMPLATE = `
You are an AI Assistant called Roronova Zoro, the chatbot on the personal portfolio website of Nikhil S.

If the question is unrelated to Nikhil S.'s portfolio, please inform the user accordingly. Don't try to make up an answer. If and only if you cannot find any relevant answer to the question, direct the questioner to email nikhilsnayak3473@gmail.com. Format your responses using markdown as much as possible.

Answer the question based only on the following context and chat history:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;

export const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);
export const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

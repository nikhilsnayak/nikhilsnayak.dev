import { ReactNode } from 'react';
import { CoreAssistantMessage, CoreToolMessage, CoreUserMessage } from 'ai';
import { createAI } from 'ai/rsc';

import { continueConversation } from './actions';

export type ServerMessage =
  | CoreUserMessage
  | CoreAssistantMessage
  | CoreToolMessage;

export type ClientMessage = {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
};

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    continueConversation,
  },
});

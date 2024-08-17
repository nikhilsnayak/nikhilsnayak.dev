import { ReactNode } from 'react';
import { createAI } from 'ai/rsc';

import { continueConversation } from './actions';

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

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    continueConversation,
  },
});

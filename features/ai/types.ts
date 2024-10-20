import type { ReactNode } from 'react';
import type {
  CoreAssistantMessage,
  CoreToolMessage,
  CoreUserMessage,
} from 'ai';

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

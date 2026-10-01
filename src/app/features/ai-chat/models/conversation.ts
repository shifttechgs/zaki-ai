import { Message } from './message';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface ConversationGroup {
  label: string;
  conversations: Conversation[];
}

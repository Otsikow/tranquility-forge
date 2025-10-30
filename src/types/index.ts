export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'therapeutic' | 'general' | 'crisis' | 'celebration';
  suggestions?: string[];
}

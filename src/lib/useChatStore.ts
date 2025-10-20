import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  isError?: boolean;
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => ChatMessage;
  updateMessage: (id: string, content: string) => void;
  markError: (id: string) => void;
  clearMessages: () => void;
  getContextMessages: () => ChatMessage[];
}

const SYSTEM_PROMPT: ChatMessage = {
  id: 'system',
  role: 'system',
  content: `You are Peace, a warm and supportive mental wellness companion. Your role is to:

- Provide empathetic, non-judgmental support
- Encourage healthy coping strategies and self-reflection
- Suggest grounding techniques, breathing exercises, and CBT-style reframes
- Keep responses concise and conversational (2-3 sentences typically)
- Never diagnose, prescribe, or provide medical/legal advice
- Always remind users that you're not a substitute for professional mental health care
- If someone expresses crisis thoughts, gently encourage them to reach out to crisis resources

Be warm, authentic, and focus on helping users feel heard and supported.`,
  createdAt: new Date().toISOString(),
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      
      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          messages: [...state.messages, newMessage].slice(-20), // Keep last 20 messages
        }));
        
        return newMessage;
      },
      
      updateMessage: (id, content) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, content } : msg
          ),
        }));
      },
      
      markError: (id) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isError: true } : msg
          ),
        }));
      },
      
      clearMessages: () => set({ messages: [] }),
      
      getContextMessages: () => {
        const messages = get().messages;
        // Keep system prompt + last 10 messages for context
        const recentMessages = messages.slice(-10);
        return [SYSTEM_PROMPT, ...recentMessages];
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);

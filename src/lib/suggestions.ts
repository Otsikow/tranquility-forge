import { ChatMessage } from "@/types";

export function getDynamicSuggestions(messages: ChatMessage[]): string[] {
  const lastAssistantMessage = messages.slice().reverse().find(msg => msg.role === 'assistant');

  if (!lastAssistantMessage) {
    return [];
  }

  const content = lastAssistantMessage.content.toLowerCase();

  if (content.includes('breathing exercise')) {
    return ['Let\'s try the breathing exercise', 'I want to talk about what\'s worrying me', 'I need more coping strategies'];
  }

  if (content.includes('comfort today')) {
    return ['Nothing brought me comfort', 'I had a small moment of peace', 'I want to talk about my feelings', 'I need professional help'];
  }

  if (content.includes('explore your feelings')) {
    return ['I want to explore my feelings', 'Show me coping strategies', 'I just need someone to listen', 'I want to set a goal'];
  }

  return [
    "Tell me more about that",
    "How did that make you feel?",
    "Is there anything else on your mind?",
    "Let's explore that further",
  ];
}

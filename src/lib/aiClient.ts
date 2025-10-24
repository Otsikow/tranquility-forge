import { getOpenAIConfig } from './env';
import { ChatMessage } from './useChatStore';
import { THERAPEUTIC_SYSTEM_PROMPT } from './therapeuticPrompts';

export interface StreamOptions {
  signal?: AbortSignal;
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  options?: StreamOptions
): AsyncGenerator<string, void, unknown> {
  const config = getOpenAIConfig();
  
  // Prepend therapeutic system prompt
  const enhancedMessages = [
    { role: 'system', content: THERAPEUTIC_SYSTEM_PROMPT },
    ...messages
  ];
  
  const response = await fetch(config.baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      messages: enhancedMessages.map(({ role, content }) => ({ role, content })),
    }),
    signal: options?.signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI service error: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

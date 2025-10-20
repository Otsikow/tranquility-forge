export const getOpenAIConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  
  if (!url) {
    throw new Error('VITE_SUPABASE_URL is not configured');
  }

  return {
    baseURL: `${url}/functions/v1/chat-stream`,
    model: 'gpt-4o-mini',
  };
};

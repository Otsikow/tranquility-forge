import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio, mimeType } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log('Received audio data, length:', audio.length, 'mimeType:', mimeType);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Decode base64 audio
    const binaryString = atob(audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Determine file extension based on mime type
    let fileExtension = 'webm';
    if (mimeType) {
      if (mimeType.includes('mp4')) {
        fileExtension = 'mp4';
      } else if (mimeType.includes('wav')) {
        fileExtension = 'wav';
      } else if (mimeType.includes('ogg')) {
        fileExtension = 'ogg';
      } else if (mimeType.includes('webm')) {
        fileExtension = 'webm';
      }
    }

    // Create form data for OpenAI Whisper API
    const formData = new FormData();
    const blob = new Blob([bytes], { type: mimeType || 'audio/webm' });
    formData.append('file', blob, `audio.${fileExtension}`);
    formData.append('model', 'whisper-1');

    console.log('Sending to OpenAI Whisper API');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', response.status, error);
      
      // Provide more specific error messages
      if (response.status === 401) {
        throw new Error('OpenAI API key is invalid');
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded');
      } else if (response.status === 400) {
        throw new Error('Invalid audio format or file too large');
      } else {
        throw new Error(`OpenAI API error: ${response.status} - ${error}`);
      }
    }

    const result = await response.json();
    console.log('Transcription successful:', result.text);

    if (!result.text || result.text.trim().length === 0) {
      throw new Error('Empty transcription result');
    }

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

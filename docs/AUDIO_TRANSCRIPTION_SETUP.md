# Audio Transcription Setup Guide

## Overview

The audio input feature in the chat uses OpenAI's Whisper API through a Supabase Edge Function. This guide will help you configure it properly.

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- OpenAI API key (get one from https://platform.openai.com/api-keys)
- Supabase project access

## Setup Steps

### 1. Deploy the Edge Function

The edge function code exists at `/workspace/supabase/functions/transcribe-audio/index.ts`. To deploy it:

```bash
# Login to Supabase (if not already logged in)
supabase login

# Link your project
supabase link --project-ref bsjnbnsufdgkrbdqnecz

# Deploy the transcribe-audio function
supabase functions deploy transcribe-audio
```

### 2. Set the OpenAI API Key

The edge function requires an `OPENAI_API_KEY` environment variable. Set it using one of these methods:

#### Option A: Using Supabase CLI
```bash
supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
```

#### Option B: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Settings**
3. Add a new secret:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

### 3. Verify the Setup

After deployment, you can test the function:

```bash
# Test the function locally
supabase functions serve transcribe-audio

# Or test it remotely via the dashboard
# Go to Edge Functions → transcribe-audio → Invoke Function
```

## How It Works

1. **Recording**: When the user clicks the microphone button, the browser's MediaRecorder API captures audio in WebM format
2. **Encoding**: The audio is converted to base64 format
3. **Transcription**: The base64 audio is sent to the Supabase edge function
4. **Processing**: The edge function calls OpenAI's Whisper API
5. **Display**: The transcribed text is inserted into the chat input field

## Troubleshooting

### "Voice transcription service is not deployed"
- The edge function hasn't been deployed to Supabase
- Run: `supabase functions deploy transcribe-audio`

### "Voice transcription is not configured"
- The `OPENAI_API_KEY` is not set in Supabase secrets
- Run: `supabase secrets set OPENAI_API_KEY=your-key`

### "Microphone access denied"
- The user needs to grant microphone permissions in their browser
- Check browser settings and ensure HTTPS is being used (required for mic access)

### Audio quality issues
- Ensure the user is in a quiet environment
- Check microphone quality and settings
- The Whisper API works best with clear audio

## Alternative: Local Development

For local development without deploying:

```bash
# Create a .env file in supabase/functions/transcribe-audio/
echo "OPENAI_API_KEY=your-key-here" > supabase/functions/transcribe-audio/.env

# Start Supabase locally
supabase start

# Serve functions locally
supabase functions serve
```

## Cost Considerations

OpenAI's Whisper API pricing (as of 2024):
- $0.006 per minute of audio transcribed
- Example: 1 minute of voice input = $0.006

Monitor usage in your OpenAI dashboard to manage costs.

## Security Notes

- Never commit API keys to version control
- Use Supabase secrets for production
- The edge function validates that audio data is provided
- CORS is configured to only allow requests from your domain

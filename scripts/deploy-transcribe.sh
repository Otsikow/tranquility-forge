#!/bin/bash

# Deploy Audio Transcription Edge Function
# This script deploys the transcribe-audio edge function to Supabase

set -e  # Exit on error

echo "🎤 Audio Transcription Deployment Script"
echo "========================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo "   Install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if OpenAI API key is provided
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY environment variable is not set"
    echo ""
    read -p "Enter your OpenAI API key (or press Enter to skip): " api_key
    if [ -n "$api_key" ]; then
        export OPENAI_API_KEY="$api_key"
    fi
fi

# Deploy the edge function
echo "📦 Deploying transcribe-audio edge function..."
supabase functions deploy transcribe-audio

if [ $? -eq 0 ]; then
    echo "✅ Edge function deployed successfully"
else
    echo "❌ Failed to deploy edge function"
    exit 1
fi

# Set the OpenAI API key if provided
if [ -n "$OPENAI_API_KEY" ]; then
    echo ""
    echo "🔑 Setting OPENAI_API_KEY secret..."
    supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY"
    
    if [ $? -eq 0 ]; then
        echo "✅ API key configured successfully"
    else
        echo "❌ Failed to set API key"
        exit 1
    fi
else
    echo ""
    echo "⚠️  Skipped API key configuration"
    echo "   Run this command manually:"
    echo "   supabase secrets set OPENAI_API_KEY=your-key-here"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Test the audio input in the chat interface"
echo "2. Grant microphone permissions when prompted"
echo "3. Monitor usage in your OpenAI dashboard"
echo ""

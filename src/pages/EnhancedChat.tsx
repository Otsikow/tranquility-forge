import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  Heart, 
  Lightbulb,
  BookOpen,
  Wind,
  MessageCircle,
  Bot,
  User,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'therapeutic' | 'general' | 'crisis' | 'celebration';
  suggestions?: string[];
}

const therapeuticPrompts = [
  "I'm feeling anxious about work",
  "I had a difficult day today",
  "I'm struggling with motivation",
  "I feel overwhelmed by everything",
  "I want to work on my self-esteem",
  "I'm having trouble sleeping",
  "I feel lonely and isolated",
  "I'm dealing with relationship issues"
];

const moodCheckIns = [
  "How are you feeling right now?",
  "What's been on your mind today?",
  "Is there anything weighing heavily on you?",
  "What brought you joy today?",
  "What challenges are you facing?",
  "How has your mood been lately?"
];

export default function EnhancedChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'general' | 'therapeutic' | 'crisis'>('therapeutic');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Peace, your AI mental health companion. I'm here to listen, support, and help you navigate your thoughts and feelings. How are you doing today?",
      timestamp: new Date(),
      type: 'therapeutic',
      suggestions: moodCheckIns
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Simulate AI response with therapeutic capabilities
      const response = await generateTherapeuticResponse(input.trim(), chatMode);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        type: response.type,
        suggestions: response.suggestions
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000); // Simulate thinking time

    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
    }
  };

  const generateTherapeuticResponse = async (userInput: string, mode: string) => {
    // In a real app, this would call the AI service
    // For now, we'll simulate therapeutic responses
    
    const lowerInput = userInput.toLowerCase();
    
    // Crisis detection
    if (lowerInput.includes('hurt myself') || lowerInput.includes('suicide') || lowerInput.includes('end it all')) {
      return {
        content: "I'm really concerned about what you're sharing. Your safety is the most important thing right now. Please reach out to a crisis helpline immediately:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nYou don't have to go through this alone. There are people who want to help you right now.",
        type: 'crisis' as const,
        suggestions: ['I need immediate help', 'I want to talk to someone', 'I\'m feeling better now']
      };
    }

    // Anxiety responses
    if (lowerInput.includes('anxious') || lowerInput.includes('worried') || lowerInput.includes('nervous')) {
      return {
        content: "I can hear that you're feeling anxious, and that's completely valid. Anxiety can feel overwhelming, but there are ways to manage it. Let's try a breathing exercise together:\n\n1. Breathe in slowly for 4 counts\n2. Hold your breath for 4 counts\n3. Breathe out slowly for 6 counts\n4. Repeat 3-5 times\n\nWould you like to try this, or would you prefer to talk about what's making you feel anxious?",
        type: 'therapeutic' as const,
        suggestions: ['Let\'s try the breathing exercise', 'I want to talk about what\'s worrying me', 'I need more coping strategies']
      };
    }

    // Depression responses
    if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('hopeless')) {
      return {
        content: "I'm sorry you're feeling this way. Depression can make everything feel heavy and difficult. It's important to remember that these feelings are temporary, even when they don't feel that way.\n\nWhat's one small thing that brought you even a tiny bit of comfort today? Sometimes focusing on these small moments can help us see that not everything is dark.",
        type: 'therapeutic' as const,
        suggestions: ['Nothing brought me comfort', 'I had a small moment of peace', 'I want to talk about my feelings', 'I need professional help']
      };
    }

    // General supportive responses
    return {
      content: "Thank you for sharing that with me. It takes courage to open up about your feelings. I'm here to listen and support you.\n\nWhat would be most helpful for you right now? Would you like to explore your feelings more, try a coping strategy, or just have someone to talk to?",
      type: 'therapeutic' as const,
      suggestions: ['I want to explore my feelings', 'Show me coping strategies', 'I just need someone to listen', 'I want to set a goal']
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Peace AI</h1>
              <p className="text-sm text-muted-foreground">Your mental health companion</p>
            </div>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200">
            Online
          </Badge>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Chat Mode Selector */}
        <div className="px-6 py-4 border-b border-border">
          <Tabs value={chatMode} onValueChange={(value) => setChatMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="therapeutic" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Therapeutic
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="crisis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Crisis
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className={`space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <Card className={`${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card'
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <Card className="bg-card">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-6 py-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Start</h3>
            <div className="flex flex-wrap gap-2">
              {therapeuticPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              placeholder="Share what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              className="min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
                className={isRecording ? 'bg-red-100 text-red-600' : ''}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
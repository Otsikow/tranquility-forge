import { useState, useRef, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/chat/Message";
import { InputBar } from "@/components/chat/InputBar";
import { SafetySheet } from "@/components/chat/SafetySheet";
import { useChatStore } from "@/lib/useChatStore";
import { streamChatCompletion } from "@/lib/aiClient";
import { containsCrisisKeywords } from "@/lib/safety";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";

export default function Chat() {
  const { messages, addMessage, updateMessage, markError, getContextMessages } = useChatStore();
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show welcome message if no messages
    if (messages.length === 0) {
      addMessage({
        role: "assistant",
        content: "Hello, I'm Peace. How are you feeling today?",
      });
    }
  }, []);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleSubmit = async (text: string) => {
    // Check for crisis keywords
    if (containsCrisisKeywords(text)) {
      setShowCrisisBanner(true);
    }

    // Add user message
    addMessage({ role: "user", content: text });

    // Create assistant message placeholder
    const assistantMsg = addMessage({ role: "assistant", content: "" });
    
    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    try {
      const contextMessages = getContextMessages();
      let fullResponse = "";

      for await (const chunk of streamChatCompletion(contextMessages, {
        signal: abortControllerRef.current.signal,
      })) {
        fullResponse += chunk;
        updateMessage(assistantMsg.id, fullResponse);
      }

      setIsStreaming(false);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // User stopped the response
        toast({
          title: "Response stopped",
          description: "You can continue the conversation anytime.",
        });
      } else {
        console.error('Chat error:', error);
        markError(assistantMsg.id);
        toast({
          title: "Error",
          description: "Failed to get response. Please try again.",
          variant: "destructive",
        });
      }
      setIsStreaming(false);
    } finally {
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-card flex flex-col pb-20">
      <AppBar title="Peace" />

      {/* Crisis Banner */}
      {showCrisisBanner && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">
                If you're in crisis, please reach out for immediate support.
              </p>
              <Button
                variant="link"
                className="h-auto p-0 text-destructive underline"
                onClick={() => setShowSafety(true)}
              >
                View crisis resources
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.filter(m => m.role !== 'system').map((message) => (
          <Message
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={message.content}
            createdAt={message.createdAt}
            isError={message.isError}
          />
        ))}
        
        {isStreaming && (
          <div className="flex gap-3">
            <div className="bg-primary/10 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Safety Tips Button */}
      <div className="px-4 py-2 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSafety(true)}
          className="w-full"
        >
          <Shield className="h-4 w-4 mr-2" />
          Safety & Wellbeing Resources
        </Button>
      </div>

      {/* Input */}
      <InputBar
        disabled={isStreaming}
        onSubmit={handleSubmit}
        onStop={handleStop}
        isStreaming={isStreaming}
      />

      {/* Safety Sheet */}
      <SafetySheet open={showSafety} onOpenChange={setShowSafety} />

      <BottomNav />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Leaf, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello, I'm Peace. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand. Sometimes just acknowledging our feelings can be a big step. What's on your mind?",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-card flex flex-col pb-20">
      <AppBar title="Peace" />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fade-up ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className={message.role === "assistant" ? "bg-primary" : "bg-muted"}>
                {message.role === "assistant" ? <Leaf className="h-5 w-5 text-primary-foreground" /> : "Y"}
              </AvatarFallback>
            </Avatar>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-muted text-card-foreground"
                  : "bg-primary/10 text-card-foreground"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
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

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-border bg-card px-4 py-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-input border-border text-card-foreground"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
}

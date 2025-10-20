import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Square } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InputBarProps {
  disabled: boolean;
  onSubmit: (text: string) => void;
  onStop?: () => void;
  isStreaming: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function InputBar({ disabled, onSubmit, onStop, isStreaming }: InputBarProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const hasSpeechRecognition = typeof window !== 'undefined' && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!hasSpeechRecognition) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = "Could not process voice input. Please try again.";
      
      switch (event.error) {
        case 'network':
          errorMessage = "Network error. Voice input requires an internet connection. Please check your connection and try again.";
          break;
        case 'not-allowed':
        case 'permission-denied':
          errorMessage = "Microphone access denied. Please allow microphone permissions in your browser settings.";
          break;
        case 'no-speech':
          errorMessage = "No speech detected. Please try speaking again.";
          break;
        case 'audio-capture':
          errorMessage = "No microphone found. Please check your audio device.";
          break;
        case 'aborted':
          // User stopped - don't show error
          return;
      }
      
      toast({
        title: "Voice input error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [hasSpeechRecognition, toast]);

  const toggleVoiceInput = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        // Check microphone permissions first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Microphone access error:', err);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access in your browser settings to use voice input.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSubmit(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card px-4 py-3">
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind..."
          className="flex-1 min-h-[44px] max-h-[120px] resize-none"
          disabled={disabled}
          aria-label="Message input"
        />
        
        {hasSpeechRecognition && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={toggleVoiceInput}
            disabled={disabled}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            className={isListening ? "bg-primary text-primary-foreground" : ""}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}

        {isStreaming ? (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={onStop}
            aria-label="Stop response"
          >
            <Square className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !input.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </form>
  );
}

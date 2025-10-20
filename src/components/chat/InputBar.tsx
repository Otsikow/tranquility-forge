import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff, Square, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [speechError, setSpeechError] = useState<string | null>(null);
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
      setSpeechError(null);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Don't show toast for network errors - just update visual state
      if (event.error === 'network') {
        setSpeechError("offline");
        return;
      }
      
      let errorMessage = "Voice input failed. Please try typing instead.";
      
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          errorMessage = "Microphone access denied. Please allow permissions and try again.";
          setSpeechError("permission");
          break;
        case 'no-speech':
          // Don't show toast for no-speech, just reset
          return;
        case 'audio-capture':
          errorMessage = "No microphone found.";
          setSpeechError("no-mic");
          break;
        case 'aborted':
          // User stopped - don't show error
          return;
      }
      
      toast({
        title: "Voice input unavailable",
        description: errorMessage,
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
        setSpeechError(null);
      } catch (err) {
        console.error('Microphone access error:', err);
        setSpeechError("permission");
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice input.",
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

  const getMicIcon = () => {
    if (isListening) return <Mic className="h-5 w-5 animate-pulse" />;
    if (speechError === "offline") return <MicOff className="h-5 w-5" />;
    return <Mic className="h-5 w-5" />;
  };

  const getMicTooltip = () => {
    if (speechError === "offline") return "Voice input requires internet connection";
    if (speechError === "permission") return "Microphone access denied";
    if (speechError === "no-mic") return "No microphone detected";
    if (isListening) return "Stop recording";
    return "Start voice input (requires internet)";
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant={speechError === "offline" ? "secondary" : "outline"}
                  onClick={toggleVoiceInput}
                  disabled={disabled || speechError === "permission"}
                  aria-label={getMicTooltip()}
                  className={isListening ? "bg-primary text-primary-foreground" : ""}
                >
                  {getMicIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex items-center gap-1">
                  {speechError === "offline" && <AlertCircle className="h-3 w-3" />}
                  {getMicTooltip()}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      
      {speechError === "offline" && (
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Voice input requires an active internet connection. You can type your message instead.
        </p>
      )}
    </form>
  );
}

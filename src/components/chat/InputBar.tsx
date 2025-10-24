import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InputBarProps {
  disabled: boolean;
  onSubmit: (text: string) => void;
  onStop?: () => void;
  isStreaming: boolean;
}

export function InputBar({ disabled, onSubmit, onStop, isStreaming }: InputBarProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

    } catch (err) {
      console.error('Microphone access error:', err);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(audioBlob);
      const base64Audio = await base64Promise;

      console.log('Sending audio for transcription, size:', audioBlob.size);

      // Call edge function
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio },
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Provide more specific error messages
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          throw new Error('Voice transcription service is not deployed. Please contact support.');
        } else if (error.message?.includes('OPENAI_API_KEY')) {
          throw new Error('Voice transcription is not configured. Please contact support.');
        } else {
          throw new Error(error.message || 'Transcription service error');
        }
      }

      if (data?.text) {
        setInput(data.text);
        toast({
          title: "Transcription complete",
          description: "Your voice has been converted to text.",
        });
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No transcription received from service');
      }

    } catch (error) {
      console.error('Transcription error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Transcription failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
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
          disabled={disabled || isTranscribing}
          aria-label="Message input"
        />
        
        {/* Voice Input Button */}
        {isTranscribing ? (
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled
          >
            <Loader2 className="h-5 w-5 animate-spin" />
          </Button>
        ) : isRecording ? (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={stopRecording}
            aria-label="Stop recording"
          >
            <Square className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={startRecording}
            disabled={disabled}
            aria-label="Start voice input"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}

        {/* Send/Stop Button */}
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
            disabled={disabled || !input.trim() || isTranscribing}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {isRecording && (
        <p className="text-xs text-primary mt-2 flex items-center gap-1 animate-pulse">
          <Mic className="h-3 w-3" />
          Recording... Click the button again to stop
        </p>
      )}
      
      {isTranscribing && (
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Transcribing your voice...
        </p>
      )}
    </form>
  );
}

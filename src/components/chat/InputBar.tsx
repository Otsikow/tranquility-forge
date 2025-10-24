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
  const chosenMimeTypeRef = useRef<string>("");
  const { toast } = useToast();

  const getSupportedMimeType = (): string | null => {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
      return null;
    }
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/mpeg',
      'audio/wav',
    ];
    for (const type of candidates) {
      if ((MediaRecorder as any).isTypeSupported?.(type)) {
        return type;
      }
    }
    return '';
  };

  const startRecording = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        toast({
          title: "Recording not supported",
          description: "Your browser doesn't support microphone access.",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const supportedType = getSupportedMimeType();
      const options: MediaRecorderOptions = supportedType
        ? { mimeType: supportedType }
        : {};
      const mediaRecorder = new MediaRecorder(stream, options);

      // Keep track of actual mimeType chosen by the recorder
      chosenMimeTypeRef.current = mediaRecorder.mimeType || supportedType || '';

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = chosenMimeTypeRef.current || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) {
          toast({
            title: "No audio captured",
            description: "Please try recording again.",
            variant: "destructive",
          });
        } else {
          await transcribeAudio(audioBlob, mimeType);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

    } catch (err) {
      console.error('Microphone access error:', err);
      toast({
        title: "Microphone access error",
        description: err instanceof Error
          ? err.message
          : "Please allow access or try a different browser.",
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

  const transcribeAudio = async (audioBlob: Blob, mimeType: string) => {
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

      console.log('Sending audio for transcription, size:', audioBlob.size, 'type:', mimeType);

      // Call edge function
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio, mimeType },
      });

      if (error) {
        throw error;
      }

      if (data?.text) {
        setInput(data.text);
        toast({
          title: "Transcription complete",
          description: "Your voice has been converted to text.",
        });
      } else {
        throw new Error('No transcription received');
      }

    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: "Could not transcribe audio. Your browser format may be unsupported.",
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

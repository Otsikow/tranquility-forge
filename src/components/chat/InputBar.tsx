import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

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
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isAudioSupported, setIsAudioSupported] = useState(false);
  const [hasWebSpeechAPI, setHasWebSpeechAPI] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Check if audio recording is supported
  useEffect(() => {
    const checkAudioSupport = () => {
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasMediaRecorder = !!window.MediaRecorder;
      const hasWebSpeech = !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
      
      setIsAudioSupported(hasMediaDevices && hasMediaRecorder);
      setHasWebSpeechAPI(hasWebSpeech);
      
      // Initialize Web Speech API as fallback
      if (hasWebSpeech) {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
          toast({
            title: "Voice input complete",
            description: "Your voice has been converted to text.",
          });
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          toast({
            title: "Voice input failed",
            description: "Could not process your voice. Please try typing instead.",
            variant: "destructive",
          });
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    };
    
    checkAudioSupport();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check for supported MIME types
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          // Fallback to default
          mimeType = '';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const recordingDuration = Date.now() - recordingStartTimeRef.current;
        
        // Check if recording was too short
        if (recordingDuration < 500) { // Less than 0.5 seconds
          toast({
            title: "Recording too short",
            description: "Please record for at least half a second.",
            variant: "destructive",
          });
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast({
          title: "Recording error",
          description: "An error occurred while recording. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      recordingStartTimeRef.current = Date.now();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      recordingIntervalRef.current = setInterval(() => {
        const duration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setRecordingDuration(duration);
        
        // Auto-stop after 60 seconds
        if (duration >= 60) {
          stopRecording();
          toast({
            title: "Recording stopped",
            description: "Maximum recording duration reached (60 seconds).",
          });
        }
      }, 100);

    } catch (err) {
      console.error('Microphone access error:', err);
      let errorMessage = "Please allow microphone access to use voice input.";
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = "Microphone access was denied. Please allow microphone access in your browser settings.";
        } else if (err.name === 'NotFoundError') {
          errorMessage = "No microphone found. Please connect a microphone and try again.";
        } else if (err.name === 'NotSupportedError') {
          errorMessage = "Voice input is not supported in this browser.";
        } else if (err.message.includes('MediaRecorder')) {
          errorMessage = "Voice recording is not supported in this browser.";
        }
      }
      
      toast({
        title: "Microphone access denied",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      setIsRecording(false);
      setRecordingDuration(0);
      
      // Clear duration counter
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const startWebSpeechRecording = () => {
    if (recognitionRef.current && hasWebSpeechAPI) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast({
          title: "Voice input started",
          description: "Speak now...",
        });
      } catch (error) {
        console.error('Web Speech API error:', error);
        setIsRecording(false);
        toast({
          title: "Voice input failed",
          description: "Could not start voice recognition. Please try typing instead.",
          variant: "destructive",
        });
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Check if audio blob is valid
      if (audioBlob.size === 0) {
        throw new Error('No audio data recorded');
      }

      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result) {
            const base64 = result.split(',')[1];
            resolve(base64);
          } else {
            reject(new Error('Failed to read audio data'));
          }
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(new Error('Failed to read audio file'));
        };
      });
      
      reader.readAsDataURL(audioBlob);
      const base64Audio = await base64Promise;

      console.log('Sending audio for transcription, size:', audioBlob.size, 'type:', audioBlob.type);

      // Call edge function
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { 
          audio: base64Audio,
          mimeType: audioBlob.type || 'audio/webm'
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.text && data.text.trim()) {
        setInput(data.text.trim());
        toast({
          title: "Transcription complete",
          description: "Your voice has been converted to text.",
        });
      } else {
        throw new Error('No transcription received or empty result');
      }

    } catch (error) {
      console.error('Transcription error:', error);
      
      // Try Web Speech API as fallback
      if (hasWebSpeechAPI && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          toast({
            title: "Using fallback transcription",
            description: "Trying alternative voice recognition...",
          });
          return; // Don't show error yet, let Web Speech API try
        } catch (fallbackError) {
          console.error('Web Speech API fallback failed:', fallbackError);
        }
      }
      
      let errorMessage = "Could not transcribe audio. Please try typing instead.";
      
      if (error instanceof Error) {
        if (error.message.includes('No audio data')) {
          errorMessage = "No audio was recorded. Please try speaking louder or closer to the microphone.";
        } else if (error.message.includes('transcribe')) {
          errorMessage = "Transcription service is currently unavailable. Please try typing instead.";
        }
      }
      
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
        {!isAudioSupported && !hasWebSpeechAPI ? (
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled
            title="Voice input not supported in this browser"
          >
            <Mic className="h-5 w-5 opacity-50" />
          </Button>
        ) : isTranscribing ? (
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
            onClick={isAudioSupported ? startRecording : startWebSpeechRecording}
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
          Recording... {recordingDuration}s - Click the button again to stop
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

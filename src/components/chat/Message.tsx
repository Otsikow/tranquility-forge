import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Leaf } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  isError?: boolean;
}

export function Message({ role, content, createdAt, isError }: MessageProps) {
  const isAssistant = role === "assistant";
  
  return (
    <div
      className={`flex gap-3 animate-fade-up ${
        isAssistant ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarFallback className={isAssistant ? "bg-primary" : "bg-muted"}>
          {isAssistant ? (
            <Leaf className="h-5 w-5 text-primary-foreground" />
          ) : (
            "Y"
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-1 max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAssistant
              ? "bg-primary/10 text-card-foreground"
              : "bg-muted text-card-foreground"
          } ${isError ? "border border-destructive" : ""}`}
        >
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        
        <span className={`text-xs text-muted-foreground px-2 ${isAssistant ? "text-left" : "text-right"}`}>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

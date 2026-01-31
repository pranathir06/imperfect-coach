import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DailyVibeInputProps {
  userName?: string;
  onSubmit?: (message: string) => void;
}

const DailyVibeInput = ({ userName = "friend", onSubmit }: DailyVibeInputProps) => {
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;
    
    setIsThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      setAiResponse(
        `I hear you — late nights happen when you're chasing something meaningful. Let's adjust: skip the intense morning workout, try a gentle 20-min walk instead. Your body needs recovery, not punishment. You've got this! 💜`
      );
      setIsThinking(false);
      onSubmit?.(message);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/80 to-lavender-soft flex items-center justify-center shrink-0 glow-indigo">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        
        <div className="flex-1 space-y-4">
          <p className="font-display text-lg font-semibold text-foreground">
            Hey {userName}, how's the heart today? What are we aiming for?
          </p>
          
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Late night coding, need to wake up at 8 AM but I'm tired..."
              className="min-h-[80px] rounded-2xl border-border/50 bg-muted/30 resize-none pr-14 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
            />
            <Button
              onClick={handleSubmit}
              disabled={!message.trim() || isThinking}
              size="icon"
              className="absolute bottom-3 right-3 rounded-xl bg-primary hover:bg-primary/90 shadow-glow-indigo transition-all hover:scale-105 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* AI Response */}
          {(aiResponse || isThinking) && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-soft/30 to-accent/20 border border-accent/30 animate-fade-in">
              {isThinking ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-sm">Thinking with compassion...</span>
                </div>
              ) : (
                <p className="text-foreground/90 leading-relaxed">{aiResponse}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyVibeInput;

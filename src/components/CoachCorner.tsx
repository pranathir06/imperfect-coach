import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Heart, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CoachCorner = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { dailyFeeling, userPreferences } = useUser();

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }));

      const res = await fetch("http://localhost:8000/agent/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          conversation_history: conversationHistory, // Send full conversation history
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      if (data.reply) {
        const coachMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, coachMessage]);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm having trouble right now. ${errorMessage}. Please try again.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePlayAudio = async (messageId: string, text: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // If clicking the same message, just stop it
    if (playingMessageId === messageId) {
      setPlayingMessageId(null);
      return;
    }

    setTtsLoadingId(messageId);
    setPlayingMessageId(messageId);

    try {
      // Call TTS endpoint
      const res = await fetch("http://localhost:8000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to generate audio" }));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      // Get audio blob
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create audio element and play
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingMessageId(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setPlayingMessageId(null);
        setTtsLoadingId(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error("Error playing audio:", err);
      setPlayingMessageId(null);
      // Show error to user (optional - you could add a toast notification here)
    } finally {
      setTtsLoadingId(null);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-rose-soft flex items-center justify-center shrink-0 glow-rose animate-pulse-soft">
          <MessageCircle className="w-7 h-7 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">
            Chat with Your Coach
          </h3>
          <p className="text-sm text-muted-foreground">
            Have a conversation with your compassionate AI coach
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto mb-4 p-4 rounded-2xl bg-muted/30 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Heart className="w-12 h-12 text-primary/40 mb-3" />
            <p className="text-muted-foreground text-sm">
              Start a conversation with your coach
            </p>
            <p className="text-muted-foreground/60 text-xs mt-2">
              Share your thoughts, ask for guidance, or just chat
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"} items-start gap-2`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-gradient-to-br from-lavender-soft/30 to-indigo-soft/20 border border-primary/20"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-xs ${
                      message.isUser
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {!message.isUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlayAudio(message.id, message.text)}
                      disabled={ttsLoadingId === message.id}
                      className={`h-7 w-7 p-0 rounded-lg ${
                        playingMessageId === message.id
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {ttsLoadingId === message.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Volume2 className={`w-3.5 h-3.5 ${playingMessageId === message.id ? "text-primary" : ""}`} />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-lavender-soft/30 to-indigo-soft/20 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm text-muted-foreground">Coach is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="min-h-[80px] rounded-2xl border-border/50 bg-muted/30 resize-none pr-14 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
        />
        <Button
          onClick={handleSend}
          disabled={!inputMessage.trim() || isLoading}
          size="icon"
          className="absolute bottom-3 right-3 rounded-xl bg-primary hover:bg-primary/90 shadow-glow-indigo transition-all hover:scale-105 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CoachCorner;

import { useState } from "react";
import { Play, Pause, Volume2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CoachCorner = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!hasPlayed) {
      setHasPlayed(true);
    }
  };

  // Simulated waveform bars
  const waveformBars = Array.from({ length: 40 }, (_, i) => ({
    height: Math.random() * 60 + 20,
    delay: i * 0.02,
  }));

  return (
    <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-rose-soft flex items-center justify-center shrink-0 glow-rose animate-pulse-soft">
          <Heart className="w-7 h-7 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">
            Coach's Corner
          </h3>
          <p className="text-sm text-muted-foreground">
            Your daily dose of compassion & guidance
          </p>
        </div>
      </div>

      {/* Waveform Visualizer */}
      <div className="relative h-20 mb-6 flex items-center justify-center gap-[2px] overflow-hidden rounded-2xl bg-muted/30 px-4">
        {waveformBars.map((bar, i) => (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full transition-all duration-150",
              isPlaying 
                ? "bg-gradient-to-t from-primary to-secondary" 
                : "bg-muted-foreground/30"
            )}
            style={{
              height: isPlaying ? `${bar.height}%` : "20%",
              transitionDelay: isPlaying ? `${bar.delay}s` : "0s",
              animation: isPlaying ? `pulse 0.8s ease-in-out ${bar.delay}s infinite alternate` : "none",
            }}
          />
        ))}
        
        {!hasPlayed && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
            <span className="text-sm text-muted-foreground font-medium">
              Press play to hear from your coach
            </span>
          </div>
        )}
      </div>

      {/* Play Button & Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handlePlay}
          size="lg"
          className={cn(
            "w-16 h-16 rounded-2xl transition-all hover:scale-105",
            isPlaying 
              ? "bg-secondary hover:bg-secondary/90 shadow-glow-rose" 
              : "bg-primary hover:bg-primary/90 shadow-glow-indigo"
          )}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </Button>

        <div className="flex-1">
          <p className="font-medium text-foreground mb-1">
            {isPlaying ? "Playing..." : "Listen to your Coach"}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            "I see you stayed up late to fix that RAG system. I'm proud of the effort, but let's swap the morning gym for a 20-minute walk..."
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-xl hover:bg-muted"
        >
          <Volume2 className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Transcript (shown after playing) */}
      {hasPlayed && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-lavender-soft/30 to-indigo-soft/20 border border-primary/20 animate-fade-in">
          <p className="text-sm text-foreground/90 leading-relaxed italic">
            "I see you stayed up late to fix that RAG system. I'm proud of the effort, but let's swap the morning gym for a 20-minute walk so you can recover. You've got this. Remember — progress isn't about perfection, it's about showing up with kindness for yourself."
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachCorner;

import { useState } from "react";
import { Moon, Salad, Music, Heart, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type CardType = "sleep" | "fuel" | "passion";

interface GoalCardProps {
  type: CardType;
  className?: string;
  style?: React.CSSProperties;
}

const cardConfig = {
  sleep: {
    icon: Moon,
    title: "Sleep",
    emoji: "🌙",
    gradient: "card-sleep",
  },
  fuel: {
    icon: Salad,
    title: "Fuel",
    emoji: "🥗",
    gradient: "card-fuel",
  },
  passion: {
    icon: Music,
    title: "Passion",
    emoji: "💃",
    gradient: "card-passion",
  },
};

const SleepCard = () => {
  const [missed, setMissed] = useState(true);
  const targetTime = "11 PM – 7 AM";
  const actualTime = "1:30 AM – 9 AM";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Target: {targetTime}</span>
      </div>
      
      {missed ? (
        <>
          <div className="p-3 rounded-xl bg-rose-soft/30 border border-secondary/30">
            <p className="text-sm text-secondary-foreground/80">
              Last night: {actualTime}
            </p>
          </div>
          <Button
            onClick={() => setMissed(false)}
            variant="ghost"
            className="w-full rounded-xl bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground font-medium transition-all hover:scale-[1.02]"
          >
            <Heart className="w-4 h-4 mr-2" />
            Forgive & Pivot
          </Button>
        </>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-soft/40 border border-accent/40 flex items-center gap-3 animate-scale-in">
          <Check className="w-5 h-5 text-accent-foreground" />
          <span className="text-sm font-medium text-accent-foreground">
            Forgiven! Let's do better tonight 💜
          </span>
        </div>
      )}
    </div>
  );
};

const FuelCard = () => {
  const [healthyChoices, setHealthyChoices] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        No judgment, just awareness
      </p>
      
      <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
            healthyChoices ? "bg-emerald-soft" : "bg-muted"
          )}>
            {healthyChoices ? (
              <Check className="w-5 h-5 text-accent-foreground" />
            ) : (
              <Salad className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <span className="font-medium text-foreground">
            Healthy choices made
          </span>
        </div>
        <Switch 
          checked={healthyChoices} 
          onCheckedChange={setHealthyChoices}
          className="data-[state=checked]:bg-accent"
        />
      </div>

      {healthyChoices && (
        <p className="text-sm text-accent-foreground animate-fade-in">
          Amazing! Your body thanks you 🌿
        </p>
      )}
    </div>
  );
};

const PassionCard = () => {
  const [minutes, setMinutes] = useState(45);
  const activities = ["Dancing", "Singing", "Coding"];
  const [activeActivity, setActiveActivity] = useState("Coding");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {activities.map((activity) => (
          <button
            key={activity}
            onClick={() => setActiveActivity(activity)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              activeActivity === activity
                ? "bg-secondary text-secondary-foreground shadow-glow-rose"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {activity}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Time invested today</span>
          <span className="font-display text-2xl font-bold text-foreground">
            {minutes} <span className="text-base font-normal text-muted-foreground">min</span>
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-secondary to-rose-soft rounded-full transition-all duration-500"
            style={{ width: `${Math.min((minutes / 60) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">Goal: 60 min / day</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMinutes((m) => Math.max(0, m - 15))}
          className="flex-1 rounded-xl bg-muted hover:bg-muted/80"
        >
          -15 min
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMinutes((m) => m + 15)}
          className="flex-1 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground"
        >
          +15 min
        </Button>
      </div>
    </div>
  );
};

const GoalCard = ({ type, className, style }: GoalCardProps) => {
  const config = cardConfig[type];
  const Icon = config.icon;

  const renderContent = () => {
    switch (type) {
      case "sleep":
        return <SleepCard />;
      case "fuel":
        return <FuelCard />;
      case "passion":
        return <PassionCard />;
    }
  };

  return (
    <div 
      className={cn(
        "rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg",
        config.gradient,
        className
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-card/60 backdrop-blur-sm flex items-center justify-center">
          <span className="text-2xl">{config.emoji}</span>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {config.title}
        </h3>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default GoalCard;

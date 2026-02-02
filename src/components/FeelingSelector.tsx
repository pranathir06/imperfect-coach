import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

interface FeelingOption {
  feeling: string;
  emoji: string;
}

const feelingOptions: FeelingOption[] = [
  { feeling: "Determined", emoji: "💪" },
  { feeling: "Inspired", emoji: "✨" },
  { feeling: "Calm", emoji: "🧘" },
  { feeling: "Grateful", emoji: "🙏" },
  { feeling: "Energetic", emoji: "⚡" },
  { feeling: "Focused", emoji: "🎯" },
  { feeling: "Hopeful", emoji: "🌱" },
  { feeling: "Peaceful", emoji: "☮️" },
  { feeling: "Tired", emoji: "😴" },
  { feeling: "Stressed", emoji: "😰" },
  { feeling: "Anxious", emoji: "😟" },
  { feeling: "Overwhelmed", emoji: "😵" },
  { feeling: "Content", emoji: "😊" },
  { feeling: "Motivated", emoji: "🚀" },
  { feeling: "Reflective", emoji: "🤔" },
  { feeling: "Excited", emoji: "🎉" },
];

interface FeelingSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeelingSelector = ({ open, onOpenChange }: FeelingSelectorProps) => {
  const { dailyFeeling, setDailyFeeling } = useUser();
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingOption | null>(
    dailyFeeling
      ? feelingOptions.find((f) => f.feeling === dailyFeeling.feeling) || null
      : null
  );

  const handleSelect = (feeling: FeelingOption) => {
    setSelectedFeeling(feeling);
  };

  const handleSave = () => {
    if (selectedFeeling) {
      setDailyFeeling(selectedFeeling.feeling, selectedFeeling.emoji);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            How are you feeling today?
          </DialogTitle>
          <DialogDescription>
            Select how you're feeling right now. You can update this anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-3 py-4">
          {feelingOptions.map((option) => (
            <button
              key={option.feeling}
              onClick={() => handleSelect(option)}
              className={`
                p-4 rounded-xl transition-all hover:scale-105
                ${
                  selectedFeeling?.feeling === option.feeling
                    ? "bg-primary text-primary-foreground shadow-glow-indigo"
                    : "bg-muted hover:bg-muted/80"
                }
              `}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-medium">{option.feeling}</div>
            </button>
          ))}
        </div>
        <Button
          onClick={handleSave}
          disabled={!selectedFeeling}
          className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-glow-indigo h-12 text-lg"
        >
          Save Feeling
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FeelingSelector;

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationProps {
  userName?: string;
  vibeStatus?: string;
  avatarUrl?: string;
}

const Navigation = ({ 
  userName = "You", 
  vibeStatus = "Feeling: Inspired ✨",
  avatarUrl 
}: NavigationProps) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 animate-fade-in">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-soft glow-indigo">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-soft rounded-full animate-glow" />
        </div>
        <span className="font-display text-xl font-bold text-foreground tracking-tight">
          Imperfect Coach
        </span>
      </div>

      {/* Profile & Vibe Status */}
      <div className="flex items-center gap-4">
        <Badge 
          variant="secondary" 
          className="px-4 py-2 rounded-full font-medium text-sm bg-rose-soft/50 text-secondary-foreground border-0 hover:bg-rose-soft/70 transition-colors"
        >
          {vibeStatus}
        </Badge>
        <Avatar className="w-10 h-10 ring-2 ring-primary/30 ring-offset-2 ring-offset-background transition-transform hover:scale-105">
          <AvatarImage src={avatarUrl} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-indigo-soft to-lavender-soft font-display font-semibold text-foreground">
            {userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navigation;

import { Sparkles, LogOut, User, Clock, Settings, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FeelingSelector from "./FeelingSelector";

interface NavigationProps {
  userName?: string;
  vibeStatus?: string;
  avatarUrl?: string;
}

const Navigation = ({ 
  userName = "You", 
  vibeStatus,
  avatarUrl 
}: NavigationProps) => {
  const { logout, dailyFeeling } = useUser();
  const navigate = useNavigate();
  const [feelingDialogOpen, setFeelingDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleChatClick = () => {
    const chatSection = document.getElementById("coach-corner");
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Get the current feeling or use default
  const currentFeeling = dailyFeeling
    ? `Feeling: ${dailyFeeling.feeling} ${dailyFeeling.emoji || ""}`
    : vibeStatus || "Feeling: Tap to set ✨";
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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleChatClick}
          className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Chat"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
        <Badge 
          variant="secondary" 
          onClick={() => setFeelingDialogOpen(true)}
          className="px-4 py-2 rounded-full font-medium text-sm bg-rose-soft/50 text-secondary-foreground border-0 hover:bg-rose-soft/70 transition-colors cursor-pointer"
        >
          {currentFeeling}
        </Badge>
        <FeelingSelector
          open={feelingDialogOpen}
          onOpenChange={setFeelingDialogOpen}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar className="w-10 h-10 ring-2 ring-primary/30 ring-offset-2 ring-offset-background transition-transform hover:scale-105 cursor-pointer">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-soft to-lavender-soft font-display font-semibold text-foreground">
                  {userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel className="font-display">
              {userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/account")}
              className="cursor-pointer rounded-lg"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Account Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/routine")}
              className="cursor-pointer rounded-lg"
            >
              <Clock className="mr-2 h-4 w-4" />
              <span>Routine</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/preferences")}
              className="cursor-pointer rounded-lg"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive rounded-lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navigation;

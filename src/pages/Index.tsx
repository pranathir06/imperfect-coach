import Navigation from "@/components/Navigation";
import DailyVibeInput from "@/components/DailyVibeInput";
import GoalCard from "@/components/GoalCard";
import CoachCorner from "@/components/CoachCorner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-soft/20 via-background to-rose-soft/20 pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        {/* Navigation */}
        <Navigation userName="Alex" vibeStatus="Feeling: Determined 💪" />

        {/* Main Content */}
        <main className="space-y-8 mt-6">
          {/* Daily Vibe Input */}
          <DailyVibeInput userName="Alex" />

          {/* Goal Grid */}
          <section>
            <h2 className="font-display text-2xl font-bold text-foreground mb-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Your Focus Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <GoalCard type="sleep" className="animate-slide-up" style={{ animationDelay: "0.15s" } as React.CSSProperties} />
              <GoalCard type="fuel" className="animate-slide-up" style={{ animationDelay: "0.2s" } as React.CSSProperties} />
              <GoalCard type="passion" className="animate-slide-up" style={{ animationDelay: "0.25s" } as React.CSSProperties} />
            </div>
          </section>

          {/* Coach's Corner */}
          <section>
            <CoachCorner />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;

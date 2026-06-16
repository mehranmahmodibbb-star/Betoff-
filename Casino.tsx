import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";

interface Game {
  id: string;
  name: string;
  category: string;
  icon: string;
  rtp: number;
}

const CASINO_GAMES: Game[] = [
  { id: "1", name: "Blackjack", category: "Card Games", icon: "♠️", rtp: 99.5 },
  { id: "2", name: "Roulette", category: "Table Games", icon: "🎡", rtp: 97.3 },
  { id: "3", name: "Slots - Gold Rush", category: "Slots", icon: "🎰", rtp: 96.5 },
  { id: "4", name: "Poker", category: "Card Games", icon: "♥️", rtp: 98.0 },
  { id: "5", name: "Baccarat", category: "Table Games", icon: "🎴", rtp: 98.6 },
  { id: "6", name: "Slots - Lucky 7", category: "Slots", icon: "7️⃣", rtp: 95.8 },
  { id: "7", name: "Craps", category: "Table Games", icon: "🎲", rtp: 98.6 },
  { id: "8", name: "Video Poker", category: "Card Games", icon: "🎰", rtp: 99.5 },
  { id: "9", name: "Keno", category: "Number Games", icon: "🔢", rtp: 95.0 },
];

export default function CasinoPage() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();

  const categories = Array.from(new Set(CASINO_GAMES.map((g) => g.category)));

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-accent hover:text-accent/80"
        >
          <ArrowLeft size={20} />
          {t("common.back", language)}
        </button>

        <h1 className="text-3xl font-bold mb-8">{t("nav.casino", language)}</h1>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CASINO_GAMES.filter((g) => g.category === category).map((game) => (
                <div
                  key={game.id}
                  className="bg-card border border-border rounded-lg p-4 hover:border-accent transition-colors"
                >
                  <div className="text-4xl mb-3 text-center">{game.icon}</div>
                  <h3 className="font-bold text-center mb-2">{game.name}</h3>
                  <p className="text-xs text-muted-foreground text-center mb-3">RTP: {game.rtp}%</p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                    <Play size={14} className="mr-1" />
                    Play
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

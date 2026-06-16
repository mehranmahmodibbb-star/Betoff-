import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Clock } from "lucide-react";
import { useBetting } from "@/contexts/BettingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { t } from "@/locales/translations";
import { trpc } from "@/lib/trpc";
import { DateFilteredEvents } from "@/components/DateFilteredEvents";

export default function PreGameBetting() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const { addBet, getBetCount } = useBetting();

  // Fetch pre-game events from API
  const { data: events = [], isLoading } = trpc.sports.getPreGameEvents.useQuery();

  const handleAddBet = (event: any, selection: "home" | "away" | "draw") => {
    const odds =
      selection === "home"
        ? event.odds?.home || event.homeOdds || 1.5
        : selection === "away"
          ? event.odds?.away || event.awayOdds || 2.0
          : event.odds?.draw || event.drawOdds || 3.5;
    
    const selectionName = selection === "home" ? event.homeTeam : selection === "away" ? event.awayTeam : "Draw";
    addBet({
      id: `${event.id}-${selection}-${Date.now()}`,
      eventId: event.id,
      eventName: `${event.homeTeam} vs ${event.awayTeam}`,
      selection: selectionName,
      odds,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-blue-900 border-b border-blue-800 sticky top-0 z-30">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              {t("common.back", language)}
            </button>
            <div className="flex items-center gap-2 text-white">
              <Clock size={20} className="text-yellow-400" />
              <span className="font-bold">{t("betting.preGame", language) || "Pre-Game Betting"}</span>
            </div>
            <div className="text-white font-semibold">
              {getBetCount()} {getBetCount() === 1 ? "شرط" : "شرط"}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {isLoading && events.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-accent mr-2" size={24} />
            <span>{t("common.loading", language) || "Loading..."}</span>
          </div>
        ) : (
          <DateFilteredEvents
            events={events}
            showTodayOnly={false}
            filterByStatus="scheduled"
            onBetClick={handleAddBet}
          />
        )}
      </div>
    </div>
  );
}

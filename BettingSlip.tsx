import { useBetting } from "@/contexts/BettingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";
import { Button } from "@/components/ui/button";
import { Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function BettingSlip() {
  const { betSlip, removeBet, getBetCount, betType, setBetType, calculateWinnings, getTotalOdds } = useBetting();
  const { language, isRTL } = useLanguage();
  const [amount, setAmount] = useState<number>(10);
  const [isOpen, setIsOpen] = useState(false);

  if (getBetCount() === 0) {
    return null;
  }

  const potentialWinnings = calculateWinnings(amount);
  const totalOdds = getTotalOdds();

  const getBetTypeLabel = () => {
    if (betType === "single") return "تکی";
    if (betType === "parlay") return "میکس";
    return "سیستمی";
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-4 shadow-lg z-40 flex items-center gap-2"
      >
        <ShoppingCart size={20} />
        <span className="bg-destructive text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {getBetCount()}
        </span>
      </button>

      {/* Betting Slip Panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 w-96 bg-card border border-border rounded-lg p-4 shadow-xl z-50 max-h-96 overflow-y-auto"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{t("betting.betSlip", language)}</h2>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>

          {/* Bet Type Selector */}
          <div className="mb-4 pb-4 border-b border-border">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">نوع شرط‌بندی:</p>
            <div className="grid grid-cols-3 gap-2">
              {(["single", "parlay", "system"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setBetType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    betType === type
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary border border-border hover:border-accent"
                  }`}
                >
                  {type === "single" ? "تکی" : type === "parlay" ? "میکس" : "سیستمی"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {betType === "single" && "فقط یک انتخاب شمارش می‌شود"}
              {betType === "parlay" && "همه انتخاب‌ها باید برنده شوند"}
              {betType === "system" && "ترکیب‌های مختلف محاسبه می‌شوند"}
            </p>
          </div>

          {/* Selections */}
          <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
            {betSlip.map((bet, idx) => (
              <div key={bet.id} className="bg-secondary p-2 rounded-lg flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-xs">{bet.eventName}</p>
                  <p className="text-xs text-accent">{bet.selection}</p>
                  <p className="text-xs text-muted-foreground">{bet.odds}</p>
                </div>
                <button
                  onClick={() => removeBet(bet.id)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Bet Amount */}
          <div className="mb-3 pb-3 border-b border-border">
            <label className="block text-xs font-semibold mb-1">مبلغ شرط:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full bg-secondary border border-border rounded-lg px-2 py-1 text-foreground text-sm focus:outline-none focus:border-accent"
              min="1"
              step="1"
            />
          </div>

          {/* Odds and Winnings */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ضریب کل:</span>
              <span className="font-bold text-accent">{totalOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">برنده احتمالی:</span>
              <span className="font-bold text-green-400">{potentialWinnings.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            ثبت شرط
          </Button>
        </div>
      )}
    </>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { useBetting } from "@/contexts/BettingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { BetSelection } from "@/contexts/BettingContext";

function PlaceBetButton({
  betType,
  stake,
  potentialWinnings,
  betSlip,
  user,
  onSuccess,
}: {
  betType: "single" | "parlay" | "system";
  stake: number;
  potentialWinnings: number;
  betSlip: BetSelection[];
  user: any;
  onSuccess: () => void;
}) {
  const [, navigate] = useLocation();
  const placeBetMutation = trpc.betting.placeBet.useMutation();

  const handlePlaceBet = async () => {
    if (!user) {
      toast.error("لطفا ابتدا وارد شوید");
      return;
    }

    if (betSlip.length === 0) {
      toast.error("لطفا حداقل یک انتخاب کنید");
      return;
    }

    if (stake <= 0) {
      toast.error("لطفا مبلغ شرط را وارد کنید");
      return;
    }

    try {
      await placeBetMutation.mutateAsync({
        betType,
        stake: stake.toString(),
        currency: "USDT",
        potentialWinnings: potentialWinnings.toString(),
        selections: betSlip.map((bet) => ({
          eventId: parseInt(bet.eventId),
          oddId: 0,
          marketType: "1X2",
          selection: bet.selection,
          oddValue: bet.odds.toString(),
        })),
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "خطا در ثبت شرط");
    }
  };

  return (
    <Button
      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg font-bold"
      onClick={handlePlaceBet}
      disabled={placeBetMutation.isPending}
    >
      {placeBetMutation.isPending ? "در حال ثبت..." : "ثبت شرط"}
    </Button>
  );
}

export default function BettingSlipPage() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const { betSlip, removeBet, getBetCount, betType, setBetType, calculateWinnings, getTotalOdds } = useBetting();
  const [amount, setAmount] = useState<number>(10);

  if (getBetCount() === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container py-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 text-accent hover:text-accent/80 transition-colors justify-center mx-auto"
          >
            <ArrowLeft size={20} />
            {t("common.back", language)}
          </button>
          <ShoppingCart size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">{t("betting.betSlip", language) || "Betting Slip"}</h1>
          <p className="text-muted-foreground mb-8">برگه شرطبندی خالی است. برای شروع، شرط‌های خود را اضافه کنید.</p>
          <Button onClick={() => navigate("/live")} className="bg-accent hover:bg-accent/90">
            برو به شرط‌بندی زنده
          </Button>
        </div>
      </div>
    );
  }

  const potentialWinnings = calculateWinnings(amount);
  const totalOdds = getTotalOdds();

  return (
    <div className="min-h-screen bg-background text-foreground pb-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-accent hover:text-accent/80 transition-colors"
        >
          <ArrowLeft size={20} />
          {t("common.back", language)}
        </button>

        <h1 className="text-4xl font-bold mb-8">{t("betting.betSlip", language) || "Betting Slip"}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selections List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">انتخاب‌های شما ({getBetCount()})</h2>

              <div className="space-y-4">
                {betSlip.map((bet, idx) => (
                  <div key={bet.id} className="bg-secondary border border-border rounded-lg p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{bet.eventName}</p>
                      <p className="text-accent font-semibold">{bet.selection}</p>
                      <p className="text-sm text-muted-foreground mt-2">ضریب: {bet.odds}</p>
                    </div>
                    <button
                      onClick={() => removeBet(bet.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors ml-4"
                      title="حذف"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bet Type Selector */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">نوع شرط‌بندی</h2>
              <div className="grid grid-cols-3 gap-3">
                {(["single", "parlay", "system"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBetType(type)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      betType === type
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary border border-border hover:border-accent"
                    }`}
                  >
                    {type === "single" ? "تکی" : type === "parlay" ? "میکس" : "سیستمی"}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {betType === "single" && "فقط یک انتخاب شمارش می‌شود"}
                {betType === "parlay" && "همه انتخاب‌ها باید برنده شوند، ضرایب ضرب می‌شوند"}
                {betType === "system" && "ترکیب‌های مختلف محاسبه می‌شوند"}
              </p>
            </div>
          </div>

          {/* Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-8 space-y-6">
              <h2 className="text-2xl font-bold">خلاصه</h2>

              {/* Bet Amount */}
              <div>
                <label className="block text-sm font-semibold mb-2">مبلغ شرط:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-lg focus:outline-none focus:border-accent"
                  min="1"
                  step="1"
                />
              </div>

              {/* Statistics */}
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">تعداد انتخاب:</span>
                  <span className="font-bold text-lg">{getBetCount()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">نوع شرط:</span>
                  <span className="font-bold text-lg">{betType === "single" ? "تکی" : betType === "parlay" ? "میکس" : "سیستمی"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ضریب کل:</span>
                  <span className="font-bold text-lg text-accent">{totalOdds.toFixed(2)}</span>
                </div>
              </div>

              {/* Winnings */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">شرط:</span>
                  <span className="font-bold text-lg">{amount}</span>
                </div>
                <div className="flex justify-between items-center bg-green-500/20 p-3 rounded-lg border border-green-500/50">
                  <span className="text-green-400 font-semibold">برنده احتمالی:</span>
                  <span className="font-bold text-lg text-green-400">{potentialWinnings.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Bet Button */}
              <PlaceBetButton
                betType={betType}
                stake={amount}
                potentialWinnings={potentialWinnings}
                betSlip={betSlip}
                user={user}
                onSuccess={() => {
                  toast.success("شرط با موفقیت ثبت شد!");
                  setTimeout(() => navigate("/"), 1500);
                }}
              />

              {/* Back to Betting */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/live")}
              >
                بازگشت به شرط‌بندی
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

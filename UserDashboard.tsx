import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ArrowLeft, Wallet, History, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";

export default function UserDashboard() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();

  if (!user) {
    navigate("/");
    return null;
  }

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

        <h1 className="text-3xl font-bold mb-8">{t("nav.dashboard", language)}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="text-accent" size={24} />
              <h3 className="text-lg font-semibold">{t("wallet.balance", language)}</h3>
            </div>
            <p className="text-2xl font-bold text-accent">$0.00</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <History className="text-accent" size={24} />
              <h3 className="text-lg font-semibold">Total Bets</h3>
            </div>
            <p className="text-2xl font-bold">0</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="text-accent" size={24} />
              <h3 className="text-lg font-semibold">Winnings</h3>
            </div>
            <p className="text-2xl font-bold text-green-500">$0.00</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";

const CURRENCIES = ["USDT", "USD", "EUR", "GBP", "AUD", "CAD"];

export default function Withdrawal() {
  const { user, loading } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    currency: "USDT",
    amount: "",
    address: "",
  });

  if (!user && !loading) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Withdrawal request:", formData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-accent hover:text-accent/80 transition-colors"
        >
          <ArrowLeft size={20} />
          {t("common.back", language)}
        </button>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">{t("wallet.withdrawal", language)}</h1>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t("wallet.withdrawal", language)}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">{t("wallet.currency", language)}</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{t("wallet.amount", language)}</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{t("wallet.address", language)}</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {t("wallet.submit", language)}
              </Button>
            </form>
          </div>

          <div className="mt-6 bg-secondary border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">ℹ️ Info</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>1. Enter amount and wallet address</li>
              <li>2. Submit withdrawal request</li>
              <li>3. Wait for admin approval (2-4 hours)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

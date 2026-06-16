import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";

const USDT_ADDRESS = "0x582dd67b4e7055096897c76fb33c58b2962affe9";
const CURRENCIES = ["USDT", "USD", "EUR", "GBP", "AUD", "CAD"];

export default function Deposit() {
  const { user, loading } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    currency: "USDT",
    amount: "",
    address: "",
  });

  if (!user && !loading) {
    navigate("/");
    return null;
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(USDT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Deposit request:", formData);
    // TODO: Submit to backend
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
          <h1 className="text-3xl font-bold mb-6">{t("wallet.deposit", language)}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* USDT Address Card */}
            <div className="bg-card border border-border rounded-lg p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">{t("wallet.usdtAddress", language)}</h2>
              <div className="bg-secondary p-4 rounded-lg mb-4">
                <p className="text-xs text-muted-foreground mb-2">BEP20 Network</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono break-all flex-1">{USDT_ADDRESS}</code>
                  <button
                    onClick={handleCopyAddress}
                    className="flex-shrink-0 p-2 hover:bg-border rounded-md transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check size={18} className="text-accent" />
                    ) : (
                      <Copy size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "fa"
                  ? "تتر را به این آدرس بر روی شبکه BEP20 ارسال کنید. حساب شما پس از تایید مدیریت شارژ می‌شود."
                  : language === "ar"
                    ? "أرسل USDT إلى هذا العنوان على شبكة BEP20. سيتم شحن حسابك بعد موافقة المسؤول."
                    : "Send USDT to this address on the BEP20 network. Your account will be credited after admin verification."}
              </p>
            </div>

            {/* Deposit Form */}
            <div className="bg-card border border-border rounded-lg p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">{t("wallet.deposit", language)} {t("common.save", language)}</h2>
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
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === "fa"
                      ? "آدرس کیف پول خود را که تتر را از آن ارسال می‌کنید وارد کنید"
                      : language === "ar"
                        ? "أدخل عنوان محفظتك التي ترسل USDT منها"
                        : "Enter the wallet address you're sending USDT from"}
                  </p>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {t("wallet.submit", language)}
                </Button>
              </form>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-secondary border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">ℹ️ {t("common.loading", language)}</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                {language === "fa"
                  ? "۱. تتر را به آدرس بالا ارسال کنید"
                  : language === "ar"
                    ? "1. أرسل USDT إلى العنوان أعلاه"
                    : "1. Send USDT to the address above"}
              </li>
              <li>
                {language === "fa"
                  ? "۲. درخواست واریز خود را در فرم بالا ثبت کنید"
                  : language === "ar"
                    ? "2. سجل طلب الإيداع الخاص بك في النموذج أعلاه"
                    : "2. Submit your deposit request in the form above"}
              </li>
              <li>
                {language === "fa"
                  ? "۳. منتظر تایید مدیریت باشید (معمولاً ۱-۲ ساعت)"
                  : language === "ar"
                    ? "3. انتظر موافقة المسؤول (عادة 1-2 ساعة)"
                    : "3. Wait for admin approval (usually 1-2 hours)"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

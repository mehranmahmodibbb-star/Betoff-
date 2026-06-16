import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Users, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [payoutAmount, setPayoutAmount] = useState<string>("");

  const affiliateQuery = trpc.affiliate.getAffiliateInfo.useQuery();
  const dashboardQuery = trpc.affiliate.getAffiliateDashboard.useQuery();
  const referralsQuery = trpc.affiliate.getReferrals.useQuery();
  const payoutHistoryQuery = trpc.affiliate.getPayoutHistory.useQuery();

  const registerMutation = trpc.affiliate.registerAffiliate.useMutation();
  const payoutMutation = trpc.affiliate.requestPayout.useMutation();

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">{language === "fa" ? "لطفا وارد شوید" : "Please login"}</p>
          <Button onClick={() => navigate("/")} className="bg-accent">
            {language === "fa" ? "بازگشت" : "Back"}
          </Button>
        </div>
      </div>
    );
  }

  const handleRegisterAffiliate = async () => {
    try {
      await registerMutation.mutateAsync();
      toast.success(language === "fa" ? "حساب تابعین ایجاد شد!" : "Affiliate account created!");
      affiliateQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || (language === "fa" ? "خطا" : "Error"));
    }
  };

  const handleCopyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(language === "fa" ? "کپی شد!" : "Copied!");
  };

  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast.error(language === "fa" ? "مبلغ را وارد کنید" : "Enter amount");
      return;
    }

    try {
      await payoutMutation.mutateAsync({
        amount: payoutAmount,
        currency: "USDT",
      });
      toast.success(language === "fa" ? "درخواست پرداخت ثبت شد!" : "Payout request submitted!");
      setPayoutAmount("");
      payoutHistoryQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || (language === "fa" ? "خطا" : "Error"));
    }
  };

  // If not an affiliate, show registration prompt
  if (!affiliateQuery.data && !affiliateQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Users size={64} className="mx-auto mb-4 text-accent" />
              <h1 className="text-3xl font-bold mb-4">
                {language === "fa" ? "برنامه تابعین" : "Affiliate Program"}
              </h1>
              <p className="text-gray-400 mb-6">
                {language === "fa"
                  ? "به عنوان تابعین BetOff درآمد کسب کنید! 60% کمیسیون از هر شرط ثبت شده توسط معرفی‌های شما"
                  : "Earn with BetOff Affiliate Program! Get 60% commission from every bet placed by your referrals"}
              </p>
              <Button
                onClick={handleRegisterAffiliate}
                disabled={registerMutation.isPending}
                className="bg-accent hover:bg-accent/90 text-lg px-8 py-6"
              >
                {registerMutation.isPending
                  ? language === "fa"
                    ? "در حال ثبت..."
                    : "Registering..."
                  : language === "fa"
                  ? "ثبت نام به عنوان تابعین"
                  : "Register as Affiliate"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const affiliate = affiliateQuery.data;
  const stats = dashboardQuery.data;
  const referrals = referralsQuery.data || [];
  const payouts = payoutHistoryQuery.data || [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {language === "fa" ? "داشبورد تابعین" : "Affiliate Dashboard"}
          </h1>
          <p className="text-gray-400">
            {language === "fa" ? "مدیریت معرفی‌های خود و کمیسیون‌های درآمدی" : "Manage your referrals and earnings"}
          </p>
        </div>

        {/* Referral Code Card */}
        {affiliate && (
          <div className="bg-gradient-to-r from-accent/20 to-blue-500/20 border border-accent/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {language === "fa" ? "کد معرفی شما" : "Your Referral Code"}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-lg">
                {affiliate.referralCode}
              </div>
              <Button
                onClick={() => handleCopyReferralCode(affiliate.referralCode)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy size={18} />
                {language === "fa" ? "کپی" : "Copy"}
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              {language === "fa"
                ? "این کد را با دوستان و شبکه‌های اجتماعی خود به اشتراک بگذارید"
                : "Share this code with friends and social networks"}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">
                {language === "fa" ? "کل معرفی‌ها" : "Total Referrals"}
              </span>
              <Users size={20} className="text-accent" />
            </div>
            <p className="text-3xl font-bold">{stats?.totalReferrals || 0}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">
                {language === "fa" ? "معرفی‌های فعال" : "Active Referrals"}
              </span>
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-500">{stats?.activeReferrals || 0}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">
                {language === "fa" ? "کمیسیون درآمدی" : "Commission Earned"}
              </span>
              <Wallet size={20} className="text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-500">
              {parseFloat(affiliate?.totalCommissionEarned || "0").toFixed(2)}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">
                {language === "fa" ? "نرخ کمیسیون" : "Commission Rate"}
              </span>
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-500">{affiliate?.commissionRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payout Request */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === "fa" ? "درخواست پرداخت" : "Request Payout"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {language === "fa" ? "مبلغ (USDT)" : "Amount (USDT)"}
                  </label>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    {language === "fa" ? "موجودی:" : "Available:"}
                  </p>
                  <p className="text-lg font-bold text-accent">
                    {parseFloat(affiliate?.totalCommissionEarned || "0").toFixed(2)} USDT
                  </p>
                </div>
                <Button
                  onClick={handleRequestPayout}
                  disabled={payoutMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {payoutMutation.isPending
                    ? language === "fa"
                      ? "در حال ثبت..."
                      : "Processing..."
                    : language === "fa"
                    ? "درخواست پرداخت"
                    : "Request Payout"}
                </Button>
              </div>
            </div>
          </div>

          {/* Referrals List */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === "fa" ? "معرفی‌های شما" : "Your Referrals"}
              </h2>
              {referrals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    {language === "fa" ? "هنوز معرفی‌ای ندارید" : "No referrals yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="bg-secondary border border-border rounded-lg p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-semibold">
                          {language === "fa" ? "کاربر" : "User"} #{referral.referredUserId}
                        </p>
                        <p className="text-sm text-gray-400">
                          {language === "fa" ? "وضعیت:" : "Status:"} {referral.status}
                        </p>
                        <p className="text-sm text-accent">
                          {language === "fa" ? "شرط‌های ثبت شده:" : "Bets Placed:"} {parseFloat(referral.totalBetsPlaced || "0").toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-500">
                          +{parseFloat(referral.commissionEarned || "0").toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {language === "fa" ? "کمیسیون" : "Commission"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="mt-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {language === "fa" ? "تاریخچه پرداخت‌ها" : "Payout History"}
            </h2>
            {payouts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {language === "fa" ? "هنوز درخواست پرداختی ندارید" : "No payout requests yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 px-4 font-semibold">
                        {language === "fa" ? "مبلغ" : "Amount"}
                      </th>
                      <th className="text-left py-2 px-4 font-semibold">
                        {language === "fa" ? "ارز" : "Currency"}
                      </th>
                      <th className="text-left py-2 px-4 font-semibold">
                        {language === "fa" ? "وضعیت" : "Status"}
                      </th>
                      <th className="text-left py-2 px-4 font-semibold">
                        {language === "fa" ? "تاریخ" : "Date"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-3 px-4 font-semibold">
                          {parseFloat(payout.amount || "0").toFixed(2)}
                        </td>
                        <td className="py-3 px-4">{payout.currency}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              payout.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : payout.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {payout.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {new Date(payout.createdAt).toLocaleDateString(language === "fa" ? "fa-IR" : "en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

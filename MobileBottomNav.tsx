import { ShoppingCart, User, Zap, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useBetting } from "@/contexts/BettingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";

export default function MobileBottomNav() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { betSlip, getBetCount } = useBetting();
  const { language } = useLanguage();

  const navItems = [
    {
      icon: ShoppingCart,
      label: t('nav.bettingSlip', language) || "Betting Slip",
      path: "/betting-slip",
      badge: getBetCount() > 0 ? getBetCount() : null,
    },
    {
      icon: User,
      label: t('nav.account', language) || "Account",
      path: isAuthenticated ? "/dashboard" : getLoginUrl(),
    },
    {
      icon: Zap,
      label: t('nav.live', language) || "Live",
      path: "/live",
    },
    {
      icon: Calendar,
      label: t('nav.preGame', language) || "Pre-Game",
      path: "/pre-game",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-blue-900 border-t border-blue-800 z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 relative transition-colors ${
                isActive
                  ? "text-white"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

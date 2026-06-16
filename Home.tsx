import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, LogIn, LogOut, User, Home as HomeIcon, Zap, Trophy, Dice5, HelpCircle, Users } from "lucide-react";
import { getLoginUrl } from "@/const";
import PromotionalCarousel from "@/components/PromotionalCarousel";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";

const SPORTS = [
  { name: "Football", icon: "⚽" },
  { name: "Basketball", icon: "🏀" },
  { name: "Volleyball", icon: "🏐" },
  { name: "Tennis", icon: "🎾" },
  { name: "Cricket", icon: "🏏" },
  { name: "Formula 1", icon: "🏎️" },
  { name: "Hockey", icon: "🏒" },
  { name: "UFC", icon: "🥊" },
  { name: "Boxing", icon: "🥋" },
];

const BETTING_TYPES = [
  { name: "Live Betting", path: "/live", icon: "⚡" },
  { name: "Pre-Game", path: "/pre-game", icon: "📅" },
];

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSport, setActiveSport] = useState("Football");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-indigo-900 border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo-new.png" alt="BetOff" className="h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="hover:text-accent transition-colors">{t('nav.home', language)}</a>
            <a href="/live" className="hover:text-accent transition-colors">{t('nav.live', language)}</a>
            <a href="/pre-game" className="hover:text-accent transition-colors">{t('nav.preGame', language)}</a>
            <a href="/casino" className="hover:text-accent transition-colors">{t('nav.casino', language)}</a>
            {isAuthenticated && (
              <a href="/affiliate" className="hover:text-accent transition-colors">{language === 'fa' ? 'تابعین' : 'Affiliate'}</a>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSelector />
            {loading ? (
              <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-white hover:bg-gray-100 transition-colors text-sm text-indigo-900"
                >
                  <User size={16} className="text-indigo-900" />
                  <span className="hidden sm:inline">{user.name || t('nav.account', language)}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive hover:bg-destructive/90 transition-colors text-sm text-destructive-foreground"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">{t('nav.logout', language)}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href={getLoginUrl()}>
                  <Button className="bg-white hover:bg-gray-100 text-indigo-900 text-xs md:text-sm">
                    <LogIn size={16} className="mr-1 md:mr-2 text-indigo-900" />
                    <span className="hidden sm:inline">{t('nav.login', language)}</span>
                  </Button>
                </a>
              </div>
            )}

            {/* Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-md transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-secondary border-t border-border">
            <nav className="flex flex-col p-4 gap-2">
              <a href="/" className="px-4 py-2 hover:bg-secondary/80 rounded-md transition-colors flex items-center gap-2">
                <HomeIcon size={18} /> {t('nav.home', language)}
              </a>
              <a href="/live" className="px-4 py-2 hover:bg-secondary/80 rounded-md transition-colors flex items-center gap-2">
                <Zap size={18} /> {t('betting.live', language)}
              </a>
              <a href="/pre-game" className="px-4 py-2 hover:bg-secondary/80 rounded-md transition-colors flex items-center gap-2">
                <Trophy size={18} /> {t('betting.preGame', language)}
              </a>
              <a href="/casino" className="px-4 py-2 hover:bg-secondary/80 rounded-md transition-colors flex items-center gap-2">
                <Dice5 size={18} /> {t('nav.casino', language)}
              </a>
              <a href="/support" className="px-4 py-2 hover:bg-secondary/80 rounded-md transition-colors flex items-center gap-2">
                <HelpCircle size={18} /> {t('nav.support', language)}
              </a>
              {isAuthenticated && (
                <a href="/affiliate" className="px-4 py-2 hover:bg-secondary/80 rounded-md transition-colors flex items-center gap-2">
                  <Users size={18} /> {language === 'fa' ? 'برنامه تابعین' : 'Affiliate Program'}
                </a>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Sports Carousel */}
      <div className="bg-indigo-900 border-b border-border overflow-x-auto">
        <div className="container flex gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {SPORTS.map((sport) => (
            <button
              key={sport.name}
              onClick={() => setActiveSport(sport.name)}
              className={`sports-item ${activeSport === sport.name ? "active" : ""}`}
            >
              <span className="mr-2">{sport.icon}</span>
              {sport.name}
            </button>
          ))}
        </div>
      </div>

      {/* Betting Type Carousel */}
      <div className="bg-indigo-900 border-b border-border">
        <div className="container flex gap-2 py-3">
          {BETTING_TYPES.map((type) => (
            <a
              key={type.path}
              href={type.path}
              className="sports-item"
            >
              <span className="mr-2">{type.icon}</span>
              {type.name}
            </a>
          ))}
        </div>
      </div>

      {/* Promotional Carousel */}
      <div className="bg-background border-b border-border">
        <div className="container py-4">
          <PromotionalCarousel />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('home.welcome', language)}</h1>
          <p className="text-muted-foreground">{t('home.subtitle', language)}</p>
        </div>

        {/* Featured Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="event-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold">{activeSport} Match {i}</h3>
                  <p className="text-sm text-muted-foreground">Today at {10 + i}:00</p>
                </div>
                <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded font-semibold">LIVE</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Team A</span>
                  <span className="odds-display">1.85</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Draw</span>
                  <span className="odds-display">3.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Team B</span>
                  <span className="odds-display">2.10</span>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {t('home.placeBet', language)}
              </Button>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Add padding to account for fixed nav */}
      <div className="h-20 md:hidden" />
      <nav className="mobile-nav md:hidden">
        <a href="/" className="mobile-nav-item active">
          <HomeIcon size={20} />
          <span>Home</span>
        </a>
        <a href="/live" className="mobile-nav-item">
          <Zap size={20} />
          <span>Live</span>
        </a>
        <a href="/pre-game" className="mobile-nav-item">
          <Trophy size={20} />
          <span>Bets</span>
        </a>
        <a href="/dashboard" className="mobile-nav-item">
          <User size={20} />
          <span>Account</span>
        </a>
      </nav>
    </div>
  );
}


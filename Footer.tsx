import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();

  const currentYear = new Date().getFullYear();

  const menuItems = [
    { label: language === "fa" ? "خانه" : "Home", href: "/" },
    { label: language === "fa" ? "شرط‌بندی زنده" : "Live Betting", href: "/live" },
    { label: language === "fa" ? "شرط‌بندی پیش‌بازی" : "Pre-Game", href: "/pre-game" },
    { label: language === "fa" ? "کازینو" : "Casino", href: "/casino" },
    { label: language === "fa" ? "پشتیبانی" : "Support", href: "/support" },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/betoff", color: "hover:text-blue-600" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/betoff", color: "hover:text-pink-600" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/betoff", color: "hover:text-blue-400" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/betoff", color: "hover:text-blue-700" },
  ];

  const supportLinks = [
    { label: language === "fa" ? "تماس با ما" : "Contact Us", href: "/support" },
    { label: language === "fa" ? "شرایط و ضوابط" : "Terms & Conditions", href: "#" },
    { label: language === "fa" ? "سیاست حریم خصوصی" : "Privacy Policy", href: "#" },
    { label: language === "fa" ? "سؤالات متداول" : "FAQ", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300 border-t border-slate-700 mt-16" dir={isRTL ? "rtl" : "ltr"}>
      {/* Main Footer Content */}
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & About */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-white">
                B
              </div>
              <span className="text-xl font-bold text-white">BetOff</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {language === "fa"
                ? "پلتفرم شرط‌بندی ورزشی و کازینو آنلاین با بهترین ضرایب و تجربه کاربری"
                : "Professional sports betting and online casino platform with best odds"}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-colors ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {language === "fa" ? "منو سایت" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => navigate(item.href)}
                    className="text-gray-400 hover:text-accent transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {language === "fa" ? "پشتیبانی" : "Support"}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {language === "fa" ? "تماس" : "Contact"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-accent mt-1 flex-shrink-0" />
                <a href="mailto:betoff90@gmail.com" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  betoff90@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} BetOff. {language === "fa" ? "تمام حقوق محفوظ است." : "All rights reserved."}
          </p>

          {/* Websphere Credit */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>{language === "fa" ? "طراحی شده توسط" : "Designed by"}</span>
            <a
              href="https://websphere.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors font-semibold"
            >
              Websphere
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">{language === "fa" ? "روش‌های پرداخت:" : "Payment:"}</span>
            <div className="flex gap-2">
              <span className="bg-slate-800 px-2 py-1 rounded text-xs text-gray-300">USDT</span>
              <span className="bg-slate-800 px-2 py-1 rounded text-xs text-gray-300">USD</span>
              <span className="bg-slate-800 px-2 py-1 rounded text-xs text-gray-300">EUR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Gradient Border */}
      <div className="h-1 bg-gradient-to-r from-accent via-blue-500 to-accent"></div>
    </footer>
  );
}

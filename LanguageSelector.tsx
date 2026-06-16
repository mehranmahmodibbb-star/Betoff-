import { useLanguage, LANGUAGE_NAMES, Language } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = ["fa", "ar", "en", "kk", "uz", "zh", "ko"];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white hover:bg-gray-100 transition-colors text-sm text-blue-600"
        title="Change Language"
      >
        <Globe size={16} className="text-blue-600" />
        <span className="hidden sm:inline uppercase font-semibold">{language}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  language === lang
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "hover:bg-secondary text-foreground"
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{LANGUAGE_NAMES[lang].nativeName}</span>
                  <span className="text-xs text-muted-foreground">{LANGUAGE_NAMES[lang].name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "fa" | "ar" | "en" | "kk" | "uz" | "zh" | "ko";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const RTL_LANGUAGES: Language[] = ["fa", "ar"];

const LANGUAGE_NAMES: Record<Language, { name: string; nativeName: string }> = {
  fa: { name: "Persian", nativeName: "فارسی" },
  ar: { name: "Arabic", nativeName: "العربية" },
  en: { name: "English", nativeName: "English" },
  kk: { name: "Kazakh", nativeName: "Қазақ" },
  uz: { name: "Uzbek", nativeName: "Ўзбек" },
  zh: { name: "Chinese", nativeName: "中文" },
  ko: { name: "Korean", nativeName: "한국어" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isRTL, setIsRTL] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("betoff_language") as Language | null;
    if (savedLanguage && Object.keys(LANGUAGE_NAMES).includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      setIsRTL(RTL_LANGUAGES.includes(savedLanguage));
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = RTL_LANGUAGES.includes(savedLanguage) ? "rtl" : "ltr";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setIsRTL(RTL_LANGUAGES.includes(lang));
    localStorage.setItem("betoff_language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? "rtl" : "ltr";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export { LANGUAGE_NAMES };

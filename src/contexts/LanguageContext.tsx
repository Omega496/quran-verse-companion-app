
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
}

const defaultLanguage: Language = "en";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  translations: {},
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("quran-app-language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load translations based on selected language
    const loadTranslations = async () => {
      try {
        const lang = savedLanguage || defaultLanguage;
        const response = await import(`../locales/${lang}.json`);
        setTranslations(response.default);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to empty translations object
        setTranslations({});
      }
    };

    loadTranslations();
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("quran-app-language", language);
    
    // Update translations when language changes
    const loadTranslations = async () => {
      try {
        const response = await import(`../locales/${language}.json`);
        setTranslations(response.default);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to empty translations object
        setTranslations({});
      }
    };

    loadTranslations();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

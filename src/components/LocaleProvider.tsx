"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale } from "@/lib/translations";

interface LocaleContextProps {
  locale: Locale;
  setLanguage: (lang: Locale) => void;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const setLanguage = (lang: Locale) => {
    setLocale(lang);
    // Write cookie client-side
    document.cookie = `almi_locale=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    // Force refresh page to reload server data with correct translations
    window.location.reload();
  };

  return (
    <LocaleContext.Provider value={{ locale, setLanguage }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

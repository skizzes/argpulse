"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, translations } from "@/lib/i18n";

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>("es");

    useEffect(() => {
        const saved = localStorage.getItem("argpulse_locale") as Locale;
        if (saved && (saved === "es" || saved === "en")) {
            setLocale(saved);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem("argpulse_locale", newLocale);
    };

    const t = translations[locale];

    return (
        <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

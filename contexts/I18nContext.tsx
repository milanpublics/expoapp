import { en, Translations } from "@/i18n/en";
import { zh } from "@/i18n/zh";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { NativeModules, Platform } from "react-native";

export type Language = "en" | "zh";

interface I18nContextType {
  t: Translations;
  lang: Language;
  setLang: (lang: Language) => void;
}

const LANG_KEY = "@tracker_language";

const translations: Record<Language, Translations> = { en, zh };

function getDeviceLanguage(): Language {
  try {
    const locale =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
          "en"
        : NativeModules.I18nManager?.localeIdentifier || "en";
    return locale.startsWith("zh") ? "zh" : "en";
  } catch {
    return "en";
  }
}

const I18nContext = createContext<I18nContextType>({
  t: en,
  lang: "en",
  setLang: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(getDeviceLanguage());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((saved) => {
      if (saved === "en" || saved === "zh") {
        setLangState(saved);
      }
      setLoaded(true);
    });
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    AsyncStorage.setItem(LANG_KEY, newLang);
  }, []);

  const t = useMemo(() => translations[lang], [lang]);

  const value = useMemo(() => ({ t, lang, setLang }), [t, lang, setLang]);

  if (!loaded) return null;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  return useContext(I18nContext);
}

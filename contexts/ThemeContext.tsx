import {
    DarkColors,
    BorderRadius as DefaultBorderRadius,
    LightColors,
    ThemeColors,
} from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  colors: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  borderRadiusScale: number;
  borderRadius: typeof DefaultBorderRadius;
  setBorderRadiusScale: (s: number) => void;
}

const THEME_KEY = "@tracker_theme_mode";
const BR_SCALE_KEY = "@tracker_br_scale";

const ThemeContext = createContext<ThemeContextType>({
  colors: DarkColors,
  mode: "system",
  isDark: true,
  setMode: () => {},
  borderRadiusScale: 1,
  borderRadius: DefaultBorderRadius,
  setBorderRadiusScale: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [brScale, setBrScale] = useState(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(THEME_KEY),
      AsyncStorage.getItem(BR_SCALE_KEY),
    ]).then(([savedMode, savedScale]) => {
      if (
        savedMode === "light" ||
        savedMode === "dark" ||
        savedMode === "system"
      ) {
        setModeState(savedMode);
      }
      if (savedScale) {
        const n = parseFloat(savedScale);
        if (!isNaN(n) && n >= 0.5 && n <= 1.5) setBrScale(n);
      }
      setLoaded(true);
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(THEME_KEY, newMode);
  };

  const setBorderRadiusScale = (s: number) => {
    setBrScale(s);
    AsyncStorage.setItem(BR_SCALE_KEY, String(s));
  };

  const isDark = useMemo(() => {
    if (mode === "system") return systemScheme !== "light";
    return mode === "dark";
  }, [mode, systemScheme]);

  const colors = useMemo(() => (isDark ? DarkColors : LightColors), [isDark]);

  const borderRadius = useMemo(() => {
    return {
      sm: DefaultBorderRadius.sm * brScale,
      md: DefaultBorderRadius.md * brScale,
      lg: DefaultBorderRadius.lg * brScale,
      xl: DefaultBorderRadius.xl * brScale,
      full: DefaultBorderRadius.full,
    };
  }, [brScale]);

  const value = useMemo(
    () => ({
      colors,
      mode,
      isDark,
      setMode,
      borderRadiusScale: brScale,
      borderRadius,
      setBorderRadiusScale,
    }),
    [colors, mode, isDark, brScale, borderRadius],
  );

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}

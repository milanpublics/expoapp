export type ThemeColors = {
  // Backgrounds
  background: string;
  cardBg: string;
  cardBgLight: string;
  surfaceBg: string;

  // Primary / accent
  primary: string;
  primaryDark: string;
  primarySoft: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Status
  green: string;
  amber: string;
  red: string;
  blue: string;
  gray: string;

  // UI
  border: string;
  overlay: string;
  danger: string;
};

export const DarkColors: ThemeColors = {
  background: "#0D0D1A",
  cardBg: "#1A1A2E",
  cardBgLight: "#242442",
  surfaceBg: "#2A2A4A",

  primary: "#00E676",
  primaryDark: "#00C853",
  primarySoft: "rgba(0, 230, 118, 0.15)",

  textPrimary: "#FFFFFF",
  textSecondary: "#9E9EA7",
  textMuted: "#6B6B7B",

  green: "#00E676",
  amber: "#FFD740",
  red: "#FF5252",
  blue: "#448AFF",
  gray: "#B0BEC5",

  border: "rgba(255,255,255,0.08)",
  overlay: "rgba(0,0,0,0.5)",
  danger: "#FF5252",
};

export const LightColors: ThemeColors = {
  background: "#F5F5FA",
  cardBg: "#FFFFFF",
  cardBgLight: "#F0F0F8",
  surfaceBg: "#E8E8F0",

  primary: "#00C853",
  primaryDark: "#00A844",
  primarySoft: "rgba(0, 200, 83, 0.12)",

  textPrimary: "#1A1A2E",
  textSecondary: "#6B6B7B",
  textMuted: "#9E9EA7",

  green: "#00C853",
  amber: "#F9A825",
  red: "#E53935",
  blue: "#1E88E5",
  gray: "#78909C",

  border: "rgba(0,0,0,0.08)",
  overlay: "rgba(0,0,0,0.3)",
  danger: "#E53935",
};

// Default export for backwards compatibility during migration
export const Colors = DarkColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  hero: 34,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

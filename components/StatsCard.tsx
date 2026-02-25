import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatsCardProps {
  label: string;
  count: number;
  icon: string;
  color: string;
}

export default function StatsCard({
  label,
  count,
  icon,
  color,
}: StatsCardProps) {
  const { colors, borderRadius, cardShadow } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBgLight,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
        cardShadow,
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={20}
        color={color}
        style={styles.icon}
      />
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.count, { color: colors.textPrimary }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  icon: {
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  count: {
    fontSize: FontSize.xxl,
    fontWeight: "700",
  },
});

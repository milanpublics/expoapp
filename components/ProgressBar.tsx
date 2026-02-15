import { BorderRadius, FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const { colors } = useTheme();
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.primary }]}>
          {label || "PROGRESS"}
        </Text>
        <Text style={[styles.percentage, { color: colors.primary }]}>
          {percentage}%
        </Text>
      </View>
      <View style={styles.trackContainer}>
        <View style={[styles.track, { backgroundColor: colors.cardBgLight }]}>
          <View
            style={[
              styles.fill,
              { width: `${percentage}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  percentage: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  trackContainer: {
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  track: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
});

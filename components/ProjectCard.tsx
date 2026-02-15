import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { PRIORITY_LEVELS, Project, PROJECT_CATEGORIES } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  faded?: boolean;
}

/** Softer priority colors for left accent strip — less saturated than raw PRIORITY_LEVELS */
const PRI_ACCENT: Record<string, string> = {
  urgent: "#E05555",
  high: "#E09040",
  medium: "#D4B84A",
  low: "#90A4AE",
};

export default function ProjectCard({
  project,
  onPress,
  faded,
}: ProjectCardProps) {
  const { colors, borderRadius } = useTheme();
  const { t } = useI18n();
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  const remaining = totalTasks - completedTasks;

  const catDef =
    PROJECT_CATEGORIES.find((c) => c.key === project.category) || null;
  const priDef =
    PRIORITY_LEVELS.find((p) => p.key === project.priority) || null;

  const iconName = catDef?.icon || project.icon;
  const iconColor = catDef?.color || project.color;

  const accentColor = PRI_ACCENT[project.priority] || PRI_ACCENT.low;

  const getSubtitle = () => {
    if (project.status === "on-hold") return t.onHold;
    if (project.status === "completed") return t.completedStatus;
    if (project.dueDate) {
      const due = new Date(project.dueDate);
      const now = new Date();
      const diffDays = Math.ceil(
        (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays < 0) return t.overdue;
      if (diffDays === 0) return t.dueToday;
      if (diffDays === 1) return t.dueTomorrow;
      if (diffDays <= 7) return t.dueInDays(diffDays);
    }
    if (remaining > 0) return t.tasksLeft(remaining);
    if (totalTasks === 0) return t.noTasksAdded;
    return t.allTasksDone;
  };

  const subtitle = getSubtitle();
  const isDueSoon =
    subtitle === t.dueTomorrow ||
    subtitle === t.dueToday ||
    subtitle === t.overdue;

  const renderIcon = () => {
    if (project.customIconUri) {
      return (
        <Image
          source={{ uri: project.customIconUri }}
          style={[styles.customIcon, { borderRadius: borderRadius.md }]}
        />
      );
    }
    return (
      <MaterialCommunityIcons
        name={iconName as any}
        size={22}
        color={faded ? colors.textMuted : iconColor}
      />
    );
  };

  const priLabel = priDef
    ? (t as any)[`pri_${priDef.key}`] || priDef.key
    : null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.cardBgLight, borderRadius: borderRadius.lg },
        faded && { opacity: 0.5 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Priority accent strip - now full height */}
      <View
        style={[
          styles.accentStrip,
          {
            backgroundColor: accentColor,
            borderTopLeftRadius: borderRadius.lg,
            borderBottomLeftRadius: borderRadius.lg,
          },
        ]}
      />

      {/* Content wrapper with padding */}
      <View style={styles.internalWrapper}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: project.customIconUri
                ? "transparent"
                : iconColor + "20",
              borderRadius: borderRadius.md,
            },
          ]}
        >
          {renderIcon()}
        </View>
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: faded ? colors.textMuted : colors.textPrimary },
            ]}
            numberOfLines={1}
          >
            {project.title}
          </Text>
          <View style={styles.metaRow}>
            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary },
                isDueSoon && { color: colors.amber },
              ]}
            >
              {subtitle}
            </Text>
            {priLabel && (
              <View
                style={[
                  styles.priBadge,
                  { backgroundColor: accentColor + "18" },
                ]}
              >
                <View
                  style={[styles.priDot, { backgroundColor: accentColor }]}
                />
                <Text style={[styles.priText, { color: accentColor }]}>
                  {priLabel}
                </Text>
              </View>
            )}
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={colors.textMuted}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 0, // removed padding to allow strip to be full height
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  accentStrip: {
    width: 6, // slightly wider for better visibility
    alignSelf: "stretch",
  },
  internalWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    paddingLeft: Spacing.md,
  },
  iconContainer: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    overflow: "hidden",
  },
  customIcon: { width: 42, height: 42 },
  content: { flex: 1 },
  title: { fontSize: FontSize.md, fontWeight: "600", marginBottom: 3 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  subtitle: { fontSize: FontSize.sm },
  priBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
  },
  priDot: { width: 6, height: 6, borderRadius: 3 },
  priText: { fontSize: 10, fontWeight: "600" },
});

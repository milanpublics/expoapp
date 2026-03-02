import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { CustomTag, PRIORITY_LEVELS, Project, tagTextColor } from "@/types";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  faded?: boolean;
  allTags?: CustomTag[];
}

/** Softer priority colors for left accent indicator */
const PRI_ACCENT: Record<string, string> = {
  urgent: "#EF5350",
  high: "#FFA726",
  medium: "#42A5F5",
  low: "#90A4AE",
};

export default function ProjectCard({
  project,
  onPress,
  faded,
  allTags,
}: ProjectCardProps) {
  const { colors, borderRadius, cardShadow } = useTheme();
  const { t } = useI18n();
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  const remaining = totalTasks - completedTasks;

  const priDef =
    PRIORITY_LEVELS.find((p) => p.key === project.priority) || null;

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

  const priLabel = priDef
    ? (t as any)[`pri_${priDef.key}`] || priDef.key
    : null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBgLight,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
        cardShadow,
        faded && { opacity: 0.5 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Priority accent indicator */}
      <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />

      {/* Content wrapper with padding */}
      <View style={styles.internalWrapper}>
        {/* Banner thumbnail */}
        <View
          style={[
            styles.thumbnailContainer,
            { borderRadius: borderRadius.md, overflow: "hidden" },
          ]}
        >
          <Image
            source={
              project.customIconUri
                ? { uri: project.customIconUri }
                : require("@/assets/images/icon.png")
            }
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
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
          {allTags && project.tags && project.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {project.tags.map((tid) => {
                const tag = allTags.find((t) => t.id === tid);
                if (!tag) return null;
                return (
                  <View
                    key={tag.id}
                    style={[styles.tagChip, { backgroundColor: tag.color }]}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        { color: tagTextColor(tag.color) },
                      ]}
                    >
                      {tag.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Progress Ring */}
        {project.status !== "completed" && totalTasks > 0 && (
          <View style={styles.progressContainer}>
            <Svg width={20} height={20} viewBox="0 0 20 20">
              <Circle
                stroke={colors.border}
                strokeWidth={3}
                cx={10}
                cy={10}
                r={8}
                fill="transparent"
              />
              <Circle
                stroke={colors.primary}
                strokeWidth={3}
                cx={10}
                cy={10}
                r={8}
                fill="transparent"
                strokeDasharray={8 * 2 * Math.PI}
                strokeDashoffset={
                  8 * 2 * Math.PI -
                  (completedTasks / totalTasks) * (8 * 2 * Math.PI)
                }
                strokeLinecap="round"
                rotation="-90"
                origin="10, 10"
              />
            </Svg>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 0,
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  accentStrip: {
    width: 3,
    alignSelf: "stretch",
    marginVertical: 10,
    marginLeft: 10,
    borderRadius: 2,
  },
  internalWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    paddingLeft: Spacing.md,
  },
  thumbnailContainer: {
    width: 42,
    height: 42,
    marginRight: Spacing.md,
  },
  thumbnailImage: {
    width: 42,
    height: 42,
  },
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
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  tagChip: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
  },
  tagChipText: {
    fontSize: 9,
    fontWeight: "600",
  },

  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
    marginRight: Spacing.sm,
  },
});

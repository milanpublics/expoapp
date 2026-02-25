import ActivityGrid from "@/components/ActivityGrid";
import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { Project } from "@/types";
import { getProjects, getTags } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";
import { useFocusEffect, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileCenterScreen() {
  const { colors, borderRadius, cardShadow } = useTheme();
  const { t } = useI18n();
  const { profile } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [statsPeriod, setStatsPeriod] = useState<"week" | "month" | "year">(
    "week",
  );

  useFocusEffect(
    useCallback(() => {
      getProjects().then(setProjects);
    }, []),
  );

  const cardHPadding = Spacing.md * 2;
  const screenHPadding = Spacing.xl * 2;
  const totalPadding = cardHPadding + screenHPadding;

  const stats = useMemo(() => {
    const now = new Date();
    let periodStart: Date;
    if (statsPeriod === "week") {
      periodStart = new Date(now);
      periodStart.setDate(now.getDate() - now.getDay());
      periodStart.setHours(0, 0, 0, 0);
    } else if (statsPeriod === "month") {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      periodStart = new Date(now.getFullYear(), 0, 1);
    }

    const totalProjects = projects.length;
    const activeCount = projects.filter((p) => p.status === "active").length;

    // Period-scoped completed projects (created within period and completed)
    const completedProjects = projects.filter(
      (p) => p.status === "completed" && new Date(p.createdAt) >= periodStart,
    ).length;

    // Period-scoped tasks
    let totalTasks = 0;
    let completedTasks = 0;
    for (const p of projects) {
      for (const task of p.tasks) {
        totalTasks++;
        if (
          task.completed &&
          task.completedAt &&
          new Date(task.completedAt) >= periodStart
        ) {
          completedTasks++;
        }
      }
    }
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;
    return {
      totalProjects,
      activeCount,
      completedProjects,
      totalTasks,
      completedTasks,
      completionRate,
    };
  }, [projects, statsPeriod]);

  const handleExportData = async () => {
    try {
      const [allProjects, allTags] = await Promise.all([
        getProjects(),
        getTags(),
      ]);
      const data = JSON.stringify(
        { projects: allProjects, tags: allTags },
        null,
        2,
      );
      const file = new File(Paths.cache, "vitrack_export.json");
      file.write(data);
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: "Vitrack Data",
      });
    } catch {
      Alert.alert(t.exportError);
    }
  };

  const menuItems = [
    {
      icon: "account-circle-outline",
      title: t.profile,
      subtitle: t.manageProfile,
      action: () => router.push("/profile"),
    },
    {
      icon: "tag-multiple-outline",
      title: t.manageTags,
      subtitle: t.manageTagsDesc,
      action: () => router.push("/manage-tags"),
    },
    {
      icon: "archive-outline",
      title: t.archivedProjects,
      subtitle: t.archivedProjectsDesc,
      action: () => router.push("/archived-projects"),
    },
    {
      icon: "export-variant",
      title: t.exportData,
      subtitle: t.exportDataDesc,
      action: handleExportData,
    },
    {
      icon: "cog-outline",
      title: t.settingsPage,
      subtitle: `${t.appearance}, ${t.language}`,
      action: () => router.push("/app-settings"),
    },
    {
      icon: "information-outline",
      title: t.about,
      subtitle: t.aboutDesc,
      action: () => router.push("/about"),
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            activeOpacity={0.8}
          >
            {profile.avatarUri ? (
              <Image
                source={{ uri: profile.avatarUri }}
                style={styles.avatarImage}
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.cardBgLight },
                ]}
              >
                <MaterialCommunityIcons
                  name="account"
                  size={28}
                  color={colors.textMuted}
                />
              </View>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: Spacing.lg }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t.profileCenter}
            </Text>
            {profile.name ? (
              <Text style={[styles.nameText, { color: colors.textSecondary }]}>
                {profile.name}
              </Text>
            ) : null}
          </View>
          {/* <TouchableOpacity
            onPress={() => router.push("/app-settings")}
            activeOpacity={0.7}
            style={[
              styles.settingsBtn,
              {
                backgroundColor: colors.cardBgLight,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity> */}
        </View>

        {/* Activity */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.activity}
        </Text>
        <View
          style={[
            styles.heatmapCard,
            {
              backgroundColor: colors.cardBgLight,
              borderRadius: borderRadius.xl,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            },
            cardShadow,
          ]}
        >
          <ActivityGrid projects={projects} containerPadding={totalPadding} />
        </View>

        {/* Statistics */}
        <View style={styles.statsHeader}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.textSecondary, marginBottom: 0, marginTop: 0 },
            ]}
          >
            {t.statistics}
          </Text>
          <View style={styles.periodChips}>
            {(["week", "month", "year"] as const).map((p) => {
              const active = statsPeriod === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setStatsPeriod(p)}
                  style={[
                    styles.periodChip,
                    {
                      backgroundColor: active ? colors.primary : "transparent",
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.periodChipText,
                      { color: active ? "#fff" : colors.textSecondary },
                    ]}
                  >
                    {t[p]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Completion Ring */}
        <View
          style={[
            styles.completionCard,
            {
              backgroundColor: colors.cardBgLight,
              borderRadius: borderRadius.xl,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            },
            cardShadow,
          ]}
        >
          <View style={styles.ringContainer}>
            {/* Ring background */}
            <View style={[styles.ringBg, { borderColor: colors.surfaceBg }]}>
              {/* Ring fill — use a half-circle overlay trick */}
              <View style={styles.ringFillWrapper}>
                <View
                  style={[
                    styles.ringHalf,
                    {
                      borderColor: colors.primary,
                      transform: [
                        {
                          rotate: `${Math.min(stats.completionRate * 360, 360)}deg`,
                        },
                      ],
                    },
                    stats.completionRate > 0.5 && {
                      borderRightColor: colors.primary,
                      borderBottomColor: colors.primary,
                    },
                  ]}
                />
                {stats.completionRate > 0.5 && (
                  <View
                    style={[
                      styles.ringHalfOverlay,
                      { borderColor: colors.primary },
                    ]}
                  />
                )}
              </View>
              <View
                style={[
                  styles.ringInner,
                  { backgroundColor: colors.cardBgLight },
                ]}
              >
                <Text
                  style={[styles.ringPercentage, { color: colors.primary }]}
                >
                  {Math.round(stats.completionRate * 100)}%
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.completionMeta}>
            <Text
              style={[styles.completionTitle, { color: colors.textPrimary }]}
            >
              {t.completionRate}
            </Text>
            <Text
              style={[styles.completionSub, { color: colors.textSecondary }]}
            >
              {stats.completedTasks}/{stats.totalTasks} {t.totalTasks}
            </Text>
          </View>
        </View>

        {/* Mini stat cards */}
        <View style={styles.statsGrid}>
          {[
            {
              label: t.completedTasksLabel,
              value: stats.completedTasks,
              color: colors.primary,
            },
            {
              label: t.completedProjectsLabel,
              value: stats.completedProjects,
              color: colors.primary,
            },
            {
              label: t.activeProjects,
              value: stats.activeCount,
              color: colors.amber,
            },
          ].map((item) => (
            <View
              key={item.label}
              style={[
                styles.miniStatCard,
                {
                  backgroundColor: colors.cardBgLight,
                  borderRadius: borderRadius.lg,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                },
                cardShadow,
              ]}
            >
              <Text style={[styles.miniStatValue, { color: item.color }]}>
                {item.value}
              </Text>
              <Text
                style={[styles.miniStatLabel, { color: colors.textSecondary }]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.general}
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBgLight,
              borderRadius: borderRadius.xl,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            },
            cardShadow,
          ]}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.listItem,
                index < menuItems.length - 1 && [
                  styles.itemBorder,
                  { borderBottomColor: colors.border },
                ],
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View style={styles.listItemContent}>
                <Text
                  style={[styles.listItemTitle, { color: colors.textPrimary }]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.listItemSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.subtitle}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.version, { color: colors.textMuted }]}>
          Vitrack v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarImage: { width: 52, height: 52, borderRadius: 26 },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: FontSize.xl, fontWeight: "700" },
  nameText: { fontSize: FontSize.sm, marginTop: 2 },
  settingsBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  heatmapCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  periodChips: {
    flexDirection: "row",
    gap: 4,
  },
  periodChip: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
  },
  periodChipText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  completionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  ringContainer: {
    marginRight: Spacing.lg,
  },
  ringBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ringFillWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  ringHalf: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    top: -5,
    left: -5,
  },
  ringHalfOverlay: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    top: -5,
    left: -5,
    transform: [{ rotate: "0deg" }],
  },
  ringInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  ringPercentage: {
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  completionMeta: {
    flex: 1,
  },
  completionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginBottom: 2,
  },
  completionSub: {
    fontSize: FontSize.sm,
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  miniStatCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  miniStatValue: {
    fontSize: FontSize.xl,
    fontWeight: "700",
  },
  miniStatLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  card: {
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  itemBorder: { borderBottomWidth: StyleSheet.hairlineWidth },
  listItemIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  listItemContent: { flex: 1 },
  listItemTitle: { fontSize: FontSize.md, fontWeight: "600", marginBottom: 1 },
  listItemSubtitle: { fontSize: FontSize.xs },
  version: {
    fontSize: FontSize.xs,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});

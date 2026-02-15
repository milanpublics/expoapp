import ProjectCard from "@/components/ProjectCard";
import StatsCard from "@/components/StatsCard";
import { BorderRadius, FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { AppStats, Priority, Project } from "@/types";
import { getProjects } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Priority sort weight — higher = more important = appears first */
const PRI_WEIGHT: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function sortByPriority(a: Project, b: Project): number {
  const wa = PRI_WEIGHT[a.priority] ?? 0;
  const wb = PRI_WEIGHT[b.priority] ?? 0;
  return wb - wa; // descending
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { profile } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<AppStats>({ completed: 0, pending: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const data = await getProjects();
    setProjects(data);
    const completed = data.filter((p) => p.status === "completed").length;
    const pending = data.filter((p) => p.status !== "completed").length;
    setStats({ completed, pending });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 18) return t.goodAfternoon;
    return t.goodEvening;
  };

  const getFormattedDate = () => {
    const now = new Date();
    const locale = lang === "zh" ? "zh-CN" : "en-US";
    return now.toLocaleDateString(locale, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const { active, onHold, completed } = useMemo(() => {
    const active = projects
      .filter((p) => p.status === "active")
      .sort(sortByPriority);
    const onHold = projects
      .filter((p) => p.status === "on-hold")
      .sort(sortByPriority);
    const completed = projects.filter((p) => p.status === "completed");
    return { active, onHold, completed };
  }, [projects]);

  const displayName = profile.name ? `, ${profile.name}` : "";

  const sectionLabel = (
    label: string,
    count: number,
    icon: string,
    color: string,
  ) => (
    <View style={styles.sectionRow}>
      <MaterialCommunityIcons name={icon as any} size={16} color={color} />
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {label}
      </Text>
      <View style={[styles.countBadge, { backgroundColor: color + "20" }]}>
        <Text style={[styles.countText, { color }]}>{count}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {getFormattedDate()}
            </Text>
            <Text
              style={[styles.greeting, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {getGreeting()}
              {displayName}
            </Text>
          </View>
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
                  color={colors.textSecondary}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatsCard
            label={t.completed}
            count={stats.completed}
            icon="check-circle"
            color={colors.green}
          />
          <View style={{ width: Spacing.md }} />
          <StatsCard
            label={t.pending}
            count={stats.pending}
            icon="clock-outline"
            color={colors.textSecondary}
          />
        </View>

        {/* Active projects */}
        {active.length > 0 && (
          <>
            {sectionLabel(
              t.pending,
              active.length,
              "play-circle-outline",
              colors.primary,
            )}
            {active.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => router.push(`/project/${project.id}`)}
              />
            ))}
          </>
        )}

        {/* On Hold projects */}
        {onHold.length > 0 && (
          <>
            {sectionLabel(
              t.onHold,
              onHold.length,
              "pause-circle-outline",
              colors.amber,
            )}
            {onHold.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => router.push(`/project/${project.id}`)}
              />
            ))}
          </>
        )}

        {/* Completed projects */}
        {completed.length > 0 && (
          <>
            {sectionLabel(
              t.completedStatus,
              completed.length,
              "check-circle-outline",
              colors.green,
            )}
            {completed.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => router.push(`/project/${project.id}`)}
                faded
              />
            ))}
          </>
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={64}
              color={colors.textMuted}
            />
            <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
              {t.noProjectsYet}
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.textSecondary }]}
            >
              {t.noProjectsHint}
            </Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  date: { fontSize: FontSize.sm, marginBottom: 4 },
  greeting: { fontSize: FontSize.xl, fontWeight: "700" },
  avatarImage: { width: 46, height: 46, borderRadius: 23 },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", marginBottom: Spacing.xxl },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  sectionTitle: { fontSize: FontSize.md, fontWeight: "700", flex: 1 },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  countText: { fontSize: FontSize.xs, fontWeight: "700" },
  emptyState: { alignItems: "center", paddingVertical: Spacing.xxxl * 2 },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
});

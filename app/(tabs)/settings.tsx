import ActivityGrid from "@/components/ActivityGrid";
import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { Project } from "@/types";
import { getProjects } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileCenterScreen() {
  const { colors, borderRadius } = useTheme();
  const { t } = useI18n();
  const { profile } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useFocusEffect(
    useCallback(() => {
      getProjects().then(setProjects);
    }, []),
  );

  const cardHPadding = Spacing.md * 2;
  const screenHPadding = Spacing.xl * 2;
  const totalPadding = cardHPadding + screenHPadding;

  const quickActions = [
    {
      icon: "account-circle-outline" as const,
      title: t.profile,
      subtitle: t.manageProfile,
      action: () => router.push("/profile"),
    },
    {
      icon: "tag-multiple-outline" as const,
      title: t.manageTags,
      subtitle: t.manageTagsDesc,
      action: () => router.push("/manage-tags"),
    },
    {
      icon: "cloud-upload-outline" as const,
      title: t.backupSync,
      subtitle: t.cloudBackup,
      action: () => {},
    },
    {
      icon: "bell-outline" as const,
      title: t.notifications,
      subtitle: t.configureAlerts,
      action: () => {},
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
          <TouchableOpacity
            onPress={() => router.push("/app-settings")}
            activeOpacity={0.7}
            style={[
              styles.settingsBtn,
              {
                backgroundColor: colors.cardBg,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Activity */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.activity}
        </Text>
        <View
          style={[
            styles.heatmapCard,
            { backgroundColor: colors.cardBg, borderRadius: borderRadius.xl },
          ]}
        >
          <ActivityGrid projects={projects} containerPadding={totalPadding} />
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.quickActions}
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBg, borderRadius: borderRadius.xl },
          ]}
        >
          {quickActions.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.listItem,
                index < quickActions.length - 1 && [
                  styles.itemBorder,
                  { borderBottomColor: colors.border },
                ],
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <MaterialCommunityIcons
                  name={item.icon}
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

        {/* Settings Entry */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.general}
        </Text>
        <TouchableOpacity
          style={[
            styles.settingsEntry,
            { backgroundColor: colors.cardBg, borderRadius: borderRadius.xl },
          ]}
          onPress={() => router.push("/app-settings")}
          activeOpacity={0.7}
        >
          <View style={styles.settingsEntryIcon}>
            <MaterialCommunityIcons
              name="cog-outline"
              size={22}
              color={colors.primary}
            />
          </View>
          <View style={styles.settingsEntryContent}>
            <Text
              style={[styles.settingsEntryTitle, { color: colors.textPrimary }]}
            >
              {t.settingsPage}
            </Text>
            <Text
              style={[
                styles.settingsEntrySubtitle,
                { color: colors.textSecondary },
              ]}
            >
              {t.appearance}, {t.language}, {t.general}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textMuted }]}>
          Clean Tracker v1.0.0
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
  settingsEntry: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  settingsEntryIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingsEntryContent: { flex: 1 },
  settingsEntryTitle: {
    fontSize: FontSize.md,
    fontWeight: "600",
    marginBottom: 1,
  },
  settingsEntrySubtitle: { fontSize: FontSize.xs },
  version: {
    fontSize: FontSize.xs,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});

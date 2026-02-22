import ActivityGrid from "@/components/ActivityGrid";
import AppDialog from "@/components/AppDialog";
import { FontSize, Spacing } from "@/constants/theme";
import { Language, useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { Project } from "@/types";
import { getProjects, resetData } from "@/utils/storage";
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

type ThemeMode = "light" | "dark" | "system";

const THEME_OPTIONS: {
  mode: ThemeMode;
  labelKey: "light" | "dark" | "system";
  icon: string;
}[] = [
  { mode: "light", labelKey: "light", icon: "white-balance-sunny" },
  { mode: "dark", labelKey: "dark", icon: "moon-waning-crescent" },
  { mode: "system", labelKey: "system", icon: "cellphone" },
];

const LANG_OPTIONS: { lang: Language; label: string }[] = [
  { lang: "en", label: "EN" },
  { lang: "zh", label: "中文" },
];

export default function SettingsScreen() {
  const {
    colors,
    mode,
    setMode,
    borderRadiusScale,
    setBorderRadiusScale,
    borderRadius,
  } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { profile } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const [resetDoneVisible, setResetDoneVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getProjects().then(setProjects);
    }, []),
  );

  const handleResetConfirm = async () => {
    await resetData();
    setResetDialogVisible(false);
    setResetDoneVisible(true);
  };

  const cardHPadding = Spacing.md * 2;
  const screenHPadding = Spacing.xl * 2;
  const totalPadding = cardHPadding + screenHPadding;

  const settingsItems = [
    {
      icon: "account-circle-outline",
      title: t.profile,
      subtitle: t.manageProfile,
      action: () => router.push("/profile"),
    },
    {
      icon: "bell-outline",
      title: t.notifications,
      subtitle: t.configureAlerts,
      action: () => {},
    },
    {
      icon: "tag-multiple-outline",
      title: t.manageTags,
      subtitle: t.manageTagsDesc,
      action: () => router.push("/manage-tags"),
    },
    {
      icon: "cloud-upload-outline",
      title: t.backupSync,
      subtitle: t.cloudBackup,
      action: () => {},
    },
    {
      icon: "trash-can-outline",
      title: t.resetData,
      subtitle: t.deleteAllData,
      action: () => setResetDialogVisible(true),
      danger: true,
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
                  size={24}
                  color={colors.textMuted}
                />
              </View>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: Spacing.lg }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t.settings}
            </Text>
            {profile.name ? (
              <Text style={[styles.nameText, { color: colors.textSecondary }]}>
                {profile.name}
              </Text>
            ) : null}
          </View>
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

        {/* Appearance - inline chips */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.appearance}
        </Text>
        <View
          style={[
            styles.chipRow,
            { backgroundColor: colors.cardBg, borderRadius: borderRadius.lg },
          ]}
        >
          {THEME_OPTIONS.map((opt) => {
            const active = mode === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active
                      ? colors.primarySoft
                      : "transparent",
                    borderColor: active ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
                onPress={() => setMode(opt.mode)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={opt.icon as any}
                  size={15}
                  color={active ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {t[opt.labelKey]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Language - inline chips */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.language}
        </Text>
        <View
          style={[
            styles.chipRow,
            { backgroundColor: colors.cardBg, borderRadius: borderRadius.lg },
          ]}
        >
          {LANG_OPTIONS.map((opt) => {
            const active = lang === opt.lang;
            return (
              <TouchableOpacity
                key={opt.lang}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active
                      ? colors.primarySoft
                      : "transparent",
                    borderColor: active ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
                onPress={() => setLang(opt.lang)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Border Radius */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.borderRadius}
        </Text>
        <View
          style={[
            styles.chipRow,
            { backgroundColor: colors.cardBg, borderRadius: borderRadius.lg },
          ]}
        >
          {(
            [
              { scale: 0.5, label: t.sharp, radius: 2 },
              { scale: 1, label: t.medium, radius: 8 },
              { scale: 1.5, label: t.round, radius: 16 },
            ] as const
          ).map((opt) => {
            const active = borderRadiusScale === opt.scale;
            return (
              <TouchableOpacity
                key={opt.scale}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active
                      ? colors.primarySoft
                      : "transparent",
                    borderColor: active ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
                onPress={() => setBorderRadiusScale(opt.scale)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.brPreview,
                    {
                      backgroundColor: active
                        ? colors.primary
                        : colors.textMuted,
                      borderRadius: opt.radius,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* General */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t.general}
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBg, borderRadius: borderRadius.xl },
          ]}
        >
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.settingsItem,
                index < settingsItems.length - 1 && [
                  styles.itemBorder,
                  { borderBottomColor: colors.border },
                ],
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconBg,
                  {
                    backgroundColor: item.danger
                      ? "rgba(255,82,82,0.15)"
                      : colors.primarySoft,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={20}
                  color={item.danger ? colors.danger : colors.primary}
                />
              </View>
              <View style={styles.settingsContent}>
                <Text
                  style={[
                    styles.settingsTitle,
                    { color: item.danger ? colors.danger : colors.textPrimary },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.settingsSubtitle,
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
          Clean Tracker v1.0.0
        </Text>
      </ScrollView>

      {/* Reset confirmation dialog */}
      <AppDialog
        visible={resetDialogVisible}
        title={t.resetAllData}
        message={t.resetConfirm}
        onClose={() => setResetDialogVisible(false)}
        actions={[
          { label: t.cancel, onPress: () => setResetDialogVisible(false) },
          { label: t.reset, onPress: handleResetConfirm, destructive: true },
        ]}
      />

      {/* Reset done dialog */}
      <AppDialog
        visible={resetDoneVisible}
        title={t.done}
        message={t.resetSuccess}
        onClose={() => setResetDoneVisible(false)}
        actions={[{ label: t.done, onPress: () => setResetDoneVisible(false) }]}
      />
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
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: FontSize.xl, fontWeight: "700" },
  nameText: { fontSize: FontSize.sm, marginTop: 2 },
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
  chipRow: {
    flexDirection: "row",
    padding: Spacing.xs,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
  },
  chipText: { fontSize: FontSize.sm, fontWeight: "600" },
  card: {
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  itemBorder: { borderBottomWidth: StyleSheet.hairlineWidth },
  iconBg: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingsContent: { flex: 1 },
  settingsTitle: { fontSize: FontSize.md, fontWeight: "600", marginBottom: 1 },
  settingsSubtitle: { fontSize: FontSize.xs },
  version: {
    fontSize: FontSize.xs,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
  brPreview: {
    width: 18,
    height: 14,
  },
});

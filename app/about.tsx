import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const APP_VERSION = "1.1.0";

const INFO_ITEMS = [
  { labelKey: "version" as const, value: APP_VERSION },
  { labelKey: "techStack" as const, value: "React Native + Expo" },
  { labelKey: "developer" as const, value: "R1cky" },
];

export default function AboutScreen() {
  const { colors, borderRadius, cardShadow } = useTheme();
  const { t } = useI18n();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t.about}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoBg,
              {
                backgroundColor: colors.primarySoft,
                borderRadius: borderRadius.xl,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={48}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>
            Clean Tracker
          </Text>
          <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
            v{APP_VERSION}
          </Text>
        </View>

        {/* Info Items */}
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
          {INFO_ITEMS.map((item, index) => (
            <View
              key={item.labelKey}
              style={[
                styles.infoRow,
                index < INFO_ITEMS.length - 1 && [
                  styles.rowBorder,
                  { borderBottomColor: colors.border },
                ],
              ]}
            >
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {t[item.labelKey]}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Feedback */}
        <TouchableOpacity
          style={[
            styles.feedbackBtn,
            {
              backgroundColor: colors.cardBgLight,
              borderRadius: borderRadius.xl,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            },
            cardShadow,
          ]}
          onPress={() => Linking.openURL("mailto:feedback@cleantracker.app")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={[styles.feedbackText, { color: colors.textPrimary }]}>
            {t.feedbackEmail}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        <Text style={[styles.footer, { color: colors.textMuted }]}>
          Made with ❤️ by R1cky
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  logoBg: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize.xxl || 24,
    fontWeight: "700",
  },
  appVersion: {
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  card: {
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: FontSize.md,
  },
  infoValue: {
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  feedbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  feedbackText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  footer: {
    fontSize: FontSize.xs,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});

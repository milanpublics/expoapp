import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Project, PROJECT_CATEGORIES } from "@/types";
import { getProjects } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArchivedProjectsScreen() {
  const { colors, borderRadius, cardShadow } = useTheme();
  const { t } = useI18n();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      getProjects().then((all) =>
        setProjects(all.filter((p) => p.status === "completed")),
      );
    }, []),
  );

  const getCategoryIcon = (key: string) => {
    const cat = PROJECT_CATEGORIES.find((c) => c.key === key);
    return cat?.icon || "folder-outline";
  };

  const renderItem = ({ item }: { item: Project }) => {
    const completedTasks = item.tasks.filter((t) => t.completed).length;
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
        ]}
        onPress={() => router.push(`/project/${item.id}`)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.color + "20",
              borderRadius: borderRadius.sm,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getCategoryIcon(item.category) as any}
            size={22}
            color={item.color}
          />
        </View>
        <View style={styles.cardContent}>
          <Text
            style={[styles.cardTitle, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            {completedTasks}/{item.tasks.length} {t.tasks}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="check-circle"
          size={20}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

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
          {t.archivedProjects}
        </Text>
        <View style={styles.backBtn} />
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchBar,
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
          name="magnify"
          size={20}
          color={colors.textMuted}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder={t.searchProjects}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {projects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="archive-outline"
            size={64}
            color={colors.textMuted}
          />
          <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
            {t.noArchivedProjects}
          </Text>
          <Text style={[styles.emptyHint, { color: colors.textMuted }]}>
            {t.noArchivedProjectsHint}
          </Text>
        </View>
      ) : (
        <FlatList
          data={projects.filter((p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: FontSize.md, fontWeight: "600", marginBottom: 2 },
  cardSubtitle: { fontSize: FontSize.xs },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: "600",
    marginTop: Spacing.lg,
  },
  emptyHint: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    paddingVertical: 4,
  },
});

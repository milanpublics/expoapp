import AppDialog from "@/components/AppDialog";
import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { CustomTag, TAG_COLORS } from "@/types";
import { addTag, deleteTag, getProjects, getTags } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_TAG_LENGTH = 8;

export default function ManageTagsScreen() {
  const router = useRouter();
  const { colors, isDark, borderRadius } = useTheme();
  const { t } = useI18n();
  const [tags, setTags] = useState<CustomTag[]>([]);
  const [tagUsage, setTagUsage] = useState<Record<string, number>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CustomTag | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    const [allTags, allProjects] = await Promise.all([
      getTags(),
      getProjects(),
    ]);
    setTags(allTags);
    // Count usage per tag
    const usage: Record<string, number> = {};
    for (const tag of allTags) {
      usage[tag.id] = allProjects.filter(
        (p) => p.tags && p.tags.includes(tag.id),
      ).length;
    }
    setTagUsage(usage);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const randomColor = () => {
    const usedColors = tags.map((t) => t.color);
    const available = TAG_COLORS.filter((c) => !usedColors.includes(c));
    const pool = available.length > 0 ? available : TAG_COLORS;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newTag: CustomTag = {
      id: `tag_${Date.now()}`,
      name,
      color: randomColor(),
    };
    await addTag(newTag);
    setNewName("");
    setIsCreating(false);
    await loadData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await deleteTag(deleteTarget.id);
    setDeleteTarget(null);
    await loadData();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t.manageTags}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.cardBgLight,
            borderRadius: borderRadius.lg,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.textMuted}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder={t.searchTags}
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tags.length === 0 && !isCreating && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="tag-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
              {t.noTags}
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textMuted }]}>
              {t.noTagsHint}
            </Text>
          </View>
        )}

        {tags
          .filter((tag) =>
            tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map((tag) => (
            <TouchableOpacity
              key={tag.id}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/tag-projects",
                  params: { tagId: tag.id },
                })
              }
            >
              <View
                style={[
                  styles.tagRow,
                  {
                    backgroundColor: colors.cardBgLight,
                    borderRadius: borderRadius.lg,
                  },
                ]}
              >
                <View
                  style={[styles.colorDot, { backgroundColor: tag.color }]}
                />
                <View style={styles.tagInfo}>
                  <Text
                    style={[styles.tagName, { color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {tag.name}
                  </Text>
                  <Text style={[styles.tagUsage, { color: colors.textMuted }]}>
                    {t.tagUsedCount(tagUsage[tag.id] || 0)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(tag);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={20}
                    color={colors.danger}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

        {/* Create tag inline */}
        {isCreating ? (
          <View
            style={[
              styles.createRow,
              {
                backgroundColor: colors.cardBgLight,
                borderRadius: borderRadius.lg,
              },
            ]}
          >
            <TextInput
              style={[styles.createInput, { color: colors.textPrimary }]}
              placeholder={t.enterTagName}
              placeholderTextColor={colors.textMuted}
              value={newName}
              onChangeText={(v) => {
                if (v.length <= MAX_TAG_LENGTH) setNewName(v);
              }}
              autoFocus
              maxLength={MAX_TAG_LENGTH}
              onSubmitEditing={handleCreate}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={handleCreate}
              disabled={!newName.trim()}
              style={[
                styles.createBtn,
                {
                  backgroundColor: newName.trim()
                    ? colors.primary
                    : colors.textMuted + "40",
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <Text
                style={{
                  color: newName.trim() ? "#FFF" : colors.textSecondary,
                  fontWeight: "700",
                  fontSize: FontSize.sm,
                }}
              >
                {t.add}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsCreating(false);
                setNewName("");
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.addBtn,
              {
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
              },
            ]}
            onPress={() => setIsCreating(true)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="plus"
              size={22}
              color={colors.primary}
            />
            <Text style={[styles.addBtnText, { color: colors.primary }]}>
              {t.addTag}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <AppDialog
        visible={!!deleteTarget}
        title={t.deleteTagTitle}
        message={deleteTarget ? t.deleteTagConfirm(deleteTarget.name) : ""}
        onClose={() => setDeleteTarget(null)}
        actions={[
          { label: t.cancel, onPress: () => setDeleteTarget(null) },
          {
            label: t.deleteTagTitle,
            onPress: handleDelete,
            destructive: true,
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl * 2,
    gap: Spacing.sm,
  },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: "600" },
  emptyHint: { fontSize: FontSize.sm },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: Spacing.md,
  },
  tagInfo: { flex: 1 },
  tagName: { fontSize: FontSize.md, fontWeight: "600", marginBottom: 2 },
  tagUsage: { fontSize: FontSize.xs },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  createInput: {
    flex: 1,
    fontSize: FontSize.md,
    paddingVertical: 4,
  },
  createBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: Spacing.sm,
  },
  addBtnText: { fontSize: FontSize.md, fontWeight: "600" },
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

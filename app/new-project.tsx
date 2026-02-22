import DatePicker from "@/components/DatePicker";
import TagSelector from "@/components/TagSelector";
import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
    Priority,
    PRIORITY_LEVELS,
    Project,
    PROJECT_CATEGORIES,
} from "@/types";
import { addProject } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export default function NewProjectScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const { t, lang } = useI18n();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    PROJECT_CATEGORIES[0].key,
  );
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customIconUri, setCustomIconUri] = useState<string | undefined>(
    undefined,
  );
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const catDef =
    PROJECT_CATEGORIES.find((c) => c.key === selectedCategory) ||
    PROJECT_CATEGORIES[0];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("", "Permission to access the photo library is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE_BYTES) {
        Alert.alert("", t.imageTooLarge);
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCustomIconUri(asset.uri);
      setImageUrl("");
    }
  };

  const applyUrl = () => {
    const url = imageUrl.trim();
    if (url) setCustomIconUri(url);
  };

  const clearCustomIcon = () => {
    setCustomIconUri(undefined);
    setImageUrl("");
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newProject: Project = {
      id: `p_${Date.now()}`,
      title: title.trim(),
      icon: catDef.icon,
      customIconUri,
      color: catDef.color,
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate ? dueDate.toISOString().slice(0, 10) : undefined,
      status: "active",
      tasks: [],
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      createdAt: new Date().toISOString(),
    };
    await addProject(newProject);
    router.back();
  };

  const previewIcon = () => {
    if (customIconUri) {
      return (
        <Image
          source={{ uri: customIconUri }}
          style={[styles.previewCustomIcon, { borderRadius: borderRadius.xl }]}
        />
      );
    }
    return (
      <MaterialCommunityIcons
        name={catDef.icon as any}
        size={32}
        color={catDef.color}
      />
    );
  };

  const formatDate = (d: Date) => {
    const locale = lang === "zh" ? "zh-CN" : "en-US";
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t.newProject}
          </Text>
          <TouchableOpacity
            onPress={handleCreate}
            disabled={!title.trim()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={[
                styles.createBtn,
                { color: colors.primary },
                !title.trim() && styles.createBtnDisabled,
              ]}
            >
              {t.create}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Preview */}
          <View style={styles.previewCard}>
            <View
              style={[
                styles.previewIcon,
                {
                  backgroundColor: customIconUri
                    ? "transparent"
                    : catDef.color + "20",
                  borderRadius: borderRadius.xl,
                },
              ]}
            >
              {previewIcon()}
            </View>
            <Text style={[styles.previewTitle, { color: colors.textPrimary }]}>
              {title || t.projectName}
            </Text>
          </View>

          {/* Name */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.projectName}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBgLight,
                color: colors.textPrimary,
                borderRadius: borderRadius.md,
              },
            ]}
            placeholder={t.enterProjectName}
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          {/* Priority */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.priority}
          </Text>
          <View style={styles.priorityRow}>
            {PRIORITY_LEVELS.map((p) => {
              const active = selectedPriority === p.key;
              const label = (t as any)[`pri_${p.key}`] || p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[
                    styles.priChip,
                    {
                      backgroundColor: active
                        ? p.color + "20"
                        : colors.cardBgLight,
                      borderColor: active ? p.color : "transparent",
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  onPress={() => {
                    setSelectedPriority(p.key);
                    Haptics.selectionAsync();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.priDot, { backgroundColor: p.color }]} />
                  <Text
                    style={[
                      styles.priChipText,
                      { color: active ? p.color : colors.textSecondary },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tags */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.tags}
          </Text>
          <TagSelector
            selectedTagIds={selectedTags}
            onToggle={(id) =>
              setSelectedTags((prev) =>
                prev.includes(id)
                  ? prev.filter((tid) => tid !== id)
                  : [...prev, id],
              )
            }
            onTagCreated={(tag) => setSelectedTags((prev) => [...prev, tag.id])}
          />

          {/* Custom Image */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.customImage}
          </Text>
          <View style={styles.customImageRow}>
            <TouchableOpacity
              style={[
                styles.imageBtn,
                {
                  backgroundColor: colors.cardBgLight,
                  borderRadius: borderRadius.full,
                },
              ]}
              onPress={pickImage}
            >
              <MaterialCommunityIcons
                name="image-plus"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.imageBtnText, { color: colors.primary }]}>
                {t.chooseImage}
              </Text>
            </TouchableOpacity>
            {customIconUri && (
              <TouchableOpacity
                style={[
                  styles.imageBtn,
                  {
                    backgroundColor: colors.cardBgLight,
                    borderRadius: borderRadius.full,
                  },
                ]}
                onPress={clearCustomIcon}
              >
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={18}
                  color={colors.danger}
                />
                <Text style={[styles.imageBtnText, { color: colors.danger }]}>
                  {t.clearImage}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBgLight,
                color: colors.textPrimary,
                borderRadius: borderRadius.md,
              },
            ]}
            placeholder={t.orEnterUrl}
            placeholderTextColor={colors.textMuted}
            value={imageUrl}
            onChangeText={setImageUrl}
            onEndEditing={applyUrl}
            autoCapitalize="none"
            keyboardType="url"
          />

          {/* Due Date */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t.dueDateOptional}
          </Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={[
                styles.dateBtn,
                {
                  backgroundColor: colors.cardBgLight,
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialCommunityIcons
                name="calendar-outline"
                size={18}
                color={colors.primary}
              />
              <Text
                style={[
                  styles.dateBtnText,
                  { color: dueDate ? colors.textPrimary : colors.textMuted },
                ]}
              >
                {dueDate ? formatDate(dueDate) : t.selectDate}
              </Text>
            </TouchableOpacity>
            {dueDate && (
              <TouchableOpacity
                style={[
                  styles.dateBtn,
                  {
                    backgroundColor: colors.cardBgLight,
                    borderRadius: borderRadius.md,
                  },
                ]}
                onPress={() => setDueDate(undefined)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={16}
                  color={colors.danger}
                />
                <Text style={[styles.dateBtnText, { color: colors.danger }]}>
                  {t.clearDate}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <DatePicker
            visible={showDatePicker}
            value={dueDate}
            minimumDate={new Date()}
            onDateChange={setDueDate}
            onClose={() => setShowDatePicker(false)}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  createBtn: { fontSize: FontSize.md, fontWeight: "700" },
  createBtnDisabled: { opacity: 0.3 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl },
  previewCard: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  previewIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  previewCustomIcon: { width: 72, height: 72 },
  previewTitle: { fontSize: FontSize.xl, fontWeight: "700" },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
  },
  input: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    fontSize: FontSize.md,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
  },
  catChipText: { fontSize: FontSize.sm, fontWeight: "600" },
  priorityRow: { flexDirection: "row", gap: Spacing.sm },
  priChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1.5,
  },
  priDot: { width: 8, height: 8, borderRadius: 4 },
  priChipText: { fontSize: FontSize.sm, fontWeight: "600" },
  customImageRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  imageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  imageBtnText: { fontSize: FontSize.sm, fontWeight: "600" },
  dateRow: { flexDirection: "row", gap: Spacing.md },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dateBtnText: { fontSize: FontSize.md },
});

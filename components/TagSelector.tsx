import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { CustomTag, TAG_COLORS, tagTextColor } from "@/types";
import { addTag, getTags } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const MAX_TAG_LENGTH = 8;

interface TagSelectorProps {
  selectedTagIds: string[];
  onToggle: (id: string) => void;
  /** Called after a new tag is created so parent can auto-select it */
  onTagCreated?: (tag: CustomTag) => void;
}

export default function TagSelector({
  selectedTagIds,
  onToggle,
  onTagCreated,
}: TagSelectorProps) {
  const { colors, isDark, borderRadius } = useTheme();
  const { t } = useI18n();
  const [tags, setTags] = useState<CustomTag[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  const refreshTags = async () => {
    const latest = await getTags();
    setTags(latest);
  };

  const randomColor = () => {
    const usedColors = tags.map((t) => t.color);
    const available = TAG_COLORS.filter((c) => !usedColors.includes(c));
    const pool = available.length > 0 ? available : TAG_COLORS;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleCreateTag = async () => {
    const name = newName.trim();
    if (!name) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newTag: CustomTag = {
      id: `tag_${Date.now()}`,
      name,
      color: randomColor(),
    };
    await addTag(newTag);
    await refreshTags();
    setNewName("");
    setIsCreating(false);
    onTagCreated?.(newTag);
  };

  return (
    <View>
      <View style={styles.wrap}>
        {tags.map((tag) => {
          const selected = selectedTagIds.includes(tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.chip,
                {
                  backgroundColor: selected
                    ? tag.color
                    : isDark
                      ? "#ffffff10"
                      : "#f5f5f5",
                  borderColor: selected ? tag.color : "transparent",
                  borderRadius: borderRadius.full,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                onToggle(tag.id);
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.tagDot,
                  {
                    backgroundColor: selected
                      ? tagTextColor(tag.color)
                      : tag.color,
                  },
                ]}
              />
              <Text
                style={[
                  styles.chipText,
                  {
                    color: selected
                      ? tagTextColor(tag.color)
                      : colors.textSecondary,
                  },
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* New tag button / inline input */}
        {isCreating ? (
          <View
            style={[
              styles.inlineInput,
              {
                backgroundColor: isDark ? "#ffffff10" : "#f5f5f5",
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <TextInput
              style={[styles.inputText, { color: colors.textPrimary }]}
              placeholder={t.enterTagName}
              placeholderTextColor={colors.textMuted}
              value={newName}
              onChangeText={(v) => {
                if (v.length <= MAX_TAG_LENGTH) setNewName(v);
              }}
              autoFocus
              maxLength={MAX_TAG_LENGTH}
              onSubmitEditing={handleCreateTag}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={handleCreateTag}
              disabled={!newName.trim()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={newName.trim() ? colors.primary : colors.textMuted}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsCreating(false);
                setNewName("");
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons
                name="close"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.addChip,
              {
                borderColor: colors.border,
                borderRadius: borderRadius.full,
              },
            ]}
            onPress={() => setIsCreating(true)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="plus"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.addChipText, { color: colors.primary }]}>
              {t.addTag}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addChipText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  inlineInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  inputText: {
    fontSize: FontSize.sm,
    minWidth: 100,
    paddingVertical: 2,
  },
});

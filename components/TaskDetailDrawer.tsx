import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { PRIORITY_LEVELS, Task } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface TaskDetailDrawerProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
}

export default function TaskDetailDrawer({
  task,
  visible,
  onClose,
}: TaskDetailDrawerProps) {
  const { colors, isDark, borderRadius } = useTheme();
  const { t } = useI18n();

  if (!task) return null;

  const priDef = task.priority
    ? PRIORITY_LEVELS.find((p) => p.key === task.priority)
    : null;
  const priLabel = priDef
    ? (t as any)[`pri_${priDef.key}`] || priDef.key
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? colors.cardBg : colors.cardBgLight,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              {t.taskDetail}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <View style={styles.section}>
              <View style={styles.titleRow}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: task.completed
                        ? colors.primary
                        : colors.textMuted,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.taskTitle,
                    { color: colors.textPrimary },
                    task.completed && {
                      color: colors.textMuted,
                      textDecorationLine: "line-through",
                    },
                  ]}
                >
                  {task.title}
                </Text>
              </View>
            </View>

            {/* Priority */}
            {priDef && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionLabel, { color: colors.textMuted }]}
                >
                  {t.taskPriority}
                </Text>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: priDef.color + "18" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="flag"
                    size={14}
                    color={priDef.color}
                  />
                  <Text style={[styles.priorityText, { color: priDef.color }]}>
                    {priLabel}
                  </Text>
                </View>
              </View>
            )}

            {/* Description */}
            {task.description ? (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionLabel, { color: colors.textMuted }]}
                >
                  {t.taskDescription}
                </Text>
                <Text
                  style={[
                    styles.descriptionText,
                    {
                      color: colors.textSecondary,
                      backgroundColor: isDark ? "#ffffff08" : colors.surfaceBg,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                >
                  {task.description}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  container: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === "ios" ? 40 : Spacing.xl,
    maxHeight: "70%",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  scrollBody: {
    flexGrow: 0,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    flexShrink: 1,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priorityText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  descriptionText: {
    fontSize: FontSize.md,
    lineHeight: 22,
    padding: Spacing.md,
  },
});

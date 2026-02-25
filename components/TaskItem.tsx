import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { PRIORITY_LEVELS, Task } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete?: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { colors, borderRadius, cardShadow } = useTheme();
  const { t } = useI18n();
  const swipeableRef = useRef<Swipeable>(null);

  const priDef = task.priority
    ? PRIORITY_LEVELS.find((p) => p.key === task.priority)
    : null;

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={[styles.deleteWrapper, { borderRadius: borderRadius.lg }]}>
        <TouchableOpacity
          style={[
            styles.deleteBtn,
            { backgroundColor: colors.danger, borderRadius: borderRadius.lg },
          ]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.();
          }}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color="#FFF"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={onDelete ? renderRightActions : undefined}
      overshootRight={false}
    >
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.cardBgLight,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            borderRadius: borderRadius.lg,
          },
          cardShadow,
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.circle,
            { borderColor: colors.textMuted },
            task.completed && {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
        >
          {task.completed && (
            <MaterialCommunityIcons
              name="check"
              size={14}
              color={colors.background}
            />
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary },
                task.completed && {
                  color: colors.textMuted,
                  textDecorationLine: "line-through",
                },
              ]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            {priDef &&
              (task.priority === "high" || task.priority === "urgent") &&
              !task.completed && (
                <MaterialCommunityIcons
                  name="flag"
                  size={14}
                  color={priDef.color}
                />
              )}
          </View>
          {task.description ? (
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: "500",
    flexShrink: 1,
  },
  description: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  deleteWrapper: {
    overflow: "hidden",
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  deleteBtn: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

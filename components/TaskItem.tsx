import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { Task } from "@/types";
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
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

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
      <TouchableOpacity
        style={[styles.deleteBtn, { backgroundColor: colors.danger }]}
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
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  title: {
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  description: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  deleteBtn: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});

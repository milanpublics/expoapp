import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { Task } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: colors.border }]}
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
});

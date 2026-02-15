import AppDialog from "@/components/AppDialog";
import ProgressBar from "@/components/ProgressBar";
import TaskInputModal from "@/components/TaskInputModal";
import TaskItem from "@/components/TaskItem";
import { BorderRadius, FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Project, Task } from "@/types";
import { deleteProject, getProject, updateProject } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const [project, setProject] = useState<Project | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (id) getProject(id).then(setProject);
    }, [id]),
  );

  const toggleTask = async (taskId: string) => {
    if (!project) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newTasks = project.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t,
    );
    const allDone = newTasks.length > 0 && newTasks.every((t) => t.completed);
    const wasCompleted = project.status === "completed";
    let newStatus = project.status;
    if (allDone) newStatus = "completed";
    else if (wasCompleted) newStatus = "active";
    const updated = {
      ...project,
      tasks: newTasks,
      status: newStatus as Project["status"],
    };
    setProject(updated);
    await updateProject(updated);
  };

  const toggleHold = async () => {
    if (!project) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newStatus = project.status === "on-hold" ? "active" : "on-hold";
    const updated = { ...project, status: newStatus as Project["status"] };
    setProject(updated);
    await updateProject(updated);
  };

  const addTask = async (title: string, description: string) => {
    if (!project) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newTask: Task = {
      id: `t_${Date.now()}`,
      title: title,
      description: description,
      completed: false,
    };
    const updated = { ...project, tasks: [...project.tasks, newTask] };
    setProject(updated);
    setTaskModalVisible(false);
    await updateProject(updated);
  };

  const markComplete = async () => {
    if (!project) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = {
      ...project,
      status: "completed" as const,
      tasks: project.tasks.map((t) => ({ ...t, completed: true })),
    };
    setProject(updated);
    await updateProject(updated);
    router.back();
  };

  const confirmDelete = async () => {
    setDeleteDialogVisible(false);
    if (id) {
      await deleteProject(id);
      router.back();
    }
  };

  const confirmTaskDelete = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const deleteTask = async () => {
    if (!project || !taskToDelete) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = {
      ...project,
      tasks: project.tasks.filter((t) => t.id !== taskToDelete),
    };
    setProject(updated);
    setTaskToDelete(null);
    await updateProject(updated);
  };

  if (!project) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loading}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t.loading}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedCount = project.tasks.filter((t) => t.completed).length;
  const totalCount = project.tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const formatDueDate = () => {
    if (!project.dueDate) return null;
    const d = new Date(project.dueDate);
    const locale = lang === "zh" ? "zh-CN" : "en-US";
    return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
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
            style={styles.headerBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            {project.status !== "completed" && (
              <TouchableOpacity
                onPress={toggleHold}
                style={styles.headerBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name={
                    project.status === "on-hold"
                      ? "play-circle-outline"
                      : "pause-circle-outline"
                  }
                  size={22}
                  color={colors.amber}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/edit-project",
                  params: { id: project.id },
                })
              }
              style={styles.headerBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={22}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteDialogVisible(true)}
              style={styles.headerBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color={colors.danger}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {project.title}
          </Text>

          <View style={styles.meta}>
            {formatDueDate() && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.metaText, { color: colors.textSecondary }]}
                >
                  {t.due} {formatDueDate()}
                </Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {completedCount}/{totalCount} {t.tasks}
              </Text>
            </View>
          </View>

          <ProgressBar progress={progress} label={t.progress} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {project.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => confirmTaskDelete(task.id)}
            />
          ))}

          <TouchableOpacity
            style={[
              styles.addTaskBtn,
              {
                borderRadius: BorderRadius.lg,
                // backgroundColor: isDark ? "#ffffff10" : "#f5f5f5",
              },
            ]}
            onPress={() => setTaskModalVisible(true)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color={colors.primary}
            />
            <Text
              style={[
                styles.addTaskText,
                { color: colors.primary, marginLeft: Spacing.sm },
              ]}
            >
              {t.addNewTask}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        {project.status !== "completed" && (
          <View
            style={[styles.bottomBar, { backgroundColor: colors.background }]}
          >
            <TouchableOpacity
              style={[
                styles.completeBtn,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
              onPress={markComplete}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color={colors.background}
              />
              <Text
                style={[styles.completeBtnText, { color: colors.background }]}
              >
                {t.markComplete}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      <AppDialog
        visible={deleteDialogVisible}
        title={t.deleteProject}
        message={t.deleteConfirm(project.title)}
        onClose={() => setDeleteDialogVisible(false)}
        actions={[
          { label: t.cancel, onPress: () => setDeleteDialogVisible(false) },
          { label: t.deleteProject, onPress: confirmDelete, destructive: true },
        ]}
      />

      <TaskInputModal
        visible={taskModalVisible}
        onClose={() => setTaskModalVisible(false)}
        onAdd={addTask}
      />

      <AppDialog
        visible={!!taskToDelete}
        title={t.deleteTask}
        message={t.deleteTaskConfirm}
        onClose={() => setTaskToDelete(null)}
        actions={[
          { label: t.cancel, onPress: () => setTaskToDelete(null) },
          { label: t.deleteTask, onPress: deleteTask, destructive: true },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: FontSize.md },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
  },
  headerRight: { flexDirection: "row", gap: Spacing.xs },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: FontSize.sm },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.md },
  addTaskBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: "transparent",
    borderStyle: "dashed",
  },
  addTaskText: {
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  completeBtnText: {
    fontSize: FontSize.md,
    fontWeight: "700",
    marginLeft: Spacing.sm,
  },
});

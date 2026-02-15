import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface TaskInputModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string) => void;
}

export default function TaskInputModal({
  visible,
  onClose,
  onAdd,
}: TaskInputModalProps) {
  const { colors, isDark, borderRadius } = useTheme();
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (visible) {
      setTitle("");
      setDescription("");
    }
  }, [visible]);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? colors.cardBg : "#FFFFFF",
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t.addNewTask}
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

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: isDark ? "#ffffff10" : "#f5f5f5",
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder={t.taskTitle}
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus={true} // Auto focus on open
            />

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  color: colors.textPrimary,
                  backgroundColor: isDark ? "#ffffff10" : "#f5f5f5",
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder={t.taskDescription}
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: isDark ? "#ffffff20" : "#e0e0e0",
                  borderRadius: borderRadius.lg,
                },
              ]}
              onPress={onClose}
            >
              <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>
                {t.cancel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: title.trim()
                    ? colors.primary
                    : colors.textMuted + "40",
                  borderRadius: borderRadius.lg,
                  flex: 1,
                  marginLeft: Spacing.md,
                },
              ]}
              onPress={handleAdd}
              disabled={!title.trim()}
            >
              <Text
                style={{
                  color: title.trim() ? "#FFFFFF" : colors.textSecondary,
                  fontWeight: "700",
                }}
              >
                {t.add}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === "ios" ? 40 : Spacing.xl, // Safe area for iOS
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
  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  inputContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  input: {
    fontSize: FontSize.md,
    padding: Spacing.md,
  },
  textArea: {
    height: 100,
  },
  footer: {
    flexDirection: "row",
  },
  btn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});

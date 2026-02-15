import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export interface DialogAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface AppDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: DialogAction[];
  onClose: () => void;
  children?: React.ReactNode;
}

export default function AppDialog({
  visible,
  title,
  message,
  actions,
  onClose,
  children,
}: AppDialogProps) {
  const { colors, isDark, borderRadius } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.cardBg : "#FFFFFF",
                  borderRadius: borderRadius.xl,
                },
              ]}
            >
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
              {message ? (
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                  {message}
                </Text>
              ) : null}
              {children}
              <View style={styles.actions}>
                {actions.map((action, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: action.destructive
                          ? colors.danger
                          : colors.primary,
                        borderRadius: borderRadius.md,
                      },
                      i > 0 && { marginLeft: Spacing.sm },
                    ]}
                    onPress={action.onPress}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xxxl,
  },
  card: {
    width: "100%",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: FontSize.md,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: Spacing.md,
  },
  actionBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    minWidth: 80,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
});

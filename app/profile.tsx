import { BorderRadius, FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, cardShadow } = useTheme();
  const { t } = useI18n();
  const { profile, setName, setAvatar } = useUser();
  const [nameInput, setNameInput] = useState(profile.name);

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
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAvatar(result.assets[0].uri);
    }
  };

  const removeAvatar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAvatar(null);
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setName(nameInput.trim());
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
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
          {t.editProfile}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.saveBtn, { color: colors.primary }]}>
            {t.save}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {profile.avatarUri ? (
            <Image
              source={{ uri: profile.avatarUri }}
              style={styles.avatarImage}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.cardBgLight },
              ]}
            >
              <MaterialCommunityIcons
                name="account"
                size={56}
                color={colors.textMuted}
              />
            </View>
          )}
          <View
            style={[styles.cameraIcon, { backgroundColor: colors.primary }]}
          >
            <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.avatarActions}>
          <TouchableOpacity
            style={[styles.avatarBtn, { backgroundColor: colors.cardBgLight }]}
            onPress={pickImage}
          >
            <MaterialCommunityIcons
              name="image-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={[styles.avatarBtnText, { color: colors.primary }]}>
              {t.chooseFromLibrary}
            </Text>
          </TouchableOpacity>
          {profile.avatarUri && (
            <TouchableOpacity
              style={[
                styles.avatarBtn,
                { backgroundColor: colors.cardBgLight },
              ]}
              onPress={removeAvatar}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={18}
                color={colors.danger}
              />
              <Text style={[styles.avatarBtnText, { color: colors.danger }]}>
                {t.removeAvatar}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Name Input */}
      <View style={styles.inputSection}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t.yourName}
        </Text>
        <View
          style={[
            {
              borderRadius: BorderRadius.md,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              overflow: "hidden",
            },
            cardShadow,
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBgLight,
                color: colors.textPrimary,
              },
            ]}
            placeholder={t.enterYourName}
            placeholderTextColor={colors.textMuted}
            value={nameInput}
            onChangeText={setNameInput}
            autoFocus={!profile.name}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </View>
      </View>
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
  saveBtn: { fontSize: FontSize.md, fontWeight: "700" },
  avatarSection: {
    alignItems: "center",
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  avatarWrapper: { position: "relative", marginBottom: Spacing.lg },
  avatarImage: { width: 110, height: 110, borderRadius: 55 },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarActions: { flexDirection: "row", gap: Spacing.md },
  avatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  avatarBtnText: { fontSize: FontSize.sm, fontWeight: "600" },
  inputSection: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    fontSize: FontSize.md,
  },
});

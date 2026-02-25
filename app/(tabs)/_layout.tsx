import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function TabLayout() {
  const { colors, borderRadius } = useTheme();
  const { t } = useI18n();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.cardBgLight,
          borderTopWidth: 0,
          height: Platform.OS === "android" ? 64 : 84,
          paddingBottom: Platform.OS === "android" ? 10 : 28,
          paddingTop: 8,
          marginHorizontal: 16,
          marginBottom: Platform.OS === "android" ? 8 : 0,
          borderRadius: 999,
          elevation: 0,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          // subtle shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.home,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.addBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </View>
          ),
          tabBarLabel: () => null,
          tabBarIconStyle: {
            marginTop: Platform.OS === "android" ? 0 : 6,
          },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/new-project");
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabProfileCenter,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});

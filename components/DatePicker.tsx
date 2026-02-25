import { FontSize, Spacing } from "@/constants/theme";
import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface DatePickerProps {
  visible: boolean;
  value?: Date;
  minimumDate?: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAYS_ZH = ["日", "一", "二", "三", "四", "五", "六"];
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_ZH = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBefore(a: Date, b: Date) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return da < db;
}

export default function DatePicker({
  visible,
  value,
  minimumDate,
  onDateChange,
  onClose,
}: DatePickerProps) {
  const { colors, borderRadius } = useTheme();
  const { lang } = useI18n();
  const today = new Date();
  const initial = value || today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const weekdays = lang === "zh" ? WEEKDAYS_ZH : WEEKDAYS_EN;
  const months = lang === "zh" ? MONTHS_ZH : MONTHS_EN;

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const startDay = getStartDayOfWeek(viewYear, viewMonth);
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else setViewMonth(viewMonth + 1);
  };

  const canGoPrev = () => {
    if (!minimumDate) return true;
    const prevDate =
      viewMonth === 0
        ? new Date(viewYear - 1, 11, 1)
        : new Date(viewYear, viewMonth - 1, 1);
    const minMonth = new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      1,
    );
    return prevDate >= minMonth;
  };

  const selectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    if (minimumDate && isBefore(selected, minimumDate)) return;
    onDateChange(selected);
    onClose();
  };

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
                  backgroundColor: colors.cardBgLight,
                  borderRadius: borderRadius.xl,
                },
              ]}
            >
              {/* Month/Year header */}
              <View style={styles.headerRow}>
                <TouchableOpacity
                  onPress={prevMonth}
                  disabled={!canGoPrev()}
                  style={styles.arrowBtn}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={24}
                    color={canGoPrev() ? colors.textPrimary : colors.textMuted}
                  />
                </TouchableOpacity>
                <Text
                  style={[styles.monthLabel, { color: colors.textPrimary }]}
                >
                  {lang === "zh"
                    ? `${viewYear}年 ${months[viewMonth]}`
                    : `${months[viewMonth]} ${viewYear}`}
                </Text>
                <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>

              {/* Weekday headers */}
              <View style={styles.weekRow}>
                {weekdays.map((wd, i) => (
                  <View key={i} style={styles.dayCell}>
                    <Text
                      style={[styles.weekdayText, { color: colors.textMuted }]}
                    >
                      {wd}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar grid */}
              <View style={styles.grid}>
                {calendarDays.map((day, i) => {
                  if (day === null) {
                    return <View key={`e_${i}`} style={styles.dayCell} />;
                  }
                  const d = new Date(viewYear, viewMonth, day);
                  const isSelected = value && isSameDay(d, value);
                  const isToday = isSameDay(d, today);
                  const disabled = minimumDate
                    ? isBefore(d, minimumDate)
                    : false;

                  return (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayCell,
                        isSelected && [
                          styles.selectedDay,
                          { backgroundColor: colors.primary },
                        ],
                        isToday &&
                          !isSelected && [
                            styles.todayDay,
                            { borderColor: colors.primary },
                          ],
                      ]}
                      onPress={() => !disabled && selectDay(day)}
                      activeOpacity={disabled ? 1 : 0.6}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color: disabled
                              ? colors.textMuted
                              : colors.textPrimary,
                          },
                          isSelected && { color: "#FFFFFF" },
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const CELL_SIZE = 40;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  card: {
    width: "100%",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  monthLabel: { fontSize: FontSize.lg, fontWeight: "700" },
  weekRow: { flexDirection: "row", marginBottom: Spacing.xs },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: `${100 / 7}%`,
    height: CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayText: { fontSize: FontSize.xs, fontWeight: "600" },
  dayText: { fontSize: FontSize.sm, fontWeight: "500" },
  selectedDay: { borderRadius: CELL_SIZE / 2 },
  todayDay: { borderRadius: CELL_SIZE / 2, borderWidth: 1.5 },
});

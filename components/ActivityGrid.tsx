import { useI18n } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Project } from "@/types";
import React, { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

interface ActivityGridProps {
  projects: Project[];
  containerPadding?: number;
}

const DOT_GAP = 3;
const MIN_DOT_SIZE = 9;

/**
 * GitHub-style contribution heatmap.
 * Always renders full 7-row, N-column grid — extends past today to fill
 * the container symmetrically.
 */
export default function ActivityGrid({
  projects,
  containerPadding = 0,
}: ActivityGridProps) {
  const { colors, borderRadius } = useTheme();
  const { lang } = useI18n();
  const { width: screenWidth } = useWindowDimensions();

  const availableWidth = screenWidth - containerPadding;
  const dotSize = MIN_DOT_SIZE;
  const colWidth = dotSize + DOT_GAP;
  const numWeeks = Math.floor(availableWidth / colWidth);

  const { grid, monthLabels, maxCount } = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const todayDow = today.getDay(); // 0=Sun

    // End date = the coming Saturday (end of this week row).
    // This ensures the last column is always a full 7-day column.
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - todayDow));

    // Total days to show = numWeeks * 7 (always complete rectangles)
    const totalDays = numWeeks * 7;

    // Start date = endDate - totalDays + 1
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    // Build activity counts
    const counts: Record<string, number> = {};
    const dateKey = (d: Date) => d.toISOString().slice(0, 10);
    const todayKey = dateKey(today);

    for (const p of projects) {
      const created = new Date(p.createdAt);
      const key = dateKey(created);
      counts[key] = (counts[key] || 0) + 1;
      for (const task of p.tasks) {
        if (task.completed) {
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    }

    // Build cells
    let max = 0;
    const cells: {
      date: string;
      count: number;
      dateObj: Date;
      isFuture: boolean;
    }[] = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = dateKey(d);
      const isFuture = key > todayKey;
      const count = isFuture ? 0 : counts[key] || 0;
      if (count > max) max = count;
      cells.push({ date: key, count, dateObj: d, isFuture });
    }

    // Build columns (each column = 7 rows, Sun-Sat)
    const columns: (typeof cells)[] = [];
    for (let w = 0; w < numWeeks; w++) {
      columns.push(cells.slice(w * 7, w * 7 + 7));
    }

    // Build month labels
    const months: { label: string; colIdx: number }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < columns.length; w++) {
      const firstCell = columns[w][0];
      if (firstCell) {
        const m = firstCell.dateObj.getMonth();
        if (m !== lastMonth) {
          const locale = lang === "zh" ? "zh-CN" : "en-US";
          months.push({
            label: firstCell.dateObj.toLocaleDateString(locale, {
              month: "short",
            }),
            colIdx: w,
          });
          lastMonth = m;
        }
      }
    }

    return { grid: columns, monthLabels: months, maxCount: max };
  }, [projects, numWeeks, lang]);

  const getColor = (count: number, isFuture: boolean) => {
    if (isFuture) return colors.surfaceBg;
    if (count === 0) return colors.surfaceBg;
    const primary = colors.primary;
    if (maxCount <= 1) return primary;
    const ratio = count / maxCount;
    if (ratio <= 0.25) return primary + "40";
    if (ratio <= 0.5) return primary + "70";
    if (ratio <= 0.75) return primary + "A0";
    return primary;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.body}>
        <View style={styles.gridContainer}>
          {grid.map((column, colIdx) => (
            <View key={colIdx} style={[styles.column, { gap: DOT_GAP }]}>
              {column.map((cell, rowIdx) => (
                <View
                  key={`${colIdx}-${rowIdx}`}
                  style={[
                    styles.dot,
                    {
                      width: dotSize,
                      height: dotSize,
                      backgroundColor: getColor(cell.count, cell.isFuture),
                      borderRadius: borderRadius.sm,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.monthRow}>
        {monthLabels.map((ml, i) => (
          <Text
            key={i}
            style={[
              styles.monthText,
              { color: colors.textMuted, left: ml.colIdx * colWidth },
            ]}
          >
            {ml.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  body: { flexDirection: "row" },
  gridContainer: { flexDirection: "row", gap: DOT_GAP, flex: 1 },
  column: {},
  dot: {},
  monthRow: { height: 16, marginTop: 4, position: "relative" },
  monthText: { fontSize: 9, fontWeight: "500", position: "absolute", top: 0 },
});

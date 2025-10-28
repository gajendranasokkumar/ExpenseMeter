import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import createStatisticsStyles from "../styles/statistics.styles";
import useTheme from "../hooks/useTheme";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const data = {
  "2025-10-01": { label: "Summa" },
  "2025-10-05": { label: "Holiday" },
  "2025-10-10": { label: "50000000" },
  "2025-10-18": { label: "Event" },
  "2025-10-25": { label: "Report" },
};

const MonthlyStats = ({ month, year }) => {
  const { colors } = useTheme();
  const styles = createStatisticsStyles();

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const totalDays = lastDay.getDate();
  const startDay = firstDay.getDay();

  // Build the calendar grid
  const daysArray = Array(startDay)
    .fill(null)
    .concat(Array.from({ length: totalDays }, (_, i) => i + 1));

  // Chunk into weeks of 7 days each
  const weeks = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    weeks.push(daysArray.slice(i, i + 7));
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Weekday Header */}
        <View style={styles.weekHeader}>
          {daysOfWeek.map((day) => (
            <View key={day} style={styles.weekDayContainer}>
              <Text style={styles.weekDay}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Rows */}
        <View style={styles.calendarGrid}>
          {weeks.map((week, rowIndex) => (
            <View key={rowIndex} style={styles.weekRow}>
              {week.map((item, index) => {
                if (!item) {
                  return <View key={index} style={styles.emptyCell} />;
                }

                const dateKey = `${year}-${String(month).padStart(
                  2,
                  "0"
                )}-${String(item).padStart(2, "0")}`;
                const info = data?.[dateKey];

                return (
                  <View
                    key={index}
                    style={[styles.cell, info && styles.activeCell]}
                  >
                    <Text
                      style={[styles.dayText, info && styles.activeDayText]}
                    >
                      {item}
                    </Text>
                    {info && Array.isArray(info.labels) ? (
                      info.labels.map((label, idx) => (
                        <Text
                          key={idx}
                          style={[
                            styles.infoText,
                            { color: label.color || "#4a9eff" },
                          ]}
                        >
                          {label.text}
                        </Text>
                      ))
                    ) : info && info.label ? (
                      <Text style={styles.infoText}>{info.label}</Text>
                    ) : null}
                  </View>
                );
              })}

              {/* Fill remaining cells if the last row has < 7 */}
              {week.length < 7 &&
                Array.from({ length: 7 - week.length }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.emptyCell} />
                ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MonthlyStats;

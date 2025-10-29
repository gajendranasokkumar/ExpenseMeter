import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import createStatisticsStyles from "../styles/statistics.styles";
import useTheme from "../hooks/useTheme";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";

const { width } = Dimensions.get("window");
const chartRadius = Math.min(Math.round(width * 0.35), 140);

const DailyStats = ({ date, month, year }) => {
  const { colors } = useTheme();
  const styles = createStatisticsStyles();

  const data = [
    {
      label: "The Lego Movie 2",
      value: 22.46,
      color: "#4FC3F7",
      text: "22.46%",
    },
    { label: "Cold Pursuit", value: 10.24, color: "#AED581", text: "10.24%" },
    { label: "Instant Family", value: 8.55, color: "#F06292", text: "8.55%" },
    {
      label: "The Kid Who Would Be King",
      value: 7.16,
      color: "#7986CB",
      text: "7.16%",
    },
    {
      label: "On the Basis of Sex",
      value: 6.01,
      color: "#81C784",
      text: "6.01%",
    },
    { label: "Alita", value: 4.37, color: "#FFD54F", text: "4.37%" },
    { label: "Total Dhamaal", value: 3.74, color: "#E57373", text: "3.74%" },
    {
      label: "How to Train Your Dragon",
      value: 11.29,
      color: "#BA68C8",
      text: "11.29%",
    },
    { label: "Bumblebee", value: 2.52, color: "#9575CD", text: "2.52%" },
    { label: "Green Book", value: 1.95, color: "#FF8A65", text: "1.95%" },
    { label: "Other", value: 21.7, color: "#4DD0E1", text: "21.7%" },
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.topExpenseContainer}>
        <View style={styles.topExpenseDataContainer}>
          <Text style={styles.topExpenseDataHeading}>Total Income :</Text>
          <Text style={[styles.topExpenseDataValue, { color: colors.income }]}>
            {formatAmountDisplay(7900)}
          </Text>
        </View>
        <View style={styles.topExpenseDataContainer}>
          <Text style={styles.topExpenseDataHeading}>Total Expense :</Text>
          <Text style={styles.topExpenseDataValue}>
            {formatAmountDisplay(5000)}
          </Text>
        </View>
      </View>
      <View style={[styles.wrapper]}>
        <View style={styles.chartWrapper}>
          <PieChart
            data={data}
            donut
            radius={chartRadius}
            showText
            innerCircleColor={colors.surface}
            textColor="#fff"
            textSize={11}
            isAnimated
            animationDuration={800}
          />
        </View>

        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendRow}>
              <View style={styles.legendColorCol}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: item.color },
                  ]}
                />
              </View>

              <View style={styles.legendLabelCol}>
                <Text
                  style={[styles.legendLabel, { color: colors.text || "#fff" }]}
                >
                  {item.label}
                </Text>
              </View>

              <View style={styles.legendValueCol}>
                <Text
                  style={[styles.legendValue, { color: colors.text || "#fff" }]}
                >
                  {formatAmountDisplay(item.value)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DailyStats;

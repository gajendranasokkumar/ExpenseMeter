import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { PieChart } from "react-native-gifted-charts";
import createStatisticsStyles from "../styles/statistics.styles";
import useTheme from "../hooks/useTheme";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import api from "../utils/api";
import { STATISTICS_ROUTES } from "../constants/endPoints";
import { useUser } from "../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import { formatToPieData } from "../utils/formatToPieData";

const { width } = Dimensions.get("window");
const chartRadius = Math.min(Math.round(width * 0.35), 140);

const DailyStats = ({ day, month, year }) => {
  const { colors } = useTheme();
  const styles = createStatisticsStyles();
  const { user } = useUser();
  const userId = user?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [dailyData, setDailyData] = useState({});

  const getDailyStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.post(
        `${STATISTICS_ROUTES.GET_DAILY_STATS.replace(":id", userId)}`,
        { day, month, year }
      );
      setDailyData(response.data);
    } catch (error) {
      console.log(error)
      setDailyData({});
    } finally {
      setIsLoading(false);
    }
  }, [userId, day, month, year]);

  useFocusEffect(
    useCallback(() => {
      getDailyStats();
    }, [getDailyStats])
  );

  const pieData = formatToPieData(dailyData);

  return (
    <>
      {isLoading ? (
        <View style={[styles.wrapper, { backgroundColor: "transparent" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topExpenseContainer}>
            <View style={styles.topExpenseDataContainer}>
              <Text style={styles.topExpenseDataHeading}>Total Income :</Text>
              <Text
                style={[styles.topExpenseDataValue, { color: colors.income }]}
              >
                {dailyData.totalIncome
                  ? formatAmountDisplay(dailyData.totalIncome)
                  : formatAmountDisplay(0)}
              </Text>
            </View>
            <View style={styles.topExpenseDataContainer}>
              <Text style={styles.topExpenseDataHeading}>Total Expense :</Text>
              <Text style={styles.topExpenseDataValue}>
                {dailyData.totalExpense
                  ? formatAmountDisplay(dailyData.totalExpense)
                  : formatAmountDisplay(0)}
              </Text>
            </View>
          </View>
          {pieData.length > 0 ? (
            <View style={[styles.wrapper]}>
              <View style={styles.chartWrapper}>
                <PieChart
                  data={pieData}
                  donut
                  radius={chartRadius}
                  showText
                  innerCircleColor={colors.surface}
                  textColor="#000000"
                  textSize={11}
                  isAnimated
                  animationDuration={800}
                />
              </View>

              <View style={styles.legendContainer}>
                {pieData.map((item, index) => (
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
                        style={[
                          styles.legendLabel,
                          { color: colors.text || "#fff" },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    <View style={styles.legendValueCol}>
                      <Text
                        style={[
                          styles.legendValue,
                          { color: colors.text || "#fff" },
                        ]}
                      >
                        {formatAmountDisplay(item.value)} ( {item.percentage} )
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.wrapper}>
              <Text style={{ color: colors.text }}>No expenses for this day.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default DailyStats;
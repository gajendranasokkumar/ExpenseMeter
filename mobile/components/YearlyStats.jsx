import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import createStatisticsStyles from "../styles/statistics.styles";
import useTheme from "../hooks/useTheme";
import { STATISTICS_ROUTES } from "../constants/endPoints";
import api from "../utils/api";
import { useUser } from "../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import { MONTH_SHORT_NAMES } from "../utils/formatDate";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import { formatToPieData } from "../utils/formatToPieData";
import { PieChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");
const chartRadius = Math.min(Math.round(width * 0.35), 140);

const YearlyStats = ({ year }) => {
  const { colors } = useTheme();
  const styles = createStatisticsStyles();
  const { user } = useUser();
  const userId = user?._id;

  const [isLoading, setIsLoading] = useState(false);
  const [yearlyData, setYearlyData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    months: [],
    yearlyPieData: {},
  });

  const fetchYearlyStats = useCallback(() => {
    if (!userId || !year) return;
    setIsLoading(true);
    api
      .post(STATISTICS_ROUTES.GET_YEARLY_STATS.replace(":id", userId), { year })
      .then((response) => {
        setYearlyData(
          { ...response.data, yearlyPieData: response.data.pieChartData } || {
            totalIncome: 0,
            totalExpense: 0,
            months: [],
            yearlyPieData: {},
          }
        );
      })
      .catch(() =>
        setYearlyData({
          totalIncome: 0,
          totalExpense: 0,
          months: [],
          yearlyPieData: {},
        })
      )
      .finally(() => setIsLoading(false));
  }, [userId, year]);

  useFocusEffect(
    useCallback(() => {
      fetchYearlyStats();
    }, [fetchYearlyStats])
  );

  const pieData = formatToPieData(yearlyData.yearlyPieData);

  const maxMonthlyValue = useMemo(() => {
    if (!yearlyData?.months?.length) return 0;
    return yearlyData.months.reduce((max, m) => {
      const v = Math.max(
        m.income || 0,
        m.expense || 0,
        (m.income || 0) + (m.expense || 0)
      );
      return Math.max(max, v);
    }, 0);
  }, [yearlyData]);

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
              <Text style={styles.topExpenseDataHeading}>
                This year's Income :
              </Text>
              <Text
                style={[styles.topExpenseDataValue, { color: colors.income }]}
              >
                {formatAmountDisplay(yearlyData.totalIncome || 0)}
              </Text>
            </View>
            <View style={styles.topExpenseDataContainer}>
              <Text style={styles.topExpenseDataHeading}>
                This year's Expense :
              </Text>
              <Text style={styles.topExpenseDataValue}>
                {formatAmountDisplay(yearlyData.totalExpense || 0)}
              </Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 15, paddingTop: 15, borderBottomWidth: 2, borderBottomColor: colors.border }}>
            <Text style={styles.budgetListHeading}>
              Month-wise breakdown ({year})
            </Text>
            {yearlyData?.months?.map((m, idx) => {
              const monthName =
                MONTH_SHORT_NAMES[(m.month || idx + 1) - 1] || `M${idx + 1}`;
              const income = m.income || 0;
              const expense = m.expense || 0;
              const total = Math.max(maxMonthlyValue, 1);
              const incomeWidth = Math.round((income / total) * (width - 60));
              const expenseWidth = Math.round((expense / total) * (width - 60));
              return (
                <View
                  key={idx}
                  style={[
                    styles.legendRow,
                    { borderBottomWidth: 0, paddingBottom: 8 },
                  ]}
                >
                  <View style={{ width: 40, alignItems: "flex-start" }}>
                    <Text style={{ color: colors.text }}>{monthName}</Text>
                  </View>
                  <View style={{ flex: 1, paddingLeft: 10 }}>
                    <View
                      style={{
                        height: 8,
                        backgroundColor: colors.bg,
                        borderRadius: 4,
                        overflow: "hidden",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          width: incomeWidth,
                          backgroundColor: colors.income,
                        }}
                      />
                      <View
                        style={{
                          width: expenseWidth,
                          backgroundColor: colors.expense,
                          marginLeft: 2,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 6,
                      }}
                    >
                      <Text style={{ color: colors.income, fontSize: 12 }}>
                        + {formatAmountDisplay(income)}
                      </Text>
                      <Text style={{ color: colors.expense, fontSize: 12 }}>
                        - {formatAmountDisplay(expense)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
            {!yearlyData?.months?.length ? (
              <View style={styles.wrapper}>
                <Text style={{ color: colors.text }}>
                  No data found for this year.
                </Text>
              </View>
            ) : null}
          </View>

          {pieData.length > 0 ? (
            <View style={[styles.wrapper]}>
              <Text style={styles.budgetListHeading}>
                Category-wise breakdown ({year})
              </Text>

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
              <Text style={{ color: colors.text }}>
                No expenses for this Year.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default YearlyStats;

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
import SingleBudget from "./SingleBudget";
import { formatToPieData } from "../utils/formatToPieData";
import { PieChart } from "react-native-gifted-charts";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import useLanguage from "../hooks/useLanguage";

const { width } = Dimensions.get("window");
const chartRadius = Math.min(Math.round(width * 0.35), 140);

const MonthlyStats = ({ month, year }) => {
  const { colors } = useTheme();
  const styles = createStatisticsStyles();
  const { user } = useUser();
  const userId = user?._id;
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState({});
  const [monthlyBudget, setMonthlyBudget] = useState([]);
  const [monthlyPieData, setMonthlyPieData] = useState({});

  const fetchMonthlyStats = useCallback(() => {
    if (!userId || !month || !year) return;
    setIsLoading(true);
    api
      .post(STATISTICS_ROUTES.GET_MONTHLY_STATS.replace(":id", userId), {
        month,
        year,
      })
      .then((response) => {
        setMonthlyData(() => response.data.summary);
        setMonthlyBudget(() => response.data.budgetsOfTheMonth.items);
        setMonthlyPieData(() => response.data.pieChartData);
      })
      .catch(() => setMonthlyData({}))
      .finally(() => setIsLoading(false));
  }, [userId, month, year]);

  useFocusEffect(
    useCallback(() => {
      fetchMonthlyStats();
    }, [fetchMonthlyStats])
  );

  const pieData = formatToPieData(monthlyPieData);

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const totalDays = lastDay.getDate();
  const startDay = firstDay.getDay();

  const daysOfWeek = useMemo(
    () => [
      t("statistics.monthly.weekdays.sun", { defaultValue: "Sun" }),
      t("statistics.monthly.weekdays.mon", { defaultValue: "Mon" }),
      t("statistics.monthly.weekdays.tue", { defaultValue: "Tue" }),
      t("statistics.monthly.weekdays.wed", { defaultValue: "Wed" }),
      t("statistics.monthly.weekdays.thu", { defaultValue: "Thu" }),
      t("statistics.monthly.weekdays.fri", { defaultValue: "Fri" }),
      t("statistics.monthly.weekdays.sat", { defaultValue: "Sat" }),
    ],
    [t]
  );

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

        {isLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
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
                    const info = monthlyData?.[dateKey];
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
                        {info ? (
                          <View style={{ alignItems: "center" }}>
                            {info.income > 0 && (
                              <Text
                                style={[
                                  styles.infoText,
                                  { color: colors.income },
                                ]}
                              >
                                +{info.income}
                              </Text>
                            )}
                            {info.expense > 0 && (
                              <Text
                                style={[
                                  styles.infoText,
                                  { color: colors.expense },
                                ]}
                              >
                                -{info.expense}
                              </Text>
                            )}
                          </View>
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
            {pieData.length > 0 && (
              <>
                <View style={styles.pieChartHeadingContainer}>
                  <Text style={styles.budgetListHeading}>
                    {t("statistics.monthly.expenseHeading", {
                      defaultValue: "All your expenses this month",
                    })}
                  </Text>
                </View>
                <View style={styles.topExpenseContainer}>
                  <View style={styles.topExpenseDataContainer}>
                    <Text style={styles.topExpenseDataHeading}>
                      {t("statistics.monthly.totalIncome", {
                        defaultValue: "Total income",
                      })}
                    </Text>
                    <Text
                      style={[
                        styles.topExpenseDataValue,
                        { color: colors.income },
                      ]}
                    >
                      {monthlyPieData.totalIncome
                        ? formatAmountDisplay(monthlyPieData.totalIncome)
                        : formatAmountDisplay(0)}
                    </Text>
                  </View>
                  <View style={styles.topExpenseDataContainer}>
                    <Text style={styles.topExpenseDataHeading}>
                      {t("statistics.monthly.totalExpense", {
                        defaultValue: "Total expense",
                      })}
                    </Text>
                    <Text style={styles.topExpenseDataValue}>
                      {monthlyPieData.totalExpense
                        ? formatAmountDisplay(monthlyPieData.totalExpense)
                        : formatAmountDisplay(0)}
                    </Text>
                  </View>
                </View>
              </>
            )}
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
                          {formatAmountDisplay(item.value)} ( {item.percentage}{" "}
                          )
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.wrapper}>
                <Text style={{ color: colors.text }}>
                  {t("statistics.monthly.empty", {
                    defaultValue: "No expenses for this month.",
                  })}
                </Text>
              </View>
            )}

            {monthlyBudget.length > 0 && (
              <View style={styles.budgetListContainer}>
                <Text style={styles.budgetListHeading}>
                  {t("statistics.monthly.budgetsHeading", {
                    defaultValue: "Your budgets this month",
                  })}
                </Text>
                {monthlyBudget.map((item, index) => (
                  <SingleBudget
                    key={index}
                    budget={item}
                    onDelete={() => {}}
                    showProgressbar
                  />
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default MonthlyStats;

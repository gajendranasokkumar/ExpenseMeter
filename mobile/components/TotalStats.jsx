import React, { useMemo, useCallback, useState } from "react";
import { View, Text, ScrollView, Dimensions, ActivityIndicator, Image } from "react-native";
import createStatisticsStyles from "../styles/statistics.styles";
import useTheme from "../hooks/useTheme";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import { STATISTICS_ROUTES } from "../constants/endPoints";
import api from "../utils/api";
import { useUser } from "../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { categories as CATEGORY_CONST } from "../constants/Categories";
import ProgressBar from "./ProgressBar";

const { width } = Dimensions.get("window");

const TotalStats = () => {
  const { colors } = useTheme();
  const styles = createStatisticsStyles();

  const { user } = useUser();
  const userId = user?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [totalData, setTotalData] = useState({
    totals: { totalIncome: 0, totalExpense: 0, net: 0 },
    bestIncomeYear: null,
    highestExpenseYear: null,
    topCategories: [],
    mostUsedBank: null,
  });

  const totalIncome = totalData.totals.totalIncome || 0;
  const totalExpense = totalData.totals.totalExpense || 0;
  const netSaving = totalData.totals.net || 0;
  const savingRate = Math.round((netSaving / Math.max(totalIncome, 1)) * 100);
  const avgMonthlySpend = Math.round(totalExpense / 12);
  const avgDailySpend = Math.round(totalExpense / 365);

  const categories = useMemo(() => totalData.topCategories || [], [totalData.topCategories]);
  const totalCategory = useMemo(
    () => categories.reduce((sum, c) => sum + c.value, 0),
    [categories]
  );
  const topCategory = useMemo(() => (categories.slice().sort((a,b)=>b.value-a.value)[0] || { name: '-', value: 0 }), [categories]);

  const bestIncomeYear = totalData.bestIncomeYear;
  const highestExpenseYear = totalData.highestExpenseYear;

  const mostUsedBank = totalData.mostUsedBank;

  const fetchTotalStats = useCallback(() => {
    if (!userId) return;
    setIsLoading(true);
    api
      .get(STATISTICS_ROUTES.GET_TOTAL_STATS.replace(":id", userId))
      .then((res) => setTotalData(res.data || totalData))
      .catch(() => setTotalData({
        totals: { totalIncome: 0, totalExpense: 0, net: 0 },
        bestIncomeYear: null,
        highestExpenseYear: null,
        topCategories: [],
        mostUsedBank: null,
      }))
      .finally(() => setIsLoading(false));
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchTotalStats();
    }, [fetchTotalStats])
  );

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {isLoading ? (
        <View style={[styles.wrapper, { backgroundColor: "transparent" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
      <View style={{ margin: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: "hidden" }}>
        <View style={{ padding: 14, backgroundColor: colors.bg }}>
          <Text style={{ color: colors.text, opacity: 0.8 }}>Overview</Text>
        </View>
        <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border }}>
          <View style={{ flex: 1, padding: 14 }}>
            <Text style={{ color: colors.text, opacity: 0.8 }}>Total Income (All time)</Text>
            <Text style={{ color: colors.income, fontSize: 12, fontWeight: "600", marginTop: 2 }}>{formatAmountDisplay(totalIncome)}</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ flex: 1, padding: 14 }}>
            <Text style={{ color: colors.text, opacity: 0.8 }}>Total Expense (All time)</Text>
            <Text style={{ color: colors.expense, fontSize: 12, fontWeight: "600", marginTop: 2 }}>{formatAmountDisplay(totalExpense)}</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ flex: 1, padding: 14 }}>
            <Text style={{ color: colors.text, opacity: 0.8 }}>Net</Text>
            <Text style={{ color: netSaving >= 0 ? colors.income : colors.expense, fontSize: 12, fontWeight: "600", marginTop: 2 }}>{formatAmountDisplay(netSaving)}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginHorizontal: 16, flexDirection: "row", gap: 12, marginBottom: 15 }}>
        <View style={{ flex: 1, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.bg, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, opacity: 0.7 }}>Average monthly spend</Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginTop: 2 }}>{formatAmountDisplay(avgMonthlySpend)}</Text>
          </View>
        </View>
        <View style={{ flex: 1, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.bg, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.expense + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            <Ionicons name="time-outline" size={18} color={colors.expense} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, opacity: 0.7 }}>Average daily spend</Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginTop: 2 }}>{formatAmountDisplay(avgDailySpend)}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginHorizontal: 16 }}>
        <Text style={styles.budgetListHeading}>Top year highlights</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.bg }}>
            <Text style={{ color: colors.text, opacity: 0.7 }}>Best Income Year</Text>
            <Text style={{ color: colors.income, fontSize: 14, fontWeight: "700", marginTop: 6 }}>{formatAmountDisplay(bestIncomeYear?.income || 0)}</Text>
            <Text style={{ color: colors.text, opacity: 0.6, marginTop: 4 }}>{bestIncomeYear?.year ?? '-'}</Text>
          </View>
          <View style={{ flex: 1, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.bg }}>
            <Text style={{ color: colors.text, opacity: 0.7 }}>Highest Expense Year</Text>
            <Text style={{ color: colors.expense, fontSize: 14, fontWeight: "700", marginTop: 6 }}>{formatAmountDisplay(highestExpenseYear?.expense || 0)}</Text>
            <Text style={{ color: colors.text, opacity: 0.6, marginTop: 4 }}>{highestExpenseYear?.year ?? '-'}</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.budgetListHeading}>Top 5 categories</Text>
        {categories
          .slice()
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
          .map((c, idx) => {
            const percent = Math.round((c.value / Math.max(totalCategory, 1)) * 100);
            const catInfo = CATEGORY_CONST.find((ci) => ci.name === c.name);
            const iconName = catInfo?.unselectedIcon || "ellipsis-horizontal-outline";
            const iconColor = catInfo?.color || colors.primary;
            return (
              <View key={idx} style={{ flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.bg, marginBottom: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: iconColor + '33', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name={iconName} size={20} color={iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: "600" }}>{idx + 1}. {c.name}</Text>
                  <Text style={{ color: colors.text, opacity: 0.75, marginTop: 2 }}>{percent}% of expenses</Text>
                </View>
                <View>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{formatAmountDisplay(c.value)}</Text>
                </View>
              </View>
            );
          })}
      </View>

      <View style={{ padding: 16, paddingBottom: 45 }}>
        <Text style={styles.budgetListHeading}>Most used bank account</Text>
        <View style={{ padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.bg }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {mostUsedBank?.logo ? (
              <Image
                source={{ uri: mostUsedBank.logo }}
                style={{ width: 42, height: 42, borderRadius: 21, marginRight: 12 }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: mostUsedBank?.color || colors.primary, marginRight: 12 }} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>{mostUsedBank?.name || '-'}</Text>
              <Text style={{ color: colors.text, opacity: 0.75 }}>{mostUsedBank?.account || ''}</Text>
            </View>
            <View>
              <Text style={{ color: colors.text, opacity: 0.75 }}>Uses</Text>
              <Text style={{ color: colors.text, fontWeight: "700", textAlign: "right" }}>{mostUsedBank?.usage ?? 0}</Text>
            </View>
          </View>
          <ProgressBar percentageUsed={100} />
        </View>
      </View>
      </>
      )}
    </ScrollView>
  );
};

export default TotalStats;
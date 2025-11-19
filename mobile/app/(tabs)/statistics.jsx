import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../../hooks/useTheme";
import createStatisticsStyles from "../../styles/statistics.styles";
import CustomDropdown from "../../components/CustomDropdown";
import { MONTH_SHORT_NAMES } from "../../utils/formatDate";
import DailyStats from "../../components/DailyStats";
import MonthlyStats from "../../components/MonthlyStats";
import YearlyStats from "../../components/YearlyStats";
import TotalStats from "../../components/TotalStats";
import useLanguage from "../../hooks/useLanguage";

const tabsNumber = Object.freeze({
  DAILY: 1,
  MONTHLY: 2,
  YEARLY: 3,
  TOTAL: 4,
});

const tabListDefinitions = [
  {
    id: tabsNumber.DAILY,
    labelKey: "statistics.tabs.daily",
    defaultLabel: "Daily",
  },
  {
    id: tabsNumber.MONTHLY,
    labelKey: "statistics.tabs.monthly",
    defaultLabel: "Monthly",
  },
  {
    id: tabsNumber.YEARLY,
    labelKey: "statistics.tabs.yearly",
    defaultLabel: "Yearly",
  },
  {
    id: tabsNumber.TOTAL,
    labelKey: "statistics.tabs.total",
    defaultLabel: "Total",
  },
];

const tabOrder = tabListDefinitions.map((tab) => tab.id);

const Statistics = () => {
  const { colors } = useTheme();
  const styles = createStatisticsStyles();
  const { t } = useLanguage();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0-11
  const currentDay = now.getDate();

  const monthNames = MONTH_SHORT_NAMES;

  const monthOptions = useMemo(
    () =>
      monthNames.map((name, idx) => ({
        value: idx + 1,
        label: t(`calendar.months.${idx}`, { defaultValue: name }),
      })),
    [monthNames, t]
  );

  const yearOptions = useMemo(() => {
    const span = 30; // last 30 years
    return Array.from({ length: span }, (_, i) => {
      const year = currentYear - i;
      return { value: year, label: String(year) };
    });
  }, [currentYear]);

  const [selectedYear, setSelectedYear] = useState({
    value: currentYear,
    label: String(currentYear),
  });
  const [selectedMonth, setSelectedMonth] = useState({
    value: currentMonthIndex + 1,
    label: monthNames[currentMonthIndex],
  });

  const daysInSelectedMonth = useMemo(() => {
    return new Date(selectedYear.value, selectedMonth.value, 0).getDate();
  }, [selectedYear.value, selectedMonth.value]);

  const dayOptions = useMemo(() => {
    return Array.from({ length: daysInSelectedMonth }, (_, i) => ({
      value: i + 1,
      label: String(i + 1),
    }));
  }, [daysInSelectedMonth]);

  const [selectedDay, setSelectedDay] = useState({
    value: Math.min(
      currentDay,
      new Date(currentYear, currentMonthIndex + 1, 0).getDate()
    ),
    label: String(
      Math.min(
        currentDay,
        new Date(currentYear, currentMonthIndex + 1, 0).getDate()
      )
    ),
  });

  const [activeTabNumber, setActiveTabNumber] = useState(tabsNumber.DAILY);

  const goToNextTab = useCallback(() => {
    setActiveTabNumber((prevTab) => {
      const currentIndex = tabOrder.indexOf(prevTab);
      if (currentIndex === -1 || currentIndex >= tabOrder.length - 1) {
        return prevTab;
      }

      return tabOrder[currentIndex + 1];
    });
  }, []);

  const goToPreviousTab = useCallback(() => {
    setActiveTabNumber((prevTab) => {
      const currentIndex = tabOrder.indexOf(prevTab);
      if (currentIndex <= 0) {
        return prevTab;
      }

      return tabOrder[currentIndex - 1];
    });
  }, []);

  const panResponder = useMemo(() => {
    const swipeThreshold = 10;

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 15;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -swipeThreshold) {
          goToNextTab();
        } else if (gestureState.dx > swipeThreshold) {
          goToPreviousTab();
        }
      },
    });
  }, [goToNextTab, goToPreviousTab]);

  const renderActiveStats = () => {
    switch (activeTabNumber) {
      case tabsNumber.DAILY:
        return (
          <DailyStats
            day={selectedDay.value}
            month={selectedMonth.value}
            year={selectedYear.value}
          />
        );
      case tabsNumber.MONTHLY:
        return (
          <MonthlyStats month={selectedMonth.value} year={selectedYear.value} />
        );
      case tabsNumber.YEARLY:
        return <YearlyStats year={selectedYear.value} />;
      case tabsNumber.TOTAL:
        return <TotalStats />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.content} {...panResponder.panHandlers}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t("statistics.title", { defaultValue: "Statistics" })}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTabNumber !== tabsNumber.TOTAL && (
            <View style={styles.monthsContainer}>
              {activeTabNumber === tabsNumber.DAILY && (
                <View style={{ flex: 1, marginRight: 5 }}>
                  <CustomDropdown
                    data={dayOptions}
                    selectedValue={selectedDay}
                    placeholder={t("statistics.filters.day", {
                      defaultValue: "Day",
                    })}
                    enableSearch={false}
                    onSelect={setSelectedDay}
                  />
                </View>
              )}

              {(activeTabNumber === tabsNumber.DAILY ||
                activeTabNumber === tabsNumber.MONTHLY) && (
                <View style={{ flex: 1, marginHorizontal: 5 }}>
                  <CustomDropdown
                    data={monthOptions}
                    selectedValue={selectedMonth}
                    placeholder={t("statistics.filters.month", {
                      defaultValue: "Month",
                    })}
                    enableSearch={false}
                    onSelect={setSelectedMonth}
                  />
                </View>
              )}

              {(activeTabNumber === tabsNumber.DAILY ||
                activeTabNumber === tabsNumber.MONTHLY ||
                activeTabNumber === tabsNumber.YEARLY) && (
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <CustomDropdown
                    data={yearOptions}
                    selectedValue={selectedYear}
                    placeholder={t("statistics.filters.year", {
                      defaultValue: "Year",
                    })}
                    enableSearch={false}
                    onSelect={setSelectedYear}
                  />
                </View>
              )}
            </View>
          )}

          <View style={styles.tabsSelectorContainer}>
            {tabListDefinitions.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTabNumber(tab.id)}
                style={
                  activeTabNumber === tab.id
                    ? styles.activeTabsSelectorItem
                    : styles.tabsSelectorItem
                }
              >
                <Text
                  style={
                    activeTabNumber === tab.id
                      ? styles.activeTabName
                      : styles.tabName
                  }
                >
                  {t(tab.labelKey, { defaultValue: tab.defaultLabel })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderActiveStats()}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Statistics;

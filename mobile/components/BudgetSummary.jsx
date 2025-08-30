import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import createHomeStyles from "../styles/home.styles";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../hooks/useTheme";

const BudgetSummary = () => {
  const styles = createHomeStyles();
  const { colors } = useTheme();
  const [budget, setBudget] = useState({
    currentExpenses: 750,
    budgetLimit: 1000,
  });
  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState([colors.success, colors.success]);
  const [progressPercentageColor, setProgressPercentageColor] = useState(colors.success);

  const calculateProgress = () => {
    setProgress(
      Math.round((budget.currentExpenses / budget.budgetLimit) * 100)
    );
  };

  useEffect(() => {
    calculateProgress();
  }, [budget]);

  useEffect(() => {
    if (progress <= 25) {
      setProgressColor([colors.success, colors.success]);
      setProgressPercentageColor(colors.success);
    } else if (progress <= 50) {
      setProgressColor([colors.success, colors.warning]);
      setProgressPercentageColor(colors.warning);
    } else if (progress <= 75) {
      setProgressColor([colors.success, colors.warning, colors.orange]);
      setProgressPercentageColor(colors.orange);
    } else {
      setProgressColor([
        colors.success,
        colors.warning,
        colors.orange,
        colors.danger,
      ]);
      setProgressPercentageColor(colors.danger);
    }
  }, [progress, colors.success, colors.warning, colors.orange, colors.danger]);

  return (
    <View style={styles.budgetSummaryContainer}>    
      <View style={styles.budgetSummaryTitleContainer}> 
        <Text style={styles.budgetSummaryTitle}>Current month budget</Text>
        <View style={styles.burgetSUmmaryPercent}>
          <Text style={[styles.burgetSUmmaryPercentText, { color: progressPercentageColor }]}>{progress}%</Text>
        </View>
      </View>
      <View style={styles.budgetSummaryContent}>
        <View style={styles.budgetSummaryContentLeft}>
          <Text style={styles.budgetSummaryAmountTitle}>Total Expenses</Text>
          <Text style={styles.budgetSummaryAmountLeft}>
            {formatAmountDisplay(budget.currentExpenses)}
          </Text>
        </View>
        <View style={styles.budgetSummaryContentRight}>
          <Text style={styles.budgetSummaryAmountTitle}>Budget Limit</Text>
          <Text style={styles.budgetSummaryAmountRight}>
            {formatAmountDisplay(budget.budgetLimit)}
          </Text>
        </View>
      </View>
      <View style={styles.progressBar}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              { width: `${progress < 100 ? progress : 100}%` },
            ]}
            colors={progressColor}
          />    
      </View>
    </View>
  );
};

export default BudgetSummary;

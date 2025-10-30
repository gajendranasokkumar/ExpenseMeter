import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import useTheme from "../hooks/useTheme";
import createCategoriesBudgetSummaryStyles from "../styles/categoriesBudgetSummary.styles";


const ProgressBar = ({ percentageUsed }) => {
  const { colors } = useTheme();
  const styles = createCategoriesBudgetSummaryStyles();

  let progressColors = [colors.incomeMuted, colors.incomeMuted];
  if (percentageUsed <= 25) {
    progressColors = [colors.incomeMuted, colors.success];
  } else if (percentageUsed <= 50) {
    progressColors = [colors.incomeMuted, colors.warning];
  } else if (percentageUsed <= 75) {
    progressColors = [colors.incomeMuted, colors.warning, colors.orange];
  } else {
    progressColors = [
      colors.incomeMuted,
      colors.warning,
      colors.orange,
      colors.danger,
    ];
  }

  return (
    <View style={styles.categoriesBudgetSummaryProgressBarContainer}>
      <LinearGradient
        style={[
          styles.categoriesBudgetSummaryProgressBar,
          { width: `${percentageUsed < 100 ? percentageUsed : 100}%` },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={progressColors}
      />
    </View>
  );
};

export default ProgressBar;

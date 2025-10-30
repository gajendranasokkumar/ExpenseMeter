import { categories } from "../constants/Categories";


export const formatToPieData = (dailyData) => {
  if (
    !dailyData ||
    !dailyData.categoryExpense ||
    Object.keys(dailyData.categoryExpense).length === 0
  ) {
    return [];
  }

  const { categoryExpense, totalExpense } = dailyData;
  if (totalExpense === 0) return [];

  return Object.entries(categoryExpense).map(
    ([categoryName, amount], index) => {
      const categoryInfo = categories.find((c) => c.name === categoryName);
      const percentage = (amount / totalExpense) * 100;
      return {
        label: `${index + 1}. ${categoryName}`,
        value: amount,
        color: categoryInfo ? categoryInfo.color : "#CCCCCC",
        text: `${index + 1}`,
        percentage: `${percentage.toFixed(1)}%`,
      };
    }
  );
};

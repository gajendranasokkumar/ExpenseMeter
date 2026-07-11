// Firestore implementation: statistics.
import { COLLECTIONS, fs, normalizeMany } from "./helpers";
import * as budgetsFire from "./budgetsFire";

const fetchTransactionsInRange = async (userId, start, end) => {
  const { db, collection, query, where, getDocs } = fs();
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.transactions), where("user_id", "==", userId))
  );
  return normalizeMany(snap, ["date"]).filter((tx) => {
    if (tx.category === "Transfer") return false;
    const d = new Date(tx.date);
    return d >= start && d <= end;
  });
};

const getStatsForRange = async (userId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const transactions = await fetchTransactionsInRange(userId, start, end);
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpense = {};
  for (const tx of transactions) {
    if (tx.amount > 0) {
      totalIncome += tx.amount;
    } else if (tx.amount < 0) {
      totalExpense += Math.abs(tx.amount);
      categoryExpense[tx.category] = (categoryExpense[tx.category] || 0) + Math.abs(tx.amount);
    }
  }
  return { totalIncome, totalExpense, categoryExpense };
};

export const daily = async (userId, day, month, year) => {
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
  const transactions = await fetchTransactionsInRange(userId, startOfDay, endOfDay);

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpense = {};
  for (const tx of transactions) {
    if (tx.amount > 0) {
      totalIncome += tx.amount;
    } else if (tx.amount < 0) {
      totalExpense += Math.abs(tx.amount);
      categoryExpense[tx.category] = (categoryExpense[tx.category] || 0) + Math.abs(tx.amount);
    }
  }
  return { totalIncome, totalExpense, categoryExpense };
};

export const monthly = async (userId, month, year) => {
  const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const budgetsOfTheMonth = await budgetsFire.getByUser(userId, {
    page: 1,
    limit: 10000,
    startDate: startOfMonth,
    endDate: endOfMonth,
  });
  const pieChartData = await getStatsForRange(userId, startOfMonth, endOfMonth);
  const transactions = await fetchTransactionsInRange(userId, startOfMonth, endOfMonth);

  const summary = {};
  for (const tx of transactions) {
    const dateStr = new Date(tx.date).toISOString().slice(0, 10);
    if (!summary[dateStr]) summary[dateStr] = { income: 0, expense: 0 };
    if (tx.amount > 0) summary[dateStr].income += tx.amount;
    else if (tx.amount < 0) summary[dateStr].expense += Math.abs(tx.amount);
  }
  return { summary, budgetsOfTheMonth, pieChartData };
};

export const yearly = async (userId, year) => {
  const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

  const pieChartData = await getStatsForRange(userId, startOfYear, endOfYear);
  const transactions = await fetchTransactionsInRange(userId, startOfYear, endOfYear);

  const months = Array.from({ length: 12 }, (_, idx) => ({ month: idx + 1, income: 0, expense: 0 }));
  let totalIncome = 0;
  let totalExpense = 0;
  for (const tx of transactions) {
    const monthIndex = new Date(tx.date).getMonth();
    if (tx.amount > 0) {
      months[monthIndex].income += tx.amount;
      totalIncome += tx.amount;
    } else if (tx.amount < 0) {
      const absAmt = Math.abs(tx.amount);
      months[monthIndex].expense += absAmt;
      totalExpense += absAmt;
    }
  }
  return { months, totalIncome, totalExpense, pieChartData };
};

export const total = async (userId) => {
  const { db, collection, query, where, getDocs, doc, getDoc } = fs();
  const allSnap = await getDocs(
    query(collection(db, COLLECTIONS.transactions), where("user_id", "==", userId))
  );
  const allTx = normalizeMany(allSnap, ["date"]).filter((tx) => tx.category !== "Transfer");

  const now = new Date();
  const dates = allTx.map((tx) => new Date(tx.date).getTime()).filter((t) => !isNaN(t));
  const startDate = dates.length ? new Date(Math.min(...dates)) : new Date(now.getFullYear(), 0, 1);
  const endDate = now;

  const { totalIncome, totalExpense, categoryExpense } = await getStatsForRange(userId, startDate, endDate);

  const topCategories = Object.entries(categoryExpense)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const inRange = allTx.filter((tx) => {
    const d = new Date(tx.date);
    return d >= startDate && d <= endDate;
  });

  const yearly = {};
  for (const tx of inRange) {
    const year = new Date(tx.date).getFullYear();
    if (!yearly[year]) yearly[year] = { _id: year, income: 0, expense: 0 };
    if (tx.amount > 0) yearly[year].income += tx.amount;
    else if (tx.amount < 0) yearly[year].expense += Math.abs(tx.amount);
  }
  const yearlyAgg = Object.values(yearly);
  const bestIncomeYear = yearlyAgg.length
    ? yearlyAgg.slice().sort((a, b) => b.income - a.income)[0]
    : null;
  const highestExpenseYear = yearlyAgg.length
    ? yearlyAgg.slice().sort((a, b) => b.expense - a.expense)[0]
    : null;

  const bankUsage = {};
  for (const tx of inRange) {
    if (!tx.bank) continue;
    bankUsage[tx.bank] = (bankUsage[tx.bank] || 0) + 1;
  }
  let mostUsedBank = null;
  const topBankId = Object.entries(bankUsage).sort((a, b) => b[1] - a[1])[0];
  if (topBankId) {
    const bankSnap = await getDoc(doc(db, COLLECTIONS.banks, topBankId[0]));
    if (bankSnap.exists()) {
      const b = bankSnap.data();
      mostUsedBank = { id: topBankId[0], name: b.name, logo: b.logo, usage: topBankId[1] };
    } else {
      mostUsedBank = { id: topBankId[0], name: "Unknown", logo: "", usage: topBankId[1] };
    }
  }

  return {
    range: { startDate, endDate },
    totals: { totalIncome, totalExpense, net: totalIncome - totalExpense },
    bestIncomeYear: bestIncomeYear ? { year: bestIncomeYear._id, income: bestIncomeYear.income } : null,
    highestExpenseYear: highestExpenseYear ? { year: highestExpenseYear._id, expense: highestExpenseYear.expense } : null,
    topCategories,
    mostUsedBank,
  };
};

// Firestore implementation: budgets.
import { COLLECTIONS, fs, normalizeMany } from "./helpers";
import { createNotification } from "./notificationsFire";

const DATE_FIELDS = ["start_date", "end_date", "created_at", "updated_at"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const getMonthIndex = (month) => MONTHS.indexOf(month);
const getPreviousMonth = (month) => MONTHS[MONTHS.indexOf(month) - 1];

const fetchUserBudgets = async (userId) => {
  const { db, collection, query, where, getDocs } = fs();
  const q = query(collection(db, COLLECTIONS.budgets), where("user_id", "==", userId));
  const snap = await getDocs(q);
  return normalizeMany(snap, DATE_FIELDS);
};

const fetchUserExpenses = async (userId) => {
  const { db, collection, query, where, getDocs } = fs();
  const q = query(collection(db, COLLECTIONS.transactions), where("user_id", "==", userId));
  const snap = await getDocs(q);
  return normalizeMany(snap, ["date"]).filter(
    (tx) => (tx.amount || 0) < 0 && tx.category !== "Transfer"
  );
};

export const getByUser = async (userId, { page = 1, limit = 10, startDate, endDate } = {}) => {
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 1000);

  let budgets = await fetchUserBudgets(userId);

  let filterStart = null;
  let filterEnd = null;
  if (startDate) {
    const d = new Date(startDate);
    if (!isNaN(d.getTime())) filterStart = d;
  }
  if (endDate) {
    const d = new Date(endDate);
    if (!isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999);
      filterEnd = d;
    }
  }
  if (filterStart && filterEnd) {
    budgets = budgets.filter(
      (b) => new Date(b.start_date) >= filterStart && new Date(b.end_date) <= filterEnd
    );
  } else if (filterStart) {
    budgets = budgets.filter((b) => new Date(b.start_date) >= filterStart);
  } else if (filterEnd) {
    budgets = budgets.filter((b) => new Date(b.end_date) <= filterEnd);
  }

  budgets.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  const total = budgets.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIdx = (pageNumber - 1) * pageSize;
  const pageItems = budgets.slice(startIdx, startIdx + pageSize);

  let itemsWithSpend = pageItems;
  if (pageItems.length > 0) {
    const transactions = await fetchUserExpenses(userId);
    itemsWithSpend = pageItems.map((b) => {
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);
      const isMonthlyBudget =
        typeof b.category === "string" &&
        (b.category === "Monthly Budget" || b.category.toLowerCase().startsWith("budget for "));

      const amountSpent = transactions.reduce((sum, tx) => {
        const d = new Date(tx.date);
        if (d < start || d > end) return sum;
        if (!isMonthlyBudget && tx.category !== b.category) return sum;
        return sum + Math.abs(tx.amount || 0);
      }, 0);
      return { ...b, amountSpent };
    });
  }

  return { items: itemsWithSpend, total, page: pageNumber, limit: pageSize, totalPages };
};

export const getMonthlyForCurrentMonth = async (userId, category, currentMonth) => {
  const budgets = (await fetchUserBudgets(userId)).filter(
    (b) => b.category === category && b.title === `Budget for ${currentMonth}`
  );
  if (budgets.length === 0) {
    throw new Error("No budget found for this month");
  }
  const budget = budgets[0];
  const start = new Date(budget.start_date);
  const end = new Date(budget.end_date);

  const transactions = await fetchUserExpenses(userId);
  const totalAmountSpent = transactions.reduce((sum, tx) => {
    const d = new Date(tx.date);
    if (d >= start && d <= end) return sum + tx.amount;
    return sum;
  }, 0);

  return { ...budget, totalAmountSpentonThisMonth: totalAmountSpent * -1 };
};

export const getCategoriesSummary = async (userId, month, year) => {
  const currentMonthIndex = getMonthIndex(month);
  const monthStart = new Date(year, currentMonthIndex, 1);
  const monthEnd = new Date(year, currentMonthIndex + 1, 0, 23, 59, 59, 999);

  const budgets = (await fetchUserBudgets(userId)).filter(
    (b) => new Date(b.start_date) >= monthStart && new Date(b.end_date) <= monthEnd
  );

  const transactions = (await fetchUserExpenses(userId)).filter((tx) => {
    const d = new Date(tx.date);
    return d >= monthStart && d <= monthEnd;
  });

  const expensesByCategory = transactions.reduce((acc, tx) => {
    const category = tx.category;
    acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
    return acc;
  }, {});

  const result = [];
  budgets.forEach((budget) => {
    if (budget.category !== "Monthly Budget" && budget.amount > 0) {
      const categoryExpenses = expensesByCategory[budget.category] || 0;
      result.push({
        category: budget.category,
        budgetAmount: budget.amount,
        totalExpenses: categoryExpenses,
        remainingBudget: budget.amount - categoryExpenses,
        percentageUsed: budget.amount > 0 ? Math.round((categoryExpenses / budget.amount) * 100) : 0,
      });
    }
  });

  return {
    month,
    year,
    monthStart,
    monthEnd,
    categories: result.sort((a, b) => a.category.localeCompare(b.category)),
  };
};

export const create = async ({ title, amount, category, category_id, user_id, period, start_date, end_date, isAllCategory }) => {
  const { db, collection, addDoc, serverTimestamp, Timestamp } = fs();
  const month = new Date(start_date).toLocaleString("en-US", { month: "long" });

  if (isAllCategory) {
    const existing = (await fetchUserBudgets(user_id)).filter(
      (b) => b.title === `Budget for ${month}`
    );
    if (existing.length > 0) {
      throw new Error("You already have a budget for this month");
    }
  }

  const payload = {
    title,
    amount,
    category: category_id ? category || category_id : category,
    user_id,
    period,
    start_date: Timestamp.fromDate(new Date(start_date)),
    end_date: Timestamp.fromDate(new Date(end_date)),
    isAllCategory: !!isAllCategory,
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
  if (category_id) payload.category_id = category_id;

  const ref = await addDoc(collection(db, COLLECTIONS.budgets), payload);

  await createNotification({
    user_id,
    title: "Budget Created",
    message: `Budget "${title}" created with amount ${amount} for ${period} period ${isAllCategory ? "for this month" : "for " + category}`,
  });

  return { _id: ref.id, id: ref.id, title, amount, category: payload.category, user_id, period, start_date, end_date };
};

export const remove = async (id) => {
  const { db, doc, getDoc, deleteDoc } = fs();
  const ref = doc(db, COLLECTIONS.budgets, id);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : null;
  await deleteDoc(ref);
  if (data) {
    await createNotification({
      user_id: data.user_id,
      title: "Budget Deleted",
      message: `Budget "${data.title}" deleted with amount ${data.amount}`,
    });
  }
};

export const setAsPrevious = async (userId, month) => {
  const { db, collection, addDoc, serverTimestamp, Timestamp } = fs();
  const lastMonth = getPreviousMonth(month);
  const currentMonthIndex = getMonthIndex(month);

  const previous = (await fetchUserBudgets(userId)).find(
    (b) => b.title === `Budget for ${lastMonth}`
  );
  if (!previous) {
    throw new Error("No budget found for the previous month");
  }

  const year = new Date().getFullYear();
  await addDoc(collection(db, COLLECTIONS.budgets), {
    user_id: userId,
    title: `Budget for ${month}`,
    category: previous.category,
    amount: previous.amount,
    period: previous.period || "monthly",
    isAllCategory: previous.isAllCategory || false,
    is_active: true,
    start_date: Timestamp.fromDate(new Date(year, currentMonthIndex, 1)),
    end_date: Timestamp.fromDate(new Date(year, currentMonthIndex + 1, 0)),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  return previous;
};

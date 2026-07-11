// Firestore implementation: full user data export.
import { COLLECTIONS, fs, normalizeMany } from "./helpers";
import * as userFire from "./userFire";
import * as transactionsFire from "./transactionsFire";
import * as budgetsFire from "./budgetsFire";
import * as statisticsFire from "./statisticsFire";

const fetchAll = async (collectionName, userId, dateFields) => {
  const { db, collection, query, where, getDocs } = fs();
  const snap = await getDocs(
    query(collection(db, collectionName), where("user_id", "==", userId))
  );
  return normalizeMany(snap, dateFields);
};

export const exportUser = async (userId) => {
  if (!userId) throw new Error("userId is required");

  const user = await userFire.getById(userId);

  const [transactions, budgetsResult, banks, categories, summary, totalStats] = await Promise.all([
    fetchAll(COLLECTIONS.transactions, userId, ["date", "created_at", "updated_at"]),
    budgetsFire.getByUser(userId, { page: 1, limit: 1000 }),
    fetchAll(COLLECTIONS.banks, userId, ["createdAt", "updatedAt"]),
    fetchAll(COLLECTIONS.categories, userId, ["created_at", "updated_at"]),
    transactionsFire.summary(userId),
    statisticsFire.total(userId),
  ]);

  const budgets = budgetsResult.items || [];

  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    user,
    summary,
    stats: totalStats,
    counts: {
      transactions: transactions.length,
      budgets: budgets.length,
      banks: banks.length,
      categories: categories.length,
    },
    transactions,
    budgets,
    banks,
    categories,
    generatedAt: new Date().toISOString(),
  };
};

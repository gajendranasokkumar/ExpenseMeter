// Firestore implementation: transactions.
import { COLLECTIONS, fs, normalizeMany } from "./helpers";
import { createNotification } from "./notificationsFire";

const DATE_FIELDS = ["date", "created_at", "updated_at"];

const clampDates = (startDate, endDate) => {
  let start = null;
  let end = null;
  if (startDate) {
    const d = new Date(startDate);
    if (!isNaN(d.getTime())) start = d;
  }
  if (endDate) {
    const d = new Date(endDate);
    if (!isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999);
      end = d;
    }
  }
  return { start, end };
};

export const getByUser = async (userId, { page = 1, limit = 10, startDate, endDate } = {}) => {
  const { db, collection, query, where, getDocs } = fs();
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100);

  const q = query(collection(db, COLLECTIONS.transactions), where("user_id", "==", userId));
  const snap = await getDocs(q);
  let all = normalizeMany(snap, DATE_FIELDS);

  const { start, end } = clampDates(startDate, endDate);
  if (start || end) {
    all = all.filter((tx) => {
      const d = new Date(tx.date);
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }

  all.sort((a, b) => {
    const byDate = new Date(b.date) - new Date(a.date);
    if (byDate !== 0) return byDate;
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const total = all.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIdx = (pageNumber - 1) * pageSize;
  const items = all.slice(startIdx, startIdx + pageSize);
  return { items, total, page: pageNumber, limit: pageSize, totalPages };
};

export const create = async ({ title, amount, category, category_id, bank, user_id, date }) => {
  const { db, collection, addDoc, serverTimestamp, Timestamp } = fs();
  const payload = {
    title,
    amount,
    category: category_id ? category || category_id : category,
    bank,
    user_id,
    date: date ? Timestamp.fromDate(new Date(date)) : serverTimestamp(),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
  if (category_id) payload.category_id = category_id;

  const ref = await addDoc(collection(db, COLLECTIONS.transactions), payload);

  if (amount > 0) {
    await createNotification({ user_id, title: "Income", message: `You have earned ${amount} from ${title}` });
  } else {
    await createNotification({ user_id, title: "Expense", message: `You have spent ${amount} on ${title}` });
  }

  return { _id: ref.id, id: ref.id, title, amount, category: payload.category, category_id, bank, user_id, date };
};

export const remove = async (id) => {
  const { db, doc, getDoc, deleteDoc } = fs();
  const ref = doc(db, COLLECTIONS.transactions, id);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : null;
  await deleteDoc(ref);
  if (data) {
    await createNotification({
      user_id: data.user_id,
      title: "Transaction Deleted",
      message: `Transaction ${data.title} deleted with amount ${data.amount}`,
    });
  }
};

export const removeAllByUser = async (userId) => {
  const { db, collection, query, where, getDocs, deleteDoc } = fs();
  const q = query(collection(db, COLLECTIONS.transactions), where("user_id", "==", userId));
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  await createNotification({ user_id: userId, title: "All Transactions Deleted", message: "All transactions deleted" });
};

export const summary = async (userId) => {
  const { db, collection, query, where, getDocs } = fs();
  const q = query(collection(db, COLLECTIONS.transactions), where("user_id", "==", userId));
  const snap = await getDocs(q);
  let balance = 0;
  let income = 0;
  let expenses = 0;
  snap.forEach((d) => {
    const data = d.data();
    if (data.category === "Transfer") return;
    const amount = data.amount || 0;
    balance += amount;
    if (amount > 0) income += amount;
    else if (amount < 0) expenses += amount;
  });
  return { balance, income, expenses };
};

export const transfer = async ({ user_id, fromBank, toBank, amount, date, note }) => {
  if (!user_id || !fromBank || !toBank || amount === undefined) {
    throw new Error("user_id, fromBank, toBank and amount are required");
  }
  if (String(fromBank) === String(toBank)) {
    throw new Error("Source and destination banks must be different");
  }
  const transferAmount = Math.abs(Number(amount));
  if (!transferAmount || Number.isNaN(transferAmount)) {
    throw new Error("Amount must be a positive number");
  }

  const { db, collection, addDoc, doc, getDoc, getDocs, query, where, serverTimestamp, Timestamp } = fs();

  const [fromSnap, toSnap] = await Promise.all([
    getDoc(doc(db, COLLECTIONS.banks, fromBank)),
    getDoc(doc(db, COLLECTIONS.banks, toBank)),
  ]);
  if (!fromSnap.exists() || !toSnap.exists()) {
    throw new Error("Bank not found");
  }
  const fromName = fromSnap.data().name;
  const toName = toSnap.data().name;

  // Ensure the source bank has enough available balance.
  const fromTxSnap = await getDocs(
    query(collection(db, COLLECTIONS.transactions), where("user_id", "==", user_id), where("bank", "==", fromBank))
  );
  let available = 0;
  fromTxSnap.forEach((d) => {
    available += d.data().amount || 0;
  });
  if (transferAmount > available) {
    throw new Error("Insufficient balance in the source bank");
  }

  const txDate = date ? Timestamp.fromDate(new Date(date)) : serverTimestamp();

  const outgoing = await addDoc(collection(db, COLLECTIONS.transactions), {
    user_id,
    title: note || `Transfer to ${toName}`,
    amount: -transferAmount,
    category: "Transfer",
    bank: fromBank,
    date: txDate,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  const incoming = await addDoc(collection(db, COLLECTIONS.transactions), {
    user_id,
    title: note || `Transfer from ${fromName}`,
    amount: transferAmount,
    category: "Transfer",
    bank: toBank,
    date: txDate,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  await createNotification({
    user_id,
    title: "Bank Transfer",
    message: `Transferred ${transferAmount} from ${fromName} to ${toName}`,
  });

  return {
    outgoing: { _id: outgoing.id, id: outgoing.id },
    incoming: { _id: incoming.id, id: incoming.id },
  };
};

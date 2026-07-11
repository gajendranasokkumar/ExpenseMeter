// Firestore implementation: banks.
import { COLLECTIONS, fs, normalizeMany } from "./helpers";

const DATE_FIELDS = ["createdAt", "updatedAt"];

export const getAll = async (userId) => {
  const { db, collection, query, where, getDocs } = fs();
  const q = query(
    collection(db, COLLECTIONS.banks),
    where("user_id", "==", userId),
    where("isActive", "==", true)
  );
  const snap = await getDocs(q);
  const banks = normalizeMany(snap, DATE_FIELDS);
  banks.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return banks;
};

export const create = async ({ name, logo, ifsc, userId, isSavings = false }) => {
  const { db, collection, query, where, getDocs, addDoc, serverTimestamp } = fs();

  const existing = await getDocs(
    query(collection(db, COLLECTIONS.banks), where("name", "==", name))
  );
  const existingIfsc = await getDocs(
    query(collection(db, COLLECTIONS.banks), where("ifsc", "==", ifsc))
  );
  if (!existing.empty || !existingIfsc.empty) {
    throw new Error("Bank already exists with this name or IFSC code");
  }

  const ref = await addDoc(collection(db, COLLECTIONS.banks), {
    name,
    logo,
    ifsc,
    isActive: true,
    isSavings: !!isSavings,
    user_id: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { _id: ref.id, id: ref.id, name, logo, ifsc, isActive: true, isSavings: !!isSavings, user_id: userId };
};

export const removePermanent = async (id) => {
  const { db, doc, deleteDoc } = fs();
  await deleteDoc(doc(db, COLLECTIONS.banks, id));
};

export const summary = async (userId) => {
  const { db, collection, query, where, getDocs } = fs();
  const banksSnap = await getDocs(
    query(collection(db, COLLECTIONS.banks), where("user_id", "==", userId))
  );
  const txSnap = await getDocs(
    query(collection(db, COLLECTIONS.transactions), where("user_id", "==", userId))
  );

  const banks = normalizeMany(banksSnap, DATE_FIELDS);
  const transactions = normalizeMany(txSnap, ["date"]);

  return banks.map((bank) => {
    const availableBalance = transactions
      .filter((tx) => tx.bank && String(tx.bank) === String(bank._id))
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    return { ...bank, availableBalance };
  });
};

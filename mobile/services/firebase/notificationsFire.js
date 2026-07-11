// Firestore implementation: notifications.
import { COLLECTIONS, fs, normalizeMany } from "./helpers";

const DATE_FIELDS = ["created_at"];

// Internal helper reused by transaction/budget creation to mirror the
// backend's automatic notification behavior.
export const createNotification = async ({ user_id, title, message }) => {
  const { db, collection, addDoc, serverTimestamp } = fs();
  const ref = await addDoc(collection(db, COLLECTIONS.notifications), {
    user_id,
    title,
    message,
    is_read: false,
    created_at: serverTimestamp(),
  });
  return { _id: ref.id, id: ref.id, user_id, title, message, is_read: false };
};

export const getByUser = async (userId, { page = 1, limit = 10 } = {}) => {
  const { db, collection, query, where, orderBy, getDocs } = fs();
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100);

  const q = query(
    collection(db, COLLECTIONS.notifications),
    where("user_id", "==", userId),
    orderBy("created_at", "desc")
  );
  const snap = await getDocs(q);
  const all = normalizeMany(snap, DATE_FIELDS);

  const total = all.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = (pageNumber - 1) * pageSize;
  const items = all.slice(start, start + pageSize);
  return { items, total, page: pageNumber, limit: pageSize, totalPages };
};

export const getUnread = async (userId) => {
  const { db, collection, query, where, getDocs } = fs();
  const q = query(
    collection(db, COLLECTIONS.notifications),
    where("user_id", "==", userId),
    where("is_read", "==", false)
  );
  const snap = await getDocs(q);
  const items = normalizeMany(snap, DATE_FIELDS);
  items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return items;
};

export const remove = async (id) => {
  const { db, doc, deleteDoc } = fs();
  await deleteDoc(doc(db, COLLECTIONS.notifications, id));
};

export const markRead = async (id) => {
  const { db, doc, updateDoc } = fs();
  await updateDoc(doc(db, COLLECTIONS.notifications, id), { is_read: true });
};

export const removeAll = async (userId) => {
  const { db, collection, query, where, getDocs, deleteDoc } = fs();
  const q = query(
    collection(db, COLLECTIONS.notifications),
    where("user_id", "==", userId)
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
};

// Firestore implementation: auto_schedules.
// Stores recurring budget / transaction schedules and processes due ones.
import { COLLECTIONS, fs, normalizeMany } from "./helpers";

const DATE_FIELDS = ["last_run", "next_run", "created_at", "updated_at"];

/**
 * Compute the next run date from a given base date and frequency.
 * @param {Date} base
 * @param {"daily"|"weekly"|"monthly"} frequency
 * @returns {Date}
 */
export const computeNextRun = (base, frequency) => {
  const d = new Date(base);
  switch (frequency) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
    default:
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d;
};

/**
 * Create a new auto-schedule document.
 * @param {{ user_id, type, frequency, payload }} data
 */
export const createSchedule = async ({ user_id, type, frequency, payload }) => {
  const { db, collection, addDoc, serverTimestamp, Timestamp } = fs();
  const now = new Date();
  const nextRun = computeNextRun(now, frequency);

  const ref = await addDoc(collection(db, COLLECTIONS.auto_schedules), {
    user_id,
    type,           // "budget" | "transaction"
    frequency,      // "daily" | "weekly" | "monthly"
    payload,        // all fields needed to recreate the budget / transaction
    last_run: null,
    next_run: Timestamp.fromDate(nextRun),
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  return { _id: ref.id, id: ref.id, user_id, type, frequency, payload, next_run: nextRun };
};

/**
 * Returns all active schedules whose next_run is <= now.
 */
export const getDueSchedules = async (userId) => {
  const { db, collection, query, where, getDocs, Timestamp } = fs();
  const now = Timestamp.fromDate(new Date());
  const q = query(
    collection(db, COLLECTIONS.auto_schedules),
    where("user_id", "==", userId),
    where("is_active", "==", true),
    where("next_run", "<=", now)
  );
  const snap = await getDocs(q);
  return normalizeMany(snap, DATE_FIELDS);
};

/**
 * Update last_run and advance next_run after a schedule fires.
 * @param {string} id
 * @param {"daily"|"weekly"|"monthly"} frequency
 */
export const updateLastRun = async (id, frequency) => {
  const { db, doc, updateDoc, serverTimestamp, Timestamp } = fs();
  const now = new Date();
  const nextRun = computeNextRun(now, frequency);
  await updateDoc(doc(db, COLLECTIONS.auto_schedules, id), {
    last_run: Timestamp.fromDate(now),
    next_run: Timestamp.fromDate(nextRun),
    updated_at: serverTimestamp(),
  });
};

/**
 * Soft-delete a schedule (sets is_active = false).
 */
export const removeSchedule = async (id) => {
  const { db, doc, updateDoc, serverTimestamp } = fs();
  await updateDoc(doc(db, COLLECTIONS.auto_schedules, id), {
    is_active: false,
    updated_at: serverTimestamp(),
  });
};

/**
 * Returns all active schedules for a user (for management UI).
 */
export const getAll = async (userId) => {
  const { db, collection, query, where, getDocs } = fs();
  const q = query(
    collection(db, COLLECTIONS.auto_schedules),
    where("user_id", "==", userId),
    where("is_active", "==", true)
  );
  const snap = await getDocs(q);
  return normalizeMany(snap, DATE_FIELDS);
};

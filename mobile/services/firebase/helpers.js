// Shared helpers for the Firestore data provider.
import { getDb } from "./firebase";

// Collection names in Firestore.
export const COLLECTIONS = {
  users: "users",
  transactions: "transactions",
  budgets: "budgets",
  banks: "banks",
  categories: "categories",
  notifications: "notifications",
};

// Convert whatever Firestore gives back for a date field into an ISO string,
// so the shape matches the REST backend (which serializes dates as ISO).
export const toIso = (value) => {
  if (!value) return value;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  // Firestore Timestamp
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return value;
};

// Normalize a Firestore document snapshot into a plain object that mirrors the
// Mongo/REST shape: expose the document id as `_id`, convert known date fields.
export const normalize = (snap, dateFields = []) => {
  if (!snap || !snap.exists?.()) return null;
  const data = snap.data();
  const out = { _id: snap.id, id: snap.id, ...data };
  for (const field of dateFields) {
    if (out[field] !== undefined) out[field] = toIso(out[field]);
  }
  return out;
};

export const normalizeMany = (querySnap, dateFields = []) => {
  const items = [];
  querySnap.forEach((docSnap) => {
    const data = docSnap.data();
    const out = { _id: docSnap.id, id: docSnap.id, ...data };
    for (const field of dateFields) {
      if (out[field] !== undefined) out[field] = toIso(out[field]);
    }
    items.push(out);
  });
  return items;
};

// Firestore query builders re-exported so domain files stay concise.
export const fs = () => {
  const mod = require("firebase/firestore");
  return { db: getDb(), ...mod };
};

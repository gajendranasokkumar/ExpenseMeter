// Firestore implementation: user profile.
import { COLLECTIONS, fs } from "./helpers";

const stripPassword = (user) => {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
};

export const getById = async (id) => {
  const { db, doc, getDoc } = fs();
  const snap = await getDoc(doc(db, COLLECTIONS.users, id));
  if (!snap.exists()) throw new Error("User not found");
  return stripPassword({ _id: snap.id, id: snap.id, ...snap.data() });
};

export const update = async (id, { name, email, avatar = "" }) => {
  if (!name || !email) throw new Error("Name and email are required");
  const { db, doc, getDoc, updateDoc } = fs();
  const ref = doc(db, COLLECTIONS.users, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("User not found");

  await updateDoc(ref, { name, email, avatar });
  return stripPassword({ _id: id, id, ...snap.data(), name, email, avatar });
};

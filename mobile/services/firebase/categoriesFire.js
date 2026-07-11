// Firestore implementation: categories.
import { COLLECTIONS, fs, normalizeMany } from "./helpers";

const DATE_FIELDS = ["created_at", "updated_at"];

export const getAll = async (userId) => {
  const { db, collection, query, where, getDocs } = fs();
  const q = query(
    collection(db, COLLECTIONS.categories),
    where("user_id", "==", userId),
    where("isActive", "==", true)
  );
  const snap = await getDocs(q);
  const categories = normalizeMany(snap, DATE_FIELDS);
  categories.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return categories;
};

const findByName = async (userId, name, excludeId) => {
  const { db, collection, query, where, getDocs } = fs();
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.categories), where("user_id", "==", userId))
  );
  return normalizeMany(snap).find(
    (cat) =>
      (cat.name || "").toLowerCase() === String(name).toLowerCase() &&
      cat._id !== excludeId
  );
};

export const create = async ({ name, icon, color, user_id }) => {
  if (!name || !user_id) throw new Error("Name and user_id are required");
  const { db, collection, addDoc, serverTimestamp } = fs();

  if (await findByName(user_id, name)) {
    throw new Error("Category already exists with this name");
  }

  const ref = await addDoc(collection(db, COLLECTIONS.categories), {
    name,
    icon,
    color,
    user_id,
    isActive: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return { _id: ref.id, id: ref.id, name, icon, color, user_id, isActive: true };
};

export const update = async (id, userId, { name, icon, color, isActive }) => {
  const { db, doc, getDoc, updateDoc, serverTimestamp } = fs();

  if (name && (await findByName(userId, name, id))) {
    throw new Error("Another category already exists with this name");
  }

  const ref = doc(db, COLLECTIONS.categories, id);
  const snap = await getDoc(ref);
  if (!snap.exists() || String(snap.data().user_id) !== String(userId)) {
    throw new Error("Category not found");
  }

  const updateFields = { updated_at: serverTimestamp() };
  if (name !== undefined) updateFields.name = name;
  if (icon !== undefined) updateFields.icon = icon;
  if (color !== undefined) updateFields.color = color;
  if (isActive !== undefined) updateFields.isActive = isActive;

  await updateDoc(ref, updateFields);
  return { _id: id, id, ...snap.data(), ...updateFields };
};

export const removePermanent = async (id) => {
  const { db, doc, deleteDoc } = fs();
  await deleteDoc(doc(db, COLLECTIONS.categories, id));
};

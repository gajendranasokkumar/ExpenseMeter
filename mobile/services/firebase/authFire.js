// Firestore implementation: authentication (Firestore-only, no Firebase Auth).
//
// Passwords are hashed with SHA-256 (pure-JS, see ./crypto) before being
// stored. This mode is intended for the "firebase" data provider on a study
// project; for production-grade auth prefer Firebase Authentication.
import { COLLECTIONS, fs } from "./helpers";
import { sha256, uuid } from "./crypto";

const hashPassword = async (password) => sha256(password);

const stripPassword = (user) => {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
};

const findUserByEmail = async (email) => {
  const { db, collection, query, where, getDocs } = fs();
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.users), where("email", "==", email))
  );
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { _id: docSnap.id, id: docSnap.id, ...docSnap.data() };
};

export const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");

  const hashed = await hashPassword(password);
  if (hashed !== user.password) throw new Error("Password is incorrect");

  const jwtToken = uuid();

  return { jwtToken, data: stripPassword(user) };
};

export const register = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const existing = await findUserByEmail(email);
  if (existing) throw new Error("User already exists");

  const { db, collection, addDoc } = fs();
  const hashed = await hashPassword(password);
  const ref = await addDoc(collection(db, COLLECTIONS.users), {
    name,
    email,
    password: hashed,
    avatar: "",
  });
  return { _id: ref.id, id: ref.id, name, email, avatar: "" };
};

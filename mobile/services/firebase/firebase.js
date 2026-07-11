// Lazy Firebase / Firestore initialization.
//
// The Firebase app is only initialized the first time a Firestore call is
// made (i.e. when DATA_PROVIDER === "firebase"). This keeps the app fully
// functional in "backend" mode even if the firebase package is not installed
// or the config is left as placeholders.

import { firebaseConfig } from "../../config/firebaseConfig";

let dbInstance = null;

export const getDb = () => {
  if (dbInstance) return dbInstance;

  // Require lazily so backend-only builds never touch the firebase SDK.
  const { initializeApp, getApps, getApp } = require("firebase/app");
  const { initializeFirestore, getFirestore } = require("firebase/firestore");

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  try {
    // Long polling is more reliable inside React Native than the default
    // WebChannel transport.
    dbInstance = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } catch {
    // initializeFirestore throws if Firestore was already initialized.
    dbInstance = getFirestore(app);
  }

  return dbInstance;
};

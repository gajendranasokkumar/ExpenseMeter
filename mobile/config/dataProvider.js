// ---------------------------------------------------------------------------
// Data provider switch (plug-and-play)
// ---------------------------------------------------------------------------
// Change DATA_PROVIDER to decide how the app talks to its data layer:
//   "backend"  -> uses the hosted REST API (axios, constants/endPoints.js)
//   "firebase" -> uses Cloud Firestore directly from the app
//
// Everything else in the app goes through the service layer in /services,
// so flipping this single constant swaps the whole data source.
// ---------------------------------------------------------------------------

export const PROVIDERS = {
    BACKEND: "backend",
    FIREBASE: "firebase",
  };
  
  export const DATA_PROVIDER = PROVIDERS.FIREBASE;
  
  export const isFirebase = () => DATA_PROVIDER === PROVIDERS.FIREBASE;
  export const isBackend = () => DATA_PROVIDER === PROVIDERS.BACKEND;
  
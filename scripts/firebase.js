import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app-check.js";

// Firebase is optional: the app should still start in local mode when a
// deployment does not include its private, per-environment config module.
let firebaseConfig;
let recaptchaEnterpriseKey;
try {
  ({ firebaseConfig, recaptchaEnterpriseKey } = await import("../firebase-config.js"));
} catch {
  ({ firebaseConfig, recaptchaEnterpriseKey } = await import("../firebase-config.example.js"));
}

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  !firebaseConfig.apiKey.startsWith("YOUR_")
);

let app = null;
let auth;
let db;
let provider;

if (isConfigured) {
  if (
    typeof location !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(location.hostname) &&
    typeof self !== "undefined"
  ) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  app = initializeApp(firebaseConfig);
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(recaptchaEnterpriseKey),
    isTokenAutoRefreshEnabled: true
  });
  auth = getAuth(app);
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
}

export { app, isConfigured, auth, db, onAuthStateChanged };

export async function signInWithGoogle() {
  if (!isConfigured) throw new Error("Firebase 尚未設定，請建立 firebase-config.js。");
  return signInWithPopup(auth, provider);
}

export async function signOutUser() {
  if (!isConfigured) return;
  await signOut(auth);
}

export async function loadUserData(uid) {
  if (!db || !uid) return null;
  const snapshot = await getDoc(doc(db, "users", uid, "app", "data"));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveUserData(uid, data) {
  if (!db || !uid) throw new Error("使用者尚未登入。");
  await setDoc(doc(db, "users", uid, "app", "data"), {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

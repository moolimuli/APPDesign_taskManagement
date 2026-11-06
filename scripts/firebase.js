import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "../firebase-config.js";

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  !firebaseConfig.apiKey.startsWith("YOUR_")
);

let auth;
let db;
let provider;

if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
}

export { isConfigured, auth, db, onAuthStateChanged };

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

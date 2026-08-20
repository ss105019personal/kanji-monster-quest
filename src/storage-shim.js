// window.storage の かわりに つかう しくみ（Firebase Firestore）
//
// もとの App.jsx は Claude のアーティファクトが よういしてくれる
// window.storage.get(key, shared) / window.storage.set(key, value, shared)
// という 2つの かんすうだけを つかっています。
// ここでは その 2つを おなじ かたちで じっそうし、
// shared=true のときは みんなで きょうゆうできる Firestore に、
// shared=false のときは その たんまつだけの localStorage に ほぞんします。
//
// ※ このアプリでは すべての よびだしが shared=true なので、
//    じっしつてきには ぜんぶ Firestore に はいります。

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ▼▼▼ ここを Firebase コンソールで取得した自分の設定に書き換えてください ▼▼▼
const firebaseConfig = {
  apiKey: "AIzaSyCyRAJyLHbdtAcio0wkJf3Y-oGVM1JJH40",
  authDomain: "kanji-mon.firebaseapp.com",
  projectId: "kanji-mon",
  storageBucket: "kanji-mon.firebasestorage.app",
  messagingSenderId: "766782588782",
  appId: "1:766782588782:web:70068ba7ef1ab6f378237f",
  measurementId: "G-K46RWWJP6X",
};
// ▲▲▲ ここまで ▲▲▲

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore のドキュメントIDに使えない文字（/ .. など）を安全な形に変換
function safeDocId(key) {
  return encodeURIComponent(key);
}

async function get(key, shared) {
  if (!shared) {
    const v = window.localStorage.getItem(key);
    if (v === null) throw new Error("not found");
    return { key, value: v, shared };
  }
  const ref = doc(db, "kv", safeDocId(key));
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("not found");
  return { key, value: snap.data().value, shared };
}

async function set(key, value, shared) {
  if (!shared) {
    window.localStorage.setItem(key, value);
    return { key, value, shared };
  }
  const ref = doc(db, "kv", safeDocId(key));
  await setDoc(ref, { value, updatedAt: Date.now() });
  return { key, value, shared };
}

// App.jsx はグローバルの window.storage を呼び出すので、ここで用意しておく
window.storage = { get, set };

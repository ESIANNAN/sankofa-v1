import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiRvic9HJwvHi8xlsBpkLB4UHJgSdAdno",
  authDomain: "sankofa-v1.firebaseapp.com",
  projectId: "sankofa-v1",
  storageBucket: "sankofa-v1.firebasestorage.app",
  messagingSenderId: "503708890292",
  appId: "1:503708890292:web:b24e0678e9921d1bb8d3e1",
  measurementId: "G-XTR263KTL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally based on environment support
export let analytics: any = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((err) => {
  console.warn("Firebase Analytics is not supported in this environment:", err);
});

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

const analytics = getAnalytics(app);

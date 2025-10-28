import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmUzYWYN735MKO0_0TTvGBgEb0LhQLzqo",
  authDomain: "mystoree-react.firebaseapp.com",
  projectId: "mystoree-react",
  storageBucket: "mystoree-react.appspot.com",
  messagingSenderId: "969506930649",
  appId: "1:969506930649:web:22826d8a18c0bc49e923c8",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)
export default app

import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCSsYMfCr8Z8fw1lGFI_pksF_9J4bE2VBw",
  authDomain: "clikshoping-47237.firebaseapp.com",
  projectId: "clikshoping-47237",
  storageBucket: "clikshoping-47237.firebasestorage.app",
  messagingSenderId: "637296909885",
  appId: "1:637296909885:web:c211cea5e80bd311e55454",
  measurementId: "G-21HT31ZQQG"
};

// 🔥 Inicializar app
const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 📊 Analytics (opcional)
export const analytics = getAnalytics(app);

// 🤖 Recaptcha
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    );
  }
};
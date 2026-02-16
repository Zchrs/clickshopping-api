import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import esLang from '../locales/es.json';
import enLang from '../locales/en.json';




i18n
  .use(initReactI18next) // inicializa react-i18next
  .use(LanguageDetector) // inicializa react-i18next
  .init({
    resources: {
      es: {
        translation: esLang,
      },
      en: {
        translation: enLang,
      },
      // Puedes agregar más idiomas si es necesario
    },
    lng: 'es',
    fallbackLng: 'en',
    whitelist: ['en', 'es'],
    interpolation: {
      escapeValue: false,
    },
  });



export default i18n;
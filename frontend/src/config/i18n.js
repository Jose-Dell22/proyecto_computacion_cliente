import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../local/en/translation.json';
import es from '../local/es/translation.json';
import zh from '../local/zh/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      zh: { translation: zh },
    },
    fallbackLng: 'es', 
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'], 
      caches: ['localStorage'], 
    },
  });

export default i18n;

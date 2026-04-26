import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonPl from './locales/pl/common.json';
import authPl from './locales/pl/auth.json';
import drugsPl from './locales/pl/drugs.json';
import dashboardPl from './locales/pl/dashboard.json';
import profilePl from './locales/pl/profile.json';
import adminPl from './locales/pl/admin.json';
import aboutPl from './locales/pl/about.json';
import contactPl from './locales/pl/contact.json';
import errorsPl from './locales/pl/errors.json';

import commonEn from './locales/en/common.json';
import authEn from './locales/en/auth.json';
import drugsEn from './locales/en/drugs.json';
import dashboardEn from './locales/en/dashboard.json';
import profileEn from './locales/en/profile.json';
import adminEn from './locales/en/admin.json';
import aboutEn from './locales/en/about.json';
import contactEn from './locales/en/contact.json';
import errorsEn from './locales/en/errors.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        common: commonPl,
        auth: authPl,
        drugs: drugsPl,
        dashboard: dashboardPl,
        profile: profilePl,
        admin: adminPl,
        about: aboutPl,
        contact: contactPl,
        errors: errorsPl,
      },
      en: {
        common: commonEn,
        auth: authEn,
        drugs: drugsEn,
        dashboard: dashboardEn,
        profile: profileEn,
        admin: adminEn,
        about: aboutEn,
        contact: contactEn,
        errors: errorsEn,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'drugs', 'dashboard', 'profile', 'admin', 'about', 'contact', 'errors'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;

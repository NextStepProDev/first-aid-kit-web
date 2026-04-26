import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { isAuthenticated, refreshUser } = useAuth();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'pl' ? 'en' : 'pl';
    i18n.changeLanguage(newLang);
    if (isAuthenticated) {
      try {
        await authApi.updateLanguage({ language: newLang });
        refreshUser();
      } catch {
        // Language changed locally even if backend save fails
      }
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-dark-700 transition-colors"
      title={i18n.language === 'pl' ? 'Switch to English' : 'Przełącz na Polski'}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{i18n.language}</span>
    </button>
  );
}

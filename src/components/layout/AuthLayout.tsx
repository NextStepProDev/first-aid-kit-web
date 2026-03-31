import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../ui';

export function AuthLayout() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-dark-900 flex relative">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="First Aid Kit" className="w-10 h-10 rounded-lg" />
          <span className="text-2xl font-bold text-white">First Aid Kit</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('authLayout.title')}
          </h1>
          <p className="text-lg text-white/80">
            {t('authLayout.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-4 text-white/60 text-sm">
          <span>{t('authLayout.features.security')}</span>
          <span>•</span>
          <span>{t('authLayout.features.reminders')}</span>
          <span>•</span>
          <span>{t('authLayout.features.statistics')}</span>
        </div>
      </div>

      {/* Language switcher - absolute positioned */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/logo.svg" alt="First Aid Kit" className="w-10 h-10 rounded-lg" />
            <span className="text-2xl font-bold text-gray-100">First Aid Kit</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

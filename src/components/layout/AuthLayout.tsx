import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Info, Shield } from 'lucide-react';
import { LanguageSwitcher, ShareButtons } from '../ui';

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

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link
              to="/o-nas"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
            >
              <Info className="w-4 h-4" />
              {t('nav.about')}
            </Link>
            <Link
              to="/polityka-prywatnosci"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
            >
              <Shield className="w-4 h-4" />
              {t('footer.privacyPolicy')}
            </Link>
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 [&_a]:text-white/70 [&_a:hover]:text-white [&_a:hover]:bg-white/10 [&_button]:text-white/70 [&_button:hover]:text-white [&_button:hover]:bg-white/10 [&_.text-gray-500]:text-white/60 [&_a]:p-0.5 [&_button]:p-0.5">
              <ShareButtons title="First Aid Kit Manager" url={window.location.origin} compact />
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>{t('authLayout.features.security')}</span>
            <span>•</span>
            <span>{t('authLayout.features.reminders')}</span>
            <span>•</span>
            <span>{t('authLayout.features.statistics')}</span>
          </div>
        </div>
      </div>

      {/* Language switcher - absolute positioned */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo + links */}
          <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="First Aid Kit" className="w-10 h-10 rounded-lg" />
              <span className="text-2xl font-bold text-gray-100">First Aid Kit</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/o-nas"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 text-sm font-medium transition-colors"
              >
                <Info className="w-4 h-4" />
                {t('nav.about')}
              </Link>
              <Link
                to="/polityka-prywatnosci"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 text-sm font-medium transition-colors"
              >
                <Shield className="w-4 h-4" />
                {t('footer.privacyPolicy')}
              </Link>
              <div className="self-stretch inline-flex items-center px-3 py-2 rounded-lg bg-primary-600/20 [&_a]:p-0.5 [&_button]:p-0.5">
                <ShareButtons title="First Aid Kit Manager" url={window.location.origin} compact />
              </div>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

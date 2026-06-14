import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_VERSION_LABEL } from '../../config/version';
import { ShareButtons } from '../ui';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="py-4 text-center text-xs text-gray-500 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4">
      <span>{APP_VERSION_LABEL}</span>
      <span className="hidden sm:inline">·</span>
      <Link
        to="/polityka-prywatnosci"
        className="hover:text-gray-300 transition-colors"
      >
        {t('footer.privacyPolicy')}
      </Link>
      <span className="hidden sm:inline">·</span>
      <Link
        to="/o-nas"
        className="hover:text-gray-300 transition-colors"
      >
        {t('nav.about')}
      </Link>
      <span className="hidden sm:inline">·</span>
      <ShareButtons title="First Aid Kit Manager" url={window.location.origin} compact />
    </footer>
  );
}

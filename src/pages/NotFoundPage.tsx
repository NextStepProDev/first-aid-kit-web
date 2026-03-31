import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui';
import { Home, AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  const { t } = useTranslation('errors');

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-danger-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-danger-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-100 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">
          {t('notFound.title')}
        </h2>
        <p className="text-gray-400 mb-8">
          {t('notFound.message')}
        </p>
        <Link to="/">
          <Button>
            <Home className="w-4 h-4" />
            {t('notFound.button')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

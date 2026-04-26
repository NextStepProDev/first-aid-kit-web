import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '../ui';

export function PublicPageLayout() {
  return (
    <div className="min-h-screen bg-dark-900">
      <header className="h-16 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-4 lg:px-8">
        <Link
          to="/login"
          className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <img src="/logo.svg" alt="First Aid Kit" className="w-8 h-8 rounded-lg" />
          <span className="text-lg font-bold text-gray-100">First Aid Kit</span>
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="w-full p-4 lg:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

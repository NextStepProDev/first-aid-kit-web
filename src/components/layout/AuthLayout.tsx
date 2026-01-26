import React from 'react';
import { Outlet } from 'react-router-dom';
import { Pill } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">First Aid Kit</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Zarządzaj swoją apteczką domową
          </h1>
          <p className="text-lg text-white/80">
            Monitoruj daty ważności leków, otrzymuj przypomnienia i miej pełną kontrolę nad swoją domową apteczką.
          </p>
        </div>

        <div className="flex items-center gap-4 text-white/60 text-sm">
          <span>Bezpieczeństwo</span>
          <span>•</span>
          <span>Przypomnienia</span>
          <span>•</span>
          <span>Statystyki</span>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-100">First Aid Kit</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

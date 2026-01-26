import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Pill,
  PlusCircle,
  Settings,
  Users,
  Shield,
  Mail,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ADMIN');

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard', end: true },
    { to: '/drugs', icon: Pill, label: 'Leki', end: true },
    { to: '/drugs/new', icon: PlusCircle, label: 'Dodaj lek', end: true },
    { to: '/profile', icon: Settings, label: 'Ustawienia', end: true },
    { to: '/contact', icon: Mail, label: 'Kontakt', end: true },
  ];

  const adminItems = [
    { to: '/admin/users', icon: Users, label: 'Użytkownicy', end: true },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 w-64 bg-dark-800 border-r border-dark-600 z-30',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <div className="flex items-center gap-2 px-4 text-xs font-semibold text-warning-400 uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </div>
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-warning-500/10 text-warning-400'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Tip */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
            <p className="text-xs text-gray-500 mb-1">Tip</p>
            <p className="text-sm text-gray-300">
              Dodaj leki do swojej apteczki, aby otrzymywać powiadomienia o ich wygasaniu.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

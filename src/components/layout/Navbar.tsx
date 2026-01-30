import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Navbar({ isSidebarOpen, onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const isAdmin = user?.roles?.includes('ADMIN');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-dark-800 border-b border-dark-600">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-dark-700 transition-colors lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="First Aid Kit" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold text-gray-100 hidden sm:block">
              First Aid Kit
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Admin badge */}
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-500/20 border border-warning-500/30">
              <Shield className="w-3.5 h-3.5 text-warning-400" />
              <span className="text-xs font-medium text-warning-400">Admin</span>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:bg-dark-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary-400" />
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {user?.username}
              </span>
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-20 py-1">
                  <div className="px-4 py-3 border-b border-dark-600">
                    <p className="text-sm font-medium text-gray-200">{user?.username}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Shield className="w-3.5 h-3.5 text-warning-400" />
                        <span className="text-xs font-medium text-warning-400">Administrator</span>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-600 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-400 hover:bg-dark-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Wyloguj
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { useLogout } from '@/features';
import { useTheme } from '@/app/theme-context';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const logout = useLogout();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            title="Menu"
          >
            <span className="text-2xl">☰</span>
          </button>

          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EF</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-gray-900">Safira</span>
          </Link>
        </div>

        {/* Theme Toggle & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 line-clamp-1">
                {user?.fullName || 'Foydalanuvchi'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'STUDENT'}</p>
            </div>
            <span className={`text-lg transition ${isDropdownOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* User Info */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Rol: <span className="font-medium">{user?.role}</span>
                </p>
              </div>

              {/* Menu Items */}
              <nav className="p-2 space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  href="/dashboard/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span>👤</span>
                  <span>Profil</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span>⚙️</span>
                  <span>Sozlamalar</span>
                </Link>
              </nav>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 transition text-sm font-medium"
              >
                <span>🚪</span>
                <span>Chiqish</span>
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}

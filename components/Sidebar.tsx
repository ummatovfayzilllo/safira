'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

const menuSections = [
  {
    title: 'Asosiy',
    items: [
      { icon: '📊', label: 'Dashboard', href: '/dashboard' },
      { icon: '📚', label: 'Mening Kurslarim', href: '/dashboard/my-courses' },
      { icon: '👤', label: 'Profil', href: '/dashboard/profile' },
    ],
  },
  {
    title: 'O\'quv Materiallari',
    items: [
      { icon: '🎓', label: 'Barcha Kurslar', href: '/dashboard/courses' },
      { icon: '📖', label: 'Darslar', href: '/dashboard/lessons' },
      { icon: '📝', label: 'Homework', href: '/dashboard/homeworks' },
      { icon: '✏️', label: 'Imtixonlar', href: '/dashboard/exams' },
    ],
  },
  {
    title: 'O\'z Faoliyati',
    items: [
      { icon: '📊', label: 'Mening Natijalarim', href: '/dashboard/results' },
      { icon: '🎖️', label: 'Sertifikatlar', href: '/dashboard/certificates' },
      { icon: '⭐', label: 'Baholanishlar', href: '/dashboard/ratings' },
      { icon: '💬', label: 'Savollar', href: '/dashboard/questions' },
    ],
  },
  {
    title: 'Mentorlar',
    items: [
      { icon: '👨‍🏫', label: 'Mentorlar', href: '/dashboard/mentors' },
      { icon: '📧', label: 'Aloqa', href: '/dashboard/contact' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { icon: '👥', label: 'Foydalanuvchilar', href: '/dashboard/admin/users' },
    ],
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        {/* Toggle Button */}
        <div className="p-4 border-b border-gray-200 flex justify-end">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title={isOpen ? 'Yigish' : 'Ochish'}
          >
            <span className="text-xl">{isOpen ? '◀' : '▶'}</span>
          </button>
        </div>

        {/* Menu Sections */}
        <nav className="flex-1 py-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              {isOpen && (
                <h3 className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition group"
                    title={!isOpen ? item.label : undefined}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    {isOpen && (
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                    )}
                    {item.badge && isOpen && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Info */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">
              EdFix v1.0 • 2026
            </p>
          </div>
        )}
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      <div
        className={`md:hidden fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-50 overflow-y-auto transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="py-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

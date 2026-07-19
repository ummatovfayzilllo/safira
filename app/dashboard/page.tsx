'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/features';
import { useAuthStore } from '@/features/stores';

interface Course {
  id: string;
  name: string;
  about: string;
  level: string;
  price: number;
  mentor?: { fullName: string };
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  image?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const logout = useLogout();
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'profile'>('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch courses
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:15975/api/courses/getall');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Yuklanyapti...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EF</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EdFix</span>
            </Link>

            {/* Navigation Items */}
            <div className="hidden sm:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-sm font-medium transition ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`text-sm font-medium transition ${
                  activeTab === 'courses'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kurslar
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`text-sm font-medium transition ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profil
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 border-r border-gray-200 pr-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                  {user.fullName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Xush kelibsiz, {user.fullName}! 👋</h1>
              <p className="text-blue-100">O'quvchilik yo'lingizda muvaffaqiyatga erishish uchun shu yerda barcha resurslar topiladi</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm font-medium mb-2">Jami Kurslar</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                <p className="text-gray-600 text-sm font-medium mb-2">Davom Etgan</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
                <p className="text-gray-600 text-sm font-medium mb-2">Yakunlangan</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                <p className="text-gray-600 text-sm font-medium mb-2">O'qish Vaqti</p>
                <p className="text-3xl font-bold text-gray-900">0h</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tavsiya Etilgan Kurslar</h2>
                <div className="space-y-4">
                  {loading ? (
                    <p className="text-gray-500">Yuklanyapti...</p>
                  ) : courses.length > 0 ? (
                    courses.slice(0, 5).map((course) => (
                      <div
                        key={course.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {course.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {course.about}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-900">
                            {course.price.toLocaleString()} so'm
                          </span>
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Ko'rish →
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Kurslar topilmadi</p>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tez Links</h2>
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                  >
                    <span className="text-xl">📚</span>
                    <span className="text-sm font-medium">Mening Kurslarim</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition"
                  >
                    <span className="text-xl">📊</span>
                    <span className="text-sm font-medium">Progress</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                  >
                    <span className="text-xl">🎖️</span>
                    <span className="text-sm font-medium">Sertifikatlar</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 transition"
                  >
                    <span className="text-xl">⚙️</span>
                    <span className="text-sm font-medium">Sozlamalar</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Barcha Kurslar</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-gray-600 col-span-full">Yuklanyapti...</p>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 overflow-hidden"
                  >
                    <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{course.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.about}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {course.level}
                        </span>
                        <span className="font-bold text-gray-900">
                          {course.price.toLocaleString()} so'm
                        </span>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition">
                        Ro'yxatdan o'tish
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">Kurslar topilmadi</p>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil</h1>

              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Rol: <span className="font-semibold">{user.role}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To'liq Ismi
                  </label>
                  <input
                    type="text"
                    value={user.fullName}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
              >
                Akkauntdan Chiqish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';

interface Course {
  id: string;
  name: string;
  about: string;
  level: string;
  price: number;
  mentor?: { fullName: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Yuklanyapti...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8">
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

        {/* Recommended Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tavsiya Etilgan Kurslar</h2>
          
          {loading ? (
            <p className="text-gray-500">Yuklanyapti...</p>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 6).map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <div className="h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg mb-4"></div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.about}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <span className="font-bold text-gray-900">
                      {course.price} so'm
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition">
                    Ro'yxatdan o'tish
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Kurslar topilmadi</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

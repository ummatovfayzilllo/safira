'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';

interface Course {
  id: string;
  name: string;
  about: string;
  level: string;
  price: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

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

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Barcha Kurslar</h1>
          <p className="text-gray-600">Mavjud barcha kurslarni ko'rish va ro'yxatdan o'tish</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Yuklanyapti...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.about}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{course.level}</span>
                    <span className="font-bold text-gray-900">{course.price.toLocaleString()} so'm</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition">
                    Ro'yxatdan o'tish
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Kurslar topilmadi</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

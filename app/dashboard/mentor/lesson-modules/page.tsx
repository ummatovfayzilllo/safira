'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';

interface LessonModule {
  id: string;
  name: string;
  courseId: string;
  courseName?: string;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  name: string;
}

export default function LessonModulesPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  const [modules, setModules] = useState<LessonModule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'MENTOR' && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      // Fetch courses
      const coursesRes = await fetch(
        'http://localhost:15975/api/courses/getall',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data.data || []);
        if (data.data?.[0]) {
          setSelectedCourseId(data.data[0].id);
        }
      }

      // Fetch modules
      const modulesRes = await fetch(
        'http://localhost:15975/api/lesson-modules/getall',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (modulesRes.ok) {
        const data = await modulesRes.json();
        setModules(data.data || []);
      } else {
        setError('Modullarni yuklashda xato');
      }
    } catch (err) {
      setError('Xato yuz berdi');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!moduleName.trim()) {
      setFormError('Modul nomini kiriting');
      return;
    }
    if (!selectedCourseId) {
      setFormError('Kursni tanlang');
      return;
    }

    setFormLoading(true);

    try {
      const endpoint = editingId
        ? `http://localhost:15975/api/lesson-modules/update-one/${editingId}`
        : 'http://localhost:15975/api/lesson-modules/create';

      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: moduleName,
          courseId: selectedCourseId,
        }),
      });

      if (response.ok) {
        setFormSuccess(true);
        setModuleName('');
        setEditingId(null);
        setTimeout(() => {
          setShowModal(false);
          fetchData();
        }, 1000);
      } else {
        const data = await response.json();
        setFormError(data.message || 'Modul saqlashda xato');
      }
    } catch (err) {
      setFormError('Xato yuz berdi');
      console.error('Submit error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (module: LessonModule) => {
    setEditingId(module.id);
    setModuleName(module.name);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Modulni o\'chirishni tasdiqlaysizmi?')) return;

    try {
      const response = await fetch(
        `http://localhost:15975/api/lesson-modules/delete-one/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        fetchData();
      } else {
        alert('Modulni o\'chirishda xato');
      }
    } catch (err) {
      alert('Xato yuz berdi');
      console.error('Delete error:', err);
    }
  };

  const openModal = () => {
    setEditingId(null);
    setModuleName('');
    setFormError('');
    setShowModal(true);
  };

  const getCourseName = (courseId: string) => {
    return courses.find((c) => c.id === courseId)?.name || 'Unknown';
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Dars Modulları
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Jami {modules.length} ta modul
            </p>
          </div>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Yangi Modul
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
              Yuklanyapti...
            </div>
          ) : modules.length > 0 ? (
            modules.map((module) => (
              <div
                key={module.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">
                  📚 {module.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Kurs: {getCourseName(module.courseId)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(module)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 rounded font-medium text-sm transition"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(module.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white py-2 rounded font-medium text-sm transition"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
              Hozircha modul yo'q
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                {editingId ? 'Modulni Tahrirlash' : 'Yangi Modul'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formSuccess && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg text-sm">
                  ✅ Muvaffaqiyatli saqlandi!
                </div>
              )}

              {formError && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modul Nomi *
                </label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Masalan: Module 1: Asosiylar"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kurs *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={formLoading}
                >
                  <option value="">Kursni tanlang</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition disabled:opacity-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {formLoading ? 'Saqlanmoqda...' : editingId ? 'Yangilash' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';

interface Lesson {
  id: string;
  name: string;
  about?: string;
  video?: string;
  lessonModulId: string;
  createdAt: string;
  updatedAt: string;
}

interface LessonModule {
  id: string;
  name: string;
  courseId: string;
}

interface LessonFormData {
  name: string;
  about: string;
  lessonModulId: string;
}

export default function LessonsPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<LessonModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<LessonFormData>({
    name: '',
    about: '',
    lessonModulId: '',
  });
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
      // Fetch lesson modules (for select dropdown)
      const modulesRes = await fetch(
        'http://localhost:15975/api/lesson-modules/getall',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (modulesRes.ok) {
        const data = await modulesRes.json();
        setModules(data.data || []);
        if (data.data?.[0]) {
          setFormData((prev) => ({ ...prev, lessonModulId: data.data[0].id }));
        }
      }

      // Fetch lessons
      const lessonsRes = await fetch(
        'http://localhost:15975/api/lessons/getall',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (lessonsRes.ok) {
        const data = await lessonsRes.json();
        setLessons(data.data || []);
      } else {
        setError('Darslarni yuklashda xato');
      }
    } catch (err) {
      setError('Xato yuz berdi');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!formData.name.trim()) {
      setFormError('Dars nomini kiriting');
      return;
    }
    if (!formData.about.trim()) {
      setFormError('Dars haqida ma\'lumot kiriting');
      return;
    }
    if (!formData.lessonModulId) {
      setFormError('Modulni tanlang');
      return;
    }
    if (!editingId && !videoInputRef.current?.files?.[0]) {
      setFormError('Video faylni yuklang');
      return;
    }

    setFormLoading(true);

    try {
      let response: Response;

      if (editingId) {
        // Update: JSON only, video can't be changed via this endpoint
        response = await fetch(
          `http://localhost:15975/api/lessons/update-one/${editingId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              about: formData.about,
              lessonModulId: formData.lessonModulId,
            }),
          }
        );
      } else {
        // Create: multipart with required video
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('about', formData.about);
        submitData.append('lessonModulId', formData.lessonModulId);
        submitData.append('video', videoInputRef.current!.files![0]);

        response = await fetch('http://localhost:15975/api/lessons/create-one', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: submitData,
        });
      }

      if (response.ok) {
        setFormSuccess(true);
        setFormData((prev) => ({ ...prev, name: '', about: '' }));
        setEditingId(null);
        if (videoInputRef.current) videoInputRef.current.value = '';
        setTimeout(() => {
          setShowModal(false);
          fetchData();
        }, 1000);
      } else {
        const data = await response.json();
        setFormError(data.message || 'Darsni saqlashda xato');
      }
    } catch (err) {
      setFormError('Xato yuz berdi');
      console.error('Submit error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setFormData({
      name: lesson.name,
      about: lesson.about || '',
      lessonModulId: lesson.lessonModulId,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Darsni o\'chirishni tasdiqlaysizmi?')) return;

    try {
      const response = await fetch(
        `http://localhost:15975/api/lessons/delete-one/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        fetchData();
      } else {
        alert('Darsni o\'chirishda xato');
      }
    } catch (err) {
      alert('Xato yuz berdi');
      console.error('Delete error:', err);
    }
  };

  const openModal = () => {
    setEditingId(null);
    setFormData((prev) => ({ ...prev, name: '', about: '' }));
    setFormError('');
    if (videoInputRef.current) videoInputRef.current.value = '';
    setShowModal(true);
  };

  const getModuleName = (lessonModulId: string) => {
    return modules.find((m) => m.id === lessonModulId)?.name || 'Noma\'lum';
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Darslar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Jami {lessons.length} ta dars
            </p>
          </div>
          <button
            onClick={openModal}
            disabled={modules.length === 0}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Yangi Dars
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {modules.length === 0 && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded-lg">
            Avval dars modulini yarating (Dars Modulları bo'limida)
          </div>
        )}

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
              Yuklanyapti...
            </div>
          ) : lessons.length > 0 ? (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition border border-gray-200 dark:border-gray-700"
              >
                {lesson.video && (
                  <video
                    src={lesson.video}
                    controls
                    className="w-full h-40 bg-black object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">
                    🎬 {lesson.name}
                  </h3>
                  {lesson.about && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {lesson.about}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Modul: {getModuleName(lesson.lessonModulId)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 rounded font-medium text-sm transition"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white py-2 rounded font-medium text-sm transition"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
              Hozircha dars yo'q
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full my-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                {editingId ? 'Darsni Tahrirlash' : 'Yangi Dars'}
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
                  Dars Nomi *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Masalan: If statement"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dars Haqida *
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Dars haqida qisqa tavsif"
                  rows={3}
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modul *
                </label>
                <select
                  name="lessonModulId"
                  value={formData.lessonModulId}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={formLoading}
                >
                  <option value="">Modulni tanlang</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>

              {editingId ? (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Video faylni tahrirlashda o'zgartirib bo'lmaydi.
                </p>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video *
                  </label>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg"
                    disabled={formLoading}
                  />
                </div>
              )}

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

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';

interface LessonFile {
  id: string;
  note: string;
  file?: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

interface Lesson {
  id: string;
  name: string;
}

interface LessonFileFormData {
  note: string;
  lessonId: string;
}

export default function LessonFilesPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<LessonFile[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<LessonFileFormData>({
    note: '',
    lessonId: '',
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
      // Fetch lessons (for select dropdown)
      const lessonsRes = await fetch(
        'http://localhost:15975/api/lessons/getall',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (lessonsRes.ok) {
        const data = await lessonsRes.json();
        setLessons(data.data || []);
        if (data.data?.[0]) {
          setFormData((prev) => ({ ...prev, lessonId: data.data[0].id }));
        }
      }

      // Fetch lesson files
      const filesRes = await fetch(
        'http://localhost:15975/api/lesson-files/v2/get-all',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (filesRes.ok) {
        const data = await filesRes.json();
        setFiles(data.data || []);
      } else {
        setError('Fayllarni yuklashda xato');
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

    if (!formData.note.trim()) {
      setFormError('Fayl haqida izoh kiriting');
      return;
    }
    if (!formData.lessonId) {
      setFormError('Darsni tanlang');
      return;
    }
    if (!editingId && !fileInputRef.current?.files?.[0]) {
      setFormError('Faylni yuklang');
      return;
    }

    setFormLoading(true);

    try {
      let response: Response;

      if (editingId) {
        // Update: JSON only, file can't be changed via this endpoint
        response = await fetch(
          `http://localhost:15975/api/lesson-files/v4/update-one/${editingId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              note: formData.note,
              lessonId: formData.lessonId,
            }),
          }
        );
      } else {
        // Create: multipart with required file
        const submitData = new FormData();
        submitData.append('note', formData.note);
        submitData.append('lessonId', formData.lessonId);
        submitData.append('file', fileInputRef.current!.files![0]);

        response = await fetch(
          'http://localhost:15975/api/lesson-files/v1/create-one',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            body: submitData,
          }
        );
      }

      if (response.ok) {
        setFormSuccess(true);
        setFormData((prev) => ({ ...prev, note: '' }));
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => {
          setShowModal(false);
          fetchData();
        }, 1000);
      } else {
        const data = await response.json();
        setFormError(data.message || 'Faylni saqlashda xato');
      }
    } catch (err) {
      setFormError('Xato yuz berdi');
      console.error('Submit error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (file: LessonFile) => {
    setEditingId(file.id);
    setFormData({
      note: file.note,
      lessonId: file.lessonId,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Faylni o\'chirishni tasdiqlaysizmi?')) return;

    try {
      const response = await fetch(
        `http://localhost:15975/api/lesson-files/v5/delete-one/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        fetchData();
      } else {
        alert('Faylni o\'chirishda xato');
      }
    } catch (err) {
      alert('Xato yuz berdi');
      console.error('Delete error:', err);
    }
  };

  const openModal = () => {
    setEditingId(null);
    setFormData((prev) => ({ ...prev, note: '' }));
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowModal(true);
  };

  const getLessonName = (lessonId: string) => {
    return lessons.find((l) => l.id === lessonId)?.name || 'Noma\'lum';
  };

  const getFileName = (url?: string) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Dars Fayllari
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Jami {files.length} ta fayl
            </p>
          </div>
          <button
            onClick={openModal}
            disabled={lessons.length === 0}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Yangi Fayl
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {lessons.length === 0 && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded-lg">
            Avval dars yarating (Darslar bo'limida)
          </div>
        )}

        {/* Files Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
              Yuklanyapti...
            </div>
          ) : files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">
                  📎 {file.note}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Dars: {getLessonName(file.lessonId)}
                </p>
                {file.file && (
                  <a
                    href={file.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline block mb-4 truncate"
                  >
                    {getFileName(file.file)}
                  </a>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(file)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 rounded font-medium text-sm transition"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white py-2 rounded font-medium text-sm transition"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
              Hozircha fayl yo'q
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
                {editingId ? 'Faylni Tahrirlash' : 'Yangi Fayl'}
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
                  Izoh *
                </label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Masalan: Lecture slides"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dars *
                </label>
                <select
                  name="lessonId"
                  value={formData.lessonId}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={formLoading}
                >
                  <option value="">Darsni tanlang</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.name}
                    </option>
                  ))}
                </select>
              </div>

              {editingId ? (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Faylni tahrirlashda o'zgartirib bo'lmaydi.
                </p>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fayl *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
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

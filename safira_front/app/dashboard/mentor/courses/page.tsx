'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';

interface Course {
  id: string;
  name: string;
  about: string;
  price: number;
  discount: number;
  level: string;
  published: boolean;
  categoryId: string;
  mentorId: string;
  banner?: string;
  introVideo?: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

interface CourseFormData {
  name: string;
  about: string;
  price: string;
  discount: string;
  categoryId: string;
  level: string;
  published: boolean;
}

const COURSE_LEVELS = [
  'BEGINNER',
  'PRE_INTERMEDIATE',
  'INTERMEDIATE',
  'UPPER_INTERMEDIATE',
  'ADVANCED',
];

export default function CoursesPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    about: '',
    price: '',
    discount: '0',
    categoryId: '',
    level: 'BEGINNER',
    published: false,
  });
  const [bannerPreview, setBannerPreview] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

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
      // Fetch categories
      const catRes = await fetch(
        'http://localhost:15975/api/course-categories/getall',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.data || []);
        // Set default category
        if (catData.data?.[0]) {
          setFormData((prev) => ({ ...prev, categoryId: catData.data[0].id }));
        }
      }

      // Fetch courses
      const coursesRes = await fetch(
        'http://localhost:15975/api/courses/getall',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.data || []);
      }
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xato');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    // Validation
    if (!formData.name.trim()) {
      setFormError('Kurs nomini kiriting');
      return;
    }
    if (!formData.about.trim()) {
      setFormError('Kurs tavsifini kiriting');
      return;
    }
    if (!formData.price) {
      setFormError('Kurs narxini kiriting');
      return;
    }
    if (!formData.categoryId) {
      setFormError('Kategoriyani tanlang');
      return;
    }

    setFormLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('about', formData.about);
      submitData.append('price', formData.price);
      submitData.append('discount', formData.discount);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('mentorId', user!.id);
      submitData.append('level', formData.level);
      submitData.append('published', formData.published.toString());

      if (bannerInputRef.current?.files?.[0]) {
        submitData.append('banner', bannerInputRef.current.files[0]);
      }
      if (videoInputRef.current?.files?.[0]) {
        submitData.append('introVideo', videoInputRef.current.files[0]);
      }

      const response = await fetch(
        'http://localhost:15975/api/courses/create-one',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: submitData,
        }
      );

      if (response.ok) {
        setFormSuccess(true);
        setFormData({
          name: '',
          about: '',
          price: '',
          discount: '0',
          categoryId: categories[0]?.id || '',
          level: 'BEGINNER',
          published: false,
        });
        setBannerPreview('');
        if (bannerInputRef.current) bannerInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';

        setTimeout(() => {
          setShowModal(false);
          fetchData();
        }, 1000);
      } else {
        const data = await response.json();
        setFormError(data.message || 'Kurs yaratishda xato');
      }
    } catch (err) {
      setFormError('Xato yuz berdi');
      console.error('Create course error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mening Kurslarim</h1>
            <p className="text-gray-600 mt-1">Jami {courses.length} ta kurs</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Yangi Kurs
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-600">
              Yuklanyapti...
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
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
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition">
                      Tahrirlash
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition">
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-600">
              Hozircha kurs yo'q
            </div>
          )}
        </div>
      </div>

      {/* Modal - Create Course */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Yangi Kurs Yaratish</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  ✅ Kurs muvaffaqiyatli yaratildi!
                </div>
              )}

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              {/* Kurs Nomi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kurs Nomi *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Masalan: Python Asoslari"
                  disabled={formLoading}
                />
              </div>

              {/* Tavsif */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif *
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Kurs haqida qisqa tavsif"
                  rows={3}
                  disabled={formLoading}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Narx */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Narx (so'm) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="50000"
                    disabled={formLoading}
                  />
                </div>

                {/* Chegirma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chegirma (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="0"
                    disabled={formLoading}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Kategoriya */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={formLoading}
                  >
                    <option value="">Kategoriyani tanlang</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daraja
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={formLoading}
                  >
                    {COURSE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Banner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Rasmi (ixtiyoriy)
                </label>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={formLoading}
                />
                {bannerPreview && (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="mt-2 h-24 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Published */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleFormChange}
                  disabled={formLoading}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Kursni chop etish (nashr qilish)
                </span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {formLoading ? 'Saqlanmoqda...' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

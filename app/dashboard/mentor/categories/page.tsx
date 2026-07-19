'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
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

    // Mentor/Admin tekshirish
    if (user.role !== 'MENTOR' && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchCategories();
  }, [user, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        'http://localhost:15975/api/course-categories/getall',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      } else {
        setError('Kategoriyalarni yuklashda xato');
      }
    } catch (err: any) {
      setError('Xato yuz berdi');
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!categoryName.trim()) {
      setFormError('Kategoriya nomini kiriting');
      return;
    }

    setFormLoading(true);

    try {
      const endpoint = editingId
        ? `http://localhost:15975/api/course-categories/${editingId}`
        : 'http://localhost:15975/api/course-categories/create';

      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        setFormSuccess(true);
        setCategoryName('');
        setEditingId(null);
        setTimeout(() => {
          setShowModal(false);
          fetchCategories();
        }, 1000);
      } else {
        const data = await response.json();
        setFormError(data.message || 'Kategoriya saqlashda xato');
      }
    } catch (err: any) {
      setFormError('Xato yuz berdi');
      console.error('Submit error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kategoriyani o\'chirishni tasdiqlaysizmi?')) return;

    try {
      const response = await fetch(
        `http://localhost:15975/api/course-categories/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        fetchCategories();
      } else {
        alert('Kategoriyani o\'chirishda xato');
      }
    } catch (err) {
      alert('Xato yuz berdi');
      console.error('Delete error:', err);
    }
  };

  const openModal = () => {
    setEditingId(null);
    setCategoryName('');
    setFormError('');
    setShowModal(true);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategoriyalar</h1>
            <p className="text-gray-600 mt-1">
              Jami {categories.length} ta kategoriya
            </p>
          </div>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Yangi Kategoriya
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-600">
              Yuklanyapti...
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📂 {category.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium text-sm transition"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium text-sm transition"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-600">
              Hozircha kategoriya yo'q
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  ✅ Muvaffaqiyatli saqlandi!
                </div>
              )}

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriya Nomi *
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="O'zingizning kategoriya nomini kiriting"
                  disabled={formLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
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

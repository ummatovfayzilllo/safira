'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'ASSISTANT';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserForm {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateUserForm>({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Admin tekshirish
    if (user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:15975/api/users/get-all', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      } else {
        setError('Foydalanuvchilarni yuklashda xato');
      }
    } catch (err: any) {
      setError('Xato yuz berdi');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    // Validation
    if (!formData.fullName.trim()) {
      setFormError("To'liq ismni kiriting");
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Emailni kiriting');
      return;
    }
    if (!formData.password) {
      setFormError('Parolni kiriting');
      return;
    }
    if (formData.password.length < 8) {
      setFormError('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setFormLoading(true);

    try {
      // FormData bilan yuborish (/admin/new-user endpoint)
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('role', formData.role);
      if (fileInputRef.current?.files?.[0]) {
        submitData.append('image', fileInputRef.current.files[0]);
      }

      const response = await fetch(
        'http://localhost:15975/api/admin/new-user',
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
          fullName: '',
          email: '',
          password: '',
          role: 'STUDENT',
        });
        setImagePreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => {
          setShowModal(false);
          fetchUsers(); // Refresh users list
        }, 1000);
      } else {
        const data = await response.json();
        setFormError(data.message || 'Foydalanuvchi yaratishda xato');
      }
    } catch (err: any) {
      setFormError('Xato yuz berdi. Iltimos, qayta urinib ko\'ring');
      console.error('Create user error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'MENTOR':
        return 'bg-blue-100 text-blue-800';
      case 'ASSISTANT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleEmoji = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '⚙️';
      case 'MENTOR':
        return '👨‍🏫';
      case 'ASSISTANT':
        return '🤝';
      default:
        return '👤';
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Foydalanuvchilar</h1>
            <p className="text-gray-600 mt-1">
              Jami {users.length} ta foydalanuvchi
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Yangi Foydalanuvchi
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Yuklanyapti...
            </div>
          ) : users.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Ism
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Yaratilgan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {usr.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {usr.fullName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {usr.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                          usr.role
                        )}`}
                      >
                        <span>{getRoleEmoji(usr.role)}</span>
                        {usr.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(usr.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-600">
              Hozircha foydalanuvchi yo'q
            </div>
          )}
        </div>
      </div>

      {/* Modal - Create User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Yangi Foydalanuvchi Yaratish
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Yangi foydalanuvchi ma'lumotlarini kiriting
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Success Message */}
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  ✅ Foydalanuvchi muvaffaqiyatli yaratildi!
                </div>
              )}

              {/* Error Message */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profil Rasmi (ixtiyoriy)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      formData.fullName?.charAt(0).toUpperCase() || '?'
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Rasm Yuklash
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'liq Ism *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                  disabled={formLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="user@example.com"
                  disabled={formLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parol (Min 8 ta belgi) *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  disabled={formLoading}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={formLoading}
                >
                  <option value="STUDENT">👤 O'quvchi</option>
                  <option value="MENTOR">👨‍🏫 Mentor</option>
                  <option value="ASSISTANT">🤝 Assistent</option>
                  <option value="ADMIN">⚙️ Administrator</option>
                </select>
              </div>

              {/* Buttons */}
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

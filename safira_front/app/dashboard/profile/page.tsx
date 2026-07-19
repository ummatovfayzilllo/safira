'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';

interface FormState {
  fullName: string;
  email: string;
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Edit
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
  });
  const [preview, setPreview] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password Reset
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
    });
    setPreview(user.image || '');
  }, [user, router]);

  if (!user) return null;

  // Profile Update Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    if (!formData.fullName.trim()) {
      setProfileError("To'liq ismni kiriting");
      return;
    }

    setProfileLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      if (fileInputRef.current?.files?.[0]) {
        submitData.append('image', fileInputRef.current.files[0]);
      }

      const response = await fetch(
        `http://localhost:15975/api/users/${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: submitData,
        }
      );

      if (response.ok) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        const data = await response.json();
        setProfileError(data.message || 'Profil yangilanishda xato');
      }
    } catch (err: any) {
      setProfileError('Xato yuz berdi. Iltimos, qayta urinib ko\'ring');
      console.error('Profile update error:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Password Reset Handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (!passwordForm.currentPassword) {
      setPasswordError('Joriy parolni kiriting');
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError('Yangi parolni kiriting');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Parollar mos kelmadi');
      return;
    }

    setPasswordLoading(true);

    try {
      // Note: This endpoint may not exist in the API yet
      // Adjust based on actual backend implementation
      const response = await fetch(
        'http://localhost:15975/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      if (response.ok) {
        setPasswordSuccess(true);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordForm(false);
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        const data = await response.json();
        setPasswordError(data.message || 'Parol o\'zgartirishda xato');
      }
    } catch (err: any) {
      setPasswordError('Xato yuz berdi. Iltimos, qayta urinib ko\'ring');
      console.error('Password reset error:', err);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
          <p className="text-gray-600 mt-1">
            Shaxsiy ma'lumotlaringizni boshqaring va o'zgartiring
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Edit Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Profil Ma'lumotlari
              </h2>

              {profileSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  ✅ Profil muvaffaqiyatli yangilandi!
                </div>
              )}

              {profileError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Avatar Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profil Rasmi
                  </label>
                  <div className="flex items-center gap-6">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold cursor-pointer hover:shadow-lg transition border-4 border-blue-100"
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.fullName?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
                      >
                        Rasm O'zgartirish
                      </button>
                      <p className="text-xs text-gray-600 mt-2">
                        Max 10MB, PNG/JPG/GIF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To'liq Ismi
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    autoComplete="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={profileLoading}
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Emailni o'zgartirib bo'lmaydi
                  </p>
                </div>

                {/* Role (Read-only) */}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileLoading ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}
                </button>
              </form>
            </div>

            {/* Password Reset Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Parol</h2>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {showPasswordForm ? 'Bekor qilish' : 'Parolni O\'zgartirish'}
                </button>
              </div>

              {passwordSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  ✅ Parol muvaffaqiyatli o'zgartirildi!
                </div>
              )}

              {passwordError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joriy Parol
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      autoComplete="current-password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={passwordLoading}
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yangi Parol (Min 8 ta belgi)
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={passwordLoading}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parolni Tasdiqlang
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={passwordLoading}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading ? 'O\'zgartirilmoqda...' : 'Parolni O\'zgartirish'}
                  </button>
                </form>
              )}

              {!showPasswordForm && (
                <p className="text-gray-600 text-sm">
                  Parolni o'zgartirish uchun tugmani bosing
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - Account Info */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Akkaunt Ma'lumotlari
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase">Rol</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {user.role === 'STUDENT'
                      ? '👤 O\'quvchi'
                      : user.role === 'MENTOR'
                      ? '👨‍🏫 Mentor'
                      : user.role === 'ADMIN'
                      ? '⚙️ Administrator'
                      : user.role === 'ASSISTANT'
                      ? '🤝 Assistent'
                      : user.role}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-600 uppercase">Akkaunt Holati</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-green-700">Faol</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">🔒 Xavfsizlik</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Kuchli parol ishlating</li>
                <li>✓ Parolni hech kimga aytmang</li>
                <li>✓ Muntazam o'zgartirib turing</li>
                <li>✓ Unknown qurilmalardan logout qiling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

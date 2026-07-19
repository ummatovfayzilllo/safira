'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { useEffect } from 'react';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [preview, setPreview] = useState(user?.image || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Agar allaqachon profile to'ldirilgan bo'lsa, dashboard ga yo'nalt
    if (user?.fullName && user.fullName !== '') {
      // Already has profile
      router.push('/dashboard');
    }

    // Agar token bo'lmasa, login ga yo'nalt
    if (!accessToken) {
      router.push('/login');
    }
  }, [user, accessToken, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!fullName.trim()) {
      setError("To'liq ismni kiriting");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      const response = await fetch('http://localhost:15975/api/users/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.message || 'Profil yangilanishda xato');
      }
    } catch (err: any) {
      setError('Xato yuz berdi. Iltimos, qayta urinib ko\'ring');
      console.error('Profile setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profilingizni to'ldiring</h1>
            <p className="text-gray-600">Akkaunt yaratishni yakunlash uchun ma'lumotlar kerak</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ✅ Profil muvaffaqiyatli yangilandi! Dashboard ga o'tish...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
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
                  fullName?.charAt(0).toUpperCase() || '👤'
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
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Rasm yuklash (ixtiyoriy)
              </button>
            </div>

            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'liq Ismi *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Fayzillo Ummatov"
                disabled={loading}
              />
            </div>

            {/* Email Display (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Email o'zgartirib bo'lmaydi</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !fullName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saqlanmoqda...' : 'Davom etish'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Bu ma'lumotlarni keyinchalik profildan o'zgartirishingiz mumkin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

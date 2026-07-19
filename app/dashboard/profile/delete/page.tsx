'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { useLogout } from '@/features';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function DeleteAccountPage() {
  const router = useRouter();
  const logout = useLogout();
  const { user, accessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const handleDeleteAccount = async () => {
    if (!confirmed || !password) {
      setError('Parolni kiriting va tasdiqlang');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:15975/api/users/${user.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        await logout();
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Akkauntni o\'chirishda xato');
      }
    } catch (err: any) {
      setError('Xato yuz berdi. Iltimos, qayta urinib ko\'ring');
      console.error('Delete account error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-red-900">Akkauntni O'chirish</h1>
          <p className="text-red-700 mt-2">
            Bu harakat qaytarib bo'lmaydi. Barcha ma'lumotlar o'chiriladi.
          </p>
        </div>

        <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-lg p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Warning */}
          <div className="bg-red-100 border border-red-400 rounded-lg p-4">
            <p className="text-red-900 font-semibold mb-2">⚠️ Diqqat!</p>
            <ul className="text-red-800 text-sm space-y-1 list-disc list-inside">
              <li>Barcha kurslar va ma'lumotlar o'chiriladi</li>
              <li>Sertifikatlar va baholashlar o'chiriladi</li>
              <li>Email endi ishlatib bo'lmaydi</li>
              <li>Ushbu harakat qaytarib bo'lmaydi</li>
            </ul>
          </div>

          {/* Password Confirmation */}
          <div>
            <label className="block text-sm font-medium text-red-900 mb-2">
              Parolingizni Kiriting
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-red-300"
              disabled={loading}
            />
            <span className="text-red-900 font-medium">
              Men bu akkauntni o'chirishni tushunib, tasdiqlayapman. Barcha ma'lumotlar doimiy o'chiriladi.
            </span>
          </label>

          {/* Delete Button */}
          <button
            onClick={handleDeleteAccount}
            disabled={loading || !confirmed || !password}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'O\'chirilmoqda...' : 'Akkauntni Doimiy O\'chirish'}
          </button>

          {/* Back Link */}
          <div className="text-center pt-4 border-t border-red-200">
            <button
              onClick={() => router.back()}
              className="text-red-700 hover:text-red-900 font-medium text-sm"
            >
              ← Orqaga qaytish
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

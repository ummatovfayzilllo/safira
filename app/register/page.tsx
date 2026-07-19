'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister, useVerify } from '@/features';
import { useAuthStore } from '@/features/stores';

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const verify = useVerify();
  const { isLoading, error } = useAuthStore();

  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!fullName || !email || !password) {
      setLocalError('Barcha maydonlarni to\'ldiring');
      return;
    }

    if (password.length < 8) {
      setLocalError('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    try {
      await register({ fullName, email, password });
      setStep('verify');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Ro\'yxatdan o\'tishda xato');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!code) {
      setLocalError('Tasdiq kodini kiriting');
      return;
    }

    try {
      await verify({ email, code: parseInt(code) });
      router.push('/profile-setup');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Tasdiq xatosi');
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasdiq</h1>
              <p className="text-gray-600">
                Tasdiq kodini {email} ga yuborildi
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {(error || localError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error || localError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasdiq Kodi (6 raqam)
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                  placeholder="000000"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? 'Tasdiqlanmoqda...' : 'Tasdiqla'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setStep('register');
                  setCode('');
                  setLocalError('');
                }}
                className="text-blue-600 text-sm hover:underline"
              >
                Orqaga qaytish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Safira</h1>
            <p className="text-gray-600">Yangi akkaunt yaratish</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {(error || localError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error || localError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To\'liq Ismi
              </label>
              <input
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parol (min 8 ta belgi)
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-3 text-gray-500 text-sm">yoki</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Allaqachon akkauntingiz bormi?{' '}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Kirish
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-600 text-sm hover:text-gray-900">
              Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

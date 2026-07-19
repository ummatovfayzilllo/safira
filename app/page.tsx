'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features';

export default function Home() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    // Agar token bo'lsa, dashboard ga yo'nalt
    if (accessToken && user) {
      router.replace('/dashboard');
    }
  }, [accessToken, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">EF</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EdFix</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Kirish
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            O'quvchilik yo'lida
            <span className="text-blue-600"> Yangi Bosqich</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            EdFix - o'quv platformasi orqali siz ko'p sonli kurslarni o'rganishingiz
            mumkin. Duniyaning eng yaxshi mentorlardan o'rganing va o'z karerani
            rivojlantiring.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition transform hover:scale-105"
            >
              Boshla → Bepul
            </Link>
            <Link
              href="/login"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Kirish
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Nima uchun EdFix?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Kurslar</h3>
            <p className="text-gray-600">
              Sertifikali kurslar duniyaning eng yaxshi mentorlar tomonidan tuzilgan.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Turli Mavzular</h3>
            <p className="text-gray-600">
              Dasturlash, dizayn, biznes va ko'p boshqa sohalar bo'yicha kurslar.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sertifikatlar</h3>
            <p className="text-gray-600">
              Kursni yakunlagach official sertifikat oling va ish bilan shug'illan.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-blue-100">Kurslar</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-blue-100">O'quvchilar</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <p className="text-blue-100">Mentorlar</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="text-blue-100">Saatlar</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            O'quvchilik yo'lingizni bugun boshlang!
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Hozir ro'yxatdan o'ting va bepul akkaunt ochib barcha kurslarni ko'ring.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition transform hover:scale-105"
          >
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2026 EdFix. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

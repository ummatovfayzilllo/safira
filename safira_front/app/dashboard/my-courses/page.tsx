'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect } from 'react';

export default function MyCoursesPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mening Kurslarim</h1>
          <p className="text-gray-600">Siz ro'yxatdan o'tgan kurslarni ko'ring va o'qing</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">Hozircha ro'yxatdan o'tgan kurslar yo'q</p>
          <p className="text-gray-400 mt-2">Yangi kursga ro'yxatdan o'tish uchun "Barcha Kurslar" bo'limiga o'ting</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

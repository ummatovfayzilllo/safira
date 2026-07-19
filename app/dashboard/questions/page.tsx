'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/stores';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect } from 'react';

export default function Page() {
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
      <div className="p-4 md:p-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">Bu sahifa juda tez tayyorlash mumkin! 🚀</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

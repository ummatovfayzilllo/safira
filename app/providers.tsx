'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

      // Protected routes
      const protectedRoutes = ['/dashboard'];
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

      // Agar token bo'lsa, user profile ni olish
      if (token) {
        try {
          setLoading(true);
          const response = await fetch('http://localhost:15975/api/users/get-my', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);

            // Agar login/register-da bo'lsa, dashboard ga yo'nalt
            if (pathname === '/login' || pathname === '/register') {
              router.push('/dashboard');
            }
          } else if (response.status === 401) {
            // Token expired
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            if (isProtectedRoute) {
              router.push('/login');
            }
          }
        } catch (error) {
          console.error('Auth init error:', error);
          if (isProtectedRoute) {
            router.push('/login');
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Token yo'q bo'lsa
        if (isProtectedRoute) {
          router.push('/login');
        }
      }
    };

    initAuth();
  }, [pathname, router]);

  return <>{children}</>;
}

import api from '@/features/api/axiosIntanse';
import {
  loginDataType,
  registerDataType,
  resetPasswordDataType,
  resetPasswordVerifyDataType,
  verifyDataType,
} from '../types';
import { useAuthStore, useApiStore } from '@/features/stores';

export function useRegister() {
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  return async (data: registerDataType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/register', {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
}

export function useVerify() {
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  return async (data: verifyDataType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/verify', {
        email: data.email,
        code: data.code,
      });

      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Verification failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
}

export function useLogin() {
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  return async (data: loginDataType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
}

export function useResetPassword() {
  const setError = useApiStore((state) => state.setError);

  return async (data: resetPasswordDataType) => {
    try {
      setError(null);

      const response = await api.post('/auth/reset-password', {
        email: data.email,
      });

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Reset password request failed';
      setError(message);
      throw error;
    }
  };
}

export function useResetPasswordVerify() {
  const setError = useApiStore((state) => state.setError);

  return async (data: resetPasswordVerifyDataType) => {
    try {
      setError(null);

      const response = await api.post('/auth/reset-password/verify', {
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Reset password verification failed';
      setError(message);
      throw error;
    }
  };
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  return async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };
}
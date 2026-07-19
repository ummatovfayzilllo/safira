import { useCallback } from 'react';
import { useAuthStore, useApiStore } from '@/features/stores';
import api from '@/features/api/axiosIntanse';
import { AxiosRequestConfig } from 'axios';

interface UseApiCallOptions extends AxiosRequestConfig {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApiCall() {
  const setLoading = useApiStore((state) => state.setLoading);
  const setError = useApiStore((state) => state.setError);
  const setSuccess = useApiStore((state) => state.setSuccess);

  const call = useCallback(
    async (url: string, options?: UseApiCallOptions) => {
      const { onSuccess, onError, ...axiosOptions } = options || {};

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const response = await api({
          url,
          ...axiosOptions,
        });

        const message = response.data?.message || 'Success';
        setSuccess(message);

        onSuccess?.(response.data);
        return response.data;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'An error occurred';
        setError(message);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setSuccess]
  );

  return call;
}

export function useGet(url: string, options?: UseApiCallOptions) {
  return useApiCall();
}

export function usePost(options?: UseApiCallOptions) {
  return useApiCall();
}

export function usePatch(options?: UseApiCallOptions) {
  return useApiCall();
}

export function useDelete(options?: UseApiCallOptions) {
  return useApiCall();
}

import { create } from 'zustand';

interface ApiState {
  isLoading: boolean;
  error: string | null;
  success: string | null;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (message: string | null) => void;
  reset: () => void;
}

export const useApiStore = create<ApiState>((set) => ({
  isLoading: false,
  error: null,
  success: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
  reset: () => set({ isLoading: false, error: null, success: null }),
}));

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import type {
  User,
  LoginCredentials,
  RegisterData,
  GoogleLoginData,
  SetPasswordData,
  ChangePasswordData,
  AuthResponse,
} from '../types';

// Save tokens to localStorage
const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Fetch functions
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

const loginWithGoogle = async (data: GoogleLoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/google', data);
  return response.data;
};

const setPassword = async (data: SetPasswordData): Promise<AuthResponse> => {
  const response = await api.post('/auth/set-password', data);
  return response.data;
};

const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await api.put('/users/me/password', data);
};

const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

const refreshToken = async (): Promise<AuthResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token available');
  const response = await api.post('/auth/refresh', { refreshToken });
  return response.data;
};

const fetchProfile = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data.user;
};

const updateProfile = async (data: { full_name: string }): Promise<User> => {
  const response = await api.put('/users/me', data);
  return response.data.user;
};

// Hooks
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(['user'], data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(['user'], data.user);
    },
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(['user'], data.user);
    },
  });
}

export function useSetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setPassword,
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(['user'], data.user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeTokens();
      queryClient.setQueryData(['user'], null);
      queryClient.clear(); // Clear all cached data
    },
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(['user'], data.user);
    },
    onError: () => {
      removeTokens();
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'profile'], data);
      queryClient.setQueryData(['user'], (old: User | null) => old ? { ...old, full_name: data.full_name } : null);
    },
  });
}
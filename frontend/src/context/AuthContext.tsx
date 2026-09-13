import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLogin, useRegister, useGoogleLogin, useSetPassword, useLogout, useRefreshToken } from '../hooks/useAuth';
import { decodeJWT } from '../lib/utils';
import type { PublicUser } from '../types';

interface AuthContextType {
  user: PublicUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (email: string, full_name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isGoogleLoggingIn: boolean;
  isSettingPassword: boolean;
  isLoggingOut: boolean;
  isRefreshing: boolean;
  loginError: unknown;
  registerError: unknown;
  googleLoginError: unknown;
  setPasswordError: unknown;
  logoutError: unknown;
  refreshError: unknown;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // React Query mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  const setPasswordMutation = useSetPassword();
  const logoutMutation = useLogout();
  const refreshTokenMutation = useRefreshToken();

  // Initialize user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = decodeJWT(token);
        if (payload) {
          setUser({ id: payload.id, email: payload.email, full_name: payload.full_name || '' });
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  }, []);

  // Sync user from React Query cache
  useEffect(() => {
    const cachedUser = queryClient.getQueryData<PublicUser>(['user']);
    if (cachedUser && (!user || cachedUser.id !== user.id)) {
      setUser(cachedUser);
    }
  }, [queryClient, user]);

  // Login function
  const login = async (email: string, password: string) => {
    const data = await loginMutation.mutateAsync({ email, password });
    setUser(data.user);
  };

  // Google login
  const loginWithGoogle = async (credential: string) => {
    const data = await googleLoginMutation.mutateAsync({ credential });
    setUser(data.user);
  };

  // Set password for Google account
  const setPassword = async (password: string) => {
    const data = await setPasswordMutation.mutateAsync({ password });
    setUser(data.user);
  };

  // Register
  const register = async (email: string, full_name: string, password: string) => {
    const data = await registerMutation.mutateAsync({ email, full_name, password });
    setUser(data.user);
  };

  // Refresh token
  const refreshToken = async () => {
    const data = await refreshTokenMutation.mutateAsync();
    setUser(data.user);
  };

  // Logout
  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshToken,
        setPassword,
        loading,
        // Expose mutation states for UI feedback
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        isGoogleLoggingIn: googleLoginMutation.isPending,
        isSettingPassword: setPasswordMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        isRefreshing: refreshTokenMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
        googleLoginError: googleLoginMutation.error,
        setPasswordError: setPasswordMutation.error,
        logoutError: logoutMutation.error,
        refreshError: refreshTokenMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
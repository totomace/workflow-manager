import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Lock, LogOut, Sparkles, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useUpdateProfile, useProfile, useChangePassword, useSetPassword } from '../hooks/useAuth';
import { passwordSchema, profileSchema, setPasswordSchema } from '../schemas/profileSchema';
import { Button, Input } from '../components/ui';

const inputSurface =
  'bg-zinc-950/5 dark:bg-white/5 border-zinc-200/80 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 focus:ring-blue-500 focus:border-blue-500';

const panel =
  'rounded-[28px] border border-zinc-200/80 bg-white/80 shadow-xl shadow-zinc-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/55 dark:shadow-black/30';

interface ProfileFormData {
  full_name: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
}

interface SetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user, logout, setPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSetPassword, setShowSetPassword] = useState(false);

  // React Query hooks
  const { data: profileData, isLoading: isProfileLoading, error: profileError, refetch: refetchProfile } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const setPasswordMutation = useSetPassword();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const {
    register: registerSetPassword,
    handleSubmit: handleSetPasswordSubmit,
    reset: resetSetPassword,
    formState: { errors: setPasswordErrors, isSubmitting: isSetPasswordSubmitting },
  } = useForm<SetPasswordFormData>({ resolver: zodResolver(setPasswordSchema) });

  // Load profile data
  useEffect(() => {
    if (profileData) {
      setProfileValue('full_name', profileData.full_name || '');
    }
  }, [profileData, setProfileValue]);

  // Handle profile loading state
  useEffect(() => {
    if (isProfileLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isProfileLoading]);

  // Handle profile error
  useEffect(() => {
    if (profileError) {
      setError('Không thể tải thông tin hồ sơ');
    }
  }, [profileError]);

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast.success('Cập nhật hồ sơ thành công');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cập nhật thất bại');
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success('Đổi mật khẩu thành công');
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đổi mật khẩu thất bại');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onSetPassword = async (data: SetPasswordFormData) => {
    try {
      await setPasswordMutation.mutateAsync(data);
      toast.success('Đặt mật khẩu thành công! Bây giờ bạn có thể đăng nhập bằng email/mật khẩu.');
      setShowSetPassword(false);
      resetSetPassword();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đặt mật khẩu thất bại');
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] dark:bg-[#09090B]">
        <Loader2 className="animate-spin text-blue-500" size={34} />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAFA] px-4 py-6 text-zinc-950 dark:bg-[#09090B] dark:text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/25" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <header className={`${panel} mb-6 px-4 py-4 sm:px-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
              <ArrowLeft size={18} />
              Quay lại Dashboard
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut size={16} />} className="text-red-600 dark:text-red-400">
              Đăng xuất
            </Button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200" role="alert">
            {error}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={`${panel} p-6`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <Sparkles size={24} />
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">Hồ sơ cá nhân</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Quản lý thông tin tài khoản và bảo mật đăng nhập cho TaskFlow.
            </p>
            <div className="mt-8 rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-2xl font-semibold text-white">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Email đăng nhập</p>
              <p className="mt-1 break-all font-semibold">{user?.email}</p>
            </div>
          </motion.aside>

          <div className="space-y-6">
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={`${panel} p-6`}>
              <h2 className="text-xl font-semibold">Thông tin hiển thị</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Cập nhật tên dùng trong ứng dụng.</p>
              <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="mt-6 space-y-4">
                <Input label="Email" type="email" value={user?.email || ''} disabled className="cursor-not-allowed bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-500" />
                <Input label="Họ tên" placeholder="Nhập họ tên" error={profileErrors.full_name?.message} className={inputSurface} {...registerProfile('full_name')} />
                <Button type="submit" disabled={isProfileSubmitting || updateProfileMutation.isPending} leftIcon={isProfileSubmitting || updateProfileMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <User size={16} />}>
                  Cập nhật hồ sơ
                </Button>
              </form>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`${panel} p-6`}>
              <h2 className="text-xl font-semibold">Bảo mật</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Quản lý mật khẩu đăng nhập tài khoản.</p>

              {showSetPassword ? (
                <form onSubmit={handleSetPasswordSubmit(onSetPassword)} className="mt-6 space-y-4">
                  <Input label="Mật khẩu mới" type="password" placeholder="••••••••" error={setPasswordErrors.newPassword?.message} className={inputSurface} {...registerSetPassword('newPassword')} />
                  <Input label="Xác nhận mật khẩu" type="password" placeholder="••••••••" error={setPasswordErrors.confirmPassword?.message} className={inputSurface} {...registerSetPassword('confirmPassword')} />
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSetPasswordSubmitting || setPasswordMutation.isPending} leftIcon={isSetPasswordSubmitting || setPasswordMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}>
                      Đặt mật khẩu
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => { setShowSetPassword(false); resetSetPassword(); }}>
                      Hủy
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Sau khi đặt mật khẩu, bạn có thể đăng nhập bằng email/mật khẩu bên cạnh Google.</p>
                </form>
              ) : (
                <form onSubmit={handlePasswordSubmit(onChangePassword)} className="mt-6 space-y-4">
                  <Input label="Mật khẩu hiện tại" type="password" placeholder="••••••••" error={passwordErrors.currentPassword?.message} className={inputSurface} {...registerPassword('currentPassword')} />
                  <Input label="Mật khẩu mới" type="password" placeholder="••••••••" error={passwordErrors.newPassword?.message} className={inputSurface} {...registerPassword('newPassword')} />
                  <Button type="submit" disabled={isPasswordSubmitting || changePasswordMutation.isPending} leftIcon={isPasswordSubmitting || changePasswordMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}>
                    Đổi mật khẩu
                  </Button>
                </form>
              )}

              {!showSetPassword && (
                <Button variant="ghost" size="sm" onClick={() => setShowSetPassword(true)} className="mt-4 text-left text-blue-600 dark:text-blue-400 hover:bg-transparent">
                  <Lock size={14} className="mr-1" /> Đặt mật khẩu cho tài khoản Google
                </Button>
              )}
            </motion.section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
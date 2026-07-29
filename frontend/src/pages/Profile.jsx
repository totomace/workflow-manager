import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, passwordSchema } from '../schemas/profileSchema';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, Card } from '../components/ui';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({ resolver: zodResolver(profileSchema) });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await client.get('/users/me');
        setProfileValue('full_name', res.data.user.full_name);
      } catch (err) {
        setError('Không thể tải thông tin');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setProfileValue]);

  const onUpdateProfile = async (data) => {
    try {
      await client.put('/users/me', data);
      toast.success('Cập nhật hồ sơ thành công!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cập nhật thất bại');
    }
  };

  const onChangePassword = async (data) => {
    try {
      await client.put('/users/me/password', data);
      toast.success('Đổi mật khẩu thành công!');
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đổi mật khẩu thất bại');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 dark:bg-violet-800 rounded-full blur-3xl opacity-30 dark:opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200 dark:bg-sky-800 rounded-full blur-3xl opacity-30 dark:opacity-20" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Quay lại Dashboard</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
            Đăng xuất
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6" role="alert">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-8 transition-colors"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hồ sơ của tôi</h1>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={user?.email}
              disabled
              className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <Input
              label="Họ tên"
              placeholder="Nhập họ tên"
              error={profileErrors.full_name?.message}
              {...registerProfile('full_name')}
            />
            <Button type="submit" disabled={isProfileSubmitting} leftIcon={isProfileSubmitting ? <Loader2 size={16} className="animate-spin" /> : <User size={16} />}>
              Cập nhật hồ sơ
            </Button>
          </form>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Đổi mật khẩu</h2>
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <Input
              label="Mật khẩu hiện tại"
              type="password"
              placeholder="••••••••"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />
            <Input
              label="Mật khẩu mới"
              type="password"
              placeholder="••••••••"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />
            <Button type="submit" disabled={isPasswordSubmitting} leftIcon={isPasswordSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}>
              Đổi mật khẩu
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
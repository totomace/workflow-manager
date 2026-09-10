import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Sparkles, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerSchema } from '../schemas/authSchema';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';

const inputSurface =
  'bg-zinc-950/5 dark:bg-white/5 border-zinc-200/80 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 focus:ring-blue-500 focus:border-blue-500';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.fullName, data.password);
      toast.success('Đăng ký thành công');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA] p-4 text-zinc-950 dark:bg-[#09090B] dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/25" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-md rounded-[32px] border border-zinc-200/80 bg-white/80 p-6 shadow-2xl shadow-zinc-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60 dark:shadow-black/40 sm:p-10"
      >
        <div className="mb-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <Sparkles size={22} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">TaskFlow</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Tạo tài khoản</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Bắt đầu quản lý công việc và thu nhập của bạn.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Họ tên" placeholder="Nguyễn Văn A" error={errors.fullName?.message} leftIcon={<User size={18} />} className={inputSurface} {...register('fullName')} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} leftIcon={<Mail size={18} />} className={inputSurface} {...register('email')} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-12 outline-none transition-all ${inputSurface}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 min-h-11 min-w-11 -translate-y-1/2 rounded-lg text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="mx-auto" size={18} /> : <Eye className="mx-auto" size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400">
            Đăng nhập
          </Link>
        </p>
      </motion.section>
    </main>
  );
};

export default Register;
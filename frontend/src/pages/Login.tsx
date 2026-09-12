import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../schemas/authSchema';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
const inputSurface =
  'bg-zinc-950/5 dark:bg-white/5 border-zinc-200/80 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 focus:ring-blue-500 focus:border-blue-500';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Đăng nhập thành công');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      await loginWithGoogle(credential);
      toast.success('Đăng nhập Google thành công');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng nhập Google thất bại');
    }
  };

  return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA] p-4 text-zinc-950 dark:bg-[#09090B] dark:text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/25" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-zinc-200/80 bg-white/80 shadow-2xl shadow-zinc-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60 dark:shadow-black/40 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <aside className="hidden border-r border-zinc-200/80 bg-zinc-950 p-10 text-white dark:border-white/10 lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-950">
                  <Sparkles size={22} />
                </div>
                <h1 className="mt-8 text-4xl font-semibold tracking-tight">TaskFlow</h1>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Quản lý task, thời gian và thu nhập trong một dashboard realtime gọn, rõ, dễ hành động.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-zinc-300">Tập trung vào tiến độ. Số liệu luôn ở đúng nơi cần nhìn.</p>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">Đăng nhập</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Chào mừng trở lại</h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Tiếp tục quản lý công việc của bạn.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs text-zinc-500">
                <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                hoặc
                <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
              </div>

              <GoogleLogin
                onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse.credential as string)}
                onError={() => toast.error('Đăng nhập Google thất bại')}
                size="large"
                width={300}
                text="signin_with"
                shape="rectangular"
              />

              <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400">
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </motion.section>
      </main>
  );
};

export default Login;
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'Đăng nhập thất bại';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 dark:bg-violet-800 rounded-full blur-3xl opacity-40 dark:opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200 dark:bg-sky-800 rounded-full blur-3xl opacity-40 dark:opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-8 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-200 dark:shadow-violet-900">WM</div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Chào mừng trở lại</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Đăng nhập để tiếp tục</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:shadow-violet-200 dark:hover:shadow-violet-900 hover:scale-[1.02] active:scale-95 transition-all duration-200">Đăng nhập</button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700 dark:hover:text-violet-300 transition-colors">Đăng ký</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
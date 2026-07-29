import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import {
  Plus, Edit, Trash2, LogOut, CheckCircle,
  Circle, Clock, Search, Filter, Moon, Sun, User, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TaskSkeleton } from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '../schemas/taskSchema';
import socket from '../socket';
import {
  Button, Input, Card, Badge, Select, Skeleton,
  EmptyState, Modal, Avatar
} from '../components/ui';

const statusLabels = {
  todo: 'Cần làm',
  in_progress: 'Đang làm',
  done: 'Hoàn thành',
};

const statusVariants = {
  todo: 'todo',
  in_progress: 'progress',
  done: 'done',
};

const COLORS = {
  todo: '#9CA3AF',
  in_progress: '#F59E0B',
  done: '#10B981',
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [moneyPeriod, setMoneyPeriod] = useState('month');
  const [statusPeriod, setStatusPeriod] = useState('month');
  const [totalMoney, setTotalMoney] = useState(0);
  const [statusStats, setStatusStats] = useState({ todo: 0, in_progress: 0, done: 0 });

  const [displayAmount, setDisplayAmount] = useState('');
  const [amountFocused, setAmountFocused] = useState(false);
  const formRef = useRef(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      amount: 0,
      task_date: '',
      start_time: '',
      end_time: '',
    },
  });

  const watchAmount = watch('amount');

  // ==================== FETCH ====================
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await client.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      setError('Không thể tải danh sách task');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoneyStats = async (period) => {
    try {
      const res = await client.get(`/tasks/stats/money?period=${period || moneyPeriod}`);
      setTotalMoney(res.data.total);
    } catch (err) {
      console.error('Không thể tải thống kê tiền');
    }
  };

  const fetchStatusStats = async (period) => {
    try {
      const res = await client.get(`/tasks/stats/status?period=${period || statusPeriod}`);
      setStatusStats(res.data.counts);
    } catch (err) {
      console.error('Không thể tải thống kê trạng thái');
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMoneyStats('month');
    fetchStatusStats('month');

    socket.on('task:created', (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
      fetchMoneyStats(moneyPeriod);
      fetchStatusStats(statusPeriod);
      toast.success('Có task mới được tạo!');
    });
    socket.on('task:updated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      fetchMoneyStats(moneyPeriod);
      fetchStatusStats(statusPeriod);
    });
    socket.on('task:deleted', ({ id }) => {
      setTasks((prev) => prev.filter((t) => t.id !== Number(id)));
      fetchMoneyStats(moneyPeriod);
      fetchStatusStats(statusPeriod);
    });
    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, []);

  // ==================== FILTER & STATS ====================
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    return [
      { name: 'Cần làm', value: statusStats.todo || 0, color: COLORS.todo },
      { name: 'Đang làm', value: statusStats.in_progress || 0, color: COLORS.in_progress },
      { name: 'Hoàn thành', value: statusStats.done || 0, color: COLORS.done },
    ];
  }, [statusStats]);

  const getDateRangeLabel = (period) => {
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate;
    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return 'Tất cả thời gian';
    }
    const format = (d) =>
      `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${d.getFullYear()}`;
    return `${format(startDate)} – ${format(endDate)}`;
  };
  const moneyRangeLabel = getDateRangeLabel(moneyPeriod);
  const statusRangeLabel = getDateRangeLabel(statusPeriod);

  // ==================== FORM HANDLERS ====================
  const onSubmit = async (data) => {
    try {
      if (editId) {
        await client.put(`/tasks/${editId}`, data);
        toast.success('Đã cập nhật task!');
      } else {
        await client.post('/tasks', data);
        toast.success('Đã thêm task mới!');
      }
      reset({
        title: '',
        description: '',
        status: 'todo',
        amount: 0,
        task_date: '',
        start_time: '',
        end_time: '',
      });
      setDisplayAmount('');
      setEditId(null);
      fetchTasks();
      fetchMoneyStats(moneyPeriod);
      fetchStatusStats(statusPeriod);
    } catch (err) {
      const message = err.response?.data?.error || 'Có lỗi xảy ra';
      setError(message);
      toast.error(message);
    }
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setValue('title', task.title);
    setValue('description', task.description || '');
    setValue('status', task.status);
    setValue('amount', task.amount || 0);
    setValue('task_date', task.task_date ? task.task_date.split('T')[0] : '');
    setValue('start_time', task.start_time ? task.start_time.slice(0, 5) : '');
    setValue('end_time', task.end_time ? task.end_time.slice(0, 5) : '');

    const amt = task.amount || 0;
    setDisplayAmount(amt > 0 ? new Intl.NumberFormat('vi-VN').format(amt) : '');
    setAmountFocused(false);

    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDeleteClick = (id) => {
    setDeleteTaskId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTaskId) return;
    try {
      await client.delete(`/tasks/${deleteTaskId}`);
      toast.success('Đã xóa task!');
      fetchTasks();
      fetchMoneyStats(moneyPeriod);
      fetchStatusStats(statusPeriod);
    } catch (err) {
      toast.error('Xóa thất bại');
    } finally {
      setDeleteModalOpen(false);
      setDeleteTaskId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 dark:bg-violet-800 rounded-full blur-3xl opacity-30 dark:opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200 dark:bg-sky-800 rounded-full blur-3xl opacity-30 dark:opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} aria-label={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="sm" aria-label="Hồ sơ">
                <User size={18} />
              </Button>
            </Link>
            <Button variant="ghost" size="md" onClick={handleLogout} leftIcon={<LogOut size={18} />}>
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-4 sm:mb-6 text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Tổng task', value: tasks.length, icon: <CheckCircle size={18} className="text-violet-500" />, bg: 'from-violet-500 to-purple-500' },
            { label: 'Cần làm', value: statusStats.todo || 0, icon: <Circle size={18} className="text-gray-500" />, bg: 'from-gray-400 to-gray-500' },
            { label: 'Đang làm', value: statusStats.in_progress || 0, icon: <Clock size={18} className="text-amber-500" />, bg: 'from-amber-400 to-orange-500' },
            { label: 'Hoàn thành', value: statusStats.done || 0, icon: <CheckCircle size={18} className="text-emerald-500" />, bg: 'from-emerald-400 to-green-500' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center justify-between transition-colors"
            >
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
              </div>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r ${card.bg} flex items-center justify-center text-white`}>
                {card.icon}
              </div>
            </motion.div>
          ))}

          {/* Card Thu nhập */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-2 sm:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 transition-colors"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Thu nhập</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrency(totalMoney)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{moneyRangeLabel}</p>
              </div>
              <Select
                value={moneyPeriod}
                onValueChange={(e) => {
                  const newPeriod = e.target.value;
                  setMoneyPeriod(newPeriod);
                  fetchMoneyStats(newPeriod);
                }}
                options={[
                  { value: 'week', label: '7 ngày qua' },
                  { value: 'month', label: '30 ngày qua' },
                  { value: 'year', label: 'Năm nay' },
                  { value: 'all', label: 'Tất cả' },
                ]}
                className="mt-3 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer self-start"
              />
            </div>
          </motion.div>
        </div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8 transition-colors"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Thống kê trạng thái</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{statusRangeLabel}</p>
            </div>
            <Select
              value={statusPeriod}
              onValueChange={(e) => {
                const newPeriod = e.target.value;
                setStatusPeriod(newPeriod);
                fetchStatusStats(newPeriod);
              }}
              options={[
                { value: 'week', label: '7 ngày qua' },
                { value: 'month', label: '30 ngày qua' },
                { value: 'year', label: 'Năm nay' },
                { value: 'all', label: 'Tất cả' },
              ]}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
            />
          </div>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-8">Chưa có dữ liệu để hiển thị</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="w-full sm:w-2/3 max-w-[250px] sm:max-w-xs">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={stats} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value">
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex sm:flex-col gap-2 sm:gap-2 flex-wrap justify-center">
                {stats.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{s.name}: {s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Form thêm/sửa */}
        <motion.div
          ref={formRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
            {editId ? 'Chỉnh sửa task' : 'Thêm task mới'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Input
                label="Tiêu đề"
                placeholder="Tiêu đề"
                error={errors.title?.message}
                {...register('title')}
              />
              <Input
                label="Mô tả"
                placeholder="Mô tả"
                error={errors.description?.message}
                {...register('description')}
              />
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tiền (VNĐ)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Tiền (VNĐ)"
                  value={displayAmount}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    const baseNum = rawValue === '' ? 0 : parseInt(rawValue, 10);
                    const multiplied = baseNum * 1000;
                    setValue('amount', multiplied, { shouldValidate: true });
                    if (amountFocused) {
                      setDisplayAmount(rawValue === '' ? '' : rawValue);
                    } else {
                      setDisplayAmount(multiplied > 0 ? new Intl.NumberFormat('vi-VN').format(multiplied) : '');
                    }
                  }}
                  onFocus={() => {
                    setAmountFocused(true);
                    const current = watch('amount');
                    if (current === 0) {
                      setDisplayAmount('');
                    } else {
                      setDisplayAmount(Math.floor(current / 1000).toString());
                    }
                  }}
                  onBlur={() => {
                    setAmountFocused(false);
                    const current = watch('amount');
                    setDisplayAmount(current > 0 ? new Intl.NumberFormat('vi-VN').format(current) : '');
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
              </div>
            </div>

            {/* Ngày & Giờ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <Input
                label="Ngày làm"
                type="date"
                error={errors.task_date?.message}
                {...register('task_date')}
              />
              <Input
                label="Giờ bắt đầu"
                type="time"
                error={errors.start_time?.message}
                {...register('start_time')}
              />
              <Input
                label="Giờ kết thúc"
                type="time"
                error={errors.end_time?.message}
                {...register('end_time')}
              />
            </div>

            <Select
              value={watch('status')}
              onValueChange={(e) => setValue('status', e.target.value)}
              options={[
                { value: 'todo', label: 'Cần làm' },
                { value: 'in_progress', label: 'Đang làm' },
                { value: 'done', label: 'Hoàn thành' },
              ]}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm sm:text-base text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
            />

            <div className="flex gap-2">
              <Button type="submit" leftIcon={editId ? <Edit size={16} /> : <Plus size={16} />}>
                {editId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              {editId && (
                <Button type="button" variant="ghost" onClick={() => {
                  setEditId(null);
                  reset({
                    title: '',
                    description: '',
                    status: 'todo',
                    amount: 0,
                    task_date: '',
                    start_time: '',
                    end_time: '',
                  });
                  setDisplayAmount('');
                }}>
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Danh sách task */}
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Danh sách task ({filteredTasks.length})</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-48 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'Tất cả trạng thái' },
                  { value: 'todo', label: 'Cần làm' },
                  { value: 'in_progress', label: 'Đang làm' },
                  { value: 'done', label: 'Hoàn thành' },
                ]}
                className="pl-10 pr-4 py-2 w-full sm:w-auto bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer"
              />
            </div>
          </div>

          {loading ? (
            <SkeletonList count={3} hasAvatar={true} hasAction={true} />
          ) : filteredTasks.length === 0 ? (
            <EmptyTasks onCreate={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-600 hover:bg-violet-50/30 dark:hover:bg-violet-800/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Badge variant={statusVariants[task.status]} dot>
                        {statusLabels[task.status]}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{task.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500">
                          {task.task_date && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(task.task_date)}
                            </span>
                          )}
                          {task.start_time && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {task.start_time.slice(0, 5)}
                            </span>
                          )}
                          {task.end_time && (
                            <span className="flex items-center gap-1">→ {task.end_time.slice(0, 5)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {task.amount > 0 && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(task.amount)}
                        </span>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(task.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>

        {/* Delete Confirm Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Xóa task"
          message="Bạn có chắc chắn muốn xóa task này? Hành động này không thể hoàn tác."
          onConfirm={handleDeleteConfirm}
          confirmText="Xóa"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default Dashboard;
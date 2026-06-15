import { useState, useEffect, useMemo } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, CheckCircle, Circle, Clock, Search, Filter, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { TaskSkeleton } from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion'; // <-- THÊM

const statusIcons = {
  todo: <Circle size={16} className="text-gray-400 dark:text-gray-500" />,
  in_progress: <Clock size={16} className="text-amber-500" />,
  done: <CheckCircle size={16} className="text-emerald-500" />,
};

const statusLabels = {
  todo: 'Cần làm',
  in_progress: 'Đang làm',
  done: 'Hoàn thành',
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (editId) {
        await client.put(`/tasks/${editId}`, { title, description, status });
        toast.success('Đã cập nhật task!');
      } else {
        await client.post('/tasks', { title, description, status });
        toast.success('Đã thêm task mới!');
      }
      setTitle('');
      setDescription('');
      setStatus('todo');
      setEditId(null);
      fetchTasks();
    } catch (err) {
      const message = err.response?.data?.error || 'Có lỗi xảy ra';
      setError(message);
      toast.error(message);
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setEditId(task.id);
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/tasks/${id}`);
      toast.success('Đã xóa task!');
      fetchTasks();
    } catch (err) {
      const message = 'Xóa thất bại';
      setError(message);
      toast.error(message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 dark:bg-violet-800 rounded-full blur-3xl opacity-30 dark:opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200 dark:bg-sky-800 rounded-full blur-3xl opacity-30 dark:opacity-20"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form thêm/sửa với animation */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editId ? 'Chỉnh sửa task' : 'Thêm task mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all" />
              <input placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all" />
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all">
                <option value="todo">Cần làm</option>
                <option value="in_progress">Đang làm</option>
                <option value="done">Hoàn thành</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:shadow-violet-200 dark:hover:shadow-violet-900 transition-all">
                {editId ? <Edit size={16} /> : <Plus size={16} />}
                {editId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setTitle(''); setDescription(''); setStatus('todo'); }} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  Hủy
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Danh sách task */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Danh sách task ({filteredTasks.length})</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full sm:w-48 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all" />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="pl-10 pr-4 py-2 w-full sm:w-auto bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="all">Tất cả trạng thái</option>
                  <option value="todo">Cần làm</option>
                  <option value="in_progress">Đang làm</option>
                  <option value="done">Hoàn thành</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <TaskSkeleton key={i} />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <p>{tasks.length === 0 ? 'Chưa có task nào. Hãy tạo task đầu tiên!' : 'Không tìm thấy task phù hợp.'}</p>
            </div>
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
                      {statusIcons[task.status]}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {statusLabels[task.status]}
                      </span>
                      <button onClick={() => handleEdit(task)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-800/20 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(task.id)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-800/20 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
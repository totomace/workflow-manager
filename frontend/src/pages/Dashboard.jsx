import { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, CheckCircle, Circle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'; // <-- THÊM DÒNG NÀY

const statusIcons = {
  todo: <Circle size={16} className="text-gray-400" />,
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
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Hàm xử lý thêm/sửa task (đã tích hợp toast)
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
      // Reset form
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

  // Hàm xóa task (chỉ còn 1 bản duy nhất, có toast)
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-30"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form thêm/sửa */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editId ? 'Chỉnh sửa task' : 'Thêm task mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                placeholder="Tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
              />
              <input
                placeholder="Mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
              >
                <option value="todo">Cần làm</option>
                <option value="in_progress">Đang làm</option>
                <option value="done">Hoàn thành</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:shadow-violet-200 transition-all"
              >
                {editId ? <Edit size={16} /> : <Plus size={16} />}
                {editId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => { setEditId(null); setTitle(''); setDescription(''); setStatus('todo'); }}
                  className="px-6 py-2.5 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách task */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Danh sách task ({tasks.length})
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Chưa có task nào. Hãy tạo task đầu tiên!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {statusIcons[task.status]}
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {statusLabels[task.status]}
                    </span>
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
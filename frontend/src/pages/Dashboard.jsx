import { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await client.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      setError('Không thể tải danh sách task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (editId) {
        await client.put(`/tasks/${editId}`, { title, description, status });
      } else {
        await client.post('/tasks', { title, description, status });
      }
      setTitle('');
      setDescription('');
      setStatus('todo');
      setEditId(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
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
      fetchTasks();
    } catch (err) {
      setError('Xóa thất bại');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard - {user?.email} <button onClick={handleLogout}>Đăng xuất</button></h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button type="submit">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editId && <button onClick={() => { setEditId(null); setTitle(''); setDescription(''); setStatus('todo'); }}>Hủy</button>}
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.status}
            <p>{task.description}</p>
            <button onClick={() => handleEdit(task)}>Sửa</button>
            <button onClick={() => handleDelete(task.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
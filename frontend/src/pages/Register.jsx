import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, fullName, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Họ tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input placeholder="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Đăng ký</button>
      </form>
      <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </div>
  );
};

export default Register;
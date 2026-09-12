import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { Toaster } from 'react-hot-toast';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; // <-- ĐÃ IMPORT
import ProtectedRoute from './components/ProtectedRoute';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />
        {/* Profile route phải đặt NGOÀI, ngang hàng với dashboard */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><Profile /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        {/* GoogleOAuthProvider ở cấp cao nhất để tránh gọi initialize() nhiều lần */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Router>
            <AnimatedRoutes />
          </Router>
        </GoogleOAuthProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
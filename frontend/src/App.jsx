import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { Toaster } from 'react-hot-toast';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

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
        <Router>
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
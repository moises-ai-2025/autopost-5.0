import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Setup Pages
import BusinessInfo from './pages/setup/BusinessInfo';
import BrandIdentity from './pages/setup/BrandIdentity';
import PostSchedule from './pages/setup/PostSchedule';

// App Pages
import Dashboard from './pages/app/Dashboard';
import ContentGenerator from './pages/app/ContentGenerator';
import Schedule from './pages/app/Schedule';
import ScheduleSettings from './pages/app/ScheduleSettings';
import Settings from './pages/app/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Setup Route Component
const SetupRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (currentUser?.setupComplete) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// App Component
const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Setup Routes */}
        <Route
          path="/setup/business-info"
          element={
            <SetupRoute>
              <BusinessInfo />
            </SetupRoute>
          }
        />
        <Route
          path="/setup/brand-identity"
          element={
            <SetupRoute>
              <BrandIdentity />
            </SetupRoute>
          }
        />
        <Route
          path="/setup/post-schedule"
          element={
            <SetupRoute>
              <PostSchedule />
            </SetupRoute>
          }
        />

        {/* App Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-generator"
          element={
            <ProtectedRoute>
              <ContentGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule-settings"
          element={
            <ProtectedRoute>
              <ScheduleSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

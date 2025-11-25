import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { RoomList } from './pages/RoomList';
import { History } from './pages/History';
import { EmergencyBooking } from './pages/EmergencyBooking';
import { AdminPanel } from './pages/AdminPanel';
import { Layout } from './components/Layout';

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Layout>{children}</Layout>;
};

const AdminRoute = ({ children }: React.PropsWithChildren) => {
    const { user } = useApp();
    if (!user || user.role !== 'admin') {
      return <Navigate to="/home" replace />;
    }
    return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/rooms" element={<ProtectedRoute><RoomList /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><EmergencyBooking /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
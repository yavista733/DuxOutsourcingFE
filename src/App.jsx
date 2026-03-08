import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Solicitudes from './pages/Solicitudes';
import Activos from './pages/Activos';
import Areas from './pages/Areas';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/solicitudes" element={<ProtectedRoute><Solicitudes /></ProtectedRoute>} />
          <Route path="/activos" element={<ProtectedRoute><Activos /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/areas" element={<ProtectedRoute><Areas /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
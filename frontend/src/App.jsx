import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Production from './pages/Production';
import Equipment from './pages/Equipment';
import Reports from './pages/Reports';
import ReportViewer from './pages/ReportViewer';
import Users from './pages/Users';
import Incidents from './pages/Incidents';
import { Minerals, Shifts } from './pages/Minerals.jsx&Shifts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/production"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Supervisor', 'FieldOperator']}>
                <Production />
              </ProtectedRoute>
            }
          />

          <Route
            path="/equipment"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Supervisor', 'Technician','FieldOpertor']}>
                <Equipment />
              </ProtectedRoute>
            }
          />
     <Route
            path="/incidents"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Supervisor', 'Technician', 'FieldOperator', 'Auditor']}>
                <Incidents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Supervisor', 'Auditor']}>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/minerals"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Supervisor']}>
                <Minerals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shifts"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Supervisor']}>
                <Shifts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['Admin','Technician']}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/:id"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Supervisor', 'Auditor']}>
                <ReportViewer />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a href="/dashboard" className="btn-primary">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
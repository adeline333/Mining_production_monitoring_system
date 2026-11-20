import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import ContactAdmin from './pages/ContactAdmin';
import Settings from './pages/Settings';
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
          <Route path="/contact-admin" element={<ContactAdmin />} />
          <Route path="/account-support" element={<ContactAdmin />} />

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

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Supervisor', 'Technician', 'FieldOperator', 'Auditor']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    The requested page does not exist or you may need to sign in with an authorized account.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/login" className="btn-primary text-center">
                      Go to Sign In
                    </Link>
                    <Link to="/contact-admin" className="btn-secondary text-center">
                      Contact Admin
                    </Link>
                  </div>
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
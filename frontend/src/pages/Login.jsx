import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mountain, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch  {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Mountain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Mining Production System
          </h1>
          <p className="text-gray-300">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
                <div className="pt-1 border-t border-red-100 flex items-center justify-between">
                  <span className="text-xs text-red-600">Account not recognized?</span>
                  <Link
                    to="/contact-admin"
                    state={{ attemptedEmail: formData.email }}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    <span>Contact Admin for account creation</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="label">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Need Account / Help Link */}
            <div className="text-center pt-1">
              <Link
                to="/contact-admin"
                state={{ attemptedEmail: formData.email }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Account doesn't exist or forgot password? Contact Admin
              </Link>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials (click to fill):</p>
            <div className="text-xs text-gray-600 space-y-1.5">
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@mining.com', password: 'admin123' })}
                className="w-full text-left p-1.5 rounded hover:bg-blue-100 transition-colors flex justify-between cursor-pointer"
              >
                <span><strong>Admin:</strong> admin@mining.com</span>
                <span className="text-gray-400">admin123</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'supervisor@mining.com', password: 'super123' })}
                className="w-full text-left p-1.5 rounded hover:bg-blue-100 transition-colors flex justify-between cursor-pointer"
              >
                <span><strong>Supervisor:</strong> supervisor@mining.com</span>
                <span className="text-gray-400">super123</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'operator@mining.com', password: 'field123' })}
                className="w-full text-left p-1.5 rounded hover:bg-blue-100 transition-colors flex justify-between cursor-pointer"
              >
                <span><strong>Field Operator:</strong> operator@mining.com</span>
                <span className="text-gray-400">field123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          © {new Date().getFullYear()} Mining Production System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mountain, Mail, ShieldAlert, ArrowLeft, Copy, Check, Send, UserCheck, HelpCircle } from 'lucide-react';

const ContactAdmin = () => {
  const location = useLocation();
  const attemptedEmail = location.state?.attemptedEmail || '';

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: attemptedEmail,
    role: 'FieldOperator',
    reason: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('admin@mining.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const mailtoLink = `mailto:admin@mining.com?subject=Account%20Creation%20Request%20-%20Mining%20System&body=Hello%20Administrator,%0A%0AI%20am%20requesting%20an%20account%20on%20the%20Mining%20Production%20System.%0A%0AName:%20${encodeURIComponent(formData.name || 'N/A')}%0AEmail:%20${encodeURIComponent(formData.email || 'N/A')}%0ARole:%20${encodeURIComponent(formData.role)}%0ANotes:%20${encodeURIComponent(formData.reason || 'N/A')}%0A%0AThank%20you!`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Header Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-3 shadow-lg">
            <Mountain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Mining Production System</h1>
          <p className="text-blue-200 text-sm">Account Assistance & Administrator Support</p>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-amber-900 text-base">Account Not Recognized?</h2>
              <p className="text-sm text-amber-800 mt-1">
                Accounts are managed centrally. If your email or password is not recognized or does not exist,
                please contact your System Administrator to create an account or reset your password.
              </p>
              {attemptedEmail && (
                <p className="text-xs text-amber-700 mt-2 font-mono bg-amber-100/70 px-2 py-1 rounded inline-block">
                  Attempted login: {attemptedEmail}
                </p>
              )}
            </div>
          </div>

          {/* Administrator Contact Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">System Administrator Contact</h3>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                Primary Contact
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Official Admin Email</p>
                <p className="text-base font-semibold text-gray-900 font-mono">admin@mining.com</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={mailtoLink}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Request Form */}
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-green-900">Request Recorded</h3>
              <p className="text-sm text-green-800">
                Your request details have been saved locally. For fastest activation, you can also notify the administrator directly at{' '}
                <a href={mailtoLink} className="underline font-semibold">admin@mining.com</a>.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-green-700 hover:underline pt-2 block mx-auto"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-800 text-sm">Submit an Account Request Form</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Requested Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="FieldOperator">Field Operator</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Technician">Technician</option>
                    <option value="Auditor">Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Additional Note (Optional)</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Shift / Department / Site location"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
                <a
                  href={mailtoLink}
                  className="py-2.5 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Directly</span>
                </a>
              </div>
            </form>
          )}

          {/* Available Demo Credentials Info */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-900 font-semibold mb-2">
              Currently Active Demo Credentials:
            </p>
            <div className="text-xs text-blue-900 space-y-1.5 font-mono">
              <div className="flex justify-between items-center bg-white/70 p-2 rounded">
                <span><strong>Admin:</strong> admin@mining.com</span>
                <span className="text-blue-600 font-bold">admin123</span>
              </div>
              <div className="flex justify-between items-center bg-white/70 p-2 rounded">
                <span><strong>Supervisor:</strong> supervisor@mining.com</span>
                <span className="text-blue-600 font-bold">super123</span>
              </div>
              <div className="flex justify-between items-center bg-white/70 p-2 rounded">
                <span><strong>Field Operator:</strong> operator@mining.com</span>
                <span className="text-blue-600 font-bold">field123</span>
              </div>
            </div>
          </div>

          {/* Back to Login Link */}
          <div className="pt-2 text-center border-t border-gray-100">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Mining Production System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ContactAdmin;

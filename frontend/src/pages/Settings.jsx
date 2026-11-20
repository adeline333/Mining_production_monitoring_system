import { useState } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Shield, Key, Check, Info } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    userName: user?.userName || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ type: '', message: '' });
    setSavingProfile(true);

    try {
      const response = await api.put(`/auth/profile/${user?._id}`, {
        userName: profileForm.userName,
        email: profileForm.email,
      });

      if (response.data?.success) {
        updateUser(response.data.user);
        setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setProfileStatus({ type: 'error', message: response.data?.message || 'Failed to update profile' });
      }
    } catch (error) {
      setProfileStatus({
        type: 'error',
        message: error.response?.data?.message || 'Action not permitted for demo accounts or failed.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', message: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setSavingPassword(true);
    try {
      const response = await api.put(`/auth/change-password/${user?._id}`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.data?.success) {
        setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordStatus({ type: 'error', message: response.data?.message || 'Failed to change password' });
      }
    } catch (error) {
      setPasswordStatus({
        type: 'error',
        message: error.response?.data?.message || 'Action not permitted for demo accounts or incorrect current password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-blue-600" />
            <span>Settings</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage your account profile and security preferences</p>
        </div>

        {/* Account Info Card */}
        <div className="card space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
              <p className="text-xs text-gray-500">View and update your display name and email address</p>
            </div>
          </div>

          {profileStatus.message && (
            <div
              className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                profileStatus.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {profileStatus.type === 'success' && <Check className="w-4 h-4 text-green-600" />}
              <span>{profileStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.userName}
                  onChange={(e) => setProfileForm({ ...profileForm, userName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                Role: <strong className="text-gray-700">{user?.role}</strong> (Managed by Admin)
              </span>

              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary py-2 px-5 text-sm font-semibold"
              >
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b">
            <Key className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Security & Password</h2>
              <p className="text-xs text-gray-500">Update your account password</p>
            </div>
          </div>

          {passwordStatus.message && (
            <div
              className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                passwordStatus.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {passwordStatus.type === 'success' && <Check className="w-4 h-4 text-green-600" />}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="input-field"
                placeholder="Enter current password"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="input-field"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="btn-primary py-2 px-5 text-sm font-semibold"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Demo Notice */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 space-y-1">
            <p className="font-semibold">Demo Environment Notice</p>
            <p>
              Demo accounts (Admin, Supervisor) have read-only permissions for security. Modifications made to demo profiles are protected on the server.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

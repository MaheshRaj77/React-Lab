import React, { useState } from 'react';
import { showSuccess, showError } from '../../components/shared/NotificationManager';

const SettingsView = ({ user, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdateProfile(profileData);
      showSuccess('Profile updated successfully!');
    } catch {
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-heading">Settings</h1>
        <p className="mt-2 text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-500/20 text-blue-300'
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'bg-blue-500/20 text-blue-300'
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-blue-500/20 text-blue-300'
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500" />
                    <span className="text-gray-300">Email notifications for new experiments</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500" defaultChecked />
                    <span className="text-gray-300">Weekly progress reports</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Display</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500" defaultChecked />
                    <span className="text-gray-300">Dark mode</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500" />
                    <span className="text-gray-300">Compact view</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Password</h3>
                <p className="text-gray-400 text-sm mb-4">Password change functionality is not yet implemented.</p>
                <button
                  disabled
                  className="px-4 py-2 bg-slate-700 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  Change Password
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                <p className="text-gray-400 text-sm mb-4">Two-factor authentication is not yet implemented.</p>
                <button
                  disabled
                  className="px-4 py-2 bg-slate-700 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  Enable 2FA
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Active Sessions</h3>
                <p className="text-gray-400 text-sm mb-4">Session management is not yet implemented.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Current Session</p>
                      <p className="text-gray-400 text-sm">Web Browser • Active now</p>
                    </div>
                    <span className="text-green-400 text-sm">Current</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;

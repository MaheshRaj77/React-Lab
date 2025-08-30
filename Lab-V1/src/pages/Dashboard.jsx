import React, { useState, useEffect, useMemo } from 'react';
import backendAPI from '../api/backend';
import developersAPI from '../api/developers';

// Components
import Navbar from '../components/Navbar';
import DashboardOverview from './view/dashboardoverview';
import ExperimentsView from './view/experimentview';
import Spinner from '../components/shared/Spinner';

// User Management View Component
const UserView = ({ user, onUpdateProfile }) => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch developers on component mount
  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await developersAPI.getAll();
      setDevelopers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch developers:', error);
      const errorMessage = error.message || 'Failed to fetch developers. Please check your authentication and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeveloper = () => {
    setShowCreateModal(true);
  };

  const handleEditDeveloper = (developer) => {
    setEditingDeveloper(developer);
  };

  const handleDeleteDeveloper = async (developer) => {
    if (!window.confirm(`Delete developer: ${developer.name}?`)) return;

    try {
      setLoading(true);
      setError(null);
      await developersAPI.delete(developer.id);
      setDevelopers(prev => prev.filter(d => d.id !== developer.id));
      setSuccessMessage('Developer deleted successfully!');
    } catch (error) {
      console.error('Failed to delete developer:', error);
      const errorMessage = error.message || 'Failed to delete developer';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const newDeveloper = await developersAPI.create(formData);
      setDevelopers(prev => [...prev, newDeveloper]);
      setShowCreateModal(false);
      setSuccessMessage('Developer created successfully!');
    } catch (error) {
      console.error('Failed to create developer:', error);
      const errorMessage = error.message || 'Failed to create developer';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDeveloper = await developersAPI.update(editingDeveloper.id, formData);
      setDevelopers(prev => prev.map(d => d.id === editingDeveloper.id ? updatedDeveloper : d));
      setEditingDeveloper(null);
      setSuccessMessage('Developer updated successfully!');
    } catch (error) {
      console.error('Failed to update developer:', error);
      const errorMessage = error.message || 'Failed to update developer';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setEditingDeveloper(null);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="mt-2 text-gray-400">
              Manage developers and user accounts
            </p>
          </div>
          <button
            onClick={handleCreateDeveloper}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Developer</span>
          </button>
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-400 font-medium">Error</h3>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={fetchDevelopers}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Display */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-green-400 font-medium">Success</h3>
                <p className="text-green-300 text-sm mt-1">{successMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-400 hover:text-green-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Developers Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Developers ({developers.length})</h2>
        </div>

        {loading ? (
          <div className="p-8">
            <Spinner />
          </div>
        ) : developers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No developers found. Create your first developer to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {developers.map((developer) => (
                  <tr key={developer.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                          {developer.profile_image ? (
                            <img
                              src={`data:image/jpeg;base64,${developer.profile_image}`}
                              alt={`${developer.name} ${developer.lastName || ''}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span style={{ display: developer.profile_image ? 'none' : 'flex' }}>
                            {developer.name?.charAt(0)?.toUpperCase() || 'D'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{developer.name}</div>
                          <div className="text-sm text-gray-400">{developer.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{developer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300">
                        {developer.role || 'Developer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {developer.created_at ? new Date(developer.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDeveloper(developer)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteDeveloper(developer)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Developer Modal */}
      {(showCreateModal || editingDeveloper) && (
        <DeveloperModal
          developer={editingDeveloper}
          onSave={editingDeveloper ? handleEditSubmit : handleCreateSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      )}
    </div>
  );
};

// Developer Modal Component
const DeveloperModal = ({ developer, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: developer?.name || '',
    lastName: developer?.lastName || '',
    email: developer?.email || '',
    role: developer?.role || 'Developer'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');

  // Set image preview when editing developer
  useEffect(() => {
    if (developer?.profile_image) {
      // The backend already returns base64 data, so just set it as data URL
      setImagePreview(`data:image/jpeg;base64,${developer.profile_image}`);
    } else {
      setImagePreview(null);
    }
  }, [developer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('lastName', formData.lastName);
    submitData.append('email', formData.email);
    submitData.append('role', formData.role);

    if (selectedImage) {
      submitData.append('profileImage', selectedImage);
    }

    onSave(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageError('');
  };

  const roles = ['Developer', 'Admin', 'Manager', 'Lead Developer'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {developer ? 'Edit Developer' : 'Create New Developer'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {developer ? 'Update developer information' : 'Add a new developer to the system'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Image Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profileImage"
                />
                <label
                  htmlFor="profileImage"
                  className="inline-block px-3 py-2 bg-slate-700 text-white rounded-lg cursor-pointer hover:bg-slate-600 transition-colors text-sm"
                >
                  Choose Image
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="ml-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {imageError && (
              <p className="text-red-400 text-sm mt-1">{imageError}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>{developer ? 'Update' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Placeholder for the Settings view
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
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
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
        <h1 className="text-3xl font-bold text-white">Settings</h1>
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
                <button className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors">
                  Change Password
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Add an extra layer of security to your account</span>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Current Session</p>
                      <p className="text-gray-400 text-sm">Chrome on macOS • Active now</p>
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

// Create Experiment Modal Component
const CreateExperimentModal = ({ onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    difficulty: 'Beginner',
    estimated_time: '',
    path: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = [
    'Web Technology',
    'Computer Networks',
    'Data Structures',
    'Algorithms',
    'Database Systems',
    'Operating Systems',
    'Software Engineering',
    'Machine Learning',
    'Cybersecurity',
    'Mobile Development',
    'Cloud Computing',
    'DevOps'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Create New Experiment</h2>
          <p className="text-gray-400 text-sm mt-1">Fill in the details for your new experiment</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter experiment title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Enter detailed description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Time
              </label>
              <input
                type="text"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2-3 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Path
              </label>
              <input
                type="text"
                name="path"
                value={formData.path}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., /experiments/exp-1/index.html"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>Create Experiment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ 
  user, 
  onHomeClick, 
  onLabsClick, 
  onResourcesClick, 
  onAboutClick,
  onLogoutClick,
  onProfileClick,
  theme = 'education' 
}) => {
  // State for the data
  const [dashboardData, setDashboardData] = useState({ developer: null, experiments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to control which content is shown
  const [activeView, setActiveView] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const developerId = user?.id || 'dev-001'; // Use logged-in user's ID

        // Fetch developer profile and experiments separately
        const [developerData, experimentsData] = await Promise.all([
          developersAPI.getProfile().catch((error) => {
            console.error('Failed to fetch user profile:', error);
            setError('Failed to fetch user details. Using default information.');
            return {
              id: developerId,
              name: user?.name || 'Developer',
              role: user?.role || 'Developer',
              avatarUrl: user?.avatarUrl || '/default-avatar.png'
            };
          }),
          backendAPI.getAll()
        ]);

        setDashboardData({
          developer: developerData,
          experiments: experimentsData.data || []
        });
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Re-fetch if the user prop changes

  // Data manipulation functions
  const handleCreateExperiment = () => {
    setShowCreateModal(true);
  };

  const handleCreateExperimentSubmit = async (formData) => {
    try {
      setLoading(true);
      // Check if formData is a template (has all required fields pre-filled)
      const isTemplate = formData.title && formData.desc && formData.category;

      if (isTemplate) {
        // If it's a template, use it directly
        const newExp = await backendAPI.createExperiment(formData);
        setDashboardData(prev => ({
          ...prev,
          experiments: [...prev.experiments, newExp]
        }));
        alert('Experiment created from template successfully!');
        setShowCreateModal(false);
      } else {
        // Original form submission logic
        const newExp = await backendAPI.createExperiment({
          title: formData.title,
          desc: formData.desc,
          category: formData.category,
          difficulty: formData.difficulty,
          estimated_time: formData.estimated_time,
          path: formData.path
        });
        setDashboardData(prev => ({
          ...prev,
          experiments: [...prev.experiments, newExp]
        }));
        alert('Experiment created successfully!');
        setShowCreateModal(false);
      }
    } catch (err) {
      setError('Failed to create experiment.');
      console.error(err);
      alert('Failed to create experiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperimentCancel = () => {
    setShowCreateModal(false);
  };

  const handleEditExperiment = async (experiment, formData) => {
    try {
      setLoading(true);
      const updated = await backendAPI.updateExperiment(experiment.id, {
        title: formData.title,
        desc: formData.desc,
        category: formData.category,
        difficulty: formData.difficulty,
        estimated_time: formData.estimated_time,
        path: formData.path
      });
      setDashboardData(prev => ({
        ...prev,
        experiments: prev.experiments.map(e => e.id === experiment.id ? updated : e)
      }));
      alert('Experiment updated successfully!');
    } catch (err) {
      setError('Failed to update experiment.');
      console.error(err);
      alert('Failed to update experiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperiment = async (exp) => {
    if (!window.confirm('Delete experiment: ' + exp.title + '?')) return;
    
    try {
      setLoading(true);
      await backendAPI.deleteExperiment(exp.id);
      setDashboardData(prev => ({
        ...prev,
        experiments: prev.experiments.filter(e => e.id !== exp.id)
      }));
      alert('Experiment deleted successfully!');
    } catch (err) {
      setError('Failed to delete experiment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile updates
  const handleUpdateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      // Call the developers API to update profile
      const updatedProfile = await developersAPI.updateProfile(profileData);

      // Update local state with the response
      setDashboardData(prev => ({
        ...prev,
        developer: {
          ...prev.developer,
          ...updatedProfile.developer
        }
      }));

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.message || 'Failed to update profile';
      setError(errorMessage);
      throw error; // Re-throw to let calling component handle it
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from the fetched data
  const stats = useMemo(() => {
    const experiments = dashboardData.experiments || [];
    
    const techFrequency = experiments.flatMap(e => [e.category]) // Using category as technology
      .reduce((acc, tech) => {
          acc[tech] = (acc[tech] || 0) + 1;
          return acc;
      }, {});

    return {
      total: experiments.length,
      mostUsedTech: Object.keys(techFrequency).sort((a, b) => techFrequency[b] - techFrequency[a])[0] || 'N/A',
    };
  }, [dashboardData.experiments]);

  // Render a loading spinner or error message
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-950"><Spinner /></div>;
  }
  if (error) {
    return <div className="text-center text-red-400 mt-20">{error}</div>;
  }

  const { developer, experiments } = dashboardData;

  // Function to render the correct view based on state
  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview developer={developer} stats={stats} />;
      case 'experiments':
        return (
          <ExperimentsView 
            experiments={experiments}
            onCreate={handleCreateExperiment}
            onEdit={handleEditExperiment}
            onDelete={handleDeleteExperiment}
            loading={loading}
          />
        );
      case 'user':
        return <UserView user={developer} onUpdateProfile={handleUpdateProfile} />;
      case 'settings':
        return <SettingsView user={developer} onUpdateProfile={handleUpdateProfile} />;
      default:
        return <DashboardOverview developer={developer} stats={stats} />;
    }
  };

  const isDark = theme === 'dark' || theme === 'akira' || theme === 'education';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Navbar 
        onHomeClick={onHomeClick}
        onLabsClick={onLabsClick}
        onResourcesClick={onResourcesClick}
        onAboutClick={onAboutClick}
        onDashboardClick={() => setActiveView('overview')}
        onProfileClick={onProfileClick}
        onLogoutClick={onLogoutClick}
        isLoggedIn={true}
        user={user}
        theme={theme}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'overview'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('experiments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'experiments'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
              }`}
            >
              Experiments
            </button>
            <button
              onClick={() => setActiveView('user')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'user'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'settings'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
        
        {renderContent()}
      </div>

      {showCreateModal && (
        <CreateExperimentModal
          onSave={handleCreateExperimentSubmit}
          onCancel={handleCreateExperimentCancel}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import developersAPI from '../../api/developers';
import Spinner from '../../components/shared/Spinner';

const UserView = ({ user: _user, onUpdateProfile: _onUpdateProfile }) => {
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
      setError('Failed to load developers');
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
            <h1 className="text-3xl font-bold text-white font-heading">User Management</h1>
            <p className="mt-2 text-neutral-400">
              Manage developers and user accounts
            </p>
          </div>
          <button
            onClick={handleCreateDeveloper}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 font-sans"
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
                className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
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
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white font-heading">Developers ({developers.length})</h2>
        </div>

        {loading ? (
          <div className="p-8">
            <Spinner />
          </div>
        ) : developers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-400">No developers found. Create your first developer to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {developers.map((developer, index) => (
                  <tr key={developer.id || `developer-${index}`} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                          {developer.profile_image_url ? (
                            <img
                              src={developer.profile_image_url}
                              alt={`${developer.name} ${developer.last_name || ''}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span style={{ display: developer.profile_image_url ? 'none' : 'flex' }}>
                            {developer.name?.charAt(0)?.toUpperCase() || 'D'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{developer.name}</div>
                          <div className="text-sm text-neutral-400">{developer.last_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{developer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-500/20 text-primary-300">
                        {developer.role || 'Developer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {developer.created_at ? new Date(developer.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDeveloper(developer)}
                          className="text-primary-400 hover:text-primary-300 transition-colors"
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
    lastName: developer?.last_name || '',
    email: developer?.email || '',
    role: developer?.role || 'Developer'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');

  // Set image preview when editing developer
  useEffect(() => {
    if (developer?.profile_image_url) {
      setImagePreview(developer.profile_image_url);
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
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">
            {developer ? 'Edit Developer' : 'Create New Developer'}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {developer ? 'Update developer information' : 'Add a new developer to the system'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Image Section */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
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
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="inline-block px-3 py-2 bg-white/10 text-white/80 rounded-lg cursor-pointer hover:bg-white/20 transition-colors text-sm border border-white/20"
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
            <p className="text-neutral-400 text-xs mt-1">
              Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Last Name <span className="text-neutral-500">(Optional)</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter last name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
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
              className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-sans"
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

export default UserView;

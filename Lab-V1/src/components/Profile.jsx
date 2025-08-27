import React, { useState } from 'react';
import developersAPI from '../api/developers.js';

const Profile = ({ user, onUpdateUser, onClose, theme = 'education' }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isEdu = theme === 'education';
  const isAkira = theme === 'akira';
  const isDark = theme === 'dark' || isAkira || isEdu;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // Split name back to firstName and lastName for API
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      const updateData = {
        name: firstName,
        lastName: lastName || null,
        email: formData.email
      };
      
      const response = await developersAPI.updateProfile(updateData);
      
      // Map API response back to expected user format
      const updatedUser = {
        ...user,
        name: response.developer.lastName 
          ? `${response.developer.name} ${response.developer.lastName}`
          : response.developer.name,
        email: response.developer.email,
        updated_at: response.developer.updatedAt
      };
      
      onUpdateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      setErrors({ general: error.message || 'Update failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`
        relative w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto
        ${isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'}
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/50" 
                />
              ) : (
                <div className={`w-24 h-24 rounded-full ${
                  isEdu ? 'bg-blue-500/30' : isAkira ? 'bg-red-500/30' : 'bg-cyan-500/30'
                } flex items-center justify-center text-3xl font-bold text-white`}>
                  {(user?.name || "U").charAt(0)}
                </div>
              )}
              <span className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-slate-800"></span>
            </div>
            
            <div className="mt-4">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {isEditing ? 'Edit Profile' : 'Profile Settings'}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                {isEditing ? 'Update your information' : 'Manage your account settings'}
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Account Info */}
            <div className={`p-6 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-colors
                        ${isDark 
                          ? 'bg-slate-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }
                        ${errors.name ? 'border-red-500' : ''}
                      `}
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user?.name || 'Not set'}
                    </p>
                  )}
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-colors
                        ${isDark 
                          ? 'bg-slate-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }
                        ${errors.email ? 'border-red-500' : ''}
                      `}
                      placeholder="your.email@example.com"
                    />
                  ) : (
                    <p className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user?.email}
                    </p>
                  )}
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className={`p-6 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Additional Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="bio" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-colors resize-none
                        ${isDark 
                          ? 'bg-slate-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }
                      `}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user?.bio || 'No bio provided'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`
                          w-full px-4 py-3 rounded-lg border transition-colors
                          ${isDark 
                            ? 'bg-slate-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                          }
                        `}
                        placeholder="Your location"
                      />
                    ) : (
                      <p className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user?.location || 'Not set'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="website" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className={`
                          w-full px-4 py-3 rounded-lg border transition-colors
                          ${isDark 
                            ? 'bg-slate-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                          }
                        `}
                        placeholder="https://your-website.com"
                      />
                    ) : (
                      <p className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user?.website ? (
                          <a href={user.website} target="_blank" rel="noopener noreferrer" 
                             className={`${isEdu ? 'text-blue-400 hover:text-blue-300' : 'text-cyan-400 hover:text-cyan-300'} transition-colors`}>
                            {user.website}
                          </a>
                        ) : (
                          'Not set'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isDark 
                        ? 'bg-slate-600 hover:bg-slate-500 text-white border border-slate-500' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center
                      ${isEdu 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : isAkira 
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-colors
                    ${isEdu 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : isAkira 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    }
                  `}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import developersAPI from '../api/developers.js';

const Login = ({ onLogin, onSwitchToRegister, onClose, theme = 'education', fromRegistration = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const response = await developersAPI.login(formData);
      
      // Map API response to expected user format
      const userFromAPI = {
        id: response.developer.id,
        name: response.developer.lastName 
          ? `${response.developer.name} ${response.developer.lastName}`
          : response.developer.name,
        email: response.developer.email,
        role: 'developer',
        avatar_url: null,
        created_at: response.developer.createdAt
      };
      
      onLogin(userFromAPI);
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`
        relative w-full max-w-md rounded-xl shadow-2xl
        ${isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'}
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isEdu ? 'bg-blue-500/20' : isAkira ? 'bg-red-500/20' : 'bg-cyan-500/20'
            }`}>
              <svg className={`w-8 h-8 ${
                isEdu ? 'text-blue-400' : isAkira ? 'text-red-400' : 'text-cyan-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Sign in to access your developer dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {fromRegistration && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm text-center">
                <div className="flex items-center justify-center mb-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Registration successful!
                </div>
                <p className="text-xs">Please sign in with your new account.</p>
              </div>
            )}
            
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 rounded-lg border transition-colors
                  ${isDark 
                    ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-slate-600' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-gray-50'
                  }
                  ${errors.email ? 'border-red-500' : ''}
                `}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 rounded-lg border transition-colors
                  ${isDark 
                    ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-slate-600' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-gray-50'
                  }
                  ${errors.password ? 'border-red-500' : ''}
                `}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center
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
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className={`font-medium ${
                  isEdu ? 'text-blue-400 hover:text-blue-300' : 
                  isAkira ? 'text-red-400 hover:text-red-300' : 
                  'text-cyan-400 hover:text-cyan-300'
                } transition-colors`}
              >
                Create one now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import developersAPI from '../api/developers.js';

const Register = ({ onRegister, onSwitchToLogin, onClose, theme = 'education' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const registrationData = {
        name: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };
      
      const response = await developersAPI.register(registrationData);
      
      // Show success state
      setRegistrationSuccess(true);
      
      // After a brief delay, redirect to login
      setTimeout(() => {
        onRegister(); // This will now switch to login instead of logging in automatically
      }, 2000);
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`
        relative w-full max-w-lg rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto
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
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isEdu ? 'bg-blue-500/20' : isAkira ? 'bg-red-500/20' : 'bg-cyan-500/20'
            }`}>
              <svg className={`w-8 h-8 ${
                isEdu ? 'text-blue-400' : isAkira ? 'text-red-400' : 'text-cyan-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create Account
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Join our developer community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {registrationSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Account created successfully!
                </div>
                <p className="text-xs">Redirecting to login...</p>
              </div>
            )}
            
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={registrationSuccess}
                  className={`
                    w-full px-4 py-3 rounded-lg border transition-colors
                    ${isDark 
                      ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-slate-600' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-gray-50'
                    }
                    ${errors.firstName ? 'border-red-500' : ''}
                    ${registrationSuccess ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-400">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border transition-colors
                    ${isDark 
                      ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-slate-600' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-gray-50'
                    }
                    ${errors.lastName ? 'border-red-500' : ''}
                  `}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 rounded-lg border transition-colors
                  ${isDark 
                    ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-slate-600' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-gray-50'
                  }
                  ${errors.confirmPassword ? 'border-red-500' : ''}
                `}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || registrationSuccess}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center
                ${isEdu 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : isAkira 
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }
                ${(isLoading || registrationSuccess) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {registrationSuccess ? (
                <>
                  <svg className="w-5 h-5 mr-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Account Created
                </>
              ) : isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                disabled={registrationSuccess}
                className={`font-medium ${
                  isEdu ? 'text-blue-400 hover:text-blue-300' : 
                  isAkira ? 'text-red-400 hover:text-red-300' : 
                  'text-cyan-400 hover:text-cyan-300'
                } transition-colors ${registrationSuccess ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

class DevelopersAPI {
  
  /**
   * Register a new developer
   * @param {Object} developerData - The developer registration data
   * @param {string} developerData.name - Developer's first name
   * @param {string} developerData.lastName - Developer's last name (optional)
   * @param {string} developerData.email - Developer's email
   * @param {string} developerData.password - Developer's password
   * @param {string} developerData.confirmPassword - Password confirmation
   * @returns {Promise<Object>} The registration response
   */
  async register(developerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/developers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(developerData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('developerToken', data.token);
      }

      return data;
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  }

  /**
   * Login a developer
   * @param {Object} credentials - The login credentials
   * @param {string} credentials.email - Developer's email
   * @param {string} credentials.password - Developer's password
   * @returns {Promise<Object>} The login response
   */
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/developers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('developerToken', data.token);
      }

      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  /**
   * Get developer profile
   * @returns {Promise<Object>} The developer profile
   */
  async getProfile() {
    try {
      const token = localStorage.getItem('developerToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/developers/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, remove it
          this.logout();
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Profile API error:', error);
      throw error;
    }
  }

    /**
   * Update developer profile
   * @param {Object|FormData} profileData - The profile data to update (can be FormData for image uploads)
   * @returns {Promise<Object>} The update response
   */
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('developerToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const isFormData = profileData instanceof FormData;
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Don't set Content-Type for FormData, let browser set it with boundary
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      console.log('Making API request to update profile...');
      const requestStartTime = Date.now();

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${API_BASE_URL}/api/developers/profile`, {
        method: 'PUT',
        headers,
        body: isFormData ? profileData : JSON.stringify(profileData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const requestTime = Date.now() - requestStartTime;
      console.log('HTTP request completed in', requestTime, 'ms');

      const data = await response.json();
      const parseTime = Date.now() - requestStartTime - requestTime;
      console.log('Response parsing completed in', parseTime, 'ms');

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, remove it
          this.logout();
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Profile update API error:', error);
      throw error;
    }
  }

  /**
   * Get all developers (admin function)
   * @returns {Promise<Object>} List of all developers
   */
  async getAll() {
    try {
      const token = localStorage.getItem('developerToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/developers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Get all developers API error:', error);
      throw error;
    }
  }

  /**
   * Get admin developer details (public function)
   * @returns {Promise<Object>} Admin developer details
   */
  async getAdmin() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/developers/admin-details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Get admin API error:', error);
      throw error;
    }
  }

  /**
   * Get admin dashboard data
   * @returns {Promise<Object>} Admin dashboard statistics
   */
  async getAdminDashboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/developers/admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Get admin dashboard API error:', error);
      throw error;
    }
  }

  /**
   * Create a new developer (admin function)
   * @param {Object|FormData} developerData - The developer data (can be FormData for image uploads)
   * @returns {Promise<Object>} The created developer
   */
  async create(developerData) {
    try {
      const token = localStorage.getItem('developerToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const isFormData = developerData instanceof FormData;
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Don't set Content-Type for FormData, let browser set it with boundary
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/api/developers`, {
        method: 'POST',
        headers,
        body: isFormData ? developerData : JSON.stringify(developerData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Create developer API error:', error);
      throw error;
    }
  }

  /**
   * Update a developer (admin function)
   * @param {string} developerId - The developer ID
   * @param {Object|FormData} developerData - The developer data to update (can be FormData for image uploads)
   * @returns {Promise<Object>} The updated developer
   */
  async update(developerId, developerData) {
    try {
      const token = localStorage.getItem('developerToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const isFormData = developerData instanceof FormData;
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Don't set Content-Type for FormData, let browser set it with boundary
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      console.log('Making API request to update developer:', developerId);
      const requestStartTime = Date.now();

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${API_BASE_URL}/api/developers/${developerId}`, {
        method: 'PUT',
        headers,
        body: isFormData ? developerData : JSON.stringify(developerData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const requestTime = Date.now() - requestStartTime;
      console.log('HTTP request completed in', requestTime, 'ms');

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Update developer API error:', error);
      throw error;
    }
  }

  /**
   * Delete a developer (admin function)
   * @param {string} developerId - The developer ID
   * @returns {Promise<Object>} The deletion response
   */
  async delete(developerId) {
    try {
      const token = localStorage.getItem('developerToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/developers/${developerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Delete developer API error:', error);
      throw error;
    }
  }

  /**
   * Logout developer (clear token)
   */
  logout() {
    localStorage.removeItem('developerToken');
    localStorage.removeItem('rememberMe');
  }

  /**
   * Check if developer is logged in
   * @returns {boolean} Whether the developer is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem('developerToken');
  }

  /**
   * Get stored token
   * @returns {string|null} The stored token or null
   */
  getToken() {
    return localStorage.getItem('developerToken');
  }
}

// Create a singleton instance
const developersAPI = new DevelopersAPI();

export default developersAPI;

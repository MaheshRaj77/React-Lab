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
   * @param {Object} profileData - The profile data to update
   * @param {string} profileData.name - Developer's first name
   * @param {string} profileData.lastName - Developer's last name (optional)
   * @param {string} profileData.email - Developer's email
   * @returns {Promise<Object>} The update response
   */
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('developerToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/developers/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
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
      console.error('Profile update API error:', error);
      throw error;
    }
  }

  /**
   * Logout developer (clear token)
   */
  logout() {
    localStorage.removeItem('developerToken');
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

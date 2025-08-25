/**
 * API service for communicating with Express.js backend
 */
class BackendAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
  }

  /**
   * Make HTTP request
   * @param {string} endpoint 
   * @param {object} options 
   * @returns {Promise}
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all experiments from backend
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async getAll() {
    try {
      const response = await this.request('/experiments');
      // The request already returns the full response with success, data, count
      return response;
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Get experiment by ID from backend
   * @param {number} id - Experiment ID
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getById(id) {
    try {
      const response = await this.request(`/experiments/${id}`);
      // The request already returns the full response with success, data
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a new experiment via backend
   * @param {Object} experiment - Experiment data
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async create(experiment) {
    try {
      const response = await this.request('/experiments', {
        method: 'POST',
        body: experiment
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update an experiment via backend
   * @param {number} id - Experiment ID
   * @param {Object} updates - Updated data
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async update(id, updates) {
    try {
      const response = await this.request(`/experiments/${id}`, {
        method: 'PUT',
        body: updates
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete an experiment via backend
   * @param {number} id - Experiment ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    try {
      await this.request(`/experiments/${id}`, {
        method: 'DELETE'
      });
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get experiments by category via backend
   * @param {string} category - Category name
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async getByCategory(category) {
    try {
      const response = await this.request(`/experiments/category/${encodeURIComponent(category)}`);
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Get experiments by difficulty via backend
   * @param {string} difficulty - Difficulty level
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async getByDifficulty(difficulty) {
    try {
      const response = await this.request(`/experiments/difficulty/${encodeURIComponent(difficulty)}`);
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Search experiments by title or description via backend
   * @param {string} query - Search query
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async search(query) {
    try {
      const response = await this.request(`/experiments/search/${encodeURIComponent(query)}`);
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Seed database with sample experiments via backend
   * @returns {Promise<{success: boolean, data?: Array, count?: number, error?: string}>}
   */
  async seedDatabase() {
    try {
      const response = await this.request('/experiments/seed', {
        method: 'POST'
      });
      return {
        success: true,
        data: response.data,
        count: response.count,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Health check for backend API
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async healthCheck() {
    try {
      const response = await this.request('/../../health');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const backendAPI = new BackendAPI();
export default backendAPI;

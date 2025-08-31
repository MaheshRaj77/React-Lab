/**
 * API service for communicating with Express.js backend
 */
class BackendAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || '';
    console.log('Backend API initialized with baseURL:', this.baseURL);
    console.log('VITE_API_URL env var:', import.meta.env.VITE_API_URL);
  }

  /**
   * Make HTTP request
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {string} endpoint 
   * @param {object} data - Request body data
   * @returns {Promise}
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`Making ${method} request to: ${url}`);
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      console.log(`Response status: ${response.status}`);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }

      return responseData;
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
      const response = await this.request('GET', '/api/experiments');
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
      const response = await this.request('GET', `/api/experiments/${id}`);
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
  async createExperiment(data) {
    return this.request('POST', '/api/experiments', data);
  }

  async updateExperiment(id, data) {
    return this.request('PUT', `/api/experiments/${id}`, data);
  }

  async deleteExperiment(id) {
    return this.removeExperiment(id);
  }

  async removeExperiment(id) {
    return this.request('DELETE', `/api/experiments/${id}`);
  }

  /**
   * Get experiments by category via backend
   * @param {string} category - Category name
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async getByCategory(category) {
    try {
      const response = await this.request('GET', `/api/experiments/category/${encodeURIComponent(category)}`);
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
      const response = await this.request('GET', `/api/experiments/difficulty/${encodeURIComponent(difficulty)}`);
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
      const response = await this.request('GET', `/api/experiments/search/${encodeURIComponent(query)}`);
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
      const response = await this.request('POST', '/api/experiments/seed');
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
      const response = await this.request('GET', '/health');
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

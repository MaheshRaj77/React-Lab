import experimentsAPI from './experiments.js';
import backendAPI from './backend.js';

/**
 * Unified API service that can switch between direct Supabase calls and backend API calls
 */
class UnifiedAPI {
  constructor() {
    // Default to backend API, can be changed via environment variable
    this.useBackend = import.meta.env.VITE_USE_BACKEND !== 'false';
    this.api = this.useBackend ? backendAPI : experimentsAPI;
  }

  /**
   * Switch API provider
   * @param {boolean} useBackend - Whether to use backend API
   */
  switchProvider(useBackend = true) {
    this.useBackend = useBackend;
    this.api = useBackend ? backendAPI : experimentsAPI;
    console.log(`Switched to ${useBackend ? 'Backend' : 'Direct Supabase'} API`);
  }

  /**
   * Get current API provider info
   */
  getProviderInfo() {
    return {
      current: this.useBackend ? 'Backend API' : 'Direct Supabase',
      useBackend: this.useBackend,
      backendUrl: backendAPI.baseURL
    };
  }

  // Proxy all methods to the current API provider
  async getAll() {
    return this.api.getAll();
  }

  async getById(id) {
    return this.api.getById(id);
  }

  async create(experiment) {
    return this.api.create(experiment);
  }

  async update(id, updates) {
    return this.api.update(id, updates);
  }

  async delete(id) {
    return this.api.delete(id);
  }

  async getByCategory(category) {
    return this.api.getByCategory(category);
  }

  async getByDifficulty(difficulty) {
    return this.api.getByDifficulty(difficulty);
  }

  async search(query) {
    return this.api.search(query);
  }

  async seedDatabase() {
    return this.api.seedDatabase();
  }

  // Backend-specific methods
  async healthCheck() {
    if (this.useBackend && backendAPI.healthCheck) {
      return backendAPI.healthCheck();
    }
    return {
      success: false,
      error: 'Health check only available for backend API'
    };
  }
}

// Export singleton instance
export const unifiedAPI = new UnifiedAPI();
export default unifiedAPI;

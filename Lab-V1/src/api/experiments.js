import { supabase } from '../lib/supabase';

/**
 * Experiments API service
 * Handles all database operations for experiments
 */
class ExperimentsAPI {
  /**
   * Get all experiments from database
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error fetching experiments:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Get experiment by ID
   * @param {number} id - Experiment ID
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching experiment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a new experiment
   * @param {Object} experiment - Experiment data
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async create(experiment) {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .insert([experiment])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error creating experiment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update an experiment
   * @param {number} id - Experiment ID
   * @param {Object} updates - Updated data
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating experiment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete an experiment
   * @param {number} id - Experiment ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from('experiments')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting experiment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get experiments by category
   * @param {string} category - Category name
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async getByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error fetching experiments by category:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Get experiments by difficulty
   * @param {string} difficulty - Difficulty level
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async getByDifficulty(difficulty) {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .eq('difficulty', difficulty)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error fetching experiments by difficulty:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Search experiments by title or description
   * @param {string} query - Search query
   * @returns {Promise<{success: boolean, data: Array, error?: string}>}
   */
  async search(query) {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .or(`title.ilike.%${query}%,desc.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error searching experiments:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Seed database with sample experiments
   * @returns {Promise<{success: boolean, data?: Array, count?: number, error?: string}>}
   */
  async seedDatabase() {
    try {
      // Check if experiments already exist
      const { data: existingData, error: checkError } = await supabase
        .from('experiments')
        .select('count', { count: 'exact' });

      if (checkError) {
        throw checkError;
      }

      if (existingData && existingData.length > 0) {
        return {
          success: true,
          message: 'Data already exists',
          count: existingData.length
        };
      }

      // Sample experiments data
      const sampleExperiments = [
        {
          title: 'Hyperspeed Background',
          desc: 'A futuristic highway animation with customizable effects and minimal glow. Features dynamic lighting, car trails, and interactive speed controls.',
          category: 'Backgrounds',
          difficulty: 'Advanced',
          estimated_time: '2 hours',
          path: '/experiments/exp-1'
        },
        {
          title: 'E-commerce Catalogue',
          desc: 'Complete e-commerce interface with product listings, shopping cart, user authentication, and responsive design.',
          category: 'Web Development',
          difficulty: 'Intermediate',
          estimated_time: '3 hours',
          path: '/experiments/exp-2'
        },
        {
          title: 'CountUp Animation',
          desc: 'Animated number counter with smooth transitions, customizable easing, and multiple formatting options.',
          category: 'Text Animations',
          difficulty: 'Beginner',
          estimated_time: '30 minutes',
          path: '/blocks/TextAnimations/CountUp'
        },
        {
          title: 'React Form Validation',
          desc: 'Advanced form handling with real-time validation, error messaging, and accessibility features.',
          category: 'UI Components',
          difficulty: 'Intermediate',
          estimated_time: '1.5 hours',
          path: '/experiments/form-validation'
        },
        {
          title: 'CSS Grid Gallery',
          desc: 'Responsive image gallery using CSS Grid with hover effects, lightbox functionality, and lazy loading.',
          category: 'CSS Layouts',
          difficulty: 'Beginner',
          estimated_time: '45 minutes',
          path: '/experiments/css-grid-gallery'
        },
        {
          title: 'WebGL Particle System',
          desc: 'Interactive particle effects using WebGL and Three.js with physics simulation and user controls.',
          category: 'WebGL',
          difficulty: 'Advanced',
          estimated_time: '4 hours',
          path: '/experiments/webgl-particles'
        }
      ];

      // Insert sample experiments
      const { data, error } = await supabase
        .from('experiments')
        .insert(sampleExperiments)
        .select();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data,
        count: data.length
      };
    } catch (error) {
      console.error('Error seeding database:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const experimentsAPI = new ExperimentsAPI();
export default experimentsAPI;

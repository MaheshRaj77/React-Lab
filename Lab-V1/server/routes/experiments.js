import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all experiments
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    next(error);
  }
});

// Get experiment by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid experiment ID is required'
      });
    }

    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});

// Create new experiment
router.post('/', async (req, res, next) => {
  try {
    const { title, desc, category, difficulty, estimated_time, path } = req.body;

    // Basic validation
    if (!title || !desc || !category || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, category, and difficulty are required'
      });
    }

    const { data, error } = await supabase
      .from('experiments')
      .insert([{
        title,
        desc,
        category,
        difficulty,
        estimated_time,
        path
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      data,
      message: 'Experiment created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update experiment
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid experiment ID is required'
      });
    }

    // Remove id from updates if present
    delete updates.id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('experiments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Experiment not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Experiment updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete experiment
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid experiment ID is required'
      });
    }

    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Experiment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get experiments by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    next(error);
  }
});

// Get experiments by difficulty
router.get('/difficulty/:difficulty', async (req, res, next) => {
  try {
    const { difficulty } = req.params;

    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('difficulty', difficulty)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    next(error);
  }
});

// Search experiments
router.get('/search/:query', async (req, res, next) => {
  try {
    const { query } = req.params;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .or(`title.ilike.%${query}%,desc.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    next(error);
  }
});

// Seed database with sample experiments
router.post('/seed', async (req, res, next) => {
  try {
    // Check if experiments already exist
    const { data: existingData, error: checkError } = await supabase
      .from('experiments')
      .select('count', { count: 'exact' });

    if (checkError) {
      throw checkError;
    }

    if (existingData && existingData.length > 0) {
      return res.json({
        success: true,
        message: 'Data already exists',
        count: existingData.length
      });
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

    res.status(201).json({
      success: true,
      data,
      count: data.length,
      message: 'Database seeded successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

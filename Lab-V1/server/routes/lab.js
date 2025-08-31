// server/routes/lab.js
import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all labs for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lab')
      .select(`
        *,
        developers (
          id,
          name,
          last_name,
          email
        )
      `)
      .eq('user_id', req.user.developerId) // Filter by authenticated user's ID
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching labs:', error);
      // If table doesn't exist, return empty array
      if (error.code === 'PGRST116' || error.message.includes('relation "public.lab" does not exist')) {
        return res.json({
          success: true,
          data: [],
          message: 'Lab table does not exist yet'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch labs'
      });
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get lab by ID (only if it belongs to authenticated user)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('lab')
      .select(`
        *,
        developers (
          id,
          name,
          last_name,
          email
        )
      `)
      .eq('id', id)
      .eq('user_id', req.user.developerId) // Ensure user owns this lab
      .single();

    if (error) {
      console.error('Error fetching lab:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch lab'
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Lab not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get labs by user ID (only for authenticated user)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure user can only access their own labs
    if (parseInt(userId) !== req.user.developerId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { data, error } = await supabase
      .from('lab')
      .select(`
        *,
        developers (
          id,
          name,
          last_name,
          email
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user labs:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user labs'
      });
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create new lab
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, category, difficulty, file_path } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const { data, error } = await supabase
      .from('lab')
      .insert([{
        name,
        description,
        category,
        difficulty,
        file_path,
        user_id: req.user.developerId // Use authenticated user's ID
      }])
      .select(`
        *,
        developers (
          id,
          name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error creating lab:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create lab'
      });
    }

    res.status(201).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update lab (only if it belongs to authenticated user)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, difficulty, file_path } = req.body;

    const { data, error } = await supabase
      .from('lab')
      .update({
        name,
        description,
        category,
        difficulty,
        file_path,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.developerId) // Ensure user owns this lab
      .select(`
        *,
        developers (
          id,
          name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error updating lab:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update lab'
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Lab not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete lab (only if it belongs to authenticated user)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('lab')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.developerId) // Ensure user owns this lab
      .select()
      .single();

    if (error) {
      console.error('Error deleting lab:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete lab'
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Lab not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;

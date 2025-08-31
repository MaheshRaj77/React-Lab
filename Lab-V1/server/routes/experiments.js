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
      // If table doesn't exist, return empty array
      if (error.code === 'PGRST116' || error.message.includes('relation "public.experiments" does not exist')) {
        return res.json({
          success: true,
          data: [],
          count: 0,
          message: 'Experiments table does not exist yet'
        });
      }
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

// Create experiment
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('experiments').insert(req.body).select();
    if (error) {
      // If table doesn't exist, return error message
      if (error.code === 'PGRST116' || error.message.includes('relation "public.experiments" does not exist')) {
        return res.status(400).json({ 
          error: 'Experiments table does not exist. Please create the table first.',
          details: 'Run the database migration to create the experiments table.'
        });
      }
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update experiment
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('experiments').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data.length) return res.status(404).json({ error: 'Experiment not found' });
  res.json(data[0]);
});

// Delete experiment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('experiments').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Experiment deleted' });
});

export default router;

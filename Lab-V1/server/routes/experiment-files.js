// server/routes/experiment-files.js
import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all experiment files
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('experiment_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching experiment files:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch experiment files'
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

// Get experiment files by experiment ID
router.get('/experiment/:experimentId', async (req, res) => {
  try {
    const { experimentId } = req.params;

    const { data, error } = await supabase
      .from('experiment_files')
      .select('*')
      .eq('experiment_id', experimentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching experiment files:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch experiment files'
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

// Upload experiment file
router.post('/upload', async (req, res) => {
  try {
    const { experiment_id, file_name, file_path, file_type, file_size } = req.body;

    if (!experiment_id || !file_name || !file_path) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: experiment_id, file_name, file_path'
      });
    }

    const { data, error } = await supabase
      .from('experiment_files')
      .insert([{
        experiment_id,
        file_name,
        file_path,
        file_type: file_type || null,
        file_size: file_size || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error uploading experiment file:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload experiment file'
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

// Delete experiment file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('experiment_files')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting experiment file:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete experiment file'
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Experiment file not found'
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

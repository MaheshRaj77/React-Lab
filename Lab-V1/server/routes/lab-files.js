// server/routes/lab-files.js
import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all lab files
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lab_files')
      .select(`
        *,
        lab!inner(user_id)
      `)
      .eq('lab.user_id', req.user.developerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lab files:', error);
      // If table doesn't exist, return empty array
      if (error.code === 'PGRST116' || error.message.includes('relation "public.lab_files" does not exist')) {
        return res.json({
          success: true,
          data: [],
          message: 'Lab files table does not exist yet'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch lab files'
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

// Get lab files by lab ID
router.get('/lab/:labId', authenticateToken, async (req, res) => {
  try {
    const { labId } = req.params;

    // First check if the lab belongs to the user
    const { data: labData, error: labError } = await supabase
      .from('lab')
      .select('id')
      .eq('id', labId)
      .eq('user_id', req.user.developerId)
      .single();

    if (labError || !labData) {
      // If lab table doesn't exist, return access denied
      if (labError && (labError.code === 'PGRST116' || labError.message.includes('relation "public.lab" does not exist'))) {
        return res.status(403).json({
          success: false,
          error: 'Lab not found or access denied'
        });
      }
      return res.status(403).json({
        success: false,
        error: 'Lab not found or access denied'
      });
    }

    const { data, error } = await supabase
      .from('lab_files')
      .select('*')
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lab files:', error);
      // If table doesn't exist, return empty array
      if (error.code === 'PGRST116' || error.message.includes('relation "public.lab_files" does not exist')) {
        return res.json({
          success: true,
          data: [],
          message: 'Lab files table does not exist yet'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch lab files'
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

// Upload lab file
router.post('/upload', authenticateToken, async (req, res) => {
  try {
    const { lab_id, file_name, file_path, file_type, file_size } = req.body;

    if (!lab_id || !file_name || !file_path) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: lab_id, file_name, file_path'
      });
    }

    // Check if the lab belongs to the authenticated user
    const { data: labData, error: labError } = await supabase
      .from('lab')
      .select('id')
      .eq('id', lab_id)
      .eq('user_id', req.user.developerId)
      .single();

    if (labError || !labData) {
      return res.status(403).json({
        success: false,
        error: 'Lab not found or access denied'
      });
    }

    const { data, error } = await supabase
      .from('lab_files')
      .insert([{
        lab_id,
        file_name,
        file_path,
        file_type: file_type || null,
        file_size: file_size || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error uploading lab file:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload lab file'
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

// Delete lab file
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the file belongs to a lab owned by the user
    const { data: fileData, error: fileError } = await supabase
      .from('lab_files')
      .select(`
        *,
        lab!inner(user_id)
      `)
      .eq('id', id)
      .eq('lab.user_id', req.user.developerId)
      .single();

    if (fileError || !fileData) {
      return res.status(403).json({
        success: false,
        error: 'File not found or access denied'
      });
    }

    const { data, error } = await supabase
      .from('lab_files')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting lab file:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete lab file'
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Lab file not found'
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

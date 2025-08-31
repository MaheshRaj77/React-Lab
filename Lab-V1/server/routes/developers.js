import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Secret key for JWT (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * POST /api/developers/register
 * Register a new developer
 */
router.post('/register', async (req, res) => {
  try {
    const { name, lastName, email, password, confirmPassword, supabaseUserId } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name, email, password, and confirm password are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match'
      });
    }

    // Check if developer already exists
    const { data: existingDeveloper, error: _checkError } = await supabase
      .from('developers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingDeveloper) {
      return res.status(409).json({
        error: 'Developer already exists',
        details: 'A developer with this email address is already registered'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new developer
    const { data: newDeveloper, error: insertError } = await supabase
      .from('developers')
      .insert([
        {
          name: name.trim(),
          last_name: lastName ? lastName.trim() : null,
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          supabase_user_id: supabaseUserId || null
        }
      ])
      .select('id, name, last_name, email, supabase_user_id, created_at')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({
        error: 'Failed to create developer account',
        details: 'Database error occurred'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        developerId: newDeveloper.id,
        email: newDeveloper.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(201).json({
      message: 'Developer registered successfully',
      developer: {
        id: newDeveloper.id,
        name: newDeveloper.name,
        lastName: newDeveloper.last_name,
        email: newDeveloper.email,
        supabaseUserId: newDeveloper.supabase_user_id,
        createdAt: newDeveloper.created_at
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred during registration'
    });
  }
});

/**
 * POST /api/developers/login
 * Login a developer
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        details: 'Email and password are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Find developer by email
    const { data: developer, error: findError } = await supabase
      .from('developers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (findError || !developer) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isValidPasswordCheck = await bcrypt.compare(password, developer.password);

    if (!isValidPasswordCheck) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        developerId: developer.id,
        email: developer.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(200).json({
      message: 'Login successful',
      developer: {
        id: developer.id,
        name: developer.name,
        lastName: developer.last_name,
        email: developer.email,
        supabaseUserId: developer.supabase_user_id,
        role: developer.role,
        createdAt: developer.created_at
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred during login'
    });
  }
});

/**
 * GET /api/developers/profile
 * Get developer profile (authenticated)
 */
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get developer profile
    const { data: developer, error } = await supabase
      .from('developers')
      .select('id, name, last_name, email, supabase_user_id, role, created_at, profile_image_url')
      .eq('id', decoded.developerId)
      .single();

    if (error || !developer) {
      return res.status(404).json({
        error: 'Developer not found'
      });
    }

    res.status(200).json({
      developer
    });

  } catch (error) {
    console.error('Profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/developers
 * Get all developers (admin only)
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('developers')
      .select('id, name, last_name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Get developers error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/developers/admin-details
 * Get admin developer details
 */
router.get('/admin-details', async (req, res) => {
  try {
    // Get the first admin user (you might want to modify this logic)
    const { data: adminData, error } = await supabase
      .from('developers')
      .select('id, name, last_name, email, supabase_user_id, role, profile_image_url, created_at')
      .eq('role', 'Admin', 'admin')
      .limit(1)
      .single();

    if (error) {
      // If no admin found, return null instead of static data
      if (error.code === 'PGRST116') {
        return res.status(200).json({
          success: true,
          data: null,
          message: 'No admin user found in database'
        });
      }
      throw error;
    }

    // Format the response to match frontend expectations
    const formattedAdmin = {
      id: adminData.id,
      name: adminData.name,
      lastName: adminData.last_name,
      email: adminData.email,
      supabaseUserId: adminData.supabase_user_id,
      role: adminData.role || 'Lead Developer',
      profile_image_url: adminData.profile_image_url,
      created_at: adminData.created_at
    };

    res.status(200).json({
      success: true,
      data: formattedAdmin
    });

  } catch (error) {
    console.error('Admin details error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/developers/admin
 * Get admin dashboard data
 */
router.get('/admin', async (req, res) => {
  try {
    // Get total counts
    const { count: totalDevelopers, error: countError } = await supabase
      .from('developers')
      .select('*', { count: 'exact', head: true });

    const { count: totalExperiments, error: expCountError } = await supabase
      .from('experiments')
      .select('*', { count: 'exact', head: true });

    if (countError || expCountError) {
      throw countError || expCountError;
    }

    // Get recent developers
    const { data: recentDevelopers, error: recentError } = await supabase
      .from('developers')
      .select('id, name, last_name, email, supabase_user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      throw recentError;
    }

    res.status(200).json({
      success: true,
      data: {
        totalDevelopers: totalDevelopers || 0,
        totalExperiments: totalExperiments || 0,
        recentDevelopers: recentDevelopers || []
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /api/developers/:id
 * Update a developer profile
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Handle both FormData and JSON requests
    let name, lastName, email, role, profile_image_url;

    if (req.file) {
      // Handle FormData request
      name = req.body.name;
      lastName = req.body.lastName;
      email = req.body.email;
      role = req.body.role;

      // Convert uploaded image to base64 data URL for now
      // In production, you'd upload to a cloud storage service
      if (req.file) {
        const base64Data = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        profile_image_url = `data:${mimeType};base64,${base64Data}`;
      }
    } else {
      // Handle JSON request
      ({ name, lastName, email, role, profile_image_url } = req.body);
    }

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name and email are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Check if developer exists
    const { data: existingDeveloper, error: fetchError } = await supabase
      .from('developers')
      .select('id, email, supabase_user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingDeveloper) {
      return res.status(404).json({
        error: 'Developer not found'
      });
    }

    // Check if email is already taken by another developer
    if (email !== existingDeveloper.email) {
      const { data: emailCheck, error: emailError } = await supabase
        .from('developers')
        .select('id')
        .eq('email', email)
        .neq('id', id)
        .single();

      if (emailCheck) {
        return res.status(400).json({
          error: 'Email already in use'
        });
      }
    }

    // Update developer
    const updateData = {
      name,
      last_name: lastName,
      email,
      role: role || 'Developer',
      profile_image_url: profile_image_url || null,
      updated_at: new Date().toISOString()
    };

    const { data: updatedDeveloper, error: updateError } = await supabase
      .from('developers')
      .update(updateData)
      .eq('id', id)
      .select('id, name, last_name, email, supabase_user_id, role, profile_image_url, created_at, updated_at')
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({
        error: 'Failed to update developer'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDeveloper,
      message: 'Developer updated successfully'
    });

  } catch (error) {
    console.error('Update developer error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/developers
 * Create a new developer (admin function)
 */
router.post('/', async (req, res) => {
  try {
    // Handle both FormData and JSON requests
    let name, lastName, email, password, role, profile_image_url, supabaseUserId;

    if (req.file) {
      // Handle FormData request
      name = req.body.name;
      lastName = req.body.lastName;
      email = req.body.email;
      password = req.body.password;
      role = req.body.role;
      supabaseUserId = req.body.supabaseUserId;

      // Convert uploaded image to base64 data URL for now
      // In production, you'd upload to a cloud storage service
      if (req.file) {
        const base64Data = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        profile_image_url = `data:${mimeType};base64,${base64Data}`;
      }
    } else {
      // Handle JSON request
      ({ name, lastName, email, password, role, profile_image_url, supabaseUserId } = req.body);
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name, email, and password are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if email already exists
    const { data: existingDeveloper, error: emailCheckError } = await supabase
      .from('developers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingDeveloper) {
      return res.status(400).json({
        error: 'Email already in use'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create developer
    const developerData = {
      name,
      last_name: lastName,
      email,
      password: hashedPassword,
      role: role || 'Developer',
      profile_image_url: profile_image_url || null,
      supabase_user_id: supabaseUserId || null
    };

    const { data: newDeveloper, error: createError } = await supabase
      .from('developers')
      .insert(developerData)
      .select('id, name, last_name, email, supabase_user_id, role, profile_image_url, created_at')
      .single();

    if (createError) {
      console.error('Create developer error:', createError);
      return res.status(500).json({
        error: 'Failed to create developer'
      });
    }

    res.status(201).json({
      success: true,
      data: newDeveloper,
      message: 'Developer created successfully'
    });

  } catch (error) {
    console.error('Create developer error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/developers/by-supabase/:supabaseUserId
 * Get developer by Supabase user ID
 */
router.get('/by-supabase/:supabaseUserId', async (req, res) => {
  try {
    const { supabaseUserId } = req.params;

    const { data: developer, error } = await supabase
      .from('developers')
      .select('id, name, last_name, email, supabase_user_id, role, created_at')
      .eq('supabase_user_id', supabaseUserId)
      .single();

    if (error || !developer) {
      return res.status(404).json({
        error: 'Developer not found'
      });
    }

    res.status(200).json({
      developer
    });

  } catch (error) {
    console.error('Get developer by Supabase ID error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if developer exists
    const { data: existingDeveloper, error: fetchError } = await supabase
      .from('developers')
      .select('id, name, email')
      .eq('id', id)
      .single();

    if (fetchError || !existingDeveloper) {
      return res.status(404).json({
        error: 'Developer not found'
      });
    }

    // Don't allow deleting the last admin
    if (existingDeveloper.role === 'Admin') {
      const { data: adminCount, error: countError } = await supabase
        .from('developers')
        .select('id', { count: 'exact' })
        .eq('role', 'Admin');

      if (adminCount && adminCount.length === 1) {
        return res.status(400).json({
          error: 'Cannot delete the last admin'
        });
      }
    }

    // Delete developer
    const { error: deleteError } = await supabase
      .from('developers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete developer error:', deleteError);
      return res.status(500).json({
        error: 'Failed to delete developer'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Developer deleted successfully'
    });

  } catch (error) {
    console.error('Delete developer error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;

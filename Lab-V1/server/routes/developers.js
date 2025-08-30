import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Secret key for JWT (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
  }
});

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
    const { name, lastName, email, password, confirmPassword } = req.body;

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
    const { data: existingDeveloper, error: checkError } = await supabase
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
          password: hashedPassword
        }
      ])
      .select('id, name, last_name, email, created_at')
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
      .select('id, name, last_name, email, role, created_at, profile_image_url')
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
      .select('id, name, last_name, email, created_at')
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

export default router;

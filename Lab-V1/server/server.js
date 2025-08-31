// Load environment configuration FIRST
import './env-config.js';

// Now import other modules
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import experimentsRoutes from './routes/experiments.js';
import developersRoutes from './routes/developers.js';
import experimentFilesRoutes from './routes/experiment-files.js';
import labRoutes from './routes/lab.js';
import labFilesRoutes from './routes/lab-files.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://10.233.110.149:3000',  // Add your network IP
  'http://10.233.110.149:5173'   // Add your network IP
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware for developers routes
app.use('/api/developers', upload.single('profileImage'));

// API routes
app.use('/api/experiments', experimentsRoutes);
app.use('/api/developers', developersRoutes);
app.use('/api/experiment-files', experimentFilesRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/lab-files', labFilesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Network access: http://10.233.110.149:${PORT}/api/health`);
});

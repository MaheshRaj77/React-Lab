import dotenv from 'dotenv';

// Load environment variables from .env file in server directory
dotenv.config({ path: './server/.env' });

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'JWT_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('Please check your .env file in the server directory.');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');

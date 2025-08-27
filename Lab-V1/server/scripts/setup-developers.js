import { supabase } from '../config/supabase.js';

async function createDevelopersTable() {
  try {
    console.log('🔄 Creating developers table...');
    
    // First, let's check if the table already exists by trying to query it
    const { data: existingData, error: existingError } = await supabase
      .from('developers')
      .select('count(*)', { count: 'exact' })
      .limit(0);
    
    if (!existingError) {
      console.log('✅ Developers table already exists!');
      return;
    }
    
    console.log('📝 Table does not exist, please create it manually in Supabase...');
    console.log(`
🔧 Please go to your Supabase dashboard and run this SQL:

CREATE TABLE IF NOT EXISTS developers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_developers_email ON developers(email);
    `);
    
  } catch (error) {
    console.error('❌ Error checking/creating table:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDevelopersTable();
}

export { createDevelopersTable };

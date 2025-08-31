import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../migrations/create_developers_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      const { data: _data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      if (error) {
        console.error('❌ Migration error:', error);
        throw error;
      }
    }
    
    console.log('✅ Database migrations completed successfully!');
    
    // Test the table by querying it
    const { data: _testData, error: testError } = await supabase
      .from('developers')
      .select('count(*)')
      .single();
    
    if (!testError) {
      console.log('✅ Developers table is ready!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations };

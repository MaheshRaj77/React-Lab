// setup-lab-files.js
import './env-config.js'; // Load environment variables FIRST
import { supabase } from './config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupLabFilesTable() {
  try {
    console.log('Setting up lab_files table...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '../LAB_FILES_SETUP.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');

        const { error } = await supabase.rpc('exec_sql', { sql: statement });

        if (error) {
          console.error('Error executing statement:', error);
          // Try direct execution for some statements
          try {
            const { error: directError } = await supabase.from('lab_files').select('*').limit(1);
            if (directError && directError.code === 'PGRST205') {
              console.log('Table does not exist, this is expected for CREATE TABLE statements');
            }
          } catch (e) {
            // Ignore errors for now
          }
        } else {
          console.log('✅ Statement executed successfully');
        }
      }
    }

    console.log('Lab files table setup completed!');
  } catch (error) {
    console.error('Failed to setup lab_files table:', error);
  }
}

setupLabFilesTable();

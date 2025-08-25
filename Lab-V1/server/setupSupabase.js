import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or key not defined. Make sure you have a .env file with SUPABASE_URL and SUPABASE_KEY.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const insertData = async () => {
  const results = [];
  const filePath = path.resolve(__dirname, './data/experiments.csv');

  if (!fs.existsSync(filePath)) {
    console.error(`CSV file not found at: ${filePath}`);
    return;
  }

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Found ${results.length} rows in CSV. Inserting into Supabase...`);
      
      const transformedRows = results.map(row => ({
        // id: parseInt(row.id, 10), // Let Supabase generate the ID
        title: row.title,
        desc: row.desc,
        category: row.category,
        difficulty: row.difficulty,
        estimated_time: row.estimated_time,
        path: row.path,
        created_at: new Date(row.created_at).toISOString(),
      }));

      const { data, error } = await supabase
        .from('experiments')
        .insert(transformedRows);

      if (error) {
        console.error('Error inserting rows:', error);
      } else {
        console.log('Successfully inserted all rows.');
      }
    });
};

insertData();

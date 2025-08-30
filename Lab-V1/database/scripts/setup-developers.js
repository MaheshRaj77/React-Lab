import { supabase } from '../config/supabase.js';

async function createDevelopersTable() {
  try {
    console.log('🔄 Creating developers table with updated schema...');

    // First, let's check if the table already exists by trying to query it
    const { data: existingData, error: existingError } = await supabase
      .from('developers')
      .select('count(*)', { count: 'exact' })
      .limit(0);

    if (!existingError) {
      console.log('✅ Developers table already exists!');
      console.log('🔄 Checking if schema needs updates...');

      // Check if profile_image column exists
      const { data: columnCheck, error: columnError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'developers')
        .eq('column_name', 'profile_image');

      if (columnError || !columnCheck || columnCheck.length === 0) {
        console.log('⚠️  Profile image column missing. Please update your table schema manually.');
      } else {
        console.log('✅ Schema looks up to date!');
      }
      return;
    }

    console.log('📝 Table does not exist, please create it manually in Supabase...');
    console.log(`
🔧 Please go to your Supabase dashboard and run this SQL:

-- Create developers table with comprehensive schema
CREATE TABLE IF NOT EXISTS public.developers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile_image BYTEA
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_developers_email ON public.developers(email);
CREATE INDEX IF NOT EXISTS idx_developers_id ON public.developers(id);
CREATE INDEX IF NOT EXISTS idx_developers_email_lower ON public.developers(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_developers_created_at ON public.developers(created_at);

-- Enable Row Level Security
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Allow public registration" ON public.developers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to read own data" ON public.developers FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Allow users to update own data" ON public.developers FOR UPDATE USING (auth.uid()::text = id::text);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.developers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comments
COMMENT ON TABLE public.developers IS 'Table to store developer accounts with authentication information';
COMMENT ON COLUMN public.developers.profile_image IS 'Binary data for profile image (optional)';

🔧 Or alternatively, you can run the migration files:
   - server/migrations/create_developers_table.sql
   - server/migrations/developers_rls_simple.sql
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

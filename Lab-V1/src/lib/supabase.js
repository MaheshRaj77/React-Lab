import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bnruzhutytkbjjziucze.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucnV6aHV0eXRrYmpqeml1Y3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NDIyMDcsImV4cCI6MjA3MDExODIwN30.6WeAxaDEts_bXqPOgJoAhIyX5f_crFLIF7CZnvcwa70'

export const supabase = createClient(supabaseUrl, supabaseKey)
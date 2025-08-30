import 'dotenv/config';
import { supabase } from '../config/supabase.js';

async function fixCorruptedImage() {
  try {
    console.log('🔧 Fixing corrupted admin profile image...\n');

    // Get current admin data
    const { data: admin, error: fetchError } = await supabase
      .from('developers')
      .select('id, name, profile_image')
      .eq('role', 'Admin')
      .single();

    if (fetchError) {
      console.log('❌ Error fetching admin:', fetchError.message);
      return;
    }

    if (!admin) {
      console.log('❌ No admin found');
      return;
    }

    console.log('✅ Found admin:', admin.name);

    // Clear the corrupted image data
    const { error: updateError } = await supabase
      .from('developers')
      .update({ profile_image: null })
      .eq('id', admin.id);

    if (updateError) {
      console.log('❌ Error clearing corrupted image:', updateError.message);
      return;
    }

    console.log('✅ Successfully cleared corrupted image data');
    console.log('💡 Now you can upload a new profile image through the Profile component');

    // Optionally, you could add a default image here
    // For now, we'll just clear it so the fallback avatar shows

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixCorruptedImage();

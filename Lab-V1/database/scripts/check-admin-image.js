import 'dotenv/config';
import { supabase } from '../config/supabase.js';

async function checkAdminAndDecodeImage() {
  try {
    console.log('🔍 Checking for admin user and decoding image...\n');

    // Check if admin exists
    const { data: admin, error } = await supabase
      .from('developers')
      .select('id, name, last_name, email, role, profile_image')
      .eq('role', 'Admin')
      .single();

    if (error) {
      console.log('❌ Database Error:', error.message);
      console.log('💡 This might mean the developers table doesn\'t exist yet.');
      console.log('🔧 Please create the table first using the migration script.');
      return;
    }

    if (!admin) {
      console.log('❌ No admin user found in database');
      console.log('💡 You need to create an admin user first.');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('   ID:', admin.id);
    console.log('   Name:', admin.name, admin.last_name || '');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Has Profile Image:', !!admin.profile_image);

    if (admin.profile_image) {
      console.log('\n🖼️  Profile Image Details:');
      console.log('   Raw Byte Length:', admin.profile_image.length, 'bytes');

      // Decode the bytea image to base64
      const base64Image = Buffer.from(admin.profile_image).toString('base64');
      console.log('   Base64 Length:', base64Image.length, 'characters');

      // Show first 100 characters of base64
      console.log('   Base64 Preview:', base64Image.substring(0, 100) + '...');

      // Create data URL for browser
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      console.log('\n🌐 Data URL for browser:');
      console.log(dataUrl);

      console.log('\n📋 HTML Image Tag:');
      console.log(`<img src="${dataUrl}" alt="Profile Image" style="max-width: 200px; max-height: 200px;" />`);

    } else {
      console.log('\n🖼️  No profile image found for this admin user');
      console.log('💡 To add an image, you can:');
      console.log('   1. Use the Profile component to upload an image');
      console.log('   2. Or manually insert image data into the database');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the function
checkAdminAndDecodeImage();

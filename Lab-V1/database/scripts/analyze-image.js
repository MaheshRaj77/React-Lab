import 'dotenv/config';
import { supabase } from '../config/supabase.js';

async function analyzeImageData() {
  try {
    console.log('🔍 Analyzing admin profile image data...\n');

    // Get admin data
    const { data: admin, error } = await supabase
      .from('developers')
      .select('id, name, profile_image')
      .eq('role', 'Admin')
      .single();

    if (error) {
      console.log('❌ Error fetching admin:', error.message);
      return;
    }

    if (!admin) {
      console.log('❌ No admin found');
      return;
    }

    console.log('✅ Admin found:', admin.name);
    console.log('📊 Image data analysis:');

    if (!admin.profile_image) {
      console.log('❌ No profile image data found');
      return;
    }

    // Convert bytea to base64
    const base64Data = Buffer.from(admin.profile_image).toString('base64');
    console.log('📏 Base64 length:', base64Data.length, 'characters');

    // Check first few bytes to determine image format
    const firstBytes = base64Data.substring(0, 20);
    console.log('🔍 First 20 chars of base64:', firstBytes);

    // Try to decode and check magic bytes
    try {
      const decoded = Buffer.from(base64Data, 'base64');
      const magicBytes = decoded.subarray(0, 8);
      console.log('🔮 Magic bytes (hex):', magicBytes.toString('hex'));

      // Check for common image formats
      if (magicBytes[0] === 0xFF && magicBytes[1] === 0xD8) {
        console.log('🖼️  Detected format: JPEG');
      } else if (magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4E && magicBytes[3] === 0x47) {
        console.log('🖼️  Detected format: PNG');
      } else if (magicBytes[0] === 0x47 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46) {
        console.log('🖼️  Detected format: GIF');
      } else if (magicBytes[0] === 0x52 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46 && magicBytes[3] === 0x46) {
        console.log('🖼️  Detected format: WebP');
      } else {
        console.log('❓ Unknown image format');
      }

      console.log('📊 Image size:', decoded.length, 'bytes');

      // Test if we can create a data URL
      const dataUrl = `data:image/jpeg;base64,${base64Data}`;
      console.log('🌐 Data URL length:', dataUrl.length, 'characters');

      // Show a truncated version for testing
      const truncatedBase64 = base64Data.substring(0, 100) + '...';
      const testDataUrl = `data:image/jpeg;base64,${truncatedBase64}`;
      console.log('🧪 Test data URL (truncated):', testDataUrl);

    } catch (decodeError) {
      console.log('❌ Error decoding base64:', decodeError.message);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the analysis
analyzeImageData();

import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createAdminUser() {
  try {
    console.log('🔄 Creating admin user...');

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('developers')
      .select('id, email')
      .eq('role', 'Admin')
      .single();

    if (!checkError && existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create admin user
    const adminData = {
      name: 'Mahesh',
      last_name: 'Raj',
      email: 'admin@cslab.com',
      password: hashedPassword,
      role: 'Admin'
    };

    const { data: newAdmin, error: insertError } = await supabase
      .from('developers')
      .insert(adminData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating admin user:', insertError);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@cslab.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: Admin');

    // Try to add a profile image (optional)
    try {
      // You can replace this with an actual image file path
      const imagePath = path.join(__dirname, '../../public/vite.svg');

      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const { error: imageError } = await supabase
          .from('developers')
          .update({ profile_image: imageBuffer })
          .eq('id', newAdmin.id);

        if (imageError) {
          console.log('⚠️  Could not add profile image:', imageError.message);
        } else {
          console.log('✅ Profile image added successfully!');
        }
      } else {
        console.log('ℹ️  No profile image file found at:', imagePath);
      }
    } catch (imageError) {
      console.log('⚠️  Could not add profile image:', imageError.message);
    }

  } catch (error) {
    console.error('❌ Error in createAdminUser:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export { createAdminUser };

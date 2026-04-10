import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seed() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    console.log('Seeding database...');

    // Create default admin user with simple credentials for testing
    const username = 'admin';
    const email = 'admin@bnbprayagraj.com';
    const password = 'pass123'; // Simple password for testing
    const passwordHash = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from('admin_users')
      .upsert(
        {
          email,
          password_hash: passwordHash,
          name: 'Admin',
          role: 'super_admin',
          is_active: true,
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }

    console.log('Admin user created/updated:');
    console.log(`  Username: ${username}`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log('  ⚠️  Please change the password after first login!');

    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
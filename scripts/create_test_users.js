const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://wxtyeuyjtrinnufznrkz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dHlldXlqdHJpbm51Znpucmt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTc3MTIsImV4cCI6MjA2OTI5MzcxMn0.jAVk8WbdzF2zk3AXv7Slkm3ebjcQFjO4cRK6YoBmX3g";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUsers() {
  console.log('--- Creating Test Users ---');

  const testUsers = [
    {
      email: 'doctor@curamind.com',
      password: 'password123',
      metadata: { full_name: 'Dr. Test Clinician', user_type: 'Doctor' }
    },
    {
      email: 'patient@curamind.com',
      password: 'password123',
      metadata: { full_name: 'John Patient', user_type: 'Patient' }
    },
    {
      email: 'admin@curamind.com',
      password: 'password123',
      metadata: { full_name: 'System Admin', user_type: 'Admin' }
    }
  ];

  for (const user of testUsers) {
    console.log(`Registering ${user.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: { data: user.metadata }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`${user.email} is already registered.`);
      } else {
        console.error(`Error registering ${user.email}:`, error.message);
      }
    } else {
      console.log(`Successfully registered ${user.email}!`);

      // Also ensure record exists in 'users' table
      if (data.user) {
        const { error: dbError } = await supabase.from('users').insert({
          id: data.user.id,
          email: user.email,
          full_name: user.metadata.full_name,
          user_type: user.metadata.user_type,
          created_at: new Date().toISOString()
        });
        if (dbError) console.log(`Note: Handled DB insert for ${user.email} (likely already exists)`);
      }
    }
  }
}

createTestUsers().then(() => console.log('Done.'));

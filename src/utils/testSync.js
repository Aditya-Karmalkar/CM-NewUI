// Test function to verify Firebase-Supabase sync is working
import { supabase } from '../supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log('📊 Current users in database:', data?.length || 0);
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

export const checkUsersTable = async () => {
  try {
    console.log('📊 Checking users table...');
    
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, firebase_uid, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error checking users table:', error);
      return [];
    }
    
    console.log('✅ Users table data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  }
};

// Manual trigger for testing
export const triggerManualSync = async (firebaseUser) => {
  if (!firebaseUser) {
    console.error('❌ No Firebase user provided');
    return false;
  }
  
  try {
    console.log('🔄 Triggering manual sync...');
    
    // Import the sync function
    const { syncOAuthUserToSupabase } = await import('../firebase');
    
    const result = await syncOAuthUserToSupabase(firebaseUser);
    console.log('✅ Manual sync completed:', result);
    
    // Check updated users table
    await checkUsersTable();
    
    return true;
  } catch (error) {
    console.error('❌ Manual sync failed:', error);
    return false;
  }
};

// Debug utility to test Firebase-Supabase sync
import { supabase } from '../supabase';

// Test current Firebase user sync
export const debugCurrentUserSync = async (firebaseUser) => {
  if (!firebaseUser) {
    console.error('❌ No Firebase user provided');
    return false;
  }

  console.log('🧪 DEBUG: Testing sync for current user...');
  console.log('Current Firebase user:', {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName
  });

  try {
    // Import the sync function
    const { syncOAuthUserToSupabase } = await import('../firebase');
    
    console.log('🔄 DEBUG: Calling syncOAuthUserToSupabase...');
    const result = await syncOAuthUserToSupabase(firebaseUser);
    
    console.log('✅ DEBUG: Sync completed:', result);
    
    // Verify the data is actually there
    console.log('🔍 DEBUG: Verifying data in Supabase...');
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', firebaseUser.email);
    
    console.log('📊 DEBUG: User data in Supabase:', userData);
    
    return userData && userData.length > 0;
    
  } catch (error) {
    console.error('❌ DEBUG: Sync failed:', error);
    return false;
  }
};

// Check all users in Supabase
export const debugCheckAllUsers = async () => {
  console.log('🔍 DEBUG: Checking all users in Supabase...');
  
  try {
    const { data: allUsers, error } = await supabase
      .from('users')
      .select('id, email, full_name, firebase_uid, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ DEBUG: Error checking users:', error);
      return [];
    }
    
    console.log('📊 DEBUG: All users in Supabase:', allUsers);
    return allUsers;
    
  } catch (error) {
    console.error('❌ DEBUG: Error:', error);
    return [];
  }
};

// Test Supabase connection
export const debugTestConnection = async () => {
  console.log('🔌 DEBUG: Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count()');
    
    if (error) {
      console.error('❌ DEBUG: Connection failed:', error);
      return false;
    }
    
    console.log('✅ DEBUG: Supabase connection successful');
    console.log('📊 DEBUG: User count:', data);
    return true;
    
  } catch (error) {
    console.error('❌ DEBUG: Connection error:', error);
    return false;
  }
};

// Manual test - run this in browser console
export const runFullDebug = async () => {
  console.log('🧪 Starting full debug test...');
  
  // Test connection
  await debugTestConnection();
  
  // Check all users
  await debugCheckAllUsers();
  
  console.log('✅ Debug test completed');
};

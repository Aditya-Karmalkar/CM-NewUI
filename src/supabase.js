import { createClient } from '@supabase/supabase-js'

// Updated with actual Supabase project credentials
const supabaseUrl = "https://wxtyeuyjtrinnufznrkz.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dHlldXlqdHJpbm51Znpucmt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTc3MTIsImV4cCI6MjA2OTI5MzcxMn0.jAVk8WbdzF2zk3AXv7Slkm3ebjcQFjO4cRK6YoBmX3g"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = supabase.auth
export const db = supabase.from
export const storage = supabase.storage

// Google OAuth provider
export const googleProvider = {
    name: 'google',
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
}

// Helper functions for backward compatibility
export const getCurrentUser = () => auth.getUser()

// Ensure user record exists in users table
export const ensureUserRecord = async (user) => {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking user:', checkError);
      return;
    }

    if (existingUser) {
      // Update existing user with latest info
      const { error: updateError } = await supabase
        .from('users')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('email', user.email);

      if (updateError) {
        console.error('Error updating user:', updateError);
      }
    } else {
      // Create new user record
      await createUserRecord(user);
    }
  } catch (error) {
    console.error('Error ensuring user record:', error);
  }
};

// Create new user record in users table
export const createUserRecord = async (user, metadata = {}) => {
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.displayName || metadata.full_name || '',
        phone: user.user_metadata?.phone || null,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.photoURL || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...metadata
      });

    if (error) {
      console.error('Error creating user record:', error);
    }
  } catch (error) {
    console.error('Error creating user record:', error);
  }
};
export const signOut = () => auth.signOut()
export const signInWithEmail = async (email, password) => {
    const { data, error } = await auth.signInWithPassword({ email, password });
    
    if (data?.user) {
        // Ensure user record exists in users table
        await ensureUserRecord(data.user);
    }
    
    return { data, error };
}
export const signUpWithEmail = async (email, password, metadata = {}) => {
    const { data, error } = await auth.signUp({ email, password, data: metadata });
    
    if (data?.user) {
        // Create user record in users table
        await createUserRecord(data.user, metadata);
    }
    
    return { data, error };
}
// Use Firebase for OAuth with Supabase integration
export const signInWithGoogle = async () => {
  try {
    const { handleOAuthSignIn } = await import('./firebase');
    return await handleOAuthSignIn('google');
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Facebook OAuth through Firebase
export const signInWithFacebook = async () => {
  try {
    const { handleOAuthSignIn } = await import('./firebase');
    return await handleOAuthSignIn('facebook');
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToTable = (table, callback) => {
    return supabase
        .from(table)
        .on('*', callback)
        .subscribe()
}

// Storage helpers
export const uploadFile = (bucket, path, file) => {
    return storage.from(bucket).upload(path, file)
}

export const getFileUrl = (bucket, path) => {
    return storage.from(bucket).getPublicUrl(path)
}

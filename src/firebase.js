// Firebase configuration for OAuth only
// Main backend remains Supabase, Firebase used only for social login
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { supabase } from './supabase';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app for OAuth only
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// OAuth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Add db export for backward compatibility (deprecated - use Supabase instead)
export const db = null; // Firebase Firestore is deprecated, use Supabase

// OAuth functions for social login only
export const signInWithGoogleFirebase = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);

// Function to sync Firebase OAuth user data to Supabase
export const syncOAuthUserToSupabase = async (firebaseUser) => {
  console.log('🔍 DEBUG: Starting syncOAuthUserToSupabase...');
  console.log('DEBUG: Firebase User:', {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL
  });

  try {
    const { uid, email, displayName, photoURL } = firebaseUser;

    // First, ensure user exists in Supabase auth
    console.log('🔐 DEBUG: Checking Supabase auth...');

    // Try to sign in with existing user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: uid
    });

    let authResult;

    if (signInError) {
      console.log('🆕 DEBUG: User not found in Supabase auth, creating...');
      const { data: newAuth, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: uid,
        data: {
          full_name: displayName,
          avatar_url: photoURL
        }
      });

      if (signUpError) {
        console.error('❌ DEBUG: Error creating Supabase auth user:', signUpError);
        throw signUpError;
      }

      authResult = newAuth;
      console.log('✅ DEBUG: Created new Supabase auth user:', newAuth.user.id);
    } else {
      authResult = signInData;
      console.log('✅ DEBUG: Found existing Supabase auth user:', signInData.user.id);
    }

    if (!authResult || !authResult.user) {
      throw new Error('Failed to get/create Supabase auth user');
    }

    const supabaseUserId = authResult.user.id;
    console.log('📊 DEBUG: Now syncing users table with ID:', supabaseUserId);

    // Check if user already exists in users table
    console.log('🔍 DEBUG: Checking users table for existing record...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    console.log('DEBUG: Users table check result:', { existingUser, checkError });

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ DEBUG: Error checking existing user:', checkError);
      throw checkError;
    }

    const hasExistingUser = existingUser && existingUser.length > 0;

    if (hasExistingUser) {
      console.log('🔄 DEBUG: Updating existing user record...');
      const { error: updateError } = await supabase
        .from('users')
        .update({
          firebase_uid: uid,
          full_name: displayName,
          avatar_url: photoURL,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.error('❌ DEBUG: Error updating user:', updateError);
        throw updateError;
      }
      console.log('✅ DEBUG: Updated existing user record');
    } else {
      console.log('🆕 DEBUG: Creating new user record in users table...');
      const { error: insertError, data: insertedData } = await supabase
        .from('users')
        .insert({
          id: supabaseUserId,
          email: email,
          full_name: displayName,
          avatar_url: photoURL,
          firebase_uid: uid,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (insertError) {
        console.error('❌ DEBUG: Error creating user record:', insertError);
        throw insertError;
      }
      console.log('✅ DEBUG: Successfully created user record:', insertedData);
    }

    // Final verification - check what's actually in the database
    console.log('🔍 DEBUG: Final verification - checking users table...');
    const { data: finalCheck } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    console.log('✅ DEBUG: Final users table state:', finalCheck);

    return authResult;
  } catch (error) {
    console.error('❌ DEBUG: Error syncing OAuth user to Supabase:', error);
    throw error;
  }
};

// Complete OAuth flow with Firebase + Supabase sync
export const handleOAuthSignIn = async (providerType = 'google') => {
  try {
    let result;

    if (providerType === 'google') {
      result = await signInWithPopup(auth, googleProvider);
    } else if (providerType === 'facebook') {
      result = await signInWithPopup(auth, facebookProvider);
    }

    const firebaseUser = result.user;

    // Sync Firebase user data to Supabase
    console.log('🔄 Syncing Firebase user to Supabase...');
    await syncOAuthUserToSupabase(firebaseUser);

    // Create Supabase session token
    console.log('🔐 Creating Supabase session...');
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: firebaseUser.email,
      password: firebaseUser.uid // Using Firebase UID as temporary password
    });

    if (error) {
      console.error('❌ Error creating Supabase session:', error);
      throw error;
    }

    console.log('✅ OAuth flow completed successfully');
    return { firebaseUser, supabaseUser: session.user };
  } catch (error) {
    console.error('❌ OAuth sign-in error:', error);
    throw error;
  }
};

// Rate limiting state management
const RATE_LIMIT_COOLDOWN = 60000; // 60 seconds
let rateLimitEndTime = 0;

// Check if we're currently rate limited
const isRateLimited = () => {
  const now = Date.now();
  return now < rateLimitEndTime;
};

// Set rate limit based on error
const setRateLimit = (error) => {
  const now = Date.now();
  if (error.message && error.message.includes('56 seconds')) {
    rateLimitEndTime = now + 56000; // 56 seconds from now
  } else if (error.message && error.message.includes('seconds')) {
    // Extract seconds from error message
    const match = error.message.match(/(\d+)\s*seconds/);
    if (match) {
      const seconds = parseInt(match[1]);
      rateLimitEndTime = now + (seconds * 1000);
    } else {
      rateLimitEndTime = now + RATE_LIMIT_COOLDOWN;
    }
  } else {
    rateLimitEndTime = now + RATE_LIMIT_COOLDOWN;
  }
};

// Get remaining cooldown time
const getRemainingCooldown = () => {
  const now = Date.now();
  const remaining = Math.max(0, rateLimitEndTime - now);
  return Math.ceil(remaining / 1000); // Return seconds
};

// Handle popup blocked with redirect fallback and rate limiting
export const handleOAuthSignInWithFallback = async (providerType = 'google') => {
  try {
    // Check if we're currently rate limited
    if (isRateLimited()) {
      const remainingSeconds = getRemainingCooldown();
      throw new Error(`Rate limited. Please wait ${remainingSeconds} seconds before trying again.`);
    }

    console.log('🔍 DEBUG: Starting OAuth sign-in with popup...');

    let result;
    let provider;

    if (providerType === 'google') {
      provider = googleProvider;
    } else if (providerType === 'facebook') {
      provider = facebookProvider;
    }

    try {
      // Try popup first
      result = await signInWithPopup(auth, provider);
      console.log('✅ DEBUG: Popup sign-in successful');
      
      // Clear any existing rate limit on successful sign-in
      rateLimitEndTime = 0;
      
    } catch (popupError) {
      // Handle rate limiting errors
      if (popupError.message && (popupError.message.includes('seconds') || popupError.code === 'auth/too-many-requests')) {
        console.log('⏱️ DEBUG: Rate limit detected, setting cooldown...');
        setRateLimit(popupError);
        const remainingSeconds = getRemainingCooldown();
        throw new Error(`Too many sign-in attempts. Please wait ${remainingSeconds} seconds before trying again.`);
      }
      
      if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
        console.log('🔄 DEBUG: Popup blocked, trying redirect...');

        // Use redirect for popup blocked
        await signInWithRedirect(auth, provider);

        // For redirect, we need to handle the result when user returns
        // This will be handled by auth state listener
        return { redirect: true };
      } else {
        throw popupError;
      }
    }

    const firebaseUser = result.user;
    console.log('✅ DEBUG: Firebase user authenticated:', firebaseUser.email);

    // OAuth providers (Google, Facebook) have inherently verified emails
    // Skip email verification for OAuth sign-ins
    console.log('✅ DEBUG: OAuth provider email verification bypassed');

    // Sync to Supabase
    console.log('🔄 DEBUG: Syncing to Supabase...');
    await syncOAuthUserToSupabase(firebaseUser);

    // Create Supabase session - handle OAuth without email confirmation
    console.log('🔐 DEBUG: Creating Supabase session...');
    
    // First, try to sign in (no email confirmation needed)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: firebaseUser.email,
      password: firebaseUser.uid
    });
    
    let session;
    
    if (signInError) {
      console.log('🆕 DEBUG: User not found, creating new Supabase auth user...');
      
      // Create user with email confirmation disabled for OAuth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: firebaseUser.email,
        password: firebaseUser.uid,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL,
            provider: 'oauth'
          }
        }
      });
      
      if (signUpError) {
        console.error('❌ DEBUG: Supabase signUp error:', signUpError);
        throw signUpError;
      }
      
      session = signUpData.session;
      
    } else {
      console.log('✅ DEBUG: Existing Supabase user found');
      session = signInData.session;
    }

    if (!session) {
      throw new Error('Failed to create Supabase session');
    }

    console.log('✅ DEBUG: Supabase session created successfully');

    console.log('✅ DEBUG: Complete flow successful');
    return { firebaseUser, supabaseUser: session.user };

  } catch (error) {
    console.error('❌ DEBUG: OAuth sign-in error:', error);

    // Handle rate limiting first
    if (error.message && (error.message.includes('seconds') || error.message.includes('Rate limited'))) {
      // Error is already formatted for rate limiting
      throw error;
    }

    // Handle Firebase rate limiting errors
    if (error.code === 'auth/too-many-requests') {
      setRateLimit(error);
      const remainingSeconds = getRemainingCooldown();
      throw new Error(`Too many sign-in attempts. Please wait ${remainingSeconds} seconds before trying again.`);
    }

    // Handle other specific error cases
    if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('Account exists with different sign-in method. Please use the original method.');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already registered. Please sign in instead.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for sign-in. Please check your Firebase configuration.');
    } else if (error.message && error.message.includes('email not confirmed')) {
      throw new Error('Email verification required. Please check your email and verify your account.');
    }

    throw error;
  }
};

// Export rate limiting utilities for use in components
export const getAuthRateLimitStatus = () => {
  return {
    isRateLimited: isRateLimited(),
    remainingSeconds: getRemainingCooldown()
  };
};

// Handle OAuth redirect result and navigate to dashboard
export const handleOAuthRedirectResult = async (navigate) => {
  try {
    console.log('🔍 DEBUG: Checking for OAuth redirect result...');
    
    const result = await getRedirectResult(auth);
    
    if (result) {
      console.log('✅ DEBUG: OAuth redirect result found:', result.user.email);
      
      // Sync Firebase user to Supabase
      await syncOAuthUserToSupabase(result.user);
      
      // Navigate to the new Shadcn dashboard
      console.log('🔄 DEBUG: Navigating to health dashboard after OAuth redirect');
      navigate('/health-dashboard');
      
      return true; // Redirect was handled
    }
    
    return false; // No redirect result
  } catch (error) {
    console.error('❌ DEBUG: Error handling OAuth redirect:', error);
    throw error;
  }
};
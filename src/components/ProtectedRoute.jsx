import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';
import UniqueLoading from './ui/morph-loading';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    let firebaseUnsubscribe;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          if (isMounted) {
            setCurrentUser(session.user);
            setIsLoading(false);
          }
        } else {
          // If no Supabase user, wait for Firebase to initialize its session
          const { auth } = await import('../firebase');
          
          // onAuthStateChanged fires immediately once Firebase resolves the initial state
          firebaseUnsubscribe = auth.onAuthStateChanged((user) => {
            if (isMounted) {
              setCurrentUser(user);
              setIsLoading(false);
            }
          });
        }
      } catch (err) {
        console.error("Auth check failed", err);
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' && isMounted) {
        setCurrentUser(null);
      } else if (session?.user && isMounted) {
        setCurrentUser(session.user);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      if (firebaseUnsubscribe) firebaseUnsubscribe();
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <UniqueLoading size="lg" />
        <span className="mt-4 text-blue-600 font-semibold tracking-wide animate-pulse">Verifying Access</span>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  
  // Supabase uses email_confirmed_at, or checking app_metadata.provider
  // For now we allow access if they have a session
  
  return children;
};

export default ProtectedRoute;

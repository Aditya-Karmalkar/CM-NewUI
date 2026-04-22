import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import UniqueLoading from './ui/morph-loading';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
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
  
  if (!currentUser.emailVerified) {
    return <Navigate to="/verification-required" />;
  }
  
  return children;
};

export default ProtectedRoute;

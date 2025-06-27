import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, role }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // If user is not signed in, redirect to home
    if (!isSignedIn) {
      navigate('/');
      return;
    }

    // If a specific role is required, check if user has that role
    if (role && user?.publicMetadata?.role !== role) {
      navigate('/');
      return;
    }
  }, [isLoaded, isSignedIn, user, role, navigate]);

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not signed in, don't render children (redirect will happen in useEffect)
  if (!isSignedIn) {
    return null;
  }

  // If role is required but user doesn't have it, don't render children (redirect will happen in useEffect)
  if (role && user?.publicMetadata?.role !== role) {
    return null;
  }

  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;
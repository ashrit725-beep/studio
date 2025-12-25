'use client';
    
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

/**
 * Interface for the return value of the useUser hook.
 */
export interface UseUserResult {
  user: User | null;
  isUserLoading: boolean;
  error: Error | null;
}

/**
 * React hook to get the current authenticated user from Firebase.
 *
 * @returns {UseUserResult} Object with user, isLoading, and error state.
 */
export function useUser(): UseUserResult {
  const auth = useAuth(); 
  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  const [isUserLoading, setIsLoading] = useState<boolean>(!auth?.currentUser);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      setUser(null);
      return;
    }
    
    // Set initial state based on current user if available
    if(auth.currentUser) {
        setUser(auth.currentUser);
        setIsLoading(false);
    } else {
        setIsLoading(true);
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
      },
      (err) => {
        console.error("useUser - Auth Error:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading: isUserLoading, error };
}

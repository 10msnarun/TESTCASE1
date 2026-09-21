import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

interface DbUser {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  idToken: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  syncWithDatabase: (token: string, user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncWithDatabase = async (token: string, currentUser: User) => {
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
      }
    } catch (err) {
      console.error('Failed to sync user with PostgreSQL database:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);
          await syncWithDatabase(token, currentUser);
        } catch (e) {
          console.error('Error retrieving ID token:', e);
        }
      } else {
        setIdToken(null);
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      setIdToken(token);
      await syncWithDatabase(token, result.user);
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIdToken(null);
      setDbUser(null);
    } catch (error) {
      console.error('Sign Out failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      dbUser,
      idToken,
      loading,
      signInWithGoogle,
      signOut,
      syncWithDatabase
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

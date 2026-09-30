import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

export interface DbUser {
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
  signInWithDemoUser: (uid: string) => Promise<DbUser>;
  signInWithEmail: (email: string, displayName?: string) => Promise<DbUser>;
  signOut: () => Promise<void>;
  syncWithDatabase: (token: string, user: User) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_TOKEN_KEY = 'lis_cloud_auth_token';

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

  const refreshProfile = async () => {
    if (!idToken) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  useEffect(() => {
    // Initial restoration: check localStorage for saved token
    const restoreSession = async () => {
      const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (savedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setDbUser(data.user);
            setIdToken(savedToken);
            // Create a lightweight user representation for UI consistency
            setUser({
              uid: data.user.uid,
              email: data.user.email,
              displayName: data.user.displayName,
              photoURL: data.user.photoUrl,
            } as any);
          } else {
            localStorage.removeItem(STORAGE_TOKEN_KEY);
          }
        } catch (e) {
          console.error('Session restoration error:', e);
        }
      }
    };

    restoreSession();

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);
          localStorage.setItem(STORAGE_TOKEN_KEY, token);
          await syncWithDatabase(token, currentUser);
        } catch (e) {
          console.error('Error retrieving ID token:', e);
        }
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
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      await syncWithDatabase(token, result.user);
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const signInWithDemoUser = async (uid: string): Promise<DbUser> => {
    try {
      const res = await fetch('/api/auth/login-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to sign in as demo user');
      }

      const data = await res.json();
      setIdToken(data.token);
      setDbUser(data.user);
      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);

      setUser({
        uid: data.user.uid,
        email: data.user.email,
        displayName: data.user.displayName,
        photoURL: data.user.photoUrl,
      } as any);

      return data.user;
    } catch (error: any) {
      console.error('Sign in with demo user failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, displayName?: string): Promise<DbUser> => {
    try {
      const res = await fetch('/api/auth/login-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to sign in with email');
      }

      const data = await res.json();
      setIdToken(data.token);
      setDbUser(data.user);
      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);

      setUser({
        uid: data.user.uid,
        email: data.user.email,
        displayName: data.user.displayName,
        photoURL: data.user.photoUrl,
      } as any);

      return data.user;
    } catch (error: any) {
      console.error('Email login failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth).catch(() => {});
      localStorage.removeItem(STORAGE_TOKEN_KEY);
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
      signInWithDemoUser,
      signInWithEmail,
      signOut,
      syncWithDatabase,
      refreshProfile
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


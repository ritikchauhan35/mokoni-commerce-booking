
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { createUserProfile, getUserProfile } from '@/services';
import { User } from '@/types';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  createdAt: Date;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log('useAuth called, context:', context ? 'available' : 'undefined');
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('AuthProvider rendering');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider useEffect setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          console.log('Fetching user profile for:', firebaseUser.uid);
          // Try to get existing user profile
          let profile = await getUserProfile(firebaseUser.uid);
          console.log('Existing profile:', profile);
          
          // If no profile exists, create one with default user role
          if (!profile) {
            console.log('No profile found, creating new profile');
            const newUserData: Omit<UserProfile, 'id'> = {
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              role: 'user',
              createdAt: new Date(),
            };
            
            await createUserProfile(firebaseUser.uid, newUserData);
            console.log('Profile created, fetching again');
            profile = await getUserProfile(firebaseUser.uid);
            console.log('New profile:', profile);
          }
          
          setUserProfile(profile);
          console.log('Final user profile set:', profile);
        } catch (error) {
          console.error('Error fetching/creating user profile:', error);
          setUserProfile(null);
        }
      } else {
        console.log('No user, clearing profile');
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
  const isSuperAdmin = userProfile?.role === 'super_admin';

  console.log('Current auth state:', { user: user?.uid, userProfile, isAdmin, isSuperAdmin, loading });

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    isSuperAdmin,
    login,
    register,
    logout
  };

  console.log('AuthProvider providing value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { createUserProfile, getUserProfile } from '@/services';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.uid);
      setUser(user);
      
      if (user) {
        try {
          console.log('Fetching user profile for:', user.uid);
          // Try to get existing user profile
          let profile = await getUserProfile(user.uid);
          console.log('Existing profile:', profile);
          
          // If no profile exists, create one with default user role
          if (!profile) {
            console.log('No profile found, creating new profile');
            const newUserData: Omit<UserProfile, 'id'> = {
              name: user.displayName || '',
              email: user.email || '',
              role: 'user',
              createdAt: new Date(),
            };
            
            await createUserProfile(user.uid, newUserData);
            console.log('Profile created, fetching again');
            profile = await getUserProfile(user.uid);
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

  console.log('Current auth state:', { user: user?.uid, userProfile, isAdmin, isSuperAdmin });

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

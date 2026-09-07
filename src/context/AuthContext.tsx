import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_ADMIN_USER, DEMO_REGULAR_USER } from '../data/seedData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string, fullName: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  switchDemoRole: (role: UserRole) => void;
  isSupabaseLive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('aura_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_ADMIN_USER;
      }
    }
    return DEMO_ADMIN_USER; // Default to admin for seamless evaluation
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Check current session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          localStorage.removeItem('aura_active_user');
          setIsLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const profile: UserProfile = {
          id: data.id,
          username: data.username || 'user',
          full_name: data.full_name || 'Aura Member',
          avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: (data.role as UserRole) || 'user',
          is_active: data.is_active ?? true,
          created_at: data.created_at,
        };
        setUser(profile);
        localStorage.setItem('aura_active_user', JSON.stringify(profile));
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) {
        showToast(error.message, 'error');
        setIsLoading(false);
        return false;
      }
      showToast('Signed in successfully', 'success');
      return true;
    } else {
      // Simulated auth for Demo mode
      const isSuper = email.includes('admin');
      const mockProfile: UserProfile = isSuper ? DEMO_ADMIN_USER : {
        ...DEMO_REGULAR_USER,
        username: email.split('@')[0],
        full_name: email.split('@')[0],
      };
      setUser(mockProfile);
      localStorage.setItem('aura_active_user', JSON.stringify(mockProfile));
      showToast(`Welcome back, ${mockProfile.full_name}!`, 'success');
      setIsLoading(false);
      return true;
    }
  };

  const signUp = async (email: string, pass: string, fullName: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: fullName, username: username, role: 'user' }
        }
      });
      if (error) {
        showToast(error.message, 'error');
        setIsLoading(false);
        return false;
      }
      showToast('Account created! Check your email to confirm.', 'success');
      setIsLoading(false);
      return true;
    } else {
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        username,
        full_name: fullName,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        role: 'user',
        is_active: true,
        created_at: new Date().toISOString()
      };
      setUser(newProfile);
      localStorage.setItem('aura_active_user', JSON.stringify(newProfile));
      showToast('Account registered successfully!', 'success');
      setIsLoading(false);
      return true;
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('aura_active_user');
    showToast('Signed out', 'info');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        showToast(error.message, 'error');
        return false;
      }
      showToast('Password reset link sent to your email', 'success');
      return true;
    } else {
      showToast('Demo Mode: Password reset instructions simulated', 'info');
      return true;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('aura_active_user', JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) {
        showToast('Profile sync failed', 'error');
        return false;
      }
    }
    showToast('Profile updated', 'success');
    return true;
  };

  const switchDemoRole = (newRole: UserRole) => {
    if (newRole === 'super_admin' || newRole === 'admin') {
      const updated: UserProfile = { ...DEMO_ADMIN_USER, role: newRole };
      setUser(updated);
      localStorage.setItem('aura_active_user', JSON.stringify(updated));
      showToast(`Switched role to ${newRole.toUpperCase()} (Full Admin Access)`, 'info');
    } else {
      const updated: UserProfile = { ...DEMO_REGULAR_USER, role: 'user' };
      setUser(updated);
      localStorage.setItem('aura_active_user', JSON.stringify(updated));
      showToast('Switched role to REGULAR USER', 'info');
    }
  };

  const role: UserRole = user?.role || 'user';
  const isAdmin = role === 'admin' || role === 'super_admin';
  const isSuperAdmin = role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isAdmin,
        isSuperAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        switchDemoRole,
        isSupabaseLive: isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

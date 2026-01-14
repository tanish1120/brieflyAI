'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) throw new Error(result.error);
  };

  const signup = async (email: string, password: string, name: string) => {
    // For signup, call the API directly
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error('Signup failed');
    const user = await res.json();
    // Then sign in
    await signIn('credentials', { email, password, redirect: false });
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const deleteAccount = async () => {
    const res = await fetch('/api/auth/delete', { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user as User || null,
        isAuthenticated: !!session?.user,
        isLoading: status === 'loading',
        login,
        signup,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

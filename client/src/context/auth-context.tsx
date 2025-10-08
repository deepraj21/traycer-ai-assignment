import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { type AuthUser, signinRequest, signupRequest } from '@/utils/api';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const signup = useCallback(async (email: string, password: string) => {
    const created = await signupRequest(email, password);
    console.log(created)
  }, []);

  const signin = useCallback(async (email: string, password: string) => {
    const loggedIn = await signinRequest(email, password);
    setUser(loggedIn);
  }, []);

  const signout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signup, signin, signout }),
    [user, loading, signup, signin, signout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}



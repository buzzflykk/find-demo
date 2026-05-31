import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  nickname: string;
  avatar: string;
  membership: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (phone: string, code: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const DEMO_USER: User = {
  id: 'demo-user',
  nickname: 'Demo 用户',
  avatar: '',
  membership: 'free',
};

const DEMO_TOKEN = 'demo-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    if (token === DEMO_TOKEN) {
      setUser(DEMO_USER);
      localStorage.setItem('userId', DEMO_USER.id);
      setLoading(false);
      return;
    }
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (phone: string, code: string) => {
    setLoading(true);
    try {
      if (phone === '13800000000' && code === '123456') {
        localStorage.setItem('token', DEMO_TOKEN);
        localStorage.setItem('userId', DEMO_USER.id);
        setUser(DEMO_USER);
        return;
      }
      const { token, userId } = await api.login(phone, code);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      await refresh();
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

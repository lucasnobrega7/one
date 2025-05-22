'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  created_at: string;
}

interface Organization {
  id: string;
  name: string;
  plan: string;
  owner_email: string;
  settings: any;
}

interface AuthState {
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    organization: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await apiClient.verifyToken();

      if (response.data?.user) {
        const user = response.data.user;

        const orgResponse = await apiClient.queryTable(
          'organizations',
          '*',
          { owner_email: user.email },
          1
        );

        setState({
          user,
          organization: orgResponse.data?.[0] || null,
          loading: false,
          isAuthenticated: true,
        });
      } else {
        setState(prev => ({ ...prev, loading: false, isAuthenticated: false }));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setState(prev => ({ ...prev, loading: false, isAuthenticated: false }));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password);
      if (response.data?.user && response.data?.token) {
        await checkAuthStatus();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setState({ user: null, organization: null, loading: false, isAuthenticated: false });
    }
  };

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

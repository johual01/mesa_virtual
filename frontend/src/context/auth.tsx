import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authService } from '@/services/authService';

interface User {
  _id: string;
  id?: string; // Para compatibilidad
  user: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      Cookies.remove('jwt');
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const data = await authService.refresh();
      localStorage.setItem('token', data.token);
      
      // Mantener el usuario actual si existe
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const savedUser = JSON.parse(userStr);
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    // Intentar cargar usuario desde localStorage primero
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const savedUser = JSON.parse(userStr);
        setUser(savedUser);
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }

    // Luego verificar refresh token
    const refreshToken = Cookies.get('jwt');
    if (refreshToken) {
      refreshAccessToken();
    }
  }, [refreshAccessToken]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const data = await authService.login({ email, password, rememberMe });

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
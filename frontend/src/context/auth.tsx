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
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const data = await authService.refresh();
      localStorage.setItem('token', data.token);
      
      // Mantener el usuario actual si existe
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const savedUser = JSON.parse(userStr);
        setUser(savedUser);
      }
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Intentar cargar usuario desde localStorage primero
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userStr && token) {
        try {
          const savedUser = JSON.parse(userStr);
          setUser(savedUser);
          
          // Intentar renovar el token en segundo plano, pero no fallar si no se puede
          const refreshToken = Cookies.get('jwt');
          if (refreshToken) {
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
              // Si el refresh falla pero tenemos token local, mantener la sesión
              // El token local puede seguir siendo válido
              console.log('Refresh failed, using cached session');
            }
          }
        } catch (e) {
          console.error('Error parsing saved user:', e);
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        // No hay sesión guardada, verificar si hay refresh token
        const refreshToken = Cookies.get('jwt');
        if (refreshToken) {
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            // Limpiar cookie inválida
            Cookies.remove('jwt');
          }
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
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
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
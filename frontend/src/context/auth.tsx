import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';

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

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    Cookies.remove('jwt');
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_URL_API + '/auth/refresh', {
      method: 'GET',
      credentials: 'include', // Esto asegura que las cookies se envíen con la solicitud
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } else {
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
    const response = await fetch(process.env.NEXT_PUBLIC_URL_API + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
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
import {
  LoginData,
  SignupData,
  AuthResponse,
  RefreshResponse,
  ResetPasswordData
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_API || 'http://localhost:3001';

export const authService = {
  /**
   * POST /auth/login
   * Inicia sesión de usuario
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errMsg || errorData.message || 'Error al iniciar sesión');
    }

    return response.json();
  },

  /**
   * POST /auth/signup
   * Registra un nuevo usuario
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errMsg || errorData.message || 'Error al registrar usuario');
    }

    return response.json();
  },

  /**
   * GET /auth/refresh
   * Renueva el access token usando el refresh token de la cookie
   */
  async refresh(): Promise<RefreshResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al renovar el token');
    }

    return response.json();
  },

  /**
   * GET /auth/logout
   * Cierra la sesión eliminando la cookie del refresh token
   */
  async logout(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }

    return response.json();
  },

  /**
   * POST /auth/forgot-password
   * Envía un correo de recuperación de contraseña
   * Nota: Por seguridad, siempre devuelve 200 aunque el email no exista
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errMsg || errorData.message || 'Error al enviar correo de recuperación');
    }

    return response.json();
  },

  /**
   * POST /auth/reset-password
   * Restablece la contraseña usando el token de recuperación
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errMsg || errorData.message || 'Error al restablecer contraseña');
    }

    return response.json();
  },
};

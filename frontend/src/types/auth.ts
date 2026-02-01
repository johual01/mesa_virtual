// Tipos de autenticación según documentación de API

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  user: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface RefreshResponse {
  token: string;
}

export interface ResetPasswordData {
  password: string;
  token: string;
}

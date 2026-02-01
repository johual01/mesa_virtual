// Tipos de perfil de usuario según documentación de API

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  joinDate: Date;
  pictureRoute?: string;
}

export interface AlterProfileData {
  username: string;
  email: string;
  currentPassword: string;
  password?: string;
  imageUrl?: string;
  image?: File;
}

export interface AlterProfileResponse {
  message: string;
  user: {
    _id: string;
    user: string;
    email: string;
  };
  token: string;
}

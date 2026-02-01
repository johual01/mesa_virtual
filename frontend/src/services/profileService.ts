import { apiService } from '@/lib/api';
import { UserProfile, AlterProfileData, AlterProfileResponse } from '@/types/profile';

export const profileService = {
  /**
   * GET /api/getProfile/:userId
   * Obtiene el perfil del usuario
   */
  async getProfile(userId: string): Promise<UserProfile> {
    return apiService.get<UserProfile>(`/api/getProfile/${userId}`);
  },

  /**
   * PATCH /api/alterProfile/:userId
   * Modifica el perfil del usuario usando FormData para soportar subida de imágenes
   */
  async alterProfile(userId: string, data: AlterProfileData): Promise<AlterProfileResponse> {
    const formData = new FormData();
    
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('currentPassword', data.currentPassword);
    
    if (data.password) {
      formData.append('password', data.password);
    }
    
    // Si hay un archivo de imagen, agregarlo al FormData
    if (data.image) {
      formData.append('image', data.image);
    } else if (data.imageUrl && data.imageUrl.startsWith('http')) {
      // Si es una URL externa, enviarla como texto
      formData.append('imageUrl', data.imageUrl);
    }
    
    return apiService.patchFormData<AlterProfileResponse>(`/api/alterProfile/${userId}`, formData);
  }
};

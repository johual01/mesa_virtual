import { apiService } from '@/lib/api';

export const profileService = {
  // Obtener perfil del usuario
  async getProfile(userId: string): Promise<unknown> {
    return apiService.get(`/api/getProfile/${userId}`);
  },

  // Actualizar perfil del usuario
  async alterProfile(userId: string, data: unknown): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/alterProfile/${userId}`, data);
  }
};

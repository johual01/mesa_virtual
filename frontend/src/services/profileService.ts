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
   * Modifica el perfil del usuario
   */
  async alterProfile(userId: string, data: AlterProfileData): Promise<AlterProfileResponse> {
    return apiService.patch<AlterProfileResponse>(`/api/alterProfile/${userId}`, data);
  }
};

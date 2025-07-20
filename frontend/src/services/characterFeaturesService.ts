import { apiService } from '@/lib/api';

export const characterFeaturesService = {
  // Cambiar estado de una característica (activa/inactiva)
  async changeFeatureStatus(characterId: string, featureId: string, data: unknown): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/changeFeatureStatus/${characterId}/${featureId}`, data);
  },

  // Agregar característica personalizada
  async addCustomFeature(characterId: string, data: unknown): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/addCustomFeature/${characterId}`, data);
  },

  // Editar característica personalizada
  async editCustomFeature(characterId: string, featureId: string, data: unknown): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/editCustomFeature/${characterId}/${featureId}`, data);
  }
};

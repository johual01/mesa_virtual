import { apiService } from '@/lib/api';
import {
  ChangeFeatureStatusData,
  AddCustomFeatureData,
  EditCustomFeatureData,
  CustomFeatureResponse
} from '@/types/character';

export const characterFeaturesService = {
  /**
   * POST /api/changeFeatureStatus/:characterId/:featureId
   * Cambia el estado de un rasgo (activo/inactivo)
   */
  async changeFeatureStatus(
    characterId: string,
    featureId: string,
    data: ChangeFeatureStatusData
  ): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(
      `/api/changeFeatureStatus/${characterId}/${featureId}`,
      data
    );
  },

  /**
   * POST /api/addCustomFeature/:characterId
   * Añade un rasgo personalizado
   */
  async addCustomFeature(
    characterId: string,
    data: AddCustomFeatureData
  ): Promise<CustomFeatureResponse> {
    return apiService.post<CustomFeatureResponse>(
      `/api/addCustomFeature/${characterId}`,
      data
    );
  },

  /**
   * PATCH /api/editCustomFeature/:characterId/:featureId
   * Edita un rasgo personalizado
   */
  async editCustomFeature(
    characterId: string,
    featureId: string,
    data: EditCustomFeatureData
  ): Promise<CustomFeatureResponse> {
    return apiService.patch<CustomFeatureResponse>(
      `/api/editCustomFeature/${characterId}/${featureId}`,
      data
    );
  }
};

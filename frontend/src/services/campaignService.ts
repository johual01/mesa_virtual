import { apiService } from '@/lib/api';
import {
  CreateCampaignData,
  GetCampaignsResponse,
  GetCampaignResponse,
  CampaignMutationResponse,
  RegisterMutationResponse,
  AddRegisterData,
  UpdateRegisterData,
  RemoveFromCampaignData
} from '@/types/campaign';

export const campaignService = {
  /**
   * POST /api/getCampaigns
   * Obtiene las campañas del usuario (como dueño o jugador)
   */
  async getCampaigns(): Promise<GetCampaignsResponse> {
    return apiService.post<GetCampaignsResponse>('/api/getCampaigns');
  },

  /**
   * PUT /api/createCampaign
   * Crea una nueva campaña
   */
  async createCampaign(data: CreateCampaignData): Promise<CampaignMutationResponse> {
    return apiService.put<CampaignMutationResponse>('/api/createCampaign', data);
  },

  /**
   * GET /api/getCampaign/:userId/:campaignId
   * Abre una campaña específica con toda su información
   */
  async getCampaign(campaignId: string): Promise<GetCampaignResponse> {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?._id || user?.id;
    
    if (!userId) {
      throw new Error('Usuario no encontrado');
    }
    
    return apiService.get<GetCampaignResponse>(`/api/getCampaign/${userId}/${campaignId}`);
  },

  /**
   * PATCH /api/editCampaign/:campaignId
   * Edita una campaña existente
   */
  async editCampaign(campaignId: string, data: CreateCampaignData): Promise<CampaignMutationResponse> {
    return apiService.patch<CampaignMutationResponse>(`/api/editCampaign/${campaignId}`, data);
  },

  /**
   * POST /api/joinCampaign/:campaignId
   * Une al usuario a una campaña
   */
  async joinCampaign(campaignId: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/joinCampaign/${campaignId}`);
  },

  /**
   * POST /api/removeFromCampaign
   * Remueve a un jugador de una campaña
   */
  async removeFromCampaign(data: RemoveFromCampaignData): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/api/removeFromCampaign', data);
  },

  /**
   * POST /api/deleteCampaign/:campaignId
   * Elimina una campaña (soft delete)
   */
  async deleteCampaign(campaignId: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/deleteCampaign/${campaignId}`);
  },

  /**
   * PUT /api/addRegister/:campaignId
   * Añade una nota/registro a la campaña
   */
  async addRegister(campaignId: string, data: Omit<AddRegisterData, 'campaignId'>): Promise<RegisterMutationResponse> {
    return apiService.put<RegisterMutationResponse>(`/api/addRegister/${campaignId}`, {
      ...data,
      campaignId
    });
  },

  /**
   * PATCH /api/updateRegister/:registerId
   * Actualiza una nota/registro existente
   */
  async updateRegister(registerId: string, data: UpdateRegisterData): Promise<RegisterMutationResponse> {
    return apiService.patch<RegisterMutationResponse>(`/api/updateRegister/${registerId}`, data);
  },

  /**
   * DELETE /api/deleteRegister/:registerId
   * Elimina una nota/registro (soft delete)
   */
  async deleteRegister(registerId: string, campaignId: string): Promise<{ message: string }> {
    return apiService.deleteWithBody<{ message: string }>(`/api/deleteRegister/${registerId}`, { campaignId });
  }
};

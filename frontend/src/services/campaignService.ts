import { apiService } from '@/lib/api';
import { Campaign, CampaignSummary, CreateCampaignData } from '@/types/campaign';

export const campaignService = {
  // Obtener todas las campañas del usuario
  async getCampaigns(): Promise<{ campanas: CampaignSummary[] }> {
    return apiService.post<{ campanas: CampaignSummary[] }>('/api/getCampaigns');
  },

  // Crear nueva campaña
  async createCampaign(data: CreateCampaignData): Promise<{ message: string; campaign: Campaign }> {
    return apiService.put<{ message: string; campaign: Campaign }>('/api/createCampaign', data);
  },

  // Obtener detalles de una campaña específica
  async getCampaign(campaignId: string): Promise<Campaign> {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;
    
    if (!userId) {
      throw new Error('Usuario no encontrado');
    }
    
    return apiService.get<Campaign>(`/api/getCampaign/${userId}/${campaignId}`);
  },

  // Editar campaña
  async editCampaign(campaignId: string, data: Partial<CreateCampaignData>): Promise<{ message: string; campaign: Campaign }> {
    return apiService.patch<{ message: string; campaign: Campaign }>(`/api/editCampaign/${campaignId}`, data);
  },

  // Unirse a una campaña
  async joinCampaign(campaignId: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/joinCampaign/${campaignId}`);
  },

  // Eliminar campaña
  async deleteCampaign(campaignId: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/deleteCampana/${campaignId}`);
  },

  // Agregar registro/nota a campaña
  async addRegister(campaignId: string, data: { title: string; content: string; isPublic: boolean }): Promise<{ message: string }> {
    return apiService.put<{ message: string }>(`/api/addRegister/${campaignId}`, data);
  },

  // Actualizar registro/nota
  async updateRegister(registerId: string, data: { title: string; content: string; isPublic: boolean }): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/updateRegister/${registerId}`, data);
  },

  // Eliminar registro/nota
  async deleteRegister(registerId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/deleteRegister/${registerId}`);
  },

  // Remover jugador de campaña
  async removeFromCampaign(data: { campaignId: string; playerId: string }): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/api/removeFromCampaign', data);
  }
};

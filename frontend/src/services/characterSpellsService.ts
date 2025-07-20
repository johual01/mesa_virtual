import { apiService } from '@/lib/api';

export const characterSpellsService = {
  // Preparar/despreparar hechizo
  async prepareSpell(characterId: string, spellId: string, data: unknown): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/prepareSpell/${characterId}/${spellId}`, data);
  },

  // Limpiar todos los hechizos preparados
  async clearPreparedSpells(characterId: string, data: unknown): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/clearPreparedSpells/${characterId}`, data);
  },

  // Agregar hechizo personalizado
  async addCustomSpell(characterId: string, data: unknown): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/addCustomSpell/${characterId}`, data);
  },

  // Editar hechizo personalizado
  async editCustomSpell(characterId: string, spellId: string, data: unknown): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/editCustomSpell/${characterId}/${spellId}`, data);
  },

  // Eliminar hechizo personalizado
  async deleteCustomSpell(characterId: string, spellId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/deleteCustomSpell/${characterId}/${spellId}`);
  }
};

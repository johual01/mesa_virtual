import { apiService } from '@/lib/api';
import {
  AddCustomSpellData,
  EditCustomSpellData,
  SpellMutationResponse
} from '@/types/character';

export const characterSpellsService = {
  /**
   * POST /api/prepareSpell/:characterId/:spellId
   * Prepara un hechizo
   */
  async prepareSpell(characterId: string, spellId: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/prepareSpell/${characterId}/${spellId}`);
  },

  /**
   * POST /api/clearPreparedSpells/:characterId
   * Limpia todos los hechizos preparados
   */
  async clearPreparedSpells(characterId: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/clearPreparedSpells/${characterId}`);
  },

  /**
   * POST /api/addCustomSpell/:characterId
   * Añade un hechizo personalizado
   */
  async addCustomSpell(characterId: string, data: AddCustomSpellData): Promise<SpellMutationResponse> {
    return apiService.post<SpellMutationResponse>(`/api/addCustomSpell/${characterId}`, data);
  },

  /**
   * PATCH /api/editCustomSpell/:characterId/:spellId
   * Edita un hechizo personalizado
   */
  async editCustomSpell(
    characterId: string,
    spellId: string,
    data: EditCustomSpellData
  ): Promise<SpellMutationResponse> {
    return apiService.patch<SpellMutationResponse>(
      `/api/editCustomSpell/${characterId}/${spellId}`,
      data
    );
  },

  /**
   * DELETE /api/deleteCustomSpell/:characterId/:spellId
   * Elimina un hechizo personalizado (soft delete)
   */
  async deleteCustomSpell(characterId: string, spellId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/deleteCustomSpell/${characterId}/${spellId}`);
  }
};

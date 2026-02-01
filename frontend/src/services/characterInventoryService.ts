import { apiService } from '@/lib/api';
import {
  GetDefaultItemsResponse,
  AddItemData,
  ItemMutationResponse
} from '@/types/character';

export const characterInventoryService = {
  /**
   * GET /api/getDefaultItems/:characterId
   * Obtiene items predeterminados y del personaje
   */
  async getDefaultItems(characterId: string): Promise<GetDefaultItemsResponse> {
    return apiService.get<GetDefaultItemsResponse>(`/api/getDefaultItems/${characterId}`);
  },

  /**
   * POST /api/addItem/:characterId
   * Añade un item al inventario
   */
  async addItem(characterId: string, data: AddItemData): Promise<ItemMutationResponse> {
    return apiService.post<ItemMutationResponse>(`/api/addItem/${characterId}`, data);
  },

  /**
   * PATCH /api/editItem/:characterId/:itemId
   * Edita un item del inventario
   */
  async editItem(
    characterId: string,
    itemId: string,
    data: AddItemData
  ): Promise<ItemMutationResponse> {
    return apiService.patch<ItemMutationResponse>(`/api/editItem/${characterId}/${itemId}`, data);
  },

  /**
   * DELETE /api/deleteItem/:characterId/:itemId
   * Elimina un item del inventario (soft delete)
   */
  async deleteItem(characterId: string, itemId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/deleteItem/${characterId}/${itemId}`);
  }
};

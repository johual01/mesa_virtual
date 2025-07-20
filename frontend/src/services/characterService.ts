import { apiService } from '@/lib/api';
import { Character, CharacterSummary, CreateCharacterData, CharacterCreateInfo } from '@/types/character';

export const characterService = {
  // Obtener información para crear personaje (elementos, estados, clases, etc.)
  async getCreateCharacterInfo(): Promise<CharacterCreateInfo> {
    return apiService.getWithBody<CharacterCreateInfo>('/api/getCreateCharacterInfo');
  },

  // Crear nuevo personaje
  async createCharacter(data: CreateCharacterData): Promise<{ message: string; character: Character }> {
    return apiService.post<{ message: string; character: Character }>('/api/createCharacter', data);
  },

  // Obtener todos los personajes del usuario
  async getCharacters(): Promise<{ characters: CharacterSummary[] }> {
    return apiService.post<{ characters: CharacterSummary[] }>('/api/getCharacters');
  },

  // Obtener detalles de un personaje específico
  async getCharacter(characterId: string): Promise<Character> {
    return apiService.get<Character>(`/api/getCharacter/${characterId}`);
  },

  // Editar personaje
  async editCharacter(characterId: string, data: Partial<CreateCharacterData>): Promise<{ message: string; character: Character }> {
    return apiService.patch<{ message: string; character: Character }>(`/api/editCharacter/${characterId}`, data);
  },

  // Eliminar personaje
  async deleteCharacter(characterId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/deleteCharacter/${characterId}`);
  },

  // Actualizar experiencia
  async updateXP(characterId: string, xp: number): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/updateXP/${characterId}`, { xp });
  },

  // Actualizar dinero
  async updateMoney(characterId: string, money: number): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/updateMoney/${characterId}`, { money });
  },

  // Subir nivel
  async levelUp(characterId: string, data: unknown): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/levelUp/${characterId}`, data);
  },

  // Obtener información para subir nivel
  async getLevelUpInfo(characterId: string): Promise<unknown> {
    return apiService.getWithBody(`/api/getLevelUpInfo/${characterId}`);
  },

  // Obtener características secundarias
  async getSecondaryFeatures(characterId: string): Promise<unknown> {
    return apiService.getWithBody(`/api/getSecondaryFeatures/${characterId}`);
  },

  // INVENTARIO
  // Obtener items por defecto y del personaje
  async getDefaultItems(characterId: string): Promise<unknown> {
    return apiService.get(`/api/getDefaultItems/${characterId}`);
  },

  // Agregar item al inventario
  async addItem(characterId: string, data: unknown): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/api/addItem/${characterId}`, data);
  },

  // Editar item del inventario
  async editItem(characterId: string, itemId: string, data: unknown): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/editItem/${characterId}/${itemId}`, data);
  },

  // Eliminar item del inventario
  async deleteItem(characterId: string, itemId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/deleteItem/${characterId}/${itemId}`);
  }
};

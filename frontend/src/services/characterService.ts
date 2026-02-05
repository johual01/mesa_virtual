import { apiService } from '@/lib/api';
import {
  Character,
  CharacterSummary,
  CreateCharacterData,
  CharacterCreateInfo,
  CharacterState,
  EditCharacterData,
  LevelUpInfo,
  LevelUpData,
  SecondaryFeaturesResponse,
  Inspiration,
  AddModifierData
} from '@/types/character';

// Tipos de respuesta según documentación
interface GetCharactersResponse {
  characters: CharacterSummary[];
}

interface GetCharactersRequest {
  origin: 'user' | 'campaign';
  state?: CharacterState;
  campaignId?: string;
}

export const characterService = {
  /**
   * GET /api/getCreateCharacterInfo
   * Obtiene información necesaria para crear un personaje
   */
  async getCreateCharacterInfo(): Promise<CharacterCreateInfo> {
    return apiService.get<CharacterCreateInfo>('/api/getCreateCharacterInfo');
  },

  /**
   * POST /api/createCharacter
   * Crea un nuevo personaje usando FormData para soportar subida de imágenes
   */
  async createCharacter(data: CreateCharacterData): Promise<{ message: string; characterId: string }> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('system', data.system);
    formData.append('state', data.state);
    formData.append('backstory', JSON.stringify(data.backstory));
    formData.append('characterClass', data.characterClass);
    formData.append('persona', data.persona);
    formData.append('money', String(data.money));
    formData.append('stadistics', JSON.stringify(data.stadistics));
    formData.append('proficency', JSON.stringify(data.proficency));
    formData.append('element', data.element);
    formData.append('weakness', data.weakness);
    
    // Si hay un archivo de imagen, agregarlo al FormData
    if (data.image) {
      formData.append('image', data.image);
    } else if (data.imageUrl && data.imageUrl.startsWith('http')) {
      formData.append('pictureRoute', data.imageUrl);
    }
    
    return apiService.postFormData<{ message: string; characterId: string }>('/api/createCharacter', formData);
  },

  /**
   * POST /api/getCharacters
   * Obtiene los personajes según el origen
   */
  async getCharacters(params: GetCharactersRequest = { origin: 'user' }): Promise<CharacterSummary[]> {
    const response = await apiService.post<GetCharactersResponse>('/api/getCharacters', params);
    return response.characters || response as unknown as CharacterSummary[];
  },

  /**
   * GET /api/getCharacter/:characterId
   * Obtiene los datos completos de un personaje
   */
  async getCharacter(characterId: string): Promise<Character> {
    return apiService.get<Character>(`/api/getCharacter/${characterId}`);
  },

  /**
   * PATCH /api/editCharacter/:characterId
   * Edita un personaje existente usando FormData para soportar subida de imágenes
   */
  async editCharacter(characterId: string, data: EditCharacterData): Promise<{ message: string }> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('state', data.state);
    formData.append('backstory', JSON.stringify(data.backstory));
    formData.append('persona', data.persona);
    formData.append('money', String(data.money));
    formData.append('stadistics', JSON.stringify(data.stadistics));
    formData.append('element', data.element);
    formData.append('weakness', data.weakness);
    
    // Si hay un archivo de imagen, agregarlo al FormData
    if (data.image) {
      formData.append('image', data.image);
    } else if (data.imageUrl && data.imageUrl.startsWith('http')) {
      formData.append('pictureRoute', data.imageUrl);
    }
    
    return apiService.patchFormData<{ message: string }>(`/api/editCharacter/${characterId}`, formData);
  },

  /**
   * DELETE /api/deleteCharacter/:characterId
   * Elimina un personaje (soft delete)
   */
  async deleteCharacter(characterId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/deleteCharacter/${characterId}`);
  },

  /**
   * PATCH /api/updateXP/:characterId
   * Actualiza la experiencia del personaje
   */
  async updateXP(characterId: string, xp: number): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/updateXP/${characterId}`, { xp });
  },

  /**
   * PATCH /api/updateMoney/:characterId
   * Actualiza el dinero del personaje
   */
  async updateMoney(characterId: string, money: number): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/updateMoney/${characterId}`, { money });
  },

  /**
   * PATCH /api/updateInspiration/:characterId
   * Actualiza la inspiración del personaje
   */
  async updateInspiration(characterId: string, inspiration: Inspiration): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/updateInspiration/${characterId}`, { inspiration });
  },

  /**
   * GET /api/getLevelUpInfo/:characterId
   * Obtiene información para subir de nivel
   */
  async getLevelUpInfo(characterId: string): Promise<LevelUpInfo> {
    return apiService.get<LevelUpInfo>(`/api/getLevelUpInfo/${characterId}`);
  },

  /**
   * PATCH /api/levelUp/:characterId
   * Sube de nivel al personaje
   */
  async levelUp(characterId: string, data: LevelUpData): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/levelUp/${characterId}`, data);
  },

  /**
   * GET /api/getSecondaryFeatures/:characterId
   * Obtiene las habilidades secundarias disponibles
   */
  async getSecondaryFeatures(characterId: string): Promise<SecondaryFeaturesResponse> {
    return apiService.get<SecondaryFeaturesResponse>(`/api/getSecondaryFeatures/${characterId}`);
  },

  /**
   * PATCH /api/updateSelectedSecondaryFeatures/:characterId
   * Actualiza las habilidades secundarias seleccionadas
   */
  async updateSelectedSecondaryFeatures(characterId: string, selectedSecondaryFeatures: string[]): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/updateSelectedSecondaryFeatures/${characterId}`, {
      selectedSecondaryFeatures
    });
  },

  /**
   * PATCH /api/addCustomModifier/:characterId
   * Añade un modificador personalizado al personaje
   */
  async addCustomModifier(characterId: string, data: AddModifierData): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/addCustomModifier/${characterId}`, data);
  },

  /**
   * PATCH /api/removeCustomModifier/:characterId/:modifierId
   * Elimina un modificador personalizado
   */
  async removeCustomModifier(characterId: string, modifierId: string): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(`/api/removeCustomModifier/${characterId}/${modifierId}`);
  }
};

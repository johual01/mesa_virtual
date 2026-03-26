import { apiService } from '@/lib/api';
import type { PersonaD20Class, PersonaD20ClassesResponse } from '@/types/personaD20';

export const personaD20Service = {
  async getClasses(search?: string): Promise<PersonaD20Class[]> {
    const params = new URLSearchParams();

    if (search?.trim()) {
      params.set('search', search.trim());
    }

    const query = params.toString();
    const endpoint = query ? `/api/personaD20/classes?${query}` : '/api/personaD20/classes';
    const response = await apiService.get<PersonaD20ClassesResponse>(endpoint);

    return response.classes;
  },
};

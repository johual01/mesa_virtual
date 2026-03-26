import { useCallback, useEffect, useState } from 'react';
import { personaD20Service } from '@/services/personaD20Service';
import type { PersonaD20Class } from '@/types/personaD20';

export const usePersonaD20Classes = (initialSearch = '') => {
  const [classes, setClasses] = useState<PersonaD20Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await personaD20Service.getClasses(search);
      setClasses(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses(initialSearch);
  }, [fetchClasses, initialSearch]);

  return {
    classes,
    loading,
    error,
    fetchClasses,
  };
};

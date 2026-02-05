import { useState, useEffect, useCallback } from 'react';
import { characterService } from '@/services/characterService';
import { LevelUpInfo, LevelUpData, Element, Stadistics } from '@/types/character';

interface UseCharacterLevelUpOptions {
  characterId: string | null;
}

interface UseCharacterLevelUpReturn {
  levelUpInfo: LevelUpInfo | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  refetch: () => Promise<void>;
  submitLevelUp: (data: LevelUpData) => Promise<boolean>;
}

export const useCharacterLevelUp = ({ characterId }: UseCharacterLevelUpOptions): UseCharacterLevelUpReturn => {
  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchLevelUpInfo = useCallback(async () => {
    if (!characterId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await characterService.getLevelUpInfo(characterId);
      setLevelUpInfo(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar información de subida de nivel';
      setError(errorMessage);
      setLevelUpInfo(null);
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  useEffect(() => {
    fetchLevelUpInfo();
  }, [fetchLevelUpInfo]);

  const submitLevelUp = useCallback(async (data: LevelUpData): Promise<boolean> => {
    if (!characterId) {
      setError('ID de personaje no disponible');
      return false;
    }

    try {
      setSubmitting(true);
      setError(null);
      await characterService.levelUp(characterId, data);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir de nivel';
      setError(errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [characterId]);

  return {
    levelUpInfo,
    loading,
    error,
    submitting,
    refetch: fetchLevelUpInfo,
    submitLevelUp,
  };
};

// Hook auxiliar para manejar el formulario de subida de nivel
interface UseLevelUpFormOptions {
  levelUpInfo: LevelUpInfo | null;
}

interface UseLevelUpFormReturn {
  formData: LevelUpData;
  setNewHP: (hp: number) => void;
  setSelectedSubclass: (subclassId: string) => void;
  setSelectedSecondaryFeatures: (features: string[]) => void;
  toggleSecondaryFeature: (featureId: string) => void;
  setSelectedSecondaryAffinity: (affinity: Element) => void;
  setSelectedStats: (stats: Partial<Stadistics>) => void;
  incrementStat: (stat: keyof Stadistics) => void;
  decrementStat: (stat: keyof Stadistics) => void;
  remainingStatPoints: number;
  isFormValid: () => boolean;
  resetForm: () => void;
}

const STAT_POINTS_PER_IMPROVEMENT = 2;

export const useLevelUpForm = ({ levelUpInfo }: UseLevelUpFormOptions): UseLevelUpFormReturn => {
  const [formData, setFormData] = useState<LevelUpData>({
    newHP: 0,
    selectedSubclass: undefined,
    selectedSecondaryFeatures: [],
    selectedSecondaryAffinity: undefined,
    selectedStats: {
      courage: 0,
      dexterity: 0,
      instincts: 0,
      knowledge: 0,
      charisma: 0,
    },
  });

  // Reset form cuando cambia levelUpInfo
  useEffect(() => {
    setFormData({
      newHP: 0,
      selectedSubclass: undefined,
      selectedSecondaryFeatures: [],
      selectedSecondaryAffinity: undefined,
      selectedStats: {
        courage: 0,
        dexterity: 0,
        instincts: 0,
        knowledge: 0,
        charisma: 0,
      },
    });
  }, [levelUpInfo]);

  const setNewHP = (hp: number) => {
    setFormData(prev => ({ ...prev, newHP: hp }));
  };

  const setSelectedSubclass = (subclassId: string) => {
    setFormData(prev => ({ ...prev, selectedSubclass: subclassId }));
  };

  const setSelectedSecondaryFeatures = (features: string[]) => {
    setFormData(prev => ({ ...prev, selectedSecondaryFeatures: features }));
  };

  const toggleSecondaryFeature = (featureId: string) => {
    setFormData(prev => {
      const current = prev.selectedSecondaryFeatures || [];
      const isSelected = current.includes(featureId);
      
      if (isSelected) {
        return {
          ...prev,
          selectedSecondaryFeatures: current.filter(id => id !== featureId),
        };
      } else {
        return {
          ...prev,
          selectedSecondaryFeatures: [...current, featureId],
        };
      }
    });
  };

  const setSelectedSecondaryAffinity = (affinity: Element) => {
    setFormData(prev => ({ ...prev, selectedSecondaryAffinity: affinity }));
  };

  const setSelectedStats = (stats: Partial<Stadistics>) => {
    setFormData(prev => ({ ...prev, selectedStats: stats }));
  };

  const getTotalStatPoints = (): number => {
    const stats = formData.selectedStats || {};
    return Object.values(stats).reduce((sum: number, val) => sum + (val || 0), 0);
  };

  const remainingStatPoints = STAT_POINTS_PER_IMPROVEMENT - getTotalStatPoints();

  const incrementStat = (stat: keyof Stadistics) => {
    if (remainingStatPoints <= 0) return;
    
    setFormData(prev => ({
      ...prev,
      selectedStats: {
        ...prev.selectedStats,
        [stat]: (prev.selectedStats?.[stat] || 0) + 1,
      },
    }));
  };

  const decrementStat = (stat: keyof Stadistics) => {
    const currentValue = formData.selectedStats?.[stat] || 0;
    if (currentValue <= 0) return;
    
    setFormData(prev => ({
      ...prev,
      selectedStats: {
        ...prev.selectedStats,
        [stat]: currentValue - 1,
      },
    }));
  };

  const isFormValid = (): boolean => {
    if (!levelUpInfo) return false;

    // HP siempre es requerido y debe ser mayor a 0
    if (formData.newHP <= 0) return false;

    // Si debe elegir subclase, debe estar seleccionada
    if (levelUpInfo.shouldChooseSubclass && !formData.selectedSubclass) {
      return false;
    }

    // Si debe elegir habilidades secundarias, debe haber al menos una seleccionada
    if (levelUpInfo.shouldChooseSecondaryFeatures) {
      const selectedCount = formData.selectedSecondaryFeatures?.length || 0;
      if (selectedCount === 0) return false;
    }

    // Si debe elegir afinidad secundaria, debe estar seleccionada
    if (levelUpInfo.shouldChooseSecondaryAffinities && !formData.selectedSecondaryAffinity) {
      return false;
    }

    // Si debe elegir mejora de estadísticas, deben estar todos los puntos usados
    if (levelUpInfo.shouldChooseStatImprovement && remainingStatPoints > 0) {
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      newHP: 0,
      selectedSubclass: undefined,
      selectedSecondaryFeatures: [],
      selectedSecondaryAffinity: undefined,
      selectedStats: {
        courage: 0,
        dexterity: 0,
        instincts: 0,
        knowledge: 0,
        charisma: 0,
      },
    });
  };

  return {
    formData,
    setNewHP,
    setSelectedSubclass,
    setSelectedSecondaryFeatures,
    toggleSecondaryFeature,
    setSelectedSecondaryAffinity,
    setSelectedStats,
    incrementStat,
    decrementStat,
    remainingStatPoints,
    isFormValid,
    resetForm,
  };
};

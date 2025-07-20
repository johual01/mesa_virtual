import { useState, useEffect } from 'react';
import { characterService } from '@/services/characterService';
import { CharacterSummary, Character, CharacterCreateInfo } from '@/types/character';

export const useCharacters = () => {
  const [characters, setCharacters] = useState<CharacterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await characterService.getCharacters();
      setCharacters(response.characters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar personajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return {
    characters,
    loading,
    error,
    refetch: fetchCharacters
  };
};

export const useCharacter = (characterId: string | null) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await characterService.getCharacter(id);
      setCharacter(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar personaje');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (characterId) {
      fetchCharacter(characterId);
    }
  }, [characterId]);

  return {
    character,
    loading,
    error,
    refetch: characterId ? () => fetchCharacter(characterId) : undefined
  };
};

export const useCharacterCreateInfo = () => {
  const [createInfo, setCreateInfo] = useState<CharacterCreateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreateInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await characterService.getCreateCharacterInfo();
      setCreateInfo(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreateInfo();
  }, []);

  return {
    createInfo,
    loading,
    error,
    refetch: fetchCreateInfo
  };
};

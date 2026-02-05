"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCharacterCreateInfo } from "@/hooks/useCharacters";
import { useNotificationContext } from "@/context/notifications";
import { characterService } from "@/services/characterService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CharacterState, System, CreateCharacterData, Element, Stadistics } from "@/types/character";
import { usePageTitle } from "@/hooks/usePageTitle";
import { CharacterForm, CharacterFormData } from "@/components/characters/CharacterForm";

export default function CreateCharacterPage() {
  usePageTitle("Crear Personaje");
  
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { createInfo, loading: infoLoading } = useCharacterCreateInfo();
  const { success, error: notifyError } = useNotificationContext();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CharacterFormData>({
    name: "",
    state: CharacterState.ACTIVE,
    backstory: {
      history: "",
      personality: "",
      appearance: "",
      traits: "",
      defects: "",
      ideals: "",
      dreams: "",
      bonds: "",
      trauma: ""
    },
    pictureRoute: "",
    characterClass: "",
    persona: "",
    money: 0,
    stadistics: {
      courage: 10,
      dexterity: 10,
      instincts: 10,
      knowledge: 10,
      charisma: 10
    },
    proficency: [],
    element: Element.FIRE,
    weakness: Element.ICE
  });
  const [campaignId, setCampaignId] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      notifyError("Campo requerido", "El nombre es obligatorio");
      return;
    }
    if (!formData.characterClass) {
      notifyError("Campo requerido", "La clase es obligatoria");
      return;
    }
    if (!formData.persona.trim()) {
      notifyError("Campo requerido", "El nombre de la Persona es obligatorio");
      return;
    }
    if (formData.proficency.length === 0) {
      notifyError("Campo requerido", "Debes seleccionar al menos una proficiencia");
      return;
    }

    setLoading(true);

    try {
      const createData: CreateCharacterData = {
        ...formData,
        system: System.PERSONAD20,
        characterClass: formData.characterClass!,
      };
      const response = await characterService.createCharacter(createData);
      success('Personaje creado', 'El personaje se ha creado exitosamente');
      router.push(`/characters/${response.characterId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear personaje';
      notifyError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('backstory.')) {
      const backstoryField = field.replace('backstory.', '');
      setFormData(prev => ({
        ...prev,
        backstory: {
          ...prev.backstory,
          [backstoryField]: value
        }
      }));
    } else if (field.startsWith('stadistics.')) {
      const statField = field.replace('stadistics.', '') as keyof Stadistics;
      setFormData(prev => ({
        ...prev,
        stadistics: {
          ...prev.stadistics,
          [statField]: Number(value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleProficiencyChange = (ability: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      proficency: checked
        ? [...prev.proficency, ability]
        : prev.proficency.filter(p => p !== ability)
    }));
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (infoLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando información...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nuevo Personaje</h1>
          <p className="text-muted-foreground">Crea una nueva ficha de personaje</p>
        </div>
      </div>

      <CharacterForm
        mode="create"
        formData={formData}
        createInfo={createInfo}
        isLoading={loading}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        onChange={handleInputChange}
        onProficiencyChange={handleProficiencyChange}
        campaignId={campaignId}
        onCampaignChange={setCampaignId}
      />
    </div>
  );
}

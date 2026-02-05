"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCharacter, useCharacterCreateInfo } from "@/hooks/useCharacters";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { CharacterState, EditCharacterData, Element, Stadistics } from "@/types/character";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";
import { characterService } from "@/services/characterService";
import { CharacterForm, CharacterFormData } from "@/components/characters/CharacterForm";

export default function EditCharacterPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const characterId = params?.id as string;
  
  const { character, loading, error } = useCharacter(characterId);
  const { createInfo, loading: infoLoading } = useCharacterCreateInfo();
  const { error: notifyError, success: notifySuccess } = useNotificationContext();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      trauma: "",
    },
    previewUrl: "",
    persona: "",
    money: 0,
    stadistics: {
      courage: 10,
      dexterity: 10,
      instincts: 10,
      knowledge: 10,
      charisma: 10,
    },
    proficency: [],
    element: Element.FIRE,
    weakness: Element.ICE,
  });

  usePageTitle(character ? `Editar ${character.name}` : "Editar Personaje");

  useEffect(() => {
    if (error) {
      notifyError('Error', error);
      router.push('/characters');
    }
  }, [error, notifyError, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name,
        state: character.state,
        backstory: character.background || {
          history: "",
          personality: "",
          appearance: "",
          traits: "",
          defects: "",
          ideals: "",
          dreams: "",
          bonds: "",
          trauma: "",
        },
        previewUrl: character.pictureRoute || "",
        persona: character.persona,
        money: character.money,
        stadistics: {
          courage: character.stats.courage.value,
          dexterity: character.stats.dexterity.value,
          instincts: character.stats.instincts.value,
          knowledge: character.stats.knowledge.value,
          charisma: character.stats.charisma.value,
        },
        proficency: [],
        element: character.element || Element.FIRE,
        weakness: character.weakness || Element.ICE,
      });
    }
  }, [character]);

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      setFormData(prev => ({ ...prev, previewUrl: URL.createObjectURL(file) }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!characterId) return;

    if (!formData.name.trim()) {
      notifyError("Campo requerido", "El nombre es obligatorio");
      return;
    }

    try {
      setIsSaving(true);
      const editData: EditCharacterData = {
        name: formData.name,
        state: formData.state,
        backstory: formData.backstory,
        persona: formData.persona,
        money: formData.money,
        stadistics: formData.stadistics,
        proficency: formData.proficency,
        element: formData.element,
        weakness: formData.weakness,
        image: imageFile || undefined,
      };
      await characterService.editCharacter(characterId, editData);
      notifySuccess("Personaje actualizado", "Los cambios se guardaron correctamente.");
      router.push(`/characters/${characterId}`);
    } catch (err) {
      notifyError("Error", err instanceof Error ? err.message : "No se pudo actualizar el personaje.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!characterId) return;

    try {
      setIsDeleting(true);
      await characterService.deleteCharacter(characterId);
      notifySuccess("Personaje eliminado", "El personaje ha sido eliminado correctamente.");
      router.push('/characters');
    } catch (err) {
      notifyError("Error", err instanceof Error ? err.message : "No se pudo eliminar el personaje.");
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  if (loading || infoLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando personaje...</span>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Personaje no encontrado</p>
          <Button onClick={() => router.push('/characters')}>
            Volver a Personajes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/characters/${characterId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Personaje</h1>
            <p className="text-muted-foreground">Modificar ficha de {character.name}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>

      <CharacterForm
        mode="edit"
        formData={formData}
        createInfo={createInfo}
        isLoading={isSaving}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/characters/${characterId}`)}
        onChange={handleInputChange}
        onFileChange={handleFileChange}
        readOnlyClass={character.class}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar personaje?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El personaje <strong>{character.name}</strong> será eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

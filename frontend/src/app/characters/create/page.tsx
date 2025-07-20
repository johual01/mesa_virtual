"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCharacterCreateInfo } from "@/hooks/useCharacters";
import { useNotificationContext } from "@/context/notifications";
import { characterService } from "@/services/characterService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectOption } from "@/components/ui/select";
import { ImageUploader } from "@/components/ImageUploader";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CharacterState, System, CreateCharacterData } from "@/types/character";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function CreateCharacterPage() {
  // Establecer título dinámico de la página
  usePageTitle("Crear Personaje");
  
  const { user } = useAuth();
  const router = useRouter();
  const { createInfo, loading: infoLoading } = useCharacterCreateInfo();
  const { success, error: notifyError } = useNotificationContext();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCharacterData>({
    name: "",
    system: System.DND5E,
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
    campaignId: ""
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await characterService.createCharacter(formData);
      success('Personaje creado', 'El personaje se ha creado exitosamente');
      router.push('/characters');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear personaje';
      setError(errorMessage);
      notifyError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('backstory.')) {
      const backstoryField = field.replace('backstory.', '');
      setFormData(prev => ({
        ...prev,
        backstory: {
          ...prev.backstory,
          [backstoryField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Personaje *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Aeliana Moonshadow"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              {/* Sistema */}
              <div className="space-y-2">
                <Label htmlFor="system">Sistema de Juego *</Label>
                <Select
                  id="system"
                  value={formData.system}
                  onChange={(e) => handleInputChange('system', e.target.value)}
                  required
                >
                  <SelectOption value={System.DND5E}>D&D 5E</SelectOption>
                  <SelectOption value={System.PERSONAD20}>Persona D20</SelectOption>
                </Select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Select
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                >
                  <SelectOption value={CharacterState.ACTIVE}>Activo</SelectOption>
                  <SelectOption value={CharacterState.INACTIVE}>Inactivo</SelectOption>
                  <SelectOption value={CharacterState.DEAD}>Muerto</SelectOption>
                  <SelectOption value={CharacterState.NON_PLAYER}>NPC</SelectOption>
                </Select>
              </div>

              {/* Campaña */}
              <div className="space-y-2">
                <Label htmlFor="campaignId">Campaña (Opcional)</Label>
                <Select
                  id="campaignId"
                  value={formData.campaignId || ""}
                  onChange={(e) => handleInputChange('campaignId', e.target.value)}
                >
                  <SelectOption value="">Sin campaña</SelectOption>
                  {createInfo?.campaigns.map((campaign) => (
                    <SelectOption key={campaign._id} value={campaign._id}>
                      {campaign.name}
                    </SelectOption>
                  ))}
                </Select>
              </div>
            </div>

            {/* Imagen */}
            <ImageUploader
              label="Imagen del Personaje"
              value={formData.pictureRoute || ""}
              onChange={(value) => handleInputChange('pictureRoute', value)}
              placeholder="https://ejemplo.com/personaje.jpg"
            />
          </CardContent>
        </Card>

        {/* Historia del Personaje */}
        <Card>
          <CardHeader>
            <CardTitle>Historia del Personaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Historia */}
              <div className="space-y-2">
                <Label htmlFor="history">Historia</Label>
                <Textarea
                  id="history"
                  placeholder="La historia de fondo de tu personaje..."
                  value={formData.backstory.history}
                  onChange={(e) => handleInputChange('backstory.history', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Personalidad */}
              <div className="space-y-2">
                <Label htmlFor="personality">Personalidad</Label>
                <Textarea
                  id="personality"
                  placeholder="Cómo se comporta tu personaje..."
                  value={formData.backstory.personality}
                  onChange={(e) => handleInputChange('backstory.personality', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Apariencia */}
              <div className="space-y-2">
                <Label htmlFor="appearance">Apariencia</Label>
                <Textarea
                  id="appearance"
                  placeholder="Descripción física del personaje..."
                  value={formData.backstory.appearance}
                  onChange={(e) => handleInputChange('backstory.appearance', e.target.value)}
                />
              </div>

              {/* Rasgos */}
              <div className="space-y-2">
                <Label htmlFor="traits">Rasgos</Label>
                <Textarea
                  id="traits"
                  placeholder="Rasgos distintivos del personaje..."
                  value={formData.backstory.traits}
                  onChange={(e) => handleInputChange('backstory.traits', e.target.value)}
                />
              </div>

              {/* Defectos */}
              <div className="space-y-2">
                <Label htmlFor="defects">Defectos</Label>
                <Textarea
                  id="defects"
                  placeholder="Debilidades o defectos del personaje..."
                  value={formData.backstory.defects}
                  onChange={(e) => handleInputChange('backstory.defects', e.target.value)}
                />
              </div>

              {/* Ideales */}
              <div className="space-y-2">
                <Label htmlFor="ideals">Ideales</Label>
                <Textarea
                  id="ideals"
                  placeholder="Qué principios guían a tu personaje..."
                  value={formData.backstory.ideals}
                  onChange={(e) => handleInputChange('backstory.ideals', e.target.value)}
                />
              </div>

              {/* Sueños */}
              <div className="space-y-2">
                <Label htmlFor="dreams">Sueños/Objetivos</Label>
                <Textarea
                  id="dreams"
                  placeholder="Qué espera lograr tu personaje..."
                  value={formData.backstory.dreams}
                  onChange={(e) => handleInputChange('backstory.dreams', e.target.value)}
                />
              </div>

              {/* Vínculos */}
              <div className="space-y-2">
                <Label htmlFor="bonds">Vínculos</Label>
                <Textarea
                  id="bonds"
                  placeholder="Conexiones importantes del personaje..."
                  value={formData.backstory.bonds}
                  onChange={(e) => handleInputChange('backstory.bonds', e.target.value)}
                />
              </div>

              {/* Trauma */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="trauma">Traumas/Miedos</Label>
                <Textarea
                  id="trauma"
                  placeholder="Experiencias traumáticas o miedos del personaje..."
                  value={formData.backstory.trauma}
                  onChange={(e) => handleInputChange('backstory.trauma', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Personaje'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

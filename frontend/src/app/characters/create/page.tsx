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
import { CharacterState, System, CreateCharacterData, Element, Stadistics } from "@/types/character";
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
    system: System.PERSONAD20,
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
      courage: 1,
      dexterity: 1,
      instincts: 1,
      knowledge: 1,
      charisma: 1
    },
    proficency: [],
    element: Element.FIRE,
    weakness: Element.ICE
  });
  const [campaignId, setCampaignId] = useState<string>("");

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
    if (!formData.characterClass) {
      setError("La clase es obligatoria");
      return;
    }
    if (!formData.persona.trim()) {
      setError("El nombre de la Persona es obligatorio");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await characterService.createCharacter(formData);
      success('Personaje creado', 'El personaje se ha creado exitosamente');
      router.push(`/characters/${response.characterId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear personaje';
      setError(errorMessage);
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
                  disabled
                >
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
                  {createInfo?.states
                    .filter(s => s !== CharacterState.DELETED)
                    .map((s) => (
                      <SelectOption key={s} value={s}>
                        {createInfo?.translations?.states?.[s] || s}
                      </SelectOption>
                    ))}
                </Select>
              </div>

              {/* Clase */}
              <div className="space-y-2">
                <Label htmlFor="characterClass">Clase *</Label>
                <Select
                  id="characterClass"
                  value={formData.characterClass}
                  onChange={(e) => handleInputChange('characterClass', e.target.value)}
                  required
                >
                  <SelectOption value="">Selecciona una clase</SelectOption>
                  {createInfo?.classes.map((cls) => (
                    <SelectOption key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectOption>
                  ))}
                </Select>
              </div>

              {/* Persona */}
              <div className="space-y-2">
                <Label htmlFor="persona">Nombre de la Persona *</Label>
                <Input
                  id="persona"
                  placeholder="Ej: Arsene, Izanagi..."
                  value={formData.persona}
                  onChange={(e) => handleInputChange('persona', e.target.value)}
                  required
                />
              </div>

              {/* Dinero */}
              <div className="space-y-2">
                <Label htmlFor="money">Dinero Inicial</Label>
                <Input
                  id="money"
                  type="number"
                  min="0"
                  value={formData.money}
                  onChange={(e) => handleInputChange('money', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Campaña */}
              <div className="space-y-2">
                <Label htmlFor="campaignId">Campaña (Opcional)</Label>
                <Select
                  id="campaignId"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
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

        {/* Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courage">Coraje</Label>
                <Input
                  id="courage"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stadistics.courage}
                  onChange={(e) => handleInputChange('stadistics.courage', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dexterity">Destreza</Label>
                <Input
                  id="dexterity"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stadistics.dexterity}
                  onChange={(e) => handleInputChange('stadistics.dexterity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instincts">Instintos</Label>
                <Input
                  id="instincts"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stadistics.instincts}
                  onChange={(e) => handleInputChange('stadistics.instincts', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="knowledge">Conocimiento</Label>
                <Input
                  id="knowledge"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stadistics.knowledge}
                  onChange={(e) => handleInputChange('stadistics.knowledge', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charisma">Carisma</Label>
                <Input
                  id="charisma"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stadistics.charisma}
                  onChange={(e) => handleInputChange('stadistics.charisma', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elementos y Debilidades */}
        <Card>
          <CardHeader>
            <CardTitle>Afinidad Elemental</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="element">Elemento Principal *</Label>
                <Select
                  id="element"
                  value={formData.element}
                  onChange={(e) => handleInputChange('element', e.target.value)}
                  required
                >
                  {createInfo?.elements.map((el) => (
                    <SelectOption key={el} value={el}>
                      {createInfo?.translations?.elements?.[el] || el}
                    </SelectOption>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weakness">Debilidad *</Label>
                <Select
                  id="weakness"
                  value={formData.weakness}
                  onChange={(e) => handleInputChange('weakness', e.target.value)}
                  required
                >
                  {createInfo?.elements.map((el) => (
                    <SelectOption key={el} value={el}>
                      {createInfo?.translations?.elements?.[el] || el}
                    </SelectOption>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proficiencias */}
        <Card>
          <CardHeader>
            <CardTitle>Proficiencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {createInfo?.secondaryAbilities.map((ability) => (
                <label key={ability} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.proficency.includes(ability)}
                    onChange={(e) => handleProficiencyChange(ability, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{createInfo?.translations?.secondaryAbilities?.[ability] || ability}</span>
                </label>
              ))}
            </div>
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

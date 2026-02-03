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
import { ArrowLeft, Loader2, Plus, Minus } from "lucide-react";
import { CharacterState, System, CreateCharacterData, Element, Stadistics } from "@/types/character";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function CreateCharacterPage() {
  // Establecer título dinámico de la página
  usePageTitle("Crear Personaje");
  
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { createInfo, loading: infoLoading } = useCharacterCreateInfo();
  const { success, error: notifyError } = useNotificationContext();
  
  const [loading, setLoading] = useState(false);
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
      const response = await characterService.createCharacter(formData);
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Layout principal en dos columnas para pantallas grandes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Información Básica */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Nombre - ancho completo */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Nombre del Personaje *</Label>
              <Input
                id="name"
                placeholder="Ej: Aeliana Moonshadow"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Persona y Estado */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="persona" className="text-xs">Nombre de la Persona *</Label>
                <Input
                  id="persona"
                  placeholder="Ej: Arsene, Izanagi..."
                  value={formData.persona}
                  onChange={(e) => handleInputChange('persona', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state" className="text-xs">Estado *</Label>
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
            </div>

            {/* Clase - ancho completo con descripción */}
            <div className="space-y-1">
              <Label htmlFor="characterClass" className="text-xs">Clase *</Label>
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
              {formData.characterClass && createInfo?.classes.find(c => c._id === formData.characterClass)?.description && (
                <p className="text-xs text-muted-foreground mt-2 p-3 bg-muted/50 rounded">
                  {createInfo?.classes.find(c => c._id === formData.characterClass)?.description}
                </p>
              )}
            </div>

            {/* Campaña y Dinero */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="campaignId" className="text-xs">Campaña (Opcional)</Label>
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
              <div className="space-y-1">
                <Label htmlFor="money" className="text-xs">Dinero Inicial</Label>
                <Input
                  id="money"
                  type="number"
                  min="0"
                  value={formData.money}
                  onChange={(e) => handleInputChange('money', parseInt(e.target.value) || 0)}
                />
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

        {/* Estadísticas, Afinidades y Proficiencias */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Estadísticas y Afinidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="space-y-2">
              {[
                { key: 'courage', name: 'Coraje', abbr: 'COR', description: 'Valentía y determinación' },
                { key: 'dexterity', name: 'Destreza', abbr: 'DES', description: 'Agilidad y coordinación' },
                { key: 'instincts', name: 'Instintos', abbr: 'INS', description: 'Percepción y reflejos' },
                { key: 'knowledge', name: 'Conocimiento', abbr: 'CON', description: 'Intelecto y memoria' },
                { key: 'charisma', name: 'Carisma', abbr: 'CAR', description: 'Presencia social' },
              ].map((stat) => {
                const value = formData.stadistics[stat.key as keyof Stadistics];
                const canIncrease = value < 20;
                const canDecrease = value > 1;
                const modifier = Math.floor((value - 10) / 2);

                return (
                  <div 
                    key={stat.key} 
                    className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {stat.abbr}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{stat.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{stat.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={!canDecrease}
                        onClick={() => handleInputChange(`stadistics.${stat.key}`, value - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="w-8 text-center text-lg font-bold">
                        {value}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={!canIncrease}
                        onClick={() => handleInputChange(`stadistics.${stat.key}`, value + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <div className={`w-10 text-center font-bold text-sm ${modifier >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                        {modifier >= 0 ? `+${modifier}` : modifier}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Afinidades y Proficiencias */}
            <div className="border-t pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="element" className="text-xs">Elemento *</Label>
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
                <div className="space-y-1">
                  <Label htmlFor="weakness" className="text-xs">Debilidad *</Label>
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
              <div className="space-y-1">
                <Label className="text-xs">Proficiencias ({formData.proficency.length}/2)</Label>
                <div className="flex flex-wrap gap-2">
                  {createInfo?.secondaryAbilities.map((ability) => {
                    const isSelected = formData.proficency.includes(ability);
                    const isDisabled = !isSelected && formData.proficency.length >= 2;
                    const label = createInfo?.translations?.secondaryAbilities?.[ability] || ability;
                    
                    return (
                      <button
                        key={ability}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleProficiencyChange(ability, !isSelected)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : isDisabled
                              ? 'bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50'
                              : 'bg-background hover:bg-accent border-input'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div> {/* Fin del grid de dos columnas */}

        {/* Historia del Personaje - Ocupa todo el ancho */}
        <Card>
          <CardHeader>
            <CardTitle>Historia del Personaje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                { key: 'history', label: 'Historia', placeholder: 'La historia de fondo de tu personaje...' },
                { key: 'personality', label: 'Personalidad', placeholder: 'Cómo se comporta tu personaje...' },
                { key: 'appearance', label: 'Apariencia', placeholder: 'Descripción física del personaje...' },
                { key: 'traits', label: 'Rasgos', placeholder: 'Rasgos distintivos del personaje...' },
                { key: 'defects', label: 'Defectos', placeholder: 'Debilidades o defectos del personaje...' },
                { key: 'ideals', label: 'Ideales', placeholder: 'Qué principios guían a tu personaje...' },
                { key: 'dreams', label: 'Sueños/Objetivos', placeholder: 'Qué espera lograr tu personaje...' },
                { key: 'bonds', label: 'Vínculos', placeholder: 'Conexiones importantes del personaje...' },
                { key: 'trauma', label: 'Traumas/Miedos', placeholder: 'Experiencias traumáticas o miedos...' },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={formData.backstory[field.key as keyof typeof formData.backstory]}
                    onChange={(e) => handleInputChange(`backstory.${field.key}`, e.target.value)}
                    className="h-24 resize-none"
                  />
                </div>
              ))}
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

"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectOption } from "@/components/ui/select";
import { ImageUploader } from "@/components/ImageUploader";
import { Loader2, Plus, Minus, Save } from "lucide-react";
import { CharacterState, Element, Stadistics, CharacterCreateInfo, PersonaClass } from "@/types/character";

export interface CharacterFormData {
  name: string;
  state: CharacterState;
  backstory: {
    history: string;
    personality: string;
    appearance: string;
    traits: string;
    defects: string;
    ideals: string;
    dreams: string;
    bonds: string;
    trauma: string;
  };
  previewUrl: string;
  persona: string;
  money: number;
  stadistics: Stadistics;
  proficency: string[];
  element: Element;
  weakness: Element;
  // Solo para creación
  characterClass?: string;
}

interface CharacterFormProps {
  mode: 'create' | 'edit';
  formData: CharacterFormData;
  createInfo: CharacterCreateInfo | null;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (field: string, value: string | number) => void;
  onFileChange?: (file: File | null) => void;
  onProficiencyChange?: (ability: string, checked: boolean) => void;
  // Para modo edición - mostrar valores solo lectura
  readOnlyClass?: string;
  // Para modo creación - campaña
  campaignId?: string;
  onCampaignChange?: (value: string) => void;
}

const STATS_CONFIG = [
  { key: 'courage', name: 'Coraje', abbr: 'COR', description: 'Valentía y determinación' },
  { key: 'dexterity', name: 'Destreza', abbr: 'DES', description: 'Agilidad y coordinación' },
  { key: 'instincts', name: 'Instintos', abbr: 'INS', description: 'Percepción y reflejos' },
  { key: 'knowledge', name: 'Conocimiento', abbr: 'CON', description: 'Intelecto y memoria' },
  { key: 'charisma', name: 'Carisma', abbr: 'CAR', description: 'Presencia social' },
];

const BACKSTORY_FIELDS = [
  { key: 'history', label: 'Historia', placeholder: 'La historia de fondo de tu personaje...' },
  { key: 'personality', label: 'Personalidad', placeholder: 'Cómo se comporta tu personaje...' },
  { key: 'appearance', label: 'Apariencia', placeholder: 'Descripción física del personaje...' },
  { key: 'traits', label: 'Rasgos', placeholder: 'Rasgos distintivos del personaje...' },
  { key: 'defects', label: 'Defectos', placeholder: 'Debilidades o defectos del personaje...' },
  { key: 'ideals', label: 'Ideales', placeholder: 'Qué principios guían a tu personaje...' },
  { key: 'dreams', label: 'Sueños/Objetivos', placeholder: 'Qué espera lograr tu personaje...' },
  { key: 'bonds', label: 'Vínculos', placeholder: 'Conexiones importantes del personaje...' },
  { key: 'trauma', label: 'Traumas/Miedos', placeholder: 'Experiencias traumáticas o miedos...' },
];

export function CharacterForm({
  mode,
  formData,
  createInfo,
  isLoading,
  onSubmit,
  onCancel,
  onChange,
  onFileChange,
  onProficiencyChange,
  readOnlyClass,
  campaignId,
  onCampaignChange,
}: CharacterFormProps) {
  const isCreateMode = mode === 'create';

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Layout principal en dos columnas para pantallas grandes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Información Básica */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Nombre */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Nombre del Personaje *</Label>
              <Input
                id="name"
                placeholder="Ej: Aeliana Moonshadow"
                value={formData.name}
                onChange={(e) => onChange('name', e.target.value)}
                required
              />
            </div>

            {/* Persona y Estado */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="persona" className="text-xs">
                  Nombre de la Persona {isCreateMode && '*'}
                </Label>
                <Input
                  id="persona"
                  placeholder="Ej: Arsene, Izanagi..."
                  value={formData.persona}
                  onChange={(e) => onChange('persona', e.target.value)}
                  required={isCreateMode}
                  disabled={!isCreateMode}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state" className="text-xs">Estado *</Label>
                <Select
                  id="state"
                  value={formData.state}
                  onChange={(e) => onChange('state', e.target.value)}
                  required
                >
                  {createInfo?.states
                    .filter((s: string) => s !== CharacterState.DELETED)
                    .map((s: string) => (
                      <SelectOption key={s} value={s}>
                        {createInfo?.translations?.states?.[s] || s}
                      </SelectOption>
                    ))}
                </Select>
              </div>
            </div>

            {/* Clase y Campaña/Dinero */}
            {isCreateMode ? (
              <>
                {/* Clase seleccionable para creación */}
                <div className="space-y-1">
                  <Label htmlFor="characterClass" className="text-xs">Clase *</Label>
                  <Select
                    id="characterClass"
                    value={formData.characterClass || ''}
                    onChange={(e) => onChange('characterClass', e.target.value)}
                    required
                  >
                    <SelectOption value="">Selecciona una clase</SelectOption>
                    {createInfo?.classes.map((cls: PersonaClass) => (
                      <SelectOption key={cls._id} value={cls._id}>
                        {cls.name}
                      </SelectOption>
                    ))}
                  </Select>
                  {formData.characterClass && createInfo?.classes.find((c: PersonaClass) => c._id === formData.characterClass)?.description && (
                    <p className="text-xs text-muted-foreground mt-2 p-3 bg-muted/50 rounded">
                      {createInfo?.classes.find((c: PersonaClass) => c._id === formData.characterClass)?.description}
                    </p>
                  )}
                </div>

                {/* Campaña y Dinero */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="campaignId" className="text-xs">Campaña (Opcional)</Label>
                    <Select
                      id="campaignId"
                      value={campaignId || ''}
                      onChange={(e) => onCampaignChange?.(e.target.value)}
                    >
                      <SelectOption value="">Sin campaña</SelectOption>
                      {createInfo?.campaigns.map((campaign: { _id: string; name: string }) => (
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
                      onChange={(e) => onChange('money', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Clase solo lectura y Dinero para edición */
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="class" className="text-xs">Clase</Label>
                  <Input
                    id="class"
                    value={readOnlyClass || ''}
                    disabled
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="money" className="text-xs">Dinero</Label>
                  <Input
                    id="money"
                    type="number"
                    min="0"
                    value={formData.money}
                    onChange={(e) => onChange('money', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}

            {/* Imagen */}
            <ImageUploader
              label="Imagen del Personaje"
              value={formData.previewUrl || ""}
              onChange={(value) => onChange('previewUrl', value)}
              onFileChange={onFileChange}
            />
          </CardContent>
        </Card>

        {/* Estadísticas y Afinidades */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Estadísticas y Afinidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estadísticas */}
            <div className="space-y-2">
              {STATS_CONFIG.map((stat) => {
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
                        onClick={() => onChange(`stadistics.${stat.key}`, value - 1)}
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
                        onClick={() => onChange(`stadistics.${stat.key}`, value + 1)}
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
                    onChange={(e) => onChange('element', e.target.value)}
                    required
                  >
                    {createInfo?.elements.map((el: string) => (
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
                    onChange={(e) => onChange('weakness', e.target.value)}
                    required
                  >
                    {createInfo?.elements.map((el: string) => (
                      <SelectOption key={el} value={el}>
                        {createInfo?.translations?.elements?.[el] || el}
                      </SelectOption>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Proficiencias - solo en modo creación */}
              {isCreateMode && onProficiencyChange && (
                <div className="space-y-1">
                  <Label className="text-xs">Proficiencias ({formData.proficency.length}/2)</Label>
                  <div className="flex flex-wrap gap-2">
                    {createInfo?.secondaryAbilities.map((ability: string) => {
                      const isSelected = formData.proficency.includes(ability);
                      const isDisabled = !isSelected && formData.proficency.length >= 2;
                      const label = createInfo?.translations?.secondaryAbilities?.[ability] || ability;
                      
                      return (
                        <button
                          key={ability}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => onProficiencyChange(ability, !isSelected)}
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historia del Personaje */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Historia del Personaje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {BACKSTORY_FIELDS.map((field) => (
              <div 
                key={field.key} 
              >
                <div className="space-y-1">
                  <Label htmlFor={field.key} className="text-xs">{field.label}</Label>
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={formData.backstory[field.key as keyof typeof formData.backstory]}
                    onChange={(e) => onChange(`backstory.${field.key}`, e.target.value)}
                    className="h-24 resize-none"
                  />
                </div>
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
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isCreateMode ? 'Creando...' : 'Guardando...'}
            </>
          ) : (
            <>
              {!isCreateMode && <Save className="h-4 w-4 mr-2" />}
              {isCreateMode ? 'Crear Personaje' : 'Guardar Cambios'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scroll, BookMarked, Check, X, Loader2, Trash2 } from "lucide-react";
import { Character, Spell } from "@/types/character";
import { characterSpellsService } from "@/services/characterSpellsService";
import { useNotificationContext } from "@/context/notifications";

const spellCategoryTranslations: Record<string, string> = {
  attack: "Ataque",
  buff: "Mejora",
  debuff: "Debilitación",
  heal: "Curación",
  shield: "Escudo",
  counter: "Contraataque",
  utility: "Utilidad",
  summoning: "Invocación"
};

// Componente para un conjuro con opción de preparar
const SpellCard = ({ 
  spell, 
  isPrepared, 
  canPrepare,
  isOwner,
  onTogglePrepare,
  isLoading 
}: { 
  spell: Spell; 
  isPrepared: boolean;
  canPrepare: boolean;
  isOwner: boolean;
  onTogglePrepare: (spellId: string) => void;
  isLoading: boolean;
}) => {
  const costDisplay = spell.cost?.map(c => `${c.amount} ${c.resource || 'AP'}`).join(', ') || 'Gratis';
  
  return (
    <div className={`p-3 rounded-lg border transition-colors ${
      isPrepared 
        ? 'bg-primary/10 border-primary/50' 
        : 'bg-muted/20 border-border hover:border-primary/50'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">{spell.name}</h4>
            {spell.concentration && (
              <Badge variant="outline" className="text-xs">Concentración</Badge>
            )}
            {isPrepared && (
              <Badge variant="default" className="text-xs gap-1">
                <BookMarked className="h-3 w-3" />
                Preparado
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {spellCategoryTranslations[spell.category] || spell.category}
            </Badge>
            <span className="text-xs text-muted-foreground">Coste: {costDisplay}</span>
          </div>
        </div>
        {isOwner && (
          <Button
            size="sm"
            variant={isPrepared ? "destructive" : "outline"}
            className="h-8 w-8 p-0"
            onClick={() => onTogglePrepare(spell._id)}
            disabled={isLoading || (!isPrepared && !canPrepare)}
            title={isPrepared ? "Depreparar" : canPrepare ? "Preparar" : "Máximo de preparados alcanzado"}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPrepared ? (
              <X className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{spell.description}</p>
    </div>
  );
};

interface SpellsTabProps {
  character: Character;
  isOwner: boolean;
  onRefetch?: () => void;
}

export function SpellsTab({ character, isOwner, onRefetch }: SpellsTabProps) {
  const router = useRouter();
  const { combatData } = character;
  const { error: notifyError, success: notifySuccess } = useNotificationContext();
  const [loadingSpellId, setLoadingSpellId] = useState<string | null>(null);
  const [isClearingPrepared, setIsClearingPrepared] = useState(false);

  const spells = combatData?.magicalStats?.spells;
  const preparedList = spells?.preparedList || [];
  const maxPrepared = spells?.maxPrepared || 0;
  const preparedIds = new Set(preparedList.map(s => s._id));
  const canPrepareMore = preparedList.length < maxPrepared;

  const handleTogglePrepare = async (spellId: string) => {
    setLoadingSpellId(spellId);
    try {
      await characterSpellsService.prepareSpell(character._id, spellId);
      const isPrepared = preparedIds.has(spellId);
      notifySuccess('Éxito', isPrepared ? 'Hechizo depreparado' : 'Hechizo preparado');
      onRefetch?.();
    } catch (err) {
      notifyError('Error', 'No se pudo preparar el hechizo');
    } finally {
      setLoadingSpellId(null);
    }
  };

  const handleClearPrepared = async () => {
    setIsClearingPrepared(true);
    try {
      await characterSpellsService.clearPreparedSpells(character._id);
      notifySuccess('Éxito', 'Todos los hechizos han sido depreparados');
      onRefetch?.();
    } catch (err) {
      notifyError('Error', 'No se pudieron limpiar los hechizos preparados');
    } finally {
      setIsClearingPrepared(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scroll className="h-5 w-5" />
            CONJUROS Y HABILIDADES
          </CardTitle>
          {isOwner && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${character._id}/edit`)}>
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats rápidos de magia */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <span className="text-xs text-muted-foreground">AP Máximo</span>
            <p className="text-xl font-bold text-blue-500">{combatData?.magicalStats?.AP?.total || 0}</p>
          </div>
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Lanzamiento</span>
            <p className="text-xl font-bold">+{combatData?.magicalStats?.magicLaunch?.total || 0}</p>
          </div>
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Salvación</span>
            <p className="text-xl font-bold">{combatData?.magicalStats?.magicSave?.total || 10}</p>
          </div>
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Curación</span>
            <p className="text-xl font-bold text-green-500">+{combatData?.magicalStats?.magicHealing?.total || 0}</p>
          </div>
        </div>

        {/* Hechizos preparados */}
        {maxPrepared > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <BookMarked className="h-4 w-4" />
                Hechizos Preparados
                <Badge variant="outline" className="ml-2">
                  {preparedList.length} / {maxPrepared}
                </Badge>
              </h3>
              {isOwner && preparedList.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleClearPrepared}
                  disabled={isClearingPrepared}
                >
                  {isClearingPrepared ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  Limpiar todos
                </Button>
              )}
            </div>
            {preparedList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {preparedList.map((spell) => (
                  <SpellCard 
                    key={spell._id} 
                    spell={spell} 
                    isPrepared={true}
                    canPrepare={true}
                    isOwner={isOwner}
                    onTogglePrepare={handleTogglePrepare}
                    isLoading={loadingSpellId === spell._id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground border border-dashed border-border rounded-lg">
                <p className="text-sm">No tienes hechizos preparados</p>
                <p className="text-xs">Prepara hechizos de tu lista de conocidos</p>
              </div>
            )}
          </div>
        )}

        {/* Lista de conjuros */}
        {spells?.list && spells.list.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Conjuros Conocidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spells.list.map((spell) => (
                <SpellCard 
                  key={spell._id} 
                  spell={spell}
                  isPrepared={preparedIds.has(spell._id)}
                  canPrepare={canPrepareMore}
                  isOwner={isOwner}
                  onTogglePrepare={handleTogglePrepare}
                  isLoading={loadingSpellId === spell._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lista de conjuros gratuitos */}
        {spells?.freeList && spells.freeList.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Conjuros Gratuitos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spells.freeList.map((spell) => (
                <SpellCard 
                  key={spell._id} 
                  spell={spell}
                  isPrepared={preparedIds.has(spell._id)}
                  canPrepare={canPrepareMore}
                  isOwner={isOwner}
                  onTogglePrepare={handleTogglePrepare}
                  isLoading={loadingSpellId === spell._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lista de conjuros adicionales */}
        {spells?.additionalList && spells.additionalList.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Conjuros Adicionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spells.additionalList.map((spell) => (
                <SpellCard 
                  key={spell._id} 
                  spell={spell}
                  isPrepared={preparedIds.has(spell._id)}
                  canPrepare={canPrepareMore}
                  isOwner={isOwner}
                  onTogglePrepare={handleTogglePrepare}
                  isLoading={loadingSpellId === spell._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay conjuros */}
        {(!spells?.list?.length && 
          !spells?.freeList?.length && 
          !spells?.additionalList?.length) && (
          <div className="text-center py-8 text-muted-foreground">
            <Scroll className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Este personaje aún no tiene conjuros.</p>
            <p className="text-sm">Los conjuros se aprenden al crear el personaje o subir de nivel.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

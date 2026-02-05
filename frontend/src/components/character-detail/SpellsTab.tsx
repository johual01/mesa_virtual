"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scroll } from "lucide-react";
import { Character, Spell } from "@/types/character";

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

// Componente para un conjuro
const SpellCard = ({ spell }: { spell: Spell }) => {
  const costDisplay = spell.cost?.map(c => `${c.amount} ${c.resource || 'AP'}`).join(', ') || 'Gratis';
  
  return (
    <div className="p-3 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">{spell.name}</h4>
            {spell.concentration && (
              <Badge variant="outline" className="text-xs">Concentración</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {spellCategoryTranslations[spell.category] || spell.category}
            </Badge>
            <span className="text-xs text-muted-foreground">Coste: {costDisplay}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{spell.description}</p>
    </div>
  );
};

interface SpellsTabProps {
  character: Character;
  isOwner: boolean;
}

export function SpellsTab({ character, isOwner }: SpellsTabProps) {
  const router = useRouter();
  const { combatData } = character;

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

        {/* Lista de conjuros */}
        {combatData?.magicalStats?.spells?.list && combatData.magicalStats.spells.list.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Conjuros Conocidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {combatData.magicalStats.spells.list.map((spell) => (
                <SpellCard key={spell._id} spell={spell} />
              ))}
            </div>
          </div>
        )}

        {/* Lista de conjuros gratuitos */}
        {combatData?.magicalStats?.spells?.freeList && combatData.magicalStats.spells.freeList.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Conjuros Gratuitos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {combatData.magicalStats.spells.freeList.map((spell) => (
                <SpellCard key={spell._id} spell={spell} />
              ))}
            </div>
          </div>
        )}

        {/* Lista de conjuros adicionales */}
        {combatData?.magicalStats?.spells?.additionalList && combatData.magicalStats.spells.additionalList.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Conjuros Adicionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {combatData.magicalStats.spells.additionalList.map((spell) => (
                <SpellCard key={spell._id} spell={spell} />
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay conjuros */}
        {(!combatData?.magicalStats?.spells?.list?.length && 
          !combatData?.magicalStats?.spells?.freeList?.length && 
          !combatData?.magicalStats?.spells?.additionalList?.length) && (
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

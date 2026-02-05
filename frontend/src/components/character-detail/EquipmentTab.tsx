"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Character } from "@/types/character";

interface EquipmentTabProps {
  character: Character;
  isOwner: boolean;
}

export function EquipmentTab({ character, isOwner }: EquipmentTabProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            EQUIPO E INVENTARIO
          </CardTitle>
          {isOwner && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${character._id}/edit`)}>
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Dinero */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-muted/30 rounded-lg">
          <span className="font-semibold">Dinero:</span>
          <span className="text-xl font-bold text-yellow-500">{character.money} ¥</span>
        </div>

        {/* Lista de equipo */}
        {character.characterInventory && character.characterInventory.length > 0 ? (
          <div className="space-y-3">
            {character.characterInventory.map((item) => (
              <div 
                key={item._id} 
                className={`p-3 rounded-lg border ${item.equipped ? 'bg-primary/5 border-primary/30' : 'bg-muted/20 border-border'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{item.equipmentName}</h4>
                      {item.equipped && <Badge variant="default" className="text-xs">Equipado</Badge>}
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Este personaje no tiene objetos en su inventario.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

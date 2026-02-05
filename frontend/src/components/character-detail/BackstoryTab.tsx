"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Character } from "@/types/character";

interface BackstoryTabProps {
  character: Character;
  isOwner: boolean;
}

export function BackstoryTab({ character, isOwner }: BackstoryTabProps) {
  const router = useRouter();
  const { background } = character;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            TRASFONDO
          </CardTitle>
          {isOwner && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${character._id}/edit`)}>
              Editar
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Cada personaje tiene una historia. Aquí se cuenta la de {character.name}.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Detalles</h3>
              
              <div className="mb-4">
                <span className="font-semibold">Persona.</span>{' '}
                <span className="text-muted-foreground">{character.persona}</span>
              </div>

              {background?.history && (
                <div className="mb-4">
                  <span className="font-semibold">Historia.</span>{' '}
                  <span className="text-muted-foreground whitespace-pre-wrap">{background.history}</span>
                </div>
              )}

              {background?.personality && (
                <div className="mb-4">
                  <span className="font-semibold">Personalidad.</span>{' '}
                  <span className="text-muted-foreground whitespace-pre-wrap">{background.personality}</span>
                </div>
              )}

              {background?.appearance && (
                <div className="mb-4">
                  <span className="font-semibold">Apariencia.</span>{' '}
                  <span className="text-muted-foreground whitespace-pre-wrap">{background.appearance}</span>
                </div>
              )}

              {background?.traits && (
                <div className="mb-4">
                  <span className="font-semibold">Rasgos.</span>{' '}
                  <span className="text-muted-foreground whitespace-pre-wrap">{background.traits}</span>
                </div>
              )}

              {background?.defects && (
                <div className="mb-4">
                  <span className="font-semibold">Defectos.</span>{' '}
                  <span className="text-muted-foreground whitespace-pre-wrap">{background.defects}</span>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {background?.ideals && (
              <div className="mb-4">
                <span className="font-semibold">Ideales.</span>{' '}
                <span className="text-muted-foreground whitespace-pre-wrap">{background.ideals}</span>
              </div>
            )}

            {background?.dreams && (
              <div className="mb-4">
                <span className="font-semibold">Sueños.</span>{' '}
                <span className="text-muted-foreground whitespace-pre-wrap">{background.dreams}</span>
              </div>
            )}

            {background?.bonds && (
              <div className="mb-4">
                <span className="font-semibold">Vínculos.</span>{' '}
                <span className="text-muted-foreground whitespace-pre-wrap">{background.bonds}</span>
              </div>
            )}

            {background?.trauma && (
              <div className="mb-4">
                <span className="font-semibold">Traumas/Miedos.</span>{' '}
                <span className="text-muted-foreground whitespace-pre-wrap">{background.trauma}</span>
              </div>
            )}

            {/* Imagen del personaje */}
            {character.pictureRoute && (
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-border">
                <Image
                  src={character.pictureRoute}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

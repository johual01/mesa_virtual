"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Character, Feature, CustomFeature } from "@/types/character";

// Componente para un rasgo/feature
const FeatureCard = ({ feature, level }: { feature: Feature | CustomFeature; level?: number }) => {
  const isCustom = !('effects' in feature);
  
  return (
    <div className="p-4 bg-muted/20 rounded-lg border border-border">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{feature.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {feature.useType === 'active' ? 'Activo' : 'Pasivo'}
            </Badge>
            {level && <Badge variant="secondary" className="text-xs">Nivel {level}</Badge>}
            {isCustom && <Badge className="text-xs">Personalizado</Badge>}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{feature.description}</p>
    </div>
  );
};

interface FeaturesTabProps {
  character: Character;
  isOwner: boolean;
}

export function FeaturesTab({ character, isOwner }: FeaturesTabProps) {
  const router = useRouter();
  const { features } = character;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            RASGOS
          </CardTitle>
          {isOwner && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${character._id}/edit`)}>
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Clase */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="text-xs">{character.class}</Badge>
            <span className="text-sm text-muted-foreground">Nivel {character.level}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Rasgos y habilidades de tu clase {character.class}.
          </p>
        </div>

        {/* Rasgos de clase */}
        {features?.classFeatures && features.classFeatures.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Rasgos de Clase</h3>
            <div className="space-y-3">
              {features.classFeatures.map((feature, index) => (
                <FeatureCard key={feature.featureId || index} feature={feature} />
              ))}
            </div>
          </div>
        )}

        {/* Rasgos de subclase */}
        {features?.subclassFeatures && features.subclassFeatures.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Rasgos de Subclase</h3>
            <div className="space-y-3">
              {features.subclassFeatures.map((feature, index) => (
                <FeatureCard key={feature.featureId || index} feature={feature} />
              ))}
            </div>
          </div>
        )}

        {/* Rasgos de objetos */}
        {features?.itemFeatures && features.itemFeatures.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Rasgos de Objetos</h3>
            <div className="space-y-3">
              {features.itemFeatures.map((feature, index) => (
                <FeatureCard key={feature.featureId || index} feature={feature} />
              ))}
            </div>
          </div>
        )}

        {/* Rasgos personalizados */}
        {features?.customFeatures && features.customFeatures.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Rasgos Personalizados</h3>
            <div className="space-y-3">
              {features.customFeatures.map((feature, index) => (
                <FeatureCard key={feature.featureId || index} feature={feature} />
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay rasgos */}
        {(!features?.classFeatures?.length && 
          !features?.subclassFeatures?.length && 
          !features?.itemFeatures?.length && 
          !features?.customFeatures?.length) && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Este personaje aún no tiene rasgos.</p>
            <p className="text-sm">Los rasgos se obtienen al subir de nivel o mediante objetos especiales.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

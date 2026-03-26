"use client"

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";
import { usePersonaD20Classes } from "@/hooks/usePersonaD20Classes";
import { Loader2, Search, ShieldCheck } from "lucide-react";

function PersonaD20ClassesContent() {
  usePageTitle("Persona D20 - Clases");

  const [draft, setDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { classes, loading, error, fetchClasses } = usePersonaD20Classes();
  const { error: notifyError } = useNotificationContext();

  useEffect(() => {
    if (error) {
      notifyError('Error', error);
    }
  }, [error, notifyError]);

  useEffect(() => {
    fetchClasses(searchTerm);
  }, [fetchClasses, searchTerm]);

  const classesWithVisuals = useMemo(() => {
    return classes.map((item) => {
      const iconText = item.name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();

      return {
        ...item,
        iconText,
      };
    });
  }, [classes]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Clases</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded border border-border/70 bg-muted/30 px-2 py-1">Persona D20</span>
          <span>/</span>
          <span className="text-foreground">Clases</span>
        </div>
      </div>

      <Card className="mb-5 border-border/70 bg-gradient-to-r from-card via-card to-muted/30">
        <CardContent className="pt-5">
          <form
            className="flex flex-col gap-3 md:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchTerm(draft.trim());
            }}
          >
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Buscar por nombre"
              className="md:flex-1"
            />
            <Button type="submit" className="md:w-40">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-lg border border-border/70">
        {loading ? (
          <div className="flex items-center justify-center gap-2 bg-card/80 px-5 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando clases...
          </div>
        ) : classesWithVisuals.length === 0 ? (
          <div className="bg-card/80 px-5 py-8 text-center text-sm text-muted-foreground">
            No se encontraron clases para la busqueda actual.
          </div>
        ) : (
          classesWithVisuals.map((item) => (
            <article
              key={item._id}
              className="border-b border-border/60 bg-card/80 px-4 py-4 last:border-b-0 sm:px-5"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600/90 to-zinc-800/90 text-xs font-semibold text-white">
                  {item.iconText}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-tight text-foreground">{item.name}</h2>
                  <Badge variant="outline" className="mt-1 border-sky-500/40 bg-sky-500/10 text-sky-300">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    {item.source}
                  </Badge>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="mt-5 flex items-center justify-start">
        <Button asChild variant="outline" className="border-border/70 bg-card/80">
          <Link href="/systems/persona-d20">Volver al sistema Persona D20</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PersonaD20ClassesPage() {
  return (
    <ProtectedRoute>
      <PersonaD20ClassesContent />
    </ProtectedRoute>
  );
}

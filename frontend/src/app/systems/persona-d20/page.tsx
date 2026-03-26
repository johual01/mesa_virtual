"use client"

import { usePageTitle } from "@/hooks/usePageTitle";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ScrollText, Sparkles, Star, Users, PawPrint, Shield, Dice6 } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface QuickAccessItem {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
  available: boolean;
  href?: string;
}

const quickAccesses: QuickAccessItem[] = [
  {
    key: "classes",
    title: "Clases",
    description: "Arquetipos, rasgos y progresion por nivel.",
    icon: Users,
    tone: "bg-blue-500/10 text-blue-300",
    href: "/systems/persona-d20/classes",
    available: true,
  },
  {
    key: "feats",
    title: "Dotes",
    description: "Opciones para personalizar habilidades y estilo.",
    icon: Star,
    tone: "bg-amber-500/10 text-amber-300",
    available: false,
  },
  {
    key: "spells",
    title: "Hechizos",
    description: "Conjuros por nivel y clase disponible.",
    icon: Sparkles,
    tone: "bg-violet-500/10 text-violet-300",
    available: false,
  },
  {
    key: "bestiary",
    title: "Bestiario",
    description: "Criaturas, estadisticas y referencias de combate.",
    icon: PawPrint,
    tone: "bg-emerald-500/10 text-emerald-300",
    available: false,
  },
  {
    key: "rules",
    title: "Reglas",
    description: "Reglas base, condiciones y acciones comunes.",
    icon: ScrollText,
    tone: "bg-rose-500/10 text-rose-300",
    available: false,
  },
];

function PersonaD20SystemContent() {
  usePageTitle("Persona D20");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="overflow-hidden border-border/70 bg-card/90">
          <div className="relative overflow-hidden border-b border-border/60 px-6 py-8">
            <div className="absolute inset-0 bg-[linear-gradient(130deg,hsl(222_32%_7%),hsl(224_29%_6%)_42%,hsl(218_34%_9%))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_86%_14%,rgba(56,189,248,0.1),transparent_36%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,6,23,0.42),rgba(2,6,23,0.08)_45%,transparent)]" />
            <div className="absolute -left-24 top-8 h-56 w-56 rounded-full bg-blue-500/[0.08] blur-3xl" />
            <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-sky-400/[0.08] blur-3xl" />
            <div className="relative">
              <Badge className="mb-4 border border-sky-200/20 bg-slate-900/55 text-sky-100 hover:bg-slate-900/55">Compendio del sistema</Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">Persona D20</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300/90 sm:text-base">
                Esta pantalla centraliza informacion del sistema para consultar reglas y contenido de referencia durante la creacion y gestion de personajes.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <div className="rounded-full border border-sky-200/15 bg-slate-900/45 px-3 py-1 text-slate-200">Narrativa y combate</div>
                <div className="rounded-full border border-sky-200/15 bg-slate-900/45 px-3 py-1 text-slate-200">Progresion por niveles</div>
                <div className="rounded-full border border-sky-200/15 bg-slate-900/45 px-3 py-1 text-slate-200">Tiradas con d20</div>
              </div>
            </div>
          </div>

          <CardContent className="space-y-5 pt-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Persona D20 adapta mecanicas de fantasia y progresion por niveles a una experiencia inspirada en la saga Persona, con enfasis en narrativa, combate y desarrollo de vinculos.
            </p>
            <p>
              Aqui iremos habilitando accesos rapidos al contenido del sistema de forma incremental. En esta primera etapa queda creada la pantalla principal como punto unico de entrada.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Card className="border-border/60 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Dice6 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nucleo</p>
                    <p className="text-sm font-semibold text-foreground">Mecanica d20</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Enfoque</p>
                    <p className="text-sm font-semibold text-foreground">Combate tactico</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estilo</p>
                    <p className="text-sm font-semibold text-foreground">Progresion flexible</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/60 bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contenido en desarrollo</CardTitle>
                <CardDescription>
                  Los modulos se iran habilitando paso a paso en los siguientes cambios.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <li className="rounded-md border border-border/50 bg-background/60 px-3 py-2 text-foreground">
                    <Link href="/systems/persona-d20/classes" className="hover:text-primary hover:underline">
                      Listado de clases
                    </Link>
                  </li>
                  <li className="rounded-md border border-border/50 bg-background/60 px-3 py-2">Listado de dotes</li>
                  <li className="rounded-md border border-border/50 bg-background/60 px-3 py-2">Listado de hechizos</li>
                  <li className="rounded-md border border-border/50 bg-background/60 px-3 py-2">Bestiario</li>
                  <li className="rounded-md border border-border/50 bg-background/60 px-3 py-2 sm:col-span-2">Reglas principales</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 xl:sticky xl:top-24 xl:h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Accesos rapidos
            </CardTitle>
            <CardDescription>
              Secciones planificadas para este sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickAccesses.map((item) => {
              const Icon = item.icon;
              const cardClasses = "group flex items-start gap-3 rounded-lg border border-border/70 bg-background/60 px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background";

              if (item.available && item.href) {
                return (
                  <Link key={item.key} href={item.href} className={cardClasses}>
                    <div className={`mt-0.5 rounded-md p-2 ${item.tone}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground transition-colors group-hover:text-primary">{item.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                );
              }

              return (
                <div key={item.key} className={cardClasses}>
                  <div className={`mt-0.5 rounded-md p-2 ${item.tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground transition-colors group-hover:text-primary">{item.title}</p>
                      <Badge variant="outline" className="border-border/70 bg-card text-[10px] uppercase tracking-wide">
                        Proximamente
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PersonaD20SystemPage() {
  return (
    <ProtectedRoute>
      <PersonaD20SystemContent />
    </ProtectedRoute>
  );
}

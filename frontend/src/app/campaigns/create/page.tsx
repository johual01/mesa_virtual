"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationContext } from "@/context/notifications";
import { campaignService } from "@/services/campaignService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ImageUploader";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function CreateCampaignPage() {
  // Establecer título dinámico de la página
  usePageTitle("Crear Campaña");
  
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { success, error: notifyError } = useNotificationContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    notes: [] as string[],
    publicEntries: [] as string[]
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Nombre y descripción son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await campaignService.createCampaign({
        name: formData.name,
        description: formData.description,
        notes: formData.notes,
        publicEntries: formData.publicEntries,
        image: imageFile || undefined,
        imageUrl: !imageFile && formData.imageUrl ? formData.imageUrl : undefined,
      });
      success('Campaña creada', 'La campaña se ha creado exitosamente');
      router.push('/campaigns');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear campaña';
      setError(errorMessage);
      notifyError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
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
          <h1 className="text-2xl font-bold">Nueva Campaña</h1>
          <p className="text-muted-foreground">Crea una nueva campaña de rol</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Campaña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Campaña *</Label>
              <Input
                id="name"
                placeholder="Ej: La Mina Perdida de Phandelver"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describe tu campaña, su ambientación, tema principal..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Imagen */}
            <ImageUploader
              label="Imagen de Portada"
              value={formData.imageUrl}
              onChange={(value) => handleInputChange('imageUrl', value)}
              onFileChange={handleFileChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />

            {/* Botones */}
            <div className="flex gap-4 pt-4">
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
                  'Crear Campaña'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

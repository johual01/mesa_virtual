import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, X, Image as ImageIcon, Maximize2 } from 'lucide-react';

interface ImageUploaderProps {
  /** URL para mostrar (preview de archivo local o imagen existente del servidor) */
  value: string;
  /** Callback para cambios de URL (se usa internamente) */
  onChange: (value: string) => void;
  /** Callback para cuando se selecciona un archivo */
  onFileChange?: (file: File | null) => void;
  label?: string;
  previewClassName?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onFileChange,
  label = "Imagen",
  previewClassName = "w-full h-48"
}) => {
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // La URL a mostrar: previewUrl (del archivo local) o value (imagen existente)
  const displayUrl = previewUrl || value;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        return;
      }
      
      // Crear URL para preview local
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageError(false);
      
      // Notificar al padre sobre el archivo seleccionado
      if (onFileChange) {
        onFileChange(file);
      }
      // Limpiar la URL externa si había una
      onChange('');
    }
  };

  const clearImage = () => {
    onChange('');
    setImageError(false);
    
    // Limpiar preview local
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    
    // Notificar que se limpió el archivo
    if (onFileChange) {
      onFileChange(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Botones de acción */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          {displayUrl ? 'Cambiar imagen' : 'Subir imagen'}
        </Button>
        {displayUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* File Input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview */}
      {displayUrl && !imageError && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Vista Previa</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFullscreen(true)}
              className="h-6 px-2 text-xs"
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              Ver completa
            </Button>
          </div>
          <div 
            className={`relative rounded-md overflow-hidden border bg-muted/30 cursor-pointer ${previewClassName}`}
            onClick={() => setShowFullscreen(true)}
          >
            <Image
              src={displayUrl}
              alt="Vista previa"
              fill
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {displayUrl && imageError && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Vista Previa</Label>
          <div className={`relative rounded-md overflow-hidden border bg-muted flex items-center justify-center ${previewClassName}`}>
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Error al cargar la imagen</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!displayUrl && (
        <div 
          className={`relative rounded-md overflow-hidden border border-dashed bg-muted/20 flex items-center justify-center cursor-pointer hover:bg-muted/40 transition-colors ${previewClassName}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Haz clic para subir una imagen</p>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/95 border-none">
          <DialogTitle className="sr-only">Vista completa de imagen</DialogTitle>
          <div className="relative w-full h-[85vh] flex items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowFullscreen(false)}
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
            {displayUrl && (
              <Image
                src={displayUrl}
                alt="Imagen completa"
                fill
                className="object-contain p-4"
                priority
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

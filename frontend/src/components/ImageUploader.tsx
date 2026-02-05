import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  /** URL para mostrar (preview o URL externa) */
  value: string;
  /** Callback para cambios de URL (para URLs externas) */
  onChange: (value: string) => void;
  /** Callback para cuando se selecciona un archivo */
  onFileChange?: (file: File | null) => void;
  label?: string;
  placeholder?: string;
  previewClassName?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onFileChange,
  label = "Imagen",
  placeholder = "https://ejemplo.com/imagen.jpg",
  previewClassName = "w-full h-48"
}) => {
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // La URL a mostrar: previewUrl (del archivo local) o value (URL externa)
  const displayUrl = previewUrl || value;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Crear URL para preview local
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

  const handleUrlChange = (url: string) => {
    onChange(url);
    setImageError(false);
    // Si el usuario escribe una URL, limpiar el archivo local
    if (url && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      if (onFileChange) {
        onFileChange(null);
      }
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
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Input URL */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
        </Button>
        {value && (
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
          <Label>Vista Previa</Label>
          <div className={`relative rounded-md overflow-hidden border ${previewClassName}`}>
            <Image
              src={displayUrl}
              alt="Vista previa"
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {displayUrl && imageError && (
        <div className="space-y-2">
          <Label>Vista Previa</Label>
          <div className={`relative rounded-md overflow-hidden border bg-muted flex items-center justify-center ${previewClassName}`}>
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Error al cargar la imagen</p>
              <p className="text-xs">Verifica que la URL sea válida</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Puedes usar una URL de imagen o subir una desde tu dispositivo
      </p>
    </div>
  );
};

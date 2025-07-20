import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  previewClassName?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = "Imagen",
  placeholder = "https://ejemplo.com/imagen.jpg",
  previewClassName = "w-full h-48"
}) => {
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aquí puedes implementar la lógica de subida de archivo
      // Por ahora, solo simulamos con URL.createObjectURL
      const url = URL.createObjectURL(file);
      onChange(url);
      setImageError(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setImageError(false);
  };

  const clearImage = () => {
    onChange('');
    setImageError(false);
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
      {value && !imageError && (
        <div className="space-y-2">
          <Label>Vista Previa</Label>
          <div className={`relative rounded-md overflow-hidden border ${previewClassName}`}>
            <Image
              src={value}
              alt="Vista previa"
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {value && imageError && (
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

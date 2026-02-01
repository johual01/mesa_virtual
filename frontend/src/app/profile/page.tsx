"use client"

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/auth';
import { useNotificationContext } from '@/context/notifications';
import { profileService } from '@/services/profileService';
import { UserProfile } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Calendar, 
  Save, 
  Eye, 
  EyeOff,
  Edit,
  X,
  Upload,
  Camera
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProfilePage() {
  const { user } = useAuth();
  const { success, error: notifyError, warning } = useNotificationContext();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    password: '',
    imageUrl: ''
  });

  const loadProfile = useCallback(async () => {
    if (!user?._id) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const profileData = await profileService.getProfile(user._id);
      
      setProfile(profileData);
      setFormData({
        username: profileData.username,
        email: profileData.email,
        currentPassword: '',
        password: '',
        imageUrl: profileData.pictureRoute || ''
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error al cargar el perfil: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [user?._id, loadProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?._id || !profile) return;
    
    if (!formData.username || !formData.email || !formData.currentPassword) {
      warning('Campos incompletos', 'Completa todos los campos obligatorios');
      return;
    }

    try {
      setSaving(true);
      const response = await profileService.alterProfile(user._id, {
        username: formData.username,
        email: formData.email,
        currentPassword: formData.currentPassword,
        password: formData.password || undefined,
        imageUrl: formData.imageUrl || undefined
      });

      // Actualizar token si se devuelve uno nuevo
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      const updatedProfile = await profileService.getProfile(user._id);
      setProfile(updatedProfile);
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        password: ''
      }));
      success('¡Perfil actualizado!', 'Los cambios se han guardado correctamente');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      notifyError('Error al actualizar', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatJoinDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !user?._id) return;

    try {
      setSaving(true);
      // Aquí iría la lógica para subir la imagen al servidor
      // Por ahora usaremos un placeholder
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Simulamos la subida de imagen
      console.log('Uploading image...', selectedFile);
      
      // Actualizar el perfil con la nueva imagen
      await loadProfile();
      setImagePreview(null);
      setSelectedFile(null);
      success('¡Imagen actualizada!', 'Tu foto de perfil se ha actualizado correctamente');
    } catch (err) {
      console.error('Error uploading image:', err);
      notifyError('Error', 'No se pudo subir la imagen');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Cargando perfil...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-red-500">No se pudo cargar el perfil</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold overflow-hidden">
                    {imagePreview ? (
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : profile.pictureRoute ? (
                      <Image 
                        src={profile.pictureRoute} 
                        alt={profile.username} 
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      getUserInitials(profile.username)
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Camera className="h-6 w-6 text-white" />
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              {imagePreview && isEditing && (
                <div className="flex justify-center gap-2 mb-4">
                  <Button size="sm" onClick={handleImageUpload} disabled={isSaving}>
                    <Upload className="h-4 w-4 mr-1" />
                    {isSaving ? 'Subiendo...' : 'Confirmar'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
              <CardTitle className="text-2xl">{profile.username}</CardTitle>
              <p className="text-muted-foreground">{profile.email}</p>
              {isEditing && (
                <p className="text-sm text-muted-foreground mt-2">
                  Haz clic en el avatar para cambiar tu foto de perfil
                </p>
              )}
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Nombre de Usuario</p>
                          <p className="text-muted-foreground">{profile.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Correo Electrónico</p>
                          <p className="text-muted-foreground">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Fecha de Registro</p>
                          <p className="text-muted-foreground">{formatJoinDate(profile.joinDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Editar Perfil
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Nombre de Usuario</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          placeholder="Ingresa tu nombre de usuario"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Ingresa tu email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Contraseña Actual *</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                            placeholder="Ingresa tu contraseña actual"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nueva Contraseña (opcional)</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Ingresa tu nueva contraseña"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-8">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: profile.username,
                          email: profile.email,
                          currentPassword: '',
                          password: '',
                          imageUrl: profile.pictureRoute || ''
                        });
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

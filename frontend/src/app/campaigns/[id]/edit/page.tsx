"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCampaign } from "@/hooks/useCampaigns";
import { campaignService } from "@/services/campaignService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Loader2, Save, Trash2, UserMinus, Users } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";
import { User } from "@/types/campaign";
import { ImageUploader } from "@/components/ImageUploader";

interface CampaignFormData {
  name: string;
  description: string;
  imageUrl: string;
}

export default function EditCampaignPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;
  
  const { campaign, loading, error, refetch } = useCampaign(campaignId);
  const { success, error: notifyError } = useNotificationContext();
  
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para eliminar campaña
  const [showDeleteCampaignDialog, setShowDeleteCampaignDialog] = useState(false);
  const [isDeletingCampaign, setIsDeletingCampaign] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  
  // Estados para remover jugador
  const [showRemovePlayerDialog, setShowRemovePlayerDialog] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<User | null>(null);
  const [isRemovingPlayer, setIsRemovingPlayer] = useState(false);
  
  usePageTitle(campaign ? `Editar ${campaign.name}` : "Editar Campaña");

  // Mostrar error como toast y redirigir
  useEffect(() => {
    if (error) {
      notifyError('Error', error);
      router.push('/campaigns');
    }
  }, [error, notifyError, router]);

  // Verificar que el usuario es el owner
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (campaign && user) {
      const ownerId = typeof campaign.owner === 'string' ? campaign.owner : campaign.owner._id;
      const userId = user._id || user.id;
      if (ownerId !== userId) {
        router.push(`/campaigns/${campaignId}`);
        return;
      }
      
      // Cargar datos del formulario
      setFormData({
        name: campaign.name || '',
        description: campaign.description || '',
        imageUrl: campaign.image || '',
      });
    }
  }, [user, authLoading, campaign, router, campaignId]);

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      notifyError('Campo requerido', 'El nombre de la campaña es obligatorio');
      return;
    }

    setIsSaving(true);
    try {
      await campaignService.editCampaign(campaignId, {
        name: formData.name,
        description: formData.description,
        image: imageFile || undefined,
        imageUrl: !imageFile && formData.imageUrl ? formData.imageUrl : undefined,
      });
      success('Campaña actualizada', 'Los cambios se han guardado correctamente');
      router.push(`/campaigns/${campaignId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar los cambios';
      notifyError('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  const openRemovePlayerDialog = (player: User) => {
    setPlayerToRemove(player);
    setShowRemovePlayerDialog(true);
  };

  const handleRemovePlayer = async () => {
    if (!playerToRemove) return;

    setIsRemovingPlayer(true);
    try {
      await campaignService.removeFromCampaign({
        playerId: playerToRemove._id,
        campaignId: campaignId,
      });
      success('Jugador removido', `${playerToRemove.username} ha sido removido de la campaña`);
      setShowRemovePlayerDialog(false);
      setPlayerToRemove(null);
      refetch?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al remover el jugador';
      notifyError('Error', message);
    } finally {
      setIsRemovingPlayer(false);
    }
  };

  const handleDeleteCampaign = async () => {
    setIsDeletingCampaign(true);
    try {
      await campaignService.deleteCampaign(campaignId);
      success('Campaña eliminada', 'La campaña ha sido eliminada correctamente');
      router.push('/campaigns');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar la campaña';
      notifyError('Error', message);
    } finally {
      setIsDeletingCampaign(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando campaña...</span>
        </div>
      </div>
    );
  }

  if (!campaign && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Campaña no encontrada</p>
          <Button onClick={() => router.push('/campaigns')}>
            Volver a Campañas
          </Button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar Campaña</h1>
          <p className="text-muted-foreground">{campaign.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal - Formulario */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Modifica los datos básicos de la campaña
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Campaña *</Label>
                <Input
                  id="name"
                  placeholder="Nombre de la campaña"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu campaña..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <ImageUploader
                  label="Imagen de Portada"
                  value={formData.imageUrl}
                  onChange={(value) => handleInputChange('imageUrl', value)}
                  onFileChange={handleFileChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Gestionar Jugadores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Jugadores ({campaign.players?.length || 0})
              </CardTitle>
              <CardDescription>
                Gestiona los participantes de la campaña
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {campaign.players && campaign.players.length > 0 ? (
                campaign.players.map((player) => (
                  <div key={player._id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-bold">
                        {player.username?.[0]?.toUpperCase() || 'P'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{player.username}</p>
                        {player.email && (
                          <p className="text-xs text-muted-foreground">{player.email}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => openRemovePlayerDialog(player)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No hay jugadores en esta campaña
                </p>
              )}
            </CardContent>
          </Card>

          {/* Zona de Peligro */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
              <CardDescription>
                Acciones irreversibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowDeleteCampaignDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Campaña
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo de confirmación para remover jugador */}
      <AlertDialog open={showRemovePlayerDialog} onOpenChange={setShowRemovePlayerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Remover jugador?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas remover a <strong>{playerToRemove?.username}</strong> de la campaña? 
              El jugador perderá acceso a la campaña pero podrá volver a unirse si le envías una nueva invitación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovingPlayer}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemovePlayer} 
              disabled={isRemovingPlayer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemovingPlayer && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación para eliminar campaña */}
      <AlertDialog open={showDeleteCampaignDialog} onOpenChange={(open) => {
        setShowDeleteCampaignDialog(open);
        if (!open) setDeleteConfirmName('');
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar campaña?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  Esta acción no se puede deshacer. La campaña será eliminada 
                  permanentemente junto con todas sus notas e historial. Los jugadores perderán acceso inmediatamente.
                </p>
                <p>
                  Escribe <strong className="text-foreground">{campaign.name}</strong> para confirmar:
                </p>
                <Input
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder="Nombre de la campaña"
                  disabled={isDeletingCampaign}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingCampaign}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCampaign} 
              disabled={isDeletingCampaign || deleteConfirmName !== campaign.name}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingCampaign && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar Campaña
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCampaign } from "@/hooks/useCampaigns";
import { campaignService } from "@/services/campaignService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { ArrowLeft, Settings, Users, BookOpen, Plus, Loader2, Copy, Check, Link, Edit, Trash2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";
import { Note } from "@/types/campaign";

interface NoteFormData {
  title: string;
  text: string;
}

export default function CampaignDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;
  
  const { campaign, loading, error, refetch } = useCampaign(campaignId);
  const { success, error: notifyError } = useNotificationContext();
  const [isOwner, setIsOwner] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Estados para notas
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteModalMode, setNoteModalMode] = useState<'create' | 'edit'>('create');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteFormData, setNoteFormData] = useState<NoteFormData>({ title: '', text: '' });
  const [isSavingNote, setIsSavingNote] = useState(false);
  
  // Estados para eliminar nota
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeletingNote, setIsDeletingNote] = useState(false);

  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/campaigns/join/${campaignId}` 
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      success('Link copiado', 'El link de invitación ha sido copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Funciones para manejar notas
  const openCreateNoteModal = (isPrivate: boolean) => {
    setNoteModalMode('create');
    setIsPrivateNote(isPrivate);
    setEditingNote(null);
    setNoteFormData({ title: '', text: '' });
    setShowNoteModal(true);
  };

  const openEditNoteModal = (note: Note, isPrivate: boolean) => {
    setNoteModalMode('edit');
    setIsPrivateNote(isPrivate);
    setEditingNote(note);
    setNoteFormData({ title: note.title, text: note.text });
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!noteFormData.title.trim() || !noteFormData.text.trim()) {
      notifyError('Campos requeridos', 'El título y el contenido son obligatorios');
      return;
    }

    setIsSavingNote(true);
    try {
      if (noteModalMode === 'create') {
        await campaignService.addRegister(campaignId, {
          title: noteFormData.title,
          text: noteFormData.text,
          isPrivate: isPrivateNote,
        });
        success('Nota creada', 'La nota se ha creado correctamente');
      } else if (editingNote) {
        await campaignService.updateRegister(editingNote._id, {
          title: noteFormData.title,
          text: noteFormData.text,
          campaignId: campaignId,
          isPrivate: isPrivateNote,
        });
        success('Nota actualizada', 'La nota se ha actualizado correctamente');
      }
      setShowNoteModal(false);
      refetch?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar la nota';
      notifyError('Error', message);
    } finally {
      setIsSavingNote(false);
    }
  };

  const openDeleteDialog = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteDialog(true);
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    setIsDeletingNote(true);
    try {
      await campaignService.deleteRegister(noteToDelete._id, campaignId);
      success('Nota eliminada', 'La nota se ha eliminado correctamente');
      setShowDeleteDialog(false);
      setNoteToDelete(null);
      refetch?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar la nota';
      notifyError('Error', message);
    } finally {
      setIsDeletingNote(false);
    }
  };

  const canEditNote = (note: Note) => {
    // El owner puede editar todas las notas, los demás solo las suyas
    if (isOwner) return true;
    const userId = user?._id || user?.id;
    return note.owner === userId;
  };
  
  // Establecer título dinámico basado en la campaña
  usePageTitle(campaign ? `${campaign.name} - Campaña` : "Campaña");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (campaign && user) {
      // Verificar si el usuario es el dueño de la campaña
      const ownerId = typeof campaign.owner === 'string' ? campaign.owner : campaign.owner._id;
      const userId = user._id || user.id;
      setIsOwner(ownerId === userId);
    }
  }, [user, authLoading, campaign, router]);

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

  if (error || !campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Campaña no encontrada'}</p>
          <Button onClick={() => router.push('/campaigns')}>
            Volver a Campañas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isOwner ? "default" : "secondary"}>
                {isOwner ? "Propietario" : "Participante"}
              </Badge>
              <Badge variant="outline">{campaign.state}</Badge>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <Button
            variant="outline"
            onClick={() => router.push(`/campaigns/${campaignId}/edit`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.image && (
                <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                  <Image
                    src={campaign.image}
                    alt={campaign.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-muted-foreground">
                {campaign.description || "Sin descripción disponible"}
              </p>
            </CardContent>
          </Card>

          {/* Personajes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Personajes ({campaign.characters?.length || 0})
              </CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Personaje
              </Button>
            </CardHeader>
            <CardContent>
              {campaign.characters && campaign.characters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.characters.map((character, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold">Personaje {index + 1}</h4>
                      <p className="text-sm text-muted-foreground">
                        {typeof character === 'string' ? character : 'ID: ' + character}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay personajes en esta campaña
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notas Públicas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notas Públicas</CardTitle>
              <Button size="sm" variant="outline" onClick={() => openCreateNoteModal(false)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Nota
              </Button>
            </CardHeader>
            <CardContent>
              {campaign.publicEntries && campaign.publicEntries.length > 0 ? (
                <div className="space-y-4">
                  {campaign.publicEntries.map((note) => (
                    <div key={note._id} className="border-l-4 border-blue-500 pl-4 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{note.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {note.text}
                          </p>
                        </div>
                        {canEditNote(note) && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => openEditNoteModal(note, false)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(note)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay notas públicas
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Dueño */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {typeof campaign.owner === 'string' ? 'GM' : campaign.owner.username?.[0]?.toUpperCase() || 'GM'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {typeof campaign.owner === 'string' ? 'Game Master' : campaign.owner.username || 'Game Master'}
                  </p>
                  <p className="text-xs text-muted-foreground">Propietario</p>
                </div>
              </div>
              
              {/* Jugadores */}
              {campaign.players && campaign.players.length > 0 ? (
                campaign.players.map((player, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-bold">
                      {typeof player === 'string' ? 'P' : player.username?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {typeof player === 'string' ? `Jugador ${index + 1}` : player.username || `Jugador ${index + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground">Jugador</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No hay otros jugadores
                </p>
              )}
              
              {isOwner && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Invitar Jugador
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Notas Privadas (solo para el owner) */}
          {isOwner && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notas Privadas</CardTitle>
                <Button size="sm" variant="outline" onClick={() => openCreateNoteModal(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {campaign.notes && campaign.notes.length > 0 ? (
                  <div className="space-y-3">
                    {campaign.notes.map((note) => (
                      <div key={note._id} className="border-l-4 border-orange-500 pl-4 group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{note.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {note.text}
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => openEditNoteModal(note, true)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(note)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay notas privadas
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Invitación */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Jugador</DialogTitle>
            <DialogDescription>
              Comparte este link con el jugador que quieras invitar a la campaña.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={inviteLink} 
                readOnly 
                className="flex-1"
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              El jugador deberá tener una cuenta e iniciar sesión para unirse a la campaña.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Crear/Editar Nota */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {noteModalMode === 'create' ? 'Nueva Nota' : 'Editar Nota'}
              {isPrivateNote ? ' (Privada)' : ' (Pública)'}
            </DialogTitle>
            <DialogDescription>
              {isPrivateNote 
                ? 'Esta nota solo será visible para ti como propietario de la campaña.'
                : 'Esta nota será visible para todos los participantes de la campaña.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Título</Label>
              <Input
                id="note-title"
                placeholder="Título de la nota"
                value={noteFormData.title}
                onChange={(e) => setNoteFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-text">Contenido</Label>
              <Textarea
                id="note-text"
                placeholder="Escribe el contenido de la nota..."
                rows={5}
                value={noteFormData.text}
                onChange={(e) => setNoteFormData(prev => ({ ...prev, text: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteModal(false)} disabled={isSavingNote}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNote} disabled={isSavingNote}>
              {isSavingNote && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {noteModalMode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar nota */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar nota?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La nota &quot;{noteToDelete?.title}&quot; será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingNote}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteNote} 
              disabled={isDeletingNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingNote && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

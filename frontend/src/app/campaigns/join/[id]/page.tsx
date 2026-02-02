"use client"

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { campaignService } from "@/services/campaignService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Users, LogIn } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";

export default function JoinCampaignPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;
  const { success, error: notifyError } = useNotificationContext();
  
  const [status, setStatus] = useState<'loading' | 'joining' | 'success' | 'error' | 'login-required'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  usePageTitle("Unirse a Campaña");

  const joinCampaign = useCallback(async () => {
    if (!campaignId) {
      setStatus('error');
      setErrorMessage('ID de campaña no válido');
      return;
    }

    setStatus('joining');
    
    try {
      await campaignService.joinCampaign(campaignId);
      setStatus('success');
      success('¡Te has unido!', 'Ahora eres parte de esta campaña');
      
      // Redirigir a la campaña después de un momento
      setTimeout(() => {
        router.push(`/campaigns/${campaignId}`);
      }, 2000);
    } catch (err) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Error al unirse a la campaña';
      setErrorMessage(message);
      notifyError('Error', message);
    }
  }, [campaignId, router, success, notifyError]);

  useEffect(() => {
    // Esperar a que se cargue la autenticación
    if (authLoading) return;

    // Si no hay usuario, mostrar opción de login
    if (!user) {
      setStatus('login-required');
      return;
    }

    // Si hay usuario, intentar unirse
    joinCampaign();
  }, [user, authLoading, joinCampaign]);

  const handleLogin = () => {
    // Guardar la URL actual para redirigir después del login
    localStorage.setItem('redirectAfterLogin', `/campaigns/join/${campaignId}`);
    router.push('/login');
  };

  const handleRegister = () => {
    localStorage.setItem('redirectAfterLogin', `/campaigns/join/${campaignId}`);
    router.push('/register');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Unirse a Campaña</CardTitle>
            <CardDescription>
              Has sido invitado a unirte a una aventura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado: Cargando autenticación */}
            {(status === 'loading' || authLoading) && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Verificando...</p>
              </div>
            )}

            {/* Estado: Requiere login */}
            {status === 'login-required' && (
              <div className="text-center space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <LogIn className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Necesitas iniciar sesión para unirte a esta campaña
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleLogin} className="w-full">
                    Iniciar Sesión
                  </Button>
                  <Button onClick={handleRegister} variant="outline" className="w-full">
                    Crear Cuenta
                  </Button>
                </div>
              </div>
            )}

            {/* Estado: Uniéndose */}
            {status === 'joining' && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Uniéndote a la campaña...</p>
              </div>
            )}

            {/* Estado: Éxito */}
            {status === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">¡Te has unido exitosamente!</h3>
                <p className="text-muted-foreground mb-4">
                  Serás redirigido a la campaña en unos segundos...
                </p>
                <Button onClick={() => router.push(`/campaigns/${campaignId}`)}>
                  Ir a la Campaña
                </Button>
              </div>
            )}

            {/* Estado: Error */}
            {status === 'error' && (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h3 className="text-lg font-semibold mb-2">No se pudo unir</h3>
                <p className="text-muted-foreground mb-4">{errorMessage}</p>
                <div className="flex flex-col gap-2">
                  <Button onClick={joinCampaign} variant="outline">
                    Reintentar
                  </Button>
                  <Button onClick={() => router.push('/campaigns')} variant="ghost">
                    Ir a Mis Campañas
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

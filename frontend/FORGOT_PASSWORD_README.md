# Forgot Password Implementation

Este componente maneja todo el flujo de recuperación de contraseña de forma autocontenida, incluyendo todas las interacciones con la API.

## Componentes Creados

### 1. `ForgotPassword` Component
**Ubicación:** `src/components/forgot-password.tsx`

**Características:**
- ✅ Modal autocontenido con toda la lógica interna
- ✅ Maneja la API de `/auth/forgot-password` internamente
- ✅ Estados de carga, éxito y error
- ✅ Validación de email
- ✅ Auto-cierre después del éxito
- ✅ Trigger personalizable o por defecto
- ✅ Soporte para email predeterminado

**Uso:**
```tsx
// Uso básico con trigger por defecto
<ForgotPassword />

// Uso con email predeterminado
<ForgotPassword defaultEmail={userEmail} />

// Uso con trigger personalizado
<ForgotPassword 
  trigger={<Button variant="link">¿Olvidaste tu contraseña?</Button>}
  defaultEmail={userEmail}
  onClose={() => console.log('Modal cerrado')}
/>
```

### 2. `ResetPassword` Component
**Ubicación:** `src/components/reset-password.tsx`

**Características:**
- ✅ Formulario para nueva contraseña
- ✅ Validación de confirmación de contraseña
- ✅ Extrae token de URL automáticamente
- ✅ Maneja la API de `/auth/reset-password` internamente
- ✅ Redirección automática después del éxito
- ✅ Manejo de tokens inválidos/expirados

### 3. Reset Password Page
**Ubicación:** `src/app/reset-password/page.tsx`

Página que se accede desde el enlace del email de recuperación.

## Backend Changes

### 1. Route Fix
**Archivo:** `backend/routes/login.ts`
- Cambiado de `GET` a `POST` para `/forgot-password`

### 2. Controller Update
**Archivo:** `backend/controllers/auth.controller.ts`
- URL del frontend actualizada para usar variable de entorno
- Título del email cambiado a "Mesa Virtual"

## Flujo Completo

1. **Usuario hace clic en "Olvidaste tu contraseña?"**
   - Se abre el modal de `ForgotPassword`
   - Email se pre-rellena si está disponible

2. **Usuario ingresa email y envía**
   - Component hace POST a `/auth/forgot-password`
   - Backend genera token JWT y envía email
   - Modal muestra mensaje de éxito y se cierra automáticamente

3. **Usuario recibe email y hace clic en enlace**
   - Navega a `/reset-password?token=<JWT>`
   - Component `ResetPassword` extrae token de URL

4. **Usuario ingresa nueva contraseña**
   - Component hace PUT a `/auth/reset-password`
   - Backend valida token y actualiza contraseña
   - Redirección automática a `/login`

## Configuración de Entorno

Agregar al backend:
```env
FRONTEND_URL=http://localhost:3000  # Para desarrollo
# o
FRONTEND_URL=https://tu-dominio.com  # Para producción
```

## Integración en Login Form

El `login-form.tsx` ahora usa:
```tsx
import { ForgotPassword } from '@/components/forgot-password';

// En lugar del enlace estático:
<ForgotPassword defaultEmail={email} />
```

## Características de UX

- **Responsive Design**: Funciona en mobile y desktop
- **Loading States**: Feedback visual durante operaciones
- **Error Handling**: Mensajes claros de error
- **Success Feedback**: Confirmación visual con iconos
- **Auto-close**: Modales se cierran automáticamente
- **Keyboard Support**: ESC para cerrar modal
- **Accessibility**: Labels apropiados y ARIA attributes

## Styling

Usa el sistema de diseño existente:
- Componentes UI de shadcn/ui
- CSS variables para temas
- Consistente con el resto de la aplicación

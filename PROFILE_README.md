# Página de Perfil de Usuario

## Descripción
La página de perfil permite a los usuarios ver y editar su información personal de cuenta, incluyendo nombre de usuario, email, foto de perfil y contraseña.

## Características

### Visualización del Perfil
- **Avatar del Usuario**: Muestra la foto de perfil del usuario o sus iniciales como fallback
- **Información Personal**: Nombre de usuario, email y fecha de registro
- **Estadísticas**: ID de usuario (últimos 8 caracteres), estado de la cuenta y tipo de usuario

### Edición del Perfil
- **Modo de Edición**: Al hacer clic en "Editar Perfil" se habilita el modo de edición
- **Campos Editables**:
  - Nombre de usuario
  - Correo electrónico
  - Foto de perfil (usando el componente ImageUploader)
  - Cambio de contraseña (opcional)

### Seguridad
- **Contraseña Actual Requerida**: Para cualquier cambio se requiere ingresar la contraseña actual
- **Cambio de Contraseña Opcional**: Se puede dejar vacío para mantener la contraseña actual
- **Botón de Mostrar/Ocultar Contraseña**: Para mejor usabilidad

### Validaciones
- Campos obligatorios: nombre de usuario, email y contraseña actual
- Validación de formato de email
- Manejo de errores con notificaciones

## Componentes Utilizados

### UI Components
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button`, `Input`, `Label`
- `Avatar`, `AvatarFallback`, `AvatarImage`
- `Separator`, `Badge`

### Funcionalidad
- `ProtectedRoute`: Protege la ruta para usuarios autenticados
- `ImageUploader`: Permite subir y cambiar la foto de perfil
- `useAuth`: Hook para acceder a la información del usuario autenticado
- `useNotifications`: Hook para mostrar notificaciones de éxito/error

## Estados de la Página

1. **Cargando**: Muestra un skeleton loader mientras carga la información
2. **Error**: Muestra mensaje de error si no se puede cargar el perfil
3. **Vista**: Modo de solo lectura con opción de editar
4. **Edición**: Modo de edición con formulario y botones de acción

## Flujo de Usuario

1. El usuario accede a `/profile`
2. Se verifica que esté autenticado (ProtectedRoute)
3. Se carga la información del perfil desde el backend
4. El usuario puede:
   - Ver su información actual
   - Hacer clic en "Editar Perfil" para modificar datos
   - Cambiar foto de perfil, nombre, email o contraseña
   - Guardar cambios o cancelar la edición

## API Endpoints

- `GET /api/getProfile/:userId` - Obtiene la información del perfil
- `PATCH /api/alterProfile/:userId` - Actualiza la información del perfil

## Tipos de Datos

```typescript
interface UserProfile {
  _id: string;
  username: string;
  email: string;
  joinDate: string;
  pictureRoute?: string;
}
```

## Navegación
- Botón "Atrás" para volver a la página anterior
- Redirección a campañas si hay error al cargar el perfil

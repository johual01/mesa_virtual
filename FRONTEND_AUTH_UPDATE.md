# Actualización de Autenticación - Frontend

## Cambios Realizados

### 1. Modificación del ApiService (`/src/lib/api.ts`)

Se ha actualizado el `ApiService` para que **automáticamente incluya el `userId` en todas las peticiones autenticadas**:

#### Nuevos métodos privados:
- `getUserId()`: Extrae el ID del usuario desde localStorage
- `getWithBody()`: Método GET especial que incluye el userId en el body (para compatibilidad con endpoints específicos)

#### Comportamiento automático:
- **POST, PUT, PATCH**: Incluyen automáticamente `userId` en el body
- **GET**: Método estándar sin modificaciones, más un método especial `getWithBody`
- **DELETE**: Sin modificaciones

### 2. Servicios Actualizados

#### `campaignService.ts`
- ✅ Actualizado para usar el nuevo sistema
- ✅ `getCampaign()` ahora obtiene userId correctamente del localStorage

#### `characterService.ts`
- ✅ Todos los métodos actualizados
- ✅ `getCreateCharacterInfo()` usa `getWithBody()` 
- ✅ `getLevelUpInfo()` usa `getWithBody()`
- ✅ Agregados métodos de inventario faltantes
- ✅ Agregado método `getSecondaryFeatures()`

#### Nuevos servicios creados:
- ✅ `profileService.ts` - Gestión de perfiles de usuario
- ✅ `characterFeaturesService.ts` - Gestión de características de personajes
- ✅ `characterSpellsService.ts` - Gestión de hechizos de personajes
- ✅ `index.ts` - Exportación centralizada de todos los servicios

### 3. Validación Backend

El backend ya está configurado para validar que todas las peticiones autenticadas incluyan:
- `req.body.userId` (para métodos POST, PUT, PATCH)
- `req.params.userId` (para rutas específicas como `/getProfile/:userId`)

### 4. Casos Especiales

#### Rutas GET que necesitan userId en el body:
- `/api/getCreateCharacterInfo` → Usa `getWithBody()`
- `/api/getLevelUpInfo/:characterId` → Usa `getWithBody()`
- `/api/getSecondaryFeatures/:characterId` → Usa `getWithBody()`

#### Rutas que ya tienen userId en parámetros:
- `/api/getProfile/:userId` → Funciona normalmente
- `/api/getCampaign/:userId/:campaignId` → Funciona normalmente

## Resultado

✅ **Todas las peticiones autenticadas ahora incluyen automáticamente el `userId`**
✅ **Compatibilidad completa con el middleware de validación del backend**
✅ **No se requieren cambios en componentes existentes**
✅ **Sistema escalable para futuras funcionalidades**

El frontend ahora cumple con el requerimiento de que todas las peticiones autenticadas incluyan `req.body.userId` o `req.params.userId` como esperado por el middleware de validación del backend.

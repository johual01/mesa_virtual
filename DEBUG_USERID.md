# Debug: Problema con userId en peticiones

## Pasos para depurar el problema 406

### 1. Verificar el usuario en localStorage

Abre las Developer Tools del navegador y ejecuta:

```javascript
// Verificar si hay usuario guardado
const userStr = localStorage.getItem('user');
console.log('User string:', userStr);

if (userStr) {
  const user = JSON.parse(userStr);
  console.log('Parsed user:', user);
  console.log('User ID:', user._id || user.id);
}

// Verificar token
const token = localStorage.getItem('token');
console.log('Token:', token);
```

### 2. Verificar logs del API Service

Ahora las peticiones `POST` y `getWithBody` mostrarán logs en la consola con:
- endpoint
- originalData
- bodyData (que debería incluir userId)
- userId extraído

### 3. Verificar estructura del usuario devuelto por el backend

Ejecuta una petición de login y revisa la respuesta en Network Tab:

**Estructura esperada del backend:**
```json
{
  "message": "Usuario autenticado",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "user": "nombreUsuario",
    "email": "email@ejemplo.com"
  },
  "token": "jwt_token_aqui"
}
```

### 4. Verificar refresh token

Si el usuario se autentica por refresh token, verificar que la estructura sea consistente.

### 5. Peticiones que deberían funcionar ahora

- ✅ `POST /api/getCampaigns` - Automáticamente incluye userId
- ✅ `POST /api/createCharacter` - Automáticamente incluye userId  
- ✅ `GET /api/getCreateCharacterInfo` - Usa getWithBody() que incluye userId
- ✅ Todas las peticiones POST/PUT/PATCH - Automáticamente incluyen userId

### 6. Si el problema persiste

Revisar:
1. ¿Se está guardando correctamente el user en localStorage?
2. ¿El user._id existe en la estructura del usuario?
3. ¿Las peticiones muestran userId en los logs de la consola?
4. ¿El backend está recibiendo el userId en req.body?

### 7. Quitar logs de debug

Una vez resuelto el problema, eliminar los console.log agregados en:
- `frontend/src/lib/api.ts` (getUserId, post, getWithBody)

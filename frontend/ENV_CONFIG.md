# Configuración de Variables de Entorno

Para el correcto funcionamiento del frontend, necesitas crear un archivo `.env.local` en la carpeta `frontend/` con las siguientes variables:

```env
# URL base del backend API
NEXT_PUBLIC_URL_API=http://localhost:3001

# Configuración de desarrollo (opcional)
NODE_ENV=development
```

## Para Producción

```env
# URL de tu backend en producción
NEXT_PUBLIC_URL_API=https://tu-api.herokuapp.com

# Modo producción
NODE_ENV=production
```

## Notas Importantes

- El prefijo `NEXT_PUBLIC_` es necesario para que las variables estén disponibles en el cliente
- Asegúrate de que el backend esté ejecutándose en la URL especificada
- Para desarrollo local, el backend típicamente corre en el puerto 3001

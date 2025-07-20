# Mesa Virtual - Frontend

Frontend de la aplicación web "Mesa Virtual" para gestión de campañas y personajes de rol de mesa.

## 🚀 Funcionalidades Implementadas

### ✅ Gestión de Campañas
- **Visualizar mis campañas**: Lista todas las campañas donde soy owner o jugador
- **Crear campaña**: Formulario completo con nombre, descripción, imagen y notas
- **Ver detalles de campaña**: Información completa, participantes, personajes y notas
- **Diferenciación visual**: Distinción entre campañas propias y campañas donde participo
- **Edición de campañas**: Para propietarios de campañas
- **Gestión de notas**: Notas públicas y privadas (privadas solo para el owner)

### ✅ Gestión de Personajes
- **Visualizar fichas**: Lista de todos mis personajes con información básica
- **Crear personaje**: Formulario extenso con historia, personalidad, apariencia, etc.
- **Ver detalles de personaje**: Información completa del personaje
- **Editar fichas**: Modificación de datos y estado del personaje
- **Asociar a campaña**: Selección de campaña al crear/editar personaje
- **Gestión de estados**: Activo, muerto, inactivo, eliminado, NPC
- **Soporte de sistemas**: D&D 5E y Persona D20

### ✅ Características Técnicas
- **Autenticación completa**: Login, registro, refresh tokens
- **Navegación responsiva**: Adaptable a móviles, tablets y desktop
- **Notificaciones**: Sistema de feedback para todas las acciones
- **Carga de imágenes**: Soporte para URLs e imágenes locales
- **Tema claro/oscuro**: Alternancia automática según preferencias del sistema
- **Estados de carga**: Indicadores visuales para todas las operaciones
- **Manejo de errores**: Gestión robusta de errores con mensajes informativos

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **UI**: Tailwind CSS + Radix UI components
- **Estado**: React Context + Custom Hooks
- **Tipos**: TypeScript estricto
- **Autenticación**: JWT con refresh tokens
- **Iconos**: Lucide React
- **HTTP**: Fetch API nativo

## 📁 Estructura del Proyecto

```
src/
├── app/                      # App Router pages
│   ├── campaigns/           # Páginas de campañas
│   ├── characters/          # Páginas de personajes
│   └── layout.tsx           # Layout principal
├── components/              # Componentes React
│   ├── ui/                  # Componentes UI base
│   ├── layout/              # Componentes de layout
│   └── Dashboard.tsx        # Dashboard principal
├── context/                 # Contextos de React
│   ├── auth.tsx            # Contexto de autenticación
│   └── notifications.tsx    # Contexto de notificaciones
├── hooks/                   # Custom hooks
│   ├── useAuth.ts          # Hook de autenticación
│   ├── useCampaigns.ts     # Hooks de campañas
│   └── useCharacters.ts    # Hooks de personajes
├── lib/                     # Librerías y utilidades
│   ├── api.ts              # Cliente API
│   └── utils.ts            # Utilidades
├── services/                # Servicios API
│   ├── campaignService.ts  # Servicio de campañas
│   └── characterService.ts # Servicio de personajes
└── types/                   # Definiciones TypeScript
    ├── campaign.ts         # Tipos de campañas
    ├── character.ts        # Tipos de personajes
    └── api.ts             # Tipos API
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend funcionando en puerto 3001

### Pasos de instalación

1. **Navegar al directorio del frontend**:
```bash
cd frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_URL_API=http://localhost:3001
```

4. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

5. **Abrir en el navegador**:
```
http://localhost:3000
```

## 📋 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Construir para producción
npm run start    # Ejecutar build de producción
npm run lint     # Verificar código con ESLint
```

## 🎯 Flujo de Usuario

### Dashboard Principal
- Acceso rápido a campañas y personajes
- Estadísticas básicas
- Navegación intuitiva

### Gestión de Campañas
1. **Ver todas mis campañas** → `/campaigns`
2. **Crear nueva campaña** → `/campaigns/create`
3. **Ver detalles** → `/campaigns/[id]`
4. **Editar campaña** → `/campaigns/[id]/edit` (solo owner)

### Gestión de Personajes
1. **Ver todos mis personajes** → `/characters`
2. **Crear nuevo personaje** → `/characters/create`
3. **Ver detalles** → `/characters/[id]`
4. **Editar personaje** → `/characters/[id]/edit`

## 🔒 Permisos y Seguridad

- **Autenticación requerida**: Todas las funcionalidades requieren login
- **Propietario de campaña**: Solo puede editar, agregar notas privadas y gestionar jugadores
- **Propietario de personaje**: Solo puede editar sus propios personajes
- **Tokens JWT**: Gestión automática con refresh tokens
- **Validación de formularios**: Validación tanto cliente como servidor

## 🎨 Características de UI/UX

- **Responsive Design**: Funciona en todos los dispositivos
- **Modo Oscuro/Claro**: Cambia automáticamente según preferencias
- **Notificaciones**: Feedback visual para todas las acciones
- **Estados de Carga**: Spinners y estados para mejor UX
- **Navegación Intuitiva**: Breadcrumbs y navegación clara
- **Componentes Accesibles**: Cumple estándares de accesibilidad

## 🔧 Personalización

### Añadir Nuevos Sistemas de Juego
1. Actualizar `types/character.ts` con el nuevo enum
2. Agregar al formulario en `characters/create/page.tsx`
3. Actualizar las funciones de mapeo de etiquetas

### Modificar Campos de Personaje
1. Actualizar interfaces en `types/character.ts`
2. Modificar formularios de creación/edición
3. Actualizar servicios API si es necesario

### Añadir Nuevas Páginas
1. Crear en `app/` siguiendo el App Router de Next.js
2. Agregar al menú de navegación
3. Implementar componentes reutilizables

## 🐛 Solución de Problemas

### Error de Conexión con Backend
- Verificar que el backend esté ejecutándose en puerto 3001
- Revisar la variable `NEXT_PUBLIC_URL_API`
- Comprobar CORS en el backend

### Problemas de Autenticación
- Limpiar localStorage y cookies
- Verificar tokens JWT en el backend
- Revisar configuración de cookies

### Errores de Compilación TypeScript
- Ejecutar `npm run lint` para ver errores específicos
- Verificar que todas las interfaces estén correctamente tipadas
- Revisar imports y exports

## 📞 Próximas Mejoras

- [ ] Subida real de imágenes a storage (S3/MinIO)
- [ ] Paginación para listas grandes
- [ ] Filtros avanzados en campañas y personajes
- [ ] Invitaciones por email a campañas
- [ ] Chat en tiempo real para campañas
- [ ] Sistema de dados integrado
- [ ] Exportación de fichas a PDF
- [ ] Modo offline con sincronización

---

**Desarrollado con ❤️ para la comunidad de rol de mesa**

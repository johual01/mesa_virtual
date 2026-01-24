# Requisitos Funcionales - Mesa Virtual (Persona D20)

## Información General del Proyecto

**Sistema:** Aplicación web para gestión de campañas de rol basadas en el sistema Persona D20 (adaptación de D&D 5e con mecánicas de la saga Persona)

**Arquitectura:** 
- Backend: Node.js + Express + TypeScript + MongoDB
- Frontend: Next.js + React + TypeScript + TailwindCSS

**Fecha del documento:** Enero 2026

---

## Índice

1. [Módulo de Autenticación](#1-módulo-de-autenticación)
2. [Módulo de Perfil de Usuario](#2-módulo-de-perfil-de-usuario)
3. [Módulo de Campañas](#3-módulo-de-campañas)
4. [Módulo de Personajes](#4-módulo-de-personajes)
5. [Módulo de Combate y Estadísticas](#5-módulo-de-combate-y-estadísticas)
6. [Módulo de Hechizos y Habilidades](#6-módulo-de-hechizos-y-habilidades)
7. [Módulo de Inventario y Equipamiento](#7-módulo-de-inventario-y-equipamiento)
8. [Sistema de Notificaciones](#8-sistema-de-notificaciones)
9. [Requisitos de UI/UX](#9-requisitos-de-uiux)

---

## 1. Módulo de Autenticación

### 1.1 Funcionalidades Core

**Registro de Usuario**
- Formulario con campos:
  - Username (mínimo 4 caracteres, único)
  - Email (único, validación de formato)
  - Password (encriptado con bcrypt)
  - Confirmación de password
- Validación en tiempo real de disponibilidad de username/email
- Fecha de registro automática
- Redirección automática al login tras registro exitoso

**Login**
- Formulario con email/username y password
- Sistema de autenticación JWT (JSON Web Token)
- Opción "Recordarme" para persistencia de sesión
- Manejo de tokens de refresh
- Redirección a dashboard tras login exitoso

**Recuperación de Contraseña**
- Formulario "Olvidé mi contraseña" (modal o página)
- Envío de email con enlace de recuperación
- Página de reset con token temporal
- Validación de token de recuperación
- Formulario para nueva contraseña

**Cierre de Sesión**
- Botón de logout accesible desde header/navbar
- Limpieza de tokens y localStorage
- Redirección a página de login

### 1.2 Protección de Rutas

- Componente `ProtectedRoute` para rutas privadas
- Verificación de token válido antes de cargar contenido
- Redirección automática a login si no autenticado
- Validación de expiración de token

### 1.3 UI/UX Específico

- Componente `LoginForm` con diseño moderno
- Componente `RegisterForm` 
- Componente `ForgotPasswordModal`
- Componente `ResetPassword`
- Mensajes de error claros y en español
- Indicadores de carga durante procesos de autenticación
- Dark mode / Light mode support (theme-provider)

---

## 2. Módulo de Perfil de Usuario

### 2.1 Visualización de Perfil

**Datos del Usuario**
- Username
- Email
- Fecha de registro (joinDate)
- Foto de perfil (pictureRoute)

**Estadísticas del Usuario** (opcional)
- Número de personajes creados
- Número de campañas activas
- Campañas como jugador vs como DM/owner

### 2.2 Edición de Perfil

**Campos Editables**
- Username (validación de unicidad)
- Email (validación de unicidad y formato)
- Foto de perfil
  - Componente `ImageUploader`
  - Soporte para subida de archivos
  - Preview antes de confirmar
  - Validación de formato y tamaño

**Cambio de Contraseña**
- Formulario separado o sección específica
- Validación de contraseña actual
- Confirmación de nueva contraseña

### 2.3 Endpoints Relacionados
- `GET /api/getProfile/:userId` - Obtener datos del perfil
- `PATCH /api/alterProfile/:userId` - Actualizar perfil

---

## 3. Módulo de Campañas

### 3.1 Listado de Campañas

**Vista Principal**
- Grid/lista de campañas del usuario
- Diferenciación visual entre:
  - Campañas donde es owner (DM/Narrador)
  - Campañas donde es jugador
- Estados de campaña:
  - `ACTIVE`: Campaña activa
  - `INACTIVE`: Campaña pausada
  - `DELETED`: Campaña eliminada (soft delete)

**Tarjeta de Campaña (CampaignSummary)**
- Nombre de la campaña
- Imagen/banner
- Descripción breve
- Owner/DM
- Número de jugadores
- Número de personajes
- Estado
- Fecha de creación
- Acciones rápidas (ver, editar, eliminar)

### 3.2 Creación de Campaña

**Formulario de Creación**
- Nombre de la campaña (mínimo 4 caracteres)
- Descripción (texto enriquecido recomendado)
- Imagen/banner de campaña
- Sistema de juego (por defecto PERSONAD20)
- Owner automático (usuario actual)
- Estado inicial: ACTIVE

**Validaciones**
- Nombre obligatorio
- Longitud mínima del nombre

### 3.3 Visualización de Campaña

**Información General**
- Nombre, descripción, imagen
- Owner/DM
- Lista de jugadores
- Lista de personajes en la campaña
- Estado de la campaña

**Pestañas/Secciones**

1. **Jugadores**
   - Lista de jugadores participantes
   - Avatar/foto de cada jugador
   - Personajes de cada jugador en esta campaña
   - Opción para remover jugadores (solo owner)
   - Invitar nuevos jugadores (código/enlace de invitación)

2. **Personajes**
   - Grid de personajes de la campaña
   - Filtros por jugador, estado, clase
   - Acceso rápido a ficha de personaje
   - Indicador de personajes activos/inactivos/muertos/NPCs

3. **Notas Privadas** (solo owner)
   - CRUD de notas privadas del DM
   - Editor de texto enriquecido
   - Organización por categorías/tags
   - Búsqueda de notas

4. **Entradas Públicas**
   - Notas visibles para todos los jugadores
   - Diario de sesiones
   - Anuncios importantes
   - Información del mundo/setting

5. **Historial**
   - Log de eventos de la campaña
   - Registro automático de:
     - Creación/eliminación de personajes
     - Entrada/salida de jugadores
     - Muertes de personajes
     - Eventos importantes
   - Origen: USER o SYSTEM
   - Timestamp de cada evento

### 3.4 Edición de Campaña

**Campos Editables** (solo owner)
- Nombre
- Descripción
- Imagen
- Estado (ACTIVE/INACTIVE)

### 3.5 Gestión de Jugadores

**Unirse a Campaña**
- Sistema de invitación por código/enlace
- `POST /api/joinCampaign/:campaignId`
- Validación de que el usuario no esté ya en la campaña
- Notificación al owner de nuevo jugador

**Remover Jugador**
- Solo owner puede remover
- Confirmación antes de remover
- Los personajes del jugador permanecen pero quedan inactivos
- Notificación al jugador removido

### 3.6 Gestión de Notas/Registros

**Agregar Nota**
- Título
- Contenido (texto enriquecido)
- Tipo: Privada (notes) o Pública (publicEntries)
- Timestamp automático

**Editar Nota**
- Solo owner puede editar
- Actualización de timestamp

**Eliminar Nota**
- Soft delete o hard delete
- Confirmación antes de eliminar

### 3.7 Eliminación de Campaña

- Solo owner puede eliminar
- Confirmación con nombre de campaña
- Soft delete (estado = DELETED)
- Los personajes asociados permanecen pero quedan huérfanos

### 3.8 Endpoints del Módulo
- `POST /api/getCampaigns` - Listar campañas del usuario
- `PUT /api/createCampaign` - Crear nueva campaña
- `GET /api/getCampaign/:userId/:campaignId` - Ver detalle
- `PATCH /api/editCampaign/:campaignId` - Editar campaña
- `POST /api/joinCampaign/:campaignId` - Unirse a campaña
- `PUT /api/addRegister/:campaignId` - Agregar nota/registro
- `PATCH /api/updateRegister/:registerId` - Actualizar registro
- `DELETE /api/deleteRegister/:registerId` - Eliminar registro
- `POST /api/removeFromCampaign` - Remover jugador
- `POST /api/deleteCampaign/:campaignId` - Eliminar campaña

---

## 4. Módulo de Personajes

### 4.1 Creación de Personaje

**Flujo de Creación** (Wizard multi-paso recomendado)

**Paso 1: Información Básica**
- Nombre del personaje (obligatorio)
- Sistema: PERSONAD20 (fijo o seleccionable)
- Foto/avatar del personaje (ImageUploader)
- Campaña asociada (opcional, dropdown de campañas del usuario)
- Estado inicial:
  - ACTIVE: Personaje jugable activo
  - INACTIVE: Personaje reserva
  - NON_PLAYER: NPC

**Paso 2: Backstory/Trasfondo**
- Historia (history): Texto largo, pasado del personaje
- Personalidad (personality): Rasgos de personalidad
- Apariencia (appearance): Descripción física
- Rasgos (traits): Características positivas
- Defectos (defects): Debilidades o flaws
- Ideales (ideals): Principios y valores
- Sueños (dreams): Metas y aspiraciones
- Vínculos (bonds): Relaciones importantes
- Trauma (trauma): Eventos traumáticos

**Paso 3: Clase y Subclase**
- Selección de clase principal
  - Lista de clases disponibles obtenidas de `/api/getCreateCharacterInfo`
  - Cada clase muestra:
    - Nombre
    - Descripción
    - Dado de vida (HPDice)
    - Salvaciones principales
    - Tipo(s) de recurso (AP, HP, SP, puntos especiales)
- Subclase (opcional en nivel 1, seleccionable en niveles específicos según clase)

**Paso 4: Estadísticas Primarias** (Persona D20)
- **5 estadísticas principales:**
  - Carisma (Charisma): Influencia social, curación, salvaciones mágicas
  - Coraje (Courage): Puntos de vida, defensa física
  - Destreza (Dexterity): Defensa, iniciativa, ataques a distancia
  - Instintos (Instincts): Defensa mágica, percepción, iniciativa
  - Conocimiento (Knowledge): Poder mágico, AP, lanzamiento de hechizos

**Métodos de Asignación:**
- Compra de puntos (point buy)
- Tirada de dados (rolling)
- Array estándar

**Paso 5: Habilidades Secundarias** (20 habilidades)
- Lista completa de habilidades secundarias:
  - Acrobacia (Acrobatics)
  - Arte (Art)
  - Atletismo (Athletics)
  - Consciencia (Consciousness)
  - Empatía (Empathy)
  - Expresión (Expression)
  - Folclore (Folklore)
  - Artesanía (Handcraft)
  - Investigación (Investigation)
  - Meditación (Meditation)
  - Misticismo (Mysticism)
  - Orientación (Orientation)
  - Regateo (Quibble)
  - Reflejos (Reflexes)
  - Velocidad (Speed)
  - Sigilo (Stealth)
  - Fuerza (Strength)
  - Tecnología (Technology)
  - Callejeo (Streetwise)
  - Fuerza de voluntad (Willpower)

**Para cada habilidad:**
- Estadística base asociada (personaStadistics)
- Bonificador de la estadística
- Competencia (isProficient: true/false)
- Bonificador total = bonus estadística + (proficiency si aplica)

**Paso 6: Elementos y Afinidades**
- **Afinidad elemental principal** (affinity):
  - PSY, NUKE, FIRE, ICE, ELEC, WIND, CURSE, BLESS, ALMIGHTY
  - SLASH, STRIKE, PIERCE (físicos)
  
- **Afinidad secundaria** (opcional, se gana en ciertos niveles)

- **Resistencias** (array): Elementos que reciben menos daño
- **Debilidades** (array): Elementos que reciben más daño
- **Inmunidades** (array): Elementos que no causan daño
- **Reflejos** (array): Elementos que se devuelven al atacante

**Paso 7: Equipamiento Inicial**
- Selección de arma inicial (según clase)
- Armadura inicial (según clase)
- Kit de aventurero
- Dinero inicial (money)

**Paso 8: Hechizos Iniciales** (si aplica)
- Selección de hechizos conocidos según clase
- Hechizos preparados iniciales
- Puntos de hechizo (SP) iniciales

**Paso 9: Nombre de Persona**
- Campo "persona" (nombre de la Persona/espíritu del personaje)
- Descripción opcional de la Persona

**Paso 10: Revisión y Confirmación**
- Resumen de todas las selecciones
- Posibilidad de volver atrás y editar
- Botón "Crear Personaje"

### 4.2 Listado de Personajes

**Vista de Personajes del Usuario**
- Grid/lista de todos los personajes
- Filtros:
  - Por campaña
  - Por estado (ACTIVE, INACTIVE, DEAD, DELETED, NON_PLAYER)
  - Por sistema
  - Por clase

**Tarjeta de Personaje (CharacterSummary)**
- Avatar/imagen
- Nombre
- Nivel
- Clase y subclase
- Sistema
- Campaña asociada (si tiene)
- Estado
- Acciones rápidas (ver, editar, eliminar)

### 4.3 Ficha de Personaje (Vista Detallada)

**Layout Principal** (Pestañas o secciones expandibles)

#### 4.3.1 Pestaña: General/Resumen

**Encabezado de Personaje**
- Imagen/avatar grande
- Nombre
- Clase y subclase
- Nivel actual
- Barra de experiencia (XP actual / XP para siguiente nivel)
- Nombre de Persona
- Estado del personaje

**Estadísticas Primarias** (Display prominente)
- Carisma, Coraje, Destreza, Instintos, Conocimiento
- Modificadores de cada estadística
- Bonificador de competencia (proficiency)

**Recursos Principales**
- HP actual / HP máximo (barra de vida visual)
  - HP temporales si los hay
  - Indicador de HP acumulativo temporal
- SP actual / SP máximo (barra de hechizo/stamina)
- AP actual / AP máximo (puntos de acción)
- Recursos especiales de clase (Rage Points, Morale Points, etc.)
- Dinero (money)
- Inspiración (si aplica)

**Estadísticas de Combate** (resumen)
- Defensa física (defense)
- Defensa mágica (magicDefense)
- Iniciativa
- Velocidad de movimiento
- Rango de ataque cuerpo a cuerpo
- Rango de ataque a distancia

**Acciones por Turno**
- Acciones (actions)
- Acciones bonus (bonusActions)
- Reacciones (reactions)
- Movimiento

#### 4.3.2 Pestaña: Backstory

**Visualización del Trasfondo**
- Secciones expandibles o tabs para cada aspecto:
  - Historia
  - Personalidad
  - Apariencia
  - Rasgos
  - Defectos
  - Ideales
  - Sueños
  - Vínculos
  - Trauma

**Edición**
- Modo lectura por defecto
- Botón "Editar" para cambiar a modo edición
- Editor de texto enriquecido recomendado
- Guardar/cancelar cambios

#### 4.3.3 Pestaña: Habilidades Secundarias

**Lista de 20 Habilidades**
- Tabla o grid organizada
- Cada habilidad muestra:
  - Nombre
  - Estadística base
  - Bonificador base
  - Competencia (checkbox o badge)
  - Bonificador total
  - Icono de dado para tiradas rápidas (futuro)

**Selección de Competencias**
- Número limitado según clase y nivel
- Interfaz para marcar/desmarcar competencias
- Validación de límite de competencias
- Endpoint: `GET /api/getSecondaryFeatures/:characterId`
- Endpoint: `PATCH /api/updateSelectedSecondaryFeatures/:characterId`

#### 4.3.4 Pestaña: Rasgos y Características (Features)

**Características de Clase**
- Lista de todas las features del personaje
- Organizadas por origen:
  - Clase base
  - Subclase
  - Raza (si aplica)
  - Personalizadas/Custom

**Para cada Feature:**
- Nombre
- Descripción
- Tipo de uso: Activo (active) / Pasivo (passive)
- Acción requerida (action, bonus_action, reaction, free, none)
- Coste (cost): recursos necesarios
- Rango (range): alcance del efecto
- Objetivo (target): quien se ve afectado
- Duración (duration)
- Usos disponibles / usos máximos
- Trigger (cuándo se activa)
- Condiciones de activación
- Efectos (effects): qué hace exactamente
- Modificadores (modifiers): qué stats/valores modifica
- Estado: ACTIVE / INACTIVE

**Gestión de Features**
- Activar/desactivar features
  - `POST /api/changeFeatureStatus/:characterId/:featureId`
- Agregar feature personalizada
  - `POST /api/addCustomFeature/:characterId`
  - Formulario modal con todos los campos
- Editar feature personalizada
  - `PATCH /api/editCustomFeature/:characterId/:featureId`
- Contador de usos (para features con usos limitados)
- Indicador de recarga (por descanso corto/largo, combate, etc.)

**Sub-Features**
- Features que otorgan otras features
- Vista jerárquica/anidada
- Ejemplo: "Invocación del Evocador" otorga "Invocar Elemental de Fuego"

#### 4.3.5 Pestaña: Hechizos (Spells)

**Vista General de Hechizos**
- Recursos de hechizo:
  - SP actual / máximo
  - Contador de AP (si usa sistema de AP)
  - Hechizos preparados / máximo preparable
  - Hechizos conocidos

**Organización de Hechizos**
- Por categoría:
  - Ataque (attack)
  - Buff (potenciación)
  - Debuff (debilitación)
  - Curación (heal)
  - Escudo (shield)
  - Contra (counter)
  - Utilidad (utility)
  - Invocación (summoning)

- Por fuente:
  - Clase
  - Subclase
  - Personalizados

- Por tipo de lista:
  - Lista de clase (list): necesita preparación
  - Gratuitos (free): siempre disponibles
  - Adicionales (additional): de features especiales

**Tarjeta de Hechizo**
- Nombre
- Categoría
- Coste (SP, AP, HP, recursos especiales)
- Coste alternativo (si aplica)
- Acción requerida
- Acción alternativa (si aplica)
- Rango y área de efecto
- Objetivo(s)
- Duración
- Concentración (sí/no)
- Trigger (cuándo se puede usar)
- Descripción detallada
- Efectos del hechizo
- Modificadores que aplica
- Usos internos (si tiene contador propio)
- Estado de preparación (preparado/no preparado)
- Estado activo/inactivo

**Gestión de Hechizos**
- Preparar/despreparar hechizos
  - `POST /api/prepareSpell/:characterId/:spellId`
  - Drag & drop recomendado
  - Validación de límite de hechizos preparados
- Limpiar todos los preparados
  - `POST /api/clearPreparedSpells/:characterId`
- Agregar hechizo personalizado
  - `POST /api/addCustomSpell/:characterId`
  - Formulario extenso con todos los campos
- Editar hechizo personalizado
  - `PATCH /api/editCustomSpell/:characterId/:spellId`
- Eliminar hechizo personalizado
  - `DELETE /api/deleteCustomSpell/:characterId/:spellId`

**Filtros y Búsqueda**
- Por categoría
- Por coste de SP
- Por acción requerida
- Por si está preparado o no
- Búsqueda por nombre
- Por concentración

#### 4.3.6 Pestaña: Inventario

**Vista de Equipamiento**

**Slots de Equipamiento** (visual de muñeco recomendado)
- Arma principal (mano derecha)
- Arma secundaria / escudo (mano izquierda)
- Armadura / ropa
- Accesorios (múltiples slots):
  - Cabeza
  - Cuello
  - Anillos (2)
  - Cinturón
  - Capa
  - Botas
  - Guantes

**Propiedades de Armas**
- Nombre
- Tipo: Simple, Marcial, Exótica, Arma de fuego
- Competencia requerida (estadística)
- Bonificador de ataque
- Rango (melee, ranged)
- Tipo de daño elemental
- Daño base (dados)
- Daño crítico
- Daño alternativo (si es versátil)
- Crítico alternativo
- Propiedades especiales:
  - Dos manos (twoHanded)
  - Ligera (light)
  - Sutil (finesse)
  - Versátil (versatile)
  - Pesada (heavy)
  - Recarga (loading)
  - Alcance (reach)
  - Arrojadiza (thrown)
- Munición (si aplica)
- Modificadores adicionales
- Features adicionales

**Propiedades de Armadura**
- Nombre
- Tipo: Armadura, Escudo, Esquiva, Mágica
- Bonificador a defensa
- Bonificador a defensa mágica
- Requisitos de uso
- Modificadores
- Features adicionales

**Propiedades de Consumibles**
- Nombre
- Tipo: Recuperación, Utilidad, Daño
- Cantidad
- Efecto al usar
- Descripción

**Propiedades de Accesorios**
- Nombre
- Tipo de accesorio
- Modificadores que otorga
- Features que otorga
- Descripción

**Inventario General**
- Lista de todos los items
- Organizados por tipo
- Indicador de equipado/no equipado
- Cantidad (para consumibles y stackeables)
- Peso (opcional)
- Valor en dinero

**Gestión de Inventario**
- Obtener items por defecto
  - `GET /api/getDefaultItems/:characterId`
- Agregar item
  - `POST /api/addItem/:characterId`
  - Formulario modal completo
- Editar item
  - `PATCH /api/editItem/:characterId/:itemId`
- Eliminar item
  - `DELETE /api/deleteItem/:characterId/:itemId`
- Equipar/desequipar items
- Usar consumible
- Arrastrar y soltar para equipar

#### 4.3.7 Pestaña: Efectos de Estado

**Efectos Activos**
- Lista de status effects actualmente activos en el personaje
- Buffs (efectos positivos)
- Debuffs (efectos negativos)
- Condiciones (envenenado, paralizado, etc.)

**Para cada Efecto:**
- Nombre
- Categoría
- Duración restante
- Descripción
- Modificadores que aplica
- Origen del efecto
- Trigger (cuándo se activa)
- Icono visual

**Gestión**
- Aplicar efecto manualmente
- Remover efecto
- Contador de turnos/tiempo restante
- Actualización automática de duración

#### 4.3.8 Pestaña: Modificadores Personalizados

**Modificadores Activos**
- Lista de todos los modificadores aplicados
- Origen:
  - Features
  - Hechizos
  - Equipamiento
  - Personalizados/temporales

**Tipos de Modificador:**
- Daño (damage)
- Ataque (attack)
- Defensa (defense)
- Crítico (critical)
- Dados adicionales (dices)
- Resistencia (resistance)
- Defensa mágica (magic_defense)
- Curación recibida (healing_received)
- Acciones (action, bonus_action, reaction, extra_action)
- Velocidad y movimiento (speed, extra_movement)
- Salvaciones (all_saving_throws)
- Estadística (stadistic)

**Para cada Modificador:**
- Valor numérico o dados
- Tipo de modificador
- Descripción
- Permanente o temporal
- Duración (si temporal)
- Origen (feature, hechizo, item, custom)
- Estado: ACTIVE / INACTIVE
- Aplica a (addTo): qué afecta específicamente
- Objetivo (target): self, ally, enemy, etc.
- Trigger: cuándo se aplica
- Condiciones adicionales

**Gestión de Modificadores**
- Agregar modificador personalizado
  - `PATCH /api/addCustomModifier/:characterId`
  - Formulario con todos los campos
- Remover modificador
  - `PATCH /api/removeCustomModifier/:characterId/:modifierId`
- Activar/desactivar modificadores

#### 4.3.9 Estadísticas de Combate Detalladas

**Vista Expandida de Combate**

**Puntos de Vida (HP)**
- HP base (de dados de golpe y nivel)
- Modificadores de HP
- HP actual / HP máximo
- HP temporal
- HP temporal acumulativo
- Historial de daño recibido

**Defensa**
- Defensa física base
- Modificadores de defensa física
- Total de defensa física
- Defensa mágica base
- Modificadores de defensa mágica
- Total de defensa mágica
- Modificadores de escudo
- Escudo actual (si tiene)

**Velocidad e Iniciativa**
- Iniciativa base
- Modificadores de iniciativa
- Total de iniciativa
- Velocidad de movimiento base
- Modificadores de velocidad
- Total de velocidad de movimiento

**Afinidades Elementales** (detallado)
- Afinidad principal (con bonificadores)
- Afinidad secundaria (si tiene)
- Tabla de elementos:
  - Para cada elemento mostrar: Débil / Normal / Resistente / Inmune / Reflejo

**Estadísticas de Magia**
- AP base
- Modificadores de AP
- Total AP
- Bonificador de salvación mágica
- Modificadores de salvación
- Total salvación
- Bonificador de lanzamiento
- Modificadores de lanzamiento
- Total lanzamiento
- Bonificador de curación
- Modificadores de curación
- Total curación
- Modificadores de daño mágico

**Acciones en Combate**
- Acciones por turno (base + modificadores)
- Acciones bonus por turno
- Reacciones por turno
- Acciones gratuitas

**Sistema de Críticos**
- Umbral de crítico base
- Modificadores de crítico
- Umbral de crítico en ataques físicos
- Umbral de crítico en ataques mágicos
- Umbral de crítico general
- Daño crítico adicional
- Modificadores de fallo crítico

**Bonificadores de Ataque**
- Ataque general
- Ataque físico
- Ataque a distancia
- Ataque cuerpo a cuerpo
- Modificadores adicionales

**Bonificadores de Daño**
- Daño general
- Daño físico
- Daño a distancia
- Daño cuerpo a cuerpo
- Daño crítico adicional
- Modificadores adicionales

**Modificadores de Rango**
- Rango de armas a distancia
- Rango de armas cuerpo a cuerpo
- Modificadores de alcance

### 4.4 Edición de Personaje

**Campos Editables**
- Nombre
- Foto/avatar
- Estado
- Backstory completo
- Campaña asociada
- Estadísticas (con validaciones)
- Nivel (con sistema de level up)

**Restricciones**
- No se puede cambiar clase una vez creado
- No se puede cambiar sistema
- Cambios en estadísticas requieren validación

### 4.5 Sistema de Nivel (Level Up)

**Obtener Información de Subida de Nivel**
- `GET /api/getLevelUpInfo/:characterId`
- Retorna:
  - Opciones de mejora de estadísticas
  - Nuevas features disponibles
  - Hechizos nuevos disponibles
  - Incremento de HP
  - Incremento de AP
  - Si debe seleccionar subclase
  - Si gana feature de subclase
  - Si gana afinidad secundaria
  - Si gana incremento de estadística
  - Habilidades secundarias adicionales disponibles

**Proceso de Level Up**
- `PATCH /api/levelUp/:characterId`
- Wizard o formulario modal con pasos:
  1. Tirada o valor fijo de HP adicional
  2. Selección de incrementos de estadística (si aplica)
  3. Selección de features nuevas (si aplica)
  4. Selección de hechizos nuevos
  5. Selección de competencias adicionales
  6. Selección de subclase (en nivel específico)
  7. Selección de afinidad secundaria (si aplica)
  8. Confirmación y aplicación

**Actualización de Experiencia**
- `PATCH /api/updateXP/:characterId`
- Formulario para agregar/quitar XP
- Cálculo automático de level up cuando se alcanza XP necesaria
- Notificación de level up disponible

### 4.6 Gestión de Recursos

**Actualizar Dinero**
- `PATCH /api/updateMoney/:characterId`
- Agregar/quitar dinero
- Historial de transacciones (opcional)

**Actualizar Inspiración**
- `PATCH /api/updateInspiration/:characterId`
- Marcar como tiene/no tiene inspiración
- Sistema de puntos de inspiración (si aplica)

**Gestionar HP/SP/Recursos**
- Formularios rápidos para:
  - Recibir daño (restar HP)
  - Recibir curación (sumar HP)
  - Aplicar HP temporal
  - Gastar SP
  - Recuperar SP
  - Gastar recursos de clase
  - Recuperar recursos (descanso corto/largo)

### 4.7 Exportación de Personaje

**PDF de Ficha**
- `GET /api/getCharacterPDF/:characterId`
- Generar PDF descargable con ficha completa
- Formato optimizado para impresión
- Incluye todas las estadísticas, hechizos, features, inventario

**Exportar JSON** (opcional)
- Exportar personaje completo en formato JSON
- Para backup o transferencia

### 4.8 Eliminación de Personaje

- `DELETE /api/deleteCharacter/:characterId`
- Confirmación con nombre del personaje
- Soft delete (estado = DELETED)
- Los datos se mantienen pero el personaje no es visible

### 4.9 Endpoints del Módulo

**Básicos:**
- `GET /api/getCreateCharacterInfo` - Info para creación
- `POST /api/createCharacter` - Crear personaje
- `POST /api/getCharacters` - Listar personajes
- `GET /api/getCharacter/:characterId` - Ver detalle
- `PATCH /api/editCharacter/:characterId` - Editar
- `DELETE /api/deleteCharacter/:characterId` - Eliminar

**Nivel y Progresión:**
- `GET /api/getLevelUpInfo/:characterId` - Info de level up
- `PATCH /api/levelUp/:characterId` - Subir nivel
- `PATCH /api/updateXP/:characterId` - Actualizar XP
- `PATCH /api/updateMoney/:characterId` - Actualizar dinero
- `PATCH /api/updateInspiration/:characterId` - Actualizar inspiración

**Habilidades Secundarias:**
- `GET /api/getSecondaryFeatures/:characterId` - Obtener habilidades
- `PATCH /api/updateSelectedSecondaryFeatures/:characterId` - Actualizar selección

**Modificadores:**
- `PATCH /api/addCustomModifier/:characterId` - Agregar modificador
- `PATCH /api/removeCustomModifier/:characterId/:modifierId` - Remover modificador

**Exportación:**
- `GET /api/getCharacterPDF/:characterId` - Obtener PDF

---

## 5. Módulo de Combate y Estadísticas

### 5.1 Sistema de Estadísticas Persona D20

**Estadísticas Primarias** (5 principales)

1. **Carisma (Charisma)**
   - Afecta: Curación mágica, salvaciones mágicas, habilidades sociales
   - Habilidades secundarias: Empatía, Expresión, Regateo

2. **Coraje (Courage)**
   - Afecta: HP máximo, escudo, resistencia física
   - Habilidades secundarias: Atletismo, Fuerza, Fuerza de voluntad

3. **Destreza (Dexterity)**
   - Afecta: Defensa física, ataques a distancia, iniciativa
   - Habilidades secundarias: Acrobacia, Reflejos, Sigilo, Velocidad

4. **Instintos (Instincts)**
   - Afecta: Defensa mágica, iniciativa, percepción
   - Habilidades secundarias: Consciencia, Orientación, Streetwise

5. **Conocimiento (Knowledge)**
   - Afecta: AP máximo, lanzamiento de hechizos, daño mágico
   - Habilidades secundarias: Investigación, Folclore, Misticismo, Tecnología

**Modificadores de Estadísticas**
- Fórmula: (Valor - 10) / 2
- Rango típico: 8-20
- Afectan a múltiples mecánicas del personaje

### 5.2 Habilidades Secundarias (Secondary Abilities)

**20 Habilidades Totales** vinculadas a estadísticas primarias

**Estructura de cada habilidad:**
- Nombre
- Estadística base (personaStadistics)
- Bonificador base (de la estadística)
- Competencia (isProficient: boolean)
- Bonificador total = bonificador base + bonificador de competencia (si es proficiente)

**Competencia**
- Número limitado de competencias según clase y nivel
- El bonificador de competencia se suma al bonificador base
- Competencia aumenta con el nivel del personaje

### 5.3 Sistema de Elementos

**Elementos en Persona D20:**

**Mágicos:**
- PSY (Psíquico)
- NUKE (Nuclear)
- FIRE (Fuego)
- ICE (Hielo)
- ELEC (Eléctrico)
- WIND (Viento)
- CURSE (Maldición)
- BLESS (Bendición)
- ALMIGHTY (Todopoderoso - ignora resistencias)

**Físicos:**
- SLASH (Cortante)
- STRIKE (Contundente)
- PIERCE (Perforante)

**Relación con Elementos:**
- **Afinidad:** Elemento principal, bonificadores al usar
- **Afinidad Secundaria:** Segundo elemento (se gana en niveles altos)
- **Resistencia:** Reduce daño recibido de ese elemento (½ daño)
- **Debilidad:** Duplica daño recibido de ese elemento (x2 daño)
- **Inmunidad:** No recibe daño de ese elemento
- **Reflejo:** Devuelve el ataque al atacante

### 5.4 Sistema de Recursos

**Recursos Principales:**

1. **HP (Hit Points)**
   - Puntos de vida
   - HP temporal: Se pierde primero, no se acumula
   - HP temporal acumulativo: Se puede apilar

2. **SP (Spell Points)**
   - Puntos de hechizo/stamina
   - Se gastan al lanzar hechizos
   - Se recuperan con descansos

3. **AP (Action Points)**
   - Puntos de acción mágica
   - Se calculan con Conocimiento
   - Limitan hechizos máximos por combate

4. **Recursos de Clase:**
   - Rage Points (Revenant)
   - Morale Points (Commander)
   - Otros específicos de clase

5. **Acciones:**
   - Actions: Acciones principales por turno
   - Bonus Actions: Acciones bonus
   - Reactions: Reacciones (respuestas a triggers)
   - Free Actions: Acciones gratuitas
   - Movement: Movimiento

### 5.5 Sistema de Modificadores (Modifiers)

**Tipos de Modificadores:**
- DAMAGE: Bonificador a daño
- ATTACK: Bonificador a tiradas de ataque
- DEFENSE: Bonificador a defensa física
- CRITICAL: Modificadores de crítico
- CRITICAL_FAIL: Modificadores de fallo crítico
- DICES: Dados adicionales
- RESISTANCE: Resistencias elementales
- MAGIC_DEFENSE: Defensa mágica
- HEALING_RECEIVED: Curación recibida
- ACTION/BONUS_ACTION/REACTION: Acciones adicionales
- SPEED: Velocidad de movimiento
- EXTRA_MOVEMENT: Movimiento extra
- ALL_SAVING_THROWS: Salvaciones
- STADISTIC: Modificar estadística

**Propiedades de un Modificador:**
- value: Valor numérico o dados (ej: "+2" o "1d6")
- type: Tipo de modificador
- description: Descripción legible
- permanent: Si es permanente o temporal
- origin: De dónde viene (feature, spell, item, custom)
- featureId: ID de la feature que lo otorga
- addTo: A qué se aplica específicamente (array de strings)
- target: A quién afecta
- duration: Duración si es temporal
- stadistic: Qué estadística afecta (si aplica)
- replaceStadistic: Reemplazar estadística por otra
- trigger: Cuándo se activa
- shouldSaveEachTurn: Requiere salvación cada turno
- state: ACTIVE / INACTIVE
- etiquette: Etiqueta para agrupar
- damageType: Tipo de daño elemental
- setValue: Si establece valor absoluto en lugar de sumar
- options: Opciones configurables
- dice: Dados a tirar

### 5.6 Sistema de Efectos (Effects)

**Tipos de Efectos Base:**

1. **Efectos de Daño**
   - type: 'damage', 'physical_damage', 'magical_damage'
   - damage: Fórmula de daño (ej: "2d6+4")
   - damageType: Elemento del daño
   - preventCritical: Prevenir crítico

2. **Efectos de Curación**
   - type: 'heal', 'regeneration'
   - heal: Cantidad de curación
   - healType: HP, SP, temp_hp, etc.
   - resource: Qué recurso recupera

3. **Efectos de Escudo/Barrera**
   - type: 'shield', 'barrier'
   - heal: Cantidad de escudo
   - shieldType: physical, magical, almighty

4. **Efectos de Estado**
   - type: 'status_effect', 'debuff', 'buff'
   - statusEffect: Referencia a IStatusEffect
   - modifiers: Modificadores que aplica

5. **Efectos de Movimiento**
   - type: 'movement', 'teleport', 'push', 'pull'
   - movement: Distancia
   - movementType: Tipo de movimiento
   - movementDirection: Dirección

6. **Efectos de Modificación** (más de 20 subtipos)
   - 'modification': Modificación general
   - 'reduce_damage': Reducir daño recibido
   - 'avoid_damage': Evitar daño completamente
   - 'cancel_disadvantage': Cancelar desventaja
   - 'reset_bonifier': Resetear bonificador
   - 'activate_feature': Activar otra feature
   - 'break_concentration': Romper concentración
   - 'remove_buffs': Remover buffs del objetivo
   - 'remove_debuffs': Remover debuffs
   - 'extend_buffs': Extender duración de buffs
   - 'change_initiative': Cambiar iniciativa
   - 'spell_cost_reduction': Reducir coste de hechizos
   - 'break_shield': Romper escudo
   - 'additional_target': Objetivos adicionales
   - 'stack_buffs': Apilar buffs
   - 'attack_with_weapon': Atacar con arma
   - 'opportunity_attack': Ataque de oportunidad
   - 'modify_feature_uses': Modificar usos de feature
   - 'cast_spell': Lanzar hechizo
   - 'create_zone': Crear zona de efecto
   - 'counterspell': Contra-hechizo
   - 'recover_resource': Recuperar recurso
   - 'all_out_attack': Ataque total

**Propiedades Comunes de Efectos:**
- parent: Feature o hechizo padre
- target: A quién afecta (self, ally, enemy, etc.)
- range: Alcance del efecto
- trigger: Cuándo se activa
- condition: Condiciones adicionales
- uses: Número de usos
- levelCondition: Nivel mínimo requerido
- shouldSaveEachTurn: Requiere salvación cada turno
- etiquette: Etiqueta
- canUseFeatures: Si permite usar features mientras activo
- canTriggerEffects: Si puede desencadenar otros efectos
- salvation: Estadística para salvación
- cd: Clase de dificultad
- duration: Duración del efecto

### 5.7 Sistema de Triggers

**Triggers de Combate** (más de 60 tipos)

**Triggers de Ataque:**
- AT_ATTACK: Al impactar un ataque
- AT_FAILED_ATTACK: Al fallar un ataque
- BEFORE_ATTACK: Antes de atacar
- AT_CRITICAL_ATTACK: Al hacer crítico
- AT_OPPORTUNITY_ATTACK: Al hacer ataque de oportunidad
- AT_WEAPON: Al usar un arma
- AT_ALL_WEAPONS: Al usar cualquier arma

**Triggers de Defensa:**
- AT_RECEIVE_DAMAGE: Al recibir daño
- AT_RECEIVE_ATTACK: Al ser atacado
- AT_RECEIVE_MAGIC_ATTACK: Al recibir ataque mágico
- BEFORE_RECEIVE_ATTACK: Antes de recibir ataque
- AT_RECEIVE_CRITICAL_ATTACK: Al recibir crítico
- BEFORE_SAVE: Antes de tirar salvación
- AT_FAILED_SAVE: Al fallar salvación
- AT_SUCCESS_SAVE: Al superar salvación

**Triggers de Hechizos:**
- AT_SPELL: Al lanzar hechizo
- AT_SPELL_ATTACK: Al lanzar hechizo de ataque
- AT_SPELL_CAST_DURING_ATTACK: Hechizo como parte de ataque
- NEXT_SPELL: Siguiente hechizo
- AT_ENEMY_SPELL_CAST: Cuando enemigo lanza hechizo

**Triggers de Daño y Curación:**
- AT_DAMAGE: Al causar daño
- AT_HEAL: Al curar
- AFTER_DAMAGE_ROLL: Después de tirar daño

**Triggers de Muerte:**
- AT_SELF_DEATH: Al morir uno mismo
- AT_ENEMY_DEATH: Al morir enemigo
- AT_ALLY_DEATH: Al morir aliado

**Triggers de Turnos:**
- AT_TURN_START: Al inicio del turno propio
- AT_ANY_TURN_START: Al inicio de cualquier turno
- AT_TURN_END: Al final del turno propio
- AT_ANY_TURN_END: Al final de cualquier turno
- AT_ROUND_START: Al inicio de la ronda
- AT_ROUND_END: Al final de la ronda

**Triggers de Combate:**
- AT_COMBAT_START: Al inicio del combate
- AT_COMBAT_END: Al final del combate
- ENEMY_ENTERS_RANGE: Cuando enemigo entra en rango

**Triggers de Aliados:**
- AT_ALLY_RECEIVE_ATTACK: Cuando aliado recibe ataque
- BEFORE_ALLY_RECEIVE_ATTACK: Antes de que aliado reciba ataque
- AT_ALLY_CRITICAL: Cuando aliado hace crítico
- AT_ALLY_ATTACK: Cuando aliado ataca

**Triggers de Efectos:**
- AT_APPLY_STATUS_EFFECT: Al aplicar efecto de estado
- AT_REMOVE_STATUS_EFFECT: Al remover efecto de estado
- AT_APPLY_DEBUFF_EFFECT: Al aplicar debuff
- AT_APPLY_BUFF_EFFECT: Al aplicar buff
- AT_APPLY_NEGATIVE_EFFECT: Al aplicar efecto negativo
- AT_DISPEL_EFFECT: Al disipar efecto

**Triggers Especiales:**
- AT_ZONE: Al entrar en zona
- AT_USE_REACTION: Al usar reacción
- AT_ENEMY_DISENGAGE_ACTION: Cuando enemigo se desengancha
- AT_ALL_OUT_ATTACK: Al hacer ataque total
- NEXT_ATTACK: Siguiente ataque

### 5.8 Sistema de Rango y Objetivos

**Tipos de Rango:**
- MELEE: Cuerpo a cuerpo
- RANGED: A distancia
- SELF: Solo a uno mismo
- ALL: Área completa

**Formas de Área:**
- CONE: Cono
- LINE: Línea
- CIRCLE: Círculo
- SQUARE: Cuadrado
- CROSS: Cruz

**Tipos de Objetivo:**
- SELF: Uno mismo
- ALLY: Un aliado
- ENEMY: Un enemigo
- ENEMIES_AT_RANGE: Enemigos en rango
- ALLIES_AT_RANGE: Aliados en rango
- ALL_ENEMIES: Todos los enemigos
- ALL_ALLIES: Todos los aliados
- ONLY_ALLY: Solo un aliado (no self)
- ALLIES_ATTACKING_TARGET: Aliados atacando al mismo objetivo
- ALL: Todos

### 5.9 Sistema de Duración

**Tipos de Duración:**
- TEMPORAL: Duración limitada en tiempo
- PERMANENT: Permanente
- INSTANT: Instantáneo
- CONCENTRATION: Mientras se mantenga concentración

**Unidades de Medición:**
- ROUNDS: Rondas de combate
- TURNS: Turnos
- ATTACKS: Número de ataques
- MINUTES: Minutos
- HOURS: Horas
- DAYS: Días
- COMBAT: Duración del combate
- REST: Hasta descanso

### 5.10 Sistema de Costes

**Tipos de Coste:**
- TEMPORAL: Coste temporal (se recupera)
- PERMANENT: Coste permanente (no se recupera)

**Recursos que se pueden gastar:**
- HP: Puntos de vida
- SP: Puntos de hechizo
- AP: Puntos de acción
- RAGE_POINTS: Puntos de rabia
- MORALE_POINTS: Puntos de moral
- REACTION: Reacción
- MOVEMENT: Movimiento
- BONUS_ACTION: Acción bonus
- FREE_ACTION: Acción gratuita
- Recursos personalizados

**Estructura de Coste:**
- amount: Cantidad (número o string)
- type: Temporal o permanente
- resource: Qué recurso se gasta

---

## 6. Módulo de Hechizos y Habilidades

### 6.1 Gestión de Rasgos (Features)

**Endpoints:**
- `POST /api/changeFeatureStatus/:characterId/:featureId` - Activar/desactivar
- `POST /api/addCustomFeature/:characterId` - Agregar personalizada
- `PATCH /api/editCustomFeature/:characterId/:featureId` - Editar personalizada

**Estructura de una Feature:**
- featureId: ID único
- name: Nombre
- description: Descripción detallada
- useType: ACTIVE (requiere activación) o PASSIVE (siempre activo)
- action: Acción requerida (action, bonus_action, reaction, free, none)
- alternativeAction: Acción alternativa
- modifiers: Array de modificadores que aplica
- trigger: Trigger(s) que activan la feature
- condition: Condiciones adicionales (string)
- cost: Costes para usar
- alternativeCost: Costes alternativos
- range: Rango de efecto
- target: Objetivo(s)
- duration: Duración del efecto
- uses: Número de usos disponibles
- internalCounter: Si tiene contador interno
- counterCondition: Condición para el contador
- triggerForRecover: Trigger para recuperar usos
- requireSalvation: Si requiere tirada de salvación
- cd: Clase de dificultad
- cooldown: Tiempo de reutilización
- origin: Origen (class, subclass, race, custom)
- addUsesToParent: Añade usos a feature padre
- addAsSubfeatureToParent: Se añade como subfeature
- state: ACTIVE o INACTIVE
- effects: Array de efectos
- parent: Feature padre (si es subfeature)
- subFeatures: Sub-features que otorga

**UI para Features:**
- Lista organizada por origen
- Expandibles para ver detalles
- Botón de activar/desactivar
- Indicador de usos restantes
- Modal de detalles completos
- Formulario de creación/edición para custom features

### 6.2 Gestión de Hechizos (Spells)

**Endpoints:**
- `POST /api/prepareSpell/:characterId/:spellId` - Preparar/despreparar
- `POST /api/clearPreparedSpells/:characterId` - Limpiar preparados
- `POST /api/addCustomSpell/:characterId` - Agregar personalizado
- `PATCH /api/editCustomSpell/:characterId/:spellId` - Editar personalizado
- `DELETE /api/deleteCustomSpell/:characterId/:spellId` - Eliminar personalizado

**Estructura de un Hechizo:**
- name: Nombre del hechizo
- system: Sistema de juego (PERSONAD20, DND5E)
- custom: Si es hechizo personalizado (boolean)
- owner: Dueño del hechizo (si es custom)
- class: Clase a la que pertenece
- subclass: Subclase específica
- cost: Costes normales (SP, AP, HP, etc.)
- alternativeCost: Costes alternativos
- action: Acción requerida
- alternativeAction: Acción alternativa
- internalCounter: Contador interno de usos
- counterCondition: Condición del contador
- useType: ACTIVE o PASSIVE
- category: Categoría del hechizo
  - ATTACK: Ataque
  - BUFF: Potenciación
  - DEBUFF: Debilitación
  - HEAL: Curación
  - SHIELD: Escudo
  - COUNTER: Contra
  - UTILITY: Utilidad
  - SUMMONING: Invocación
- description: Descripción completa
- trigger: Cuándo se puede usar
- concentration: Requiere concentración (boolean)
- effects: Array de efectos del hechizo
- modifiers: Modificadores que aplica
- toList: Tipo de lista
  - 'list': Lista de clase (necesita preparación)
  - 'free': Siempre disponible
  - 'additional': Hechizos adicionales por features
- state: ACTIVE, INACTIVE, DELETED

**UI para Hechizos:**
- Vista de libro de hechizos (spellbook)
- Filtros por categoría, coste, preparado
- Tarjetas de hechizo con info clave
- Modal de detalles completos
- Sistema de preparación (drag & drop recomendado)
- Límite visual de hechizos preparables
- Indicador de SP/AP actuales
- Formulario extenso para crear custom spells
- Calculadora de daño/curación

### 6.3 Categorías de Hechizos

**ATTACK (Ataque)**
- Hechizos que causan daño
- Pueden tener efectos adicionales
- Requieren tirada de ataque o salvación

**BUFF (Potenciación)**
- Mejoran estadísticas o capacidades de aliados
- Duración variable
- Pueden requerir concentración

**DEBUFF (Debilitación)**
- Reducen capacidades de enemigos
- Requieren salvación generalmente
- Efectos de estado negativos

**HEAL (Curación)**
- Restauran HP u otros recursos
- Pueden remover efectos negativos
- Algunos requieren concentración

**SHIELD (Escudo)**
- Crean barreras protectoras
- Tipos: físico, mágico, todopoderoso
- Pueden absorber daño específico

**COUNTER (Contra)**
- Reacciones a acciones enemigas
- Contraataques
- Contrahechizos

**UTILITY (Utilidad)**
- Efectos variados
- Exploración
- Interacción con el entorno
- Buffs situacionales

**SUMMONING (Invocación)**
- Invocan criaturas o entidades
- Duración variable
- Las invocaciones pueden tener estadísticas propias

---

## 7. Módulo de Inventario y Equipamiento

### 7.1 Gestión de Inventario

**Endpoints:**
- `GET /api/getDefaultItems/:characterId` - Obtener items por defecto
- `POST /api/addItem/:characterId` - Agregar item
- `PATCH /api/editItem/:characterId/:itemId` - Editar item
- `DELETE /api/deleteItem/:characterId/:itemId` - Eliminar item

### 7.2 Tipos de Equipamiento

**WEAPON (Arma)**
- Categorías:
  - SIMPLE: Armas simples
  - MARTIAL: Armas marciales
  - EXOTIC: Armas exóticas
  - FIRE_WEAPONS: Armas de fuego

**Propiedades de Arma:**
- attack: Estadística de ataque y bonificador
- target: Tipo de objetivo
- range: Rango y tipo (melee/ranged)
- damageType: Elemento del daño
- damage: Dados de daño base
- critical: Dados en crítico
- alternativeDamage: Daño versátil
- alternativeCritical: Crítico versátil
- ammunition: Munición que usa
- twoHanded: Requiere dos manos (boolean)
- light: Es ligera (boolean)
- finesse: Usa destreza (boolean)
- versatile: Versátil (boolean)
- heavy: Es pesada (boolean)
- loading: Requiere recarga (boolean)
- reach: Tiene alcance (boolean)
- thrown: Se puede arrojar (boolean)

**ARMOR (Armadura)**
- Categorías:
  - ARMOR: Armadura corporal
  - SHIELD: Escudo
  - DODGE: Esquiva/sin armadura
  - MAGICAL: Protección mágica

**ACCESORY (Accesorio)**
- Categorías personalizables
- Slots: cabeza, cuello, anillos, cinturón, capa, botas, guantes
- Otorgan modificadores pasivos

**CONSUMIBLE (Consumible)**
- Categorías:
  - RECOVERY: Recuperación (pociones, vendajes)
  - UTILITY: Utilidad (bombas de humo, herramientas)
  - DAMAGE: Daño (granadas, venenos)
- quantity: Cantidad de items

**OTHER (Otro)**
- Items misceláneos
- Items de quest
- Objetos decorativos

### 7.3 Propiedades Comunes

**Campos Obligatorios:**
- equipmentName: Nombre del item
- description: Descripción
- type: Tipo de equipamiento
- category: Categoría dentro del tipo
- equipped: Si está equipado (boolean)
- quantity: Cantidad (número, default 1)

**Campos Opcionales:**
- proficiency: Competencia requerida
- canAttack: Si permite atacar (boolean)
- provideDefense: Si da defensa (boolean)
- properties: Propiedades específicas según tipo
- modifiers: Modificadores que otorga
- additionalProperties: Features adicionales

### 7.4 UI de Inventario

**Vista de Muñeco de Equipo:**
- Representación visual del personaje
- Slots clicables para equipar items
- Drag & drop para equipar/desequipar
- Tooltips con info del item equipado

**Lista de Inventario:**
- Tabla o grid de todos los items
- Ordenamiento por tipo, nombre, valor
- Filtros por tipo, equipado, categoría
- Búsqueda de items
- Indicador de peso total (opcional)
- Valor total en dinero

**Gestión de Items:**
- Botón "Agregar Item" → Modal de creación
- Click en item → Modal de detalles/edición
- Equipar/desequipar con un click
- Usar consumible
- Eliminar item con confirmación

**Armas:**
- Vista especial para armas equipadas
- Estadísticas de ataque calculadas
- Opciones de ataque (normal/versátil)
- Munición restante (si aplica)

---

## 8. Sistema de Notificaciones

### 8.1 Componentes

**NotificationContainer**
- Contenedor global de notificaciones
- Posicionamiento fixed (esquina superior derecha recomendado)
- Stack de notificaciones múltiples
- Auto-dismiss configurable

**useNotifications Hook**
- Context provider para notificaciones
- Métodos:
  - `showNotification(message, type, duration)`
  - `hideNotification(id)`
  - `clearAll()`

### 8.2 Tipos de Notificación

**SUCCESS (Éxito)**
- Color: Verde
- Icono: Checkmark
- Uso: Operaciones exitosas
  - "Personaje creado exitosamente"
  - "Campaña guardada"
  - "Hechizo preparado"

**ERROR (Error)**
- Color: Rojo
- Icono: X o alerta
- Uso: Errores y fallos
  - "Error al guardar"
  - "No tienes permisos"
  - "Campo requerido"

**WARNING (Advertencia)**
- Color: Amarillo/Naranja
- Icono: Triángulo de advertencia
- Uso: Avisos importantes
  - "Estás a punto de eliminar"
  - "Límite de hechizos alcanzado"
  - "HP bajo"

**INFO (Información)**
- Color: Azul
- Icono: i o info
- Uso: Información general
  - "Nuevo jugador se unió"
  - "Subiste de nivel"
  - "Recordatorio"

### 8.3 Configuración

**Duración:**
- Por defecto: 3-5 segundos
- Configurable por notificación
- Errores: Más tiempo (5-7 segundos)
- Éxitos: Menos tiempo (3 segundos)

**Comportamiento:**
- Auto-dismiss (se cierra solo)
- Botón de cierre manual
- Click en notificación para cerrar
- Animaciones de entrada/salida
- Stack vertical (múltiples notificaciones)

### 8.4 Triggers de Notificaciones

**Operaciones de Personaje:**
- Crear, editar, eliminar personaje
- Subir nivel
- Ganar XP
- HP crítico
- Recursos agotados

**Operaciones de Campaña:**
- Crear, editar, eliminar campaña
- Nuevo jugador se une
- Jugador removido
- Nueva nota/registro

**Operaciones de Combate:**
- Turno inicia
- Efecto aplicado/removido
- Característica usada
- Hechizo lanzado

**Errores del Sistema:**
- Error de conexión
- Error de autenticación
- Validación fallida
- Operación no permitida

---

## 9. Requisitos de UI/UX

### 9.1 Diseño General

**Sistema de Diseño:**
- Framework: TailwindCSS
- Componentes: ShadCN UI (ya configurado en components.json)
- Tema: Dark mode / Light mode
  - `theme-provider` ya implementado
  - Toggle de tema accesible
  - Persistencia de preferencia

**Paleta de Colores:**
- Colores principales coherentes con temática Persona
- Rojo/negro/blanco (característicos de Persona 5)
- Modo oscuro por defecto recomendado
- Alto contraste para legibilidad

**Tipografía:**
- Fuente principal legible
- Fuente de display para títulos (estilo Persona)
- Tamaños escalables y responsivos
- Jerarquía clara de información

### 9.2 Layout Principal

**Header/Navbar:**
- Logo/título de la aplicación
- Navegación principal:
  - Dashboard/Inicio
  - Mis Personajes
  - Mis Campañas
  - Perfil
- Indicador de usuario actual (avatar + username)
- Toggle de tema (dark/light)
- Botón de logout

**Sidebar (opcional):**
- Navegación rápida
- Personaje activo (si aplicable)
- Recursos rápidos
- Accesos directos

**Main Content:**
- Área principal de contenido
- Breadcrumbs para navegación
- Título de página claro
- Espacio respirable entre secciones

**Footer (opcional):**
- Copyright/créditos
- Enlaces útiles
- Versión de la app

### 9.3 Componentes Clave

**Dashboard:**
- Componente `Dashboard.tsx` ya existe
- Resumen de campañas activas
- Personajes recientes
- Notificaciones/actividad reciente
- Accesos rápidos a crear nuevo personaje/campaña

**Tarjetas (Cards):**
- Tarjetas de personaje
- Tarjetas de campaña
- Tarjetas de hechizo
- Tarjetas de item
- Hover effects
- Acciones rápidas

**Formularios:**
- Validación en tiempo real
- Mensajes de error claros
- Labels descriptivos
- Placeholders útiles
- Estados: normal, focus, error, disabled
- Autocomplete donde sea apropiado

**Modales:**
- Overlay oscuro
- Centrado en pantalla
- Animación de entrada/salida
- Cerrar con ESC o click fuera
- Scroll interno si es necesario
- Tamaño responsive

**Tablas:**
- Ordenamiento por columna
- Paginación si hay muchos datos
- Acciones por fila (editar, eliminar, ver)
- Responsive (colapsar a cards en móvil)
- Búsqueda y filtros

**Pestañas (Tabs):**
- Navegación clara entre secciones
- Estado activo visible
- Persistencia de pestaña activa
- Lazy loading de contenido pesado

### 9.4 Responsividad

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

**Adaptaciones Mobile:**
- Navegación: Hamburger menu
- Tablas: Convertir a tarjetas
- Formularios: Inputs full-width
- Grid: 1 columna
- Modales: Full-screen en mobile

**Adaptaciones Tablet:**
- Grid: 2 columnas
- Sidebar colapsable
- Touch-friendly (botones más grandes)

**Desktop:**
- Aprovechamiento de espacio horizontal
- Multi-columna
- Tooltips y hovers
- Sidebar visible por defecto

### 9.5 Interacciones

**Estados de Carga:**
- Spinners para operaciones largas
- Skeleton screens para carga de contenido
- Progress bars para procesos con pasos
- Disable de botones durante operación

**Feedback Visual:**
- Animaciones sutiles
- Transiciones suaves
- Cambios de color en hover
- Estados activos claros
- Confirmación visual de acciones

**Accesibilidad:**
- Navegación por teclado
- Focus visible
- ARIA labels apropiados
- Alt text en imágenes
- Contraste suficiente (WCAG AA mínimo)
- Screen reader friendly

### 9.6 Imágenes y Medios

**ImageUploader:**
- Componente `ImageUploader.tsx` ya existe
- Drag & drop
- Click para seleccionar
- Preview antes de subir
- Crop/resize opcional
- Validación de formato (jpg, png, webp)
- Validación de tamaño (límite recomendado: 2-5MB)
- Compresión automática

**Avatares:**
- Circular o cuadrado con border-radius
- Placeholder si no hay imagen
- Iniciales del nombre como fallback
- Tamaños: small, medium, large, xl

**Imágenes de Personaje/Campaña:**
- Aspect ratio consistente
- Lazy loading
- Optimización automática
- Placeholder durante carga

### 9.7 Navegación y Flujo

**Protected Routes:**
- Componente `ProtectedRoute.tsx` ya existe
- Redirección automática si no autenticado
- Preservar URL destino para redirección post-login

**Breadcrumbs:**
- Navegación jerárquica clara
- Links clickeables
- Página actual no clickeable

**Botones de Acción:**
- Primarios: Crear, Guardar, Confirmar
- Secundarios: Cancelar, Volver
- Destructivos: Eliminar (con confirmación)
- Posicionamiento consistente

**Confirmaciones:**
- Modales de confirmación para acciones destructivas
- "¿Estás seguro?" con detalles
- Botones claramente etiquetados
- Opción de cancelar prominente

### 9.8 Páginas Específicas

**Página de Login:**
- Componente `login-form.tsx` ya existe
- Centro de pantalla
- Branding visible
- Enlaces a registro y recuperación
- Opción "recordarme"

**Página de Registro:**
- Componente `register-form.tsx` ya existe
- Formulario multi-paso o largo
- Validación en tiempo real
- Indicadores de fortaleza de contraseña
- Términos y condiciones

**Página de Dashboard:**
- Componente `Dashboard.tsx` ya existe
- Resumen personalizado
- Widgets con información clave
- Acciones rápidas
- Últimas actualizaciones

**Página de Listado** (personajes/campañas)
- Grid o lista seleccionable
- Filtros en sidebar o top
- Búsqueda prominente
- Botón "Crear nuevo" destacado
- Paginación o scroll infinito

**Página de Detalle** (personaje/campaña)
- Información organizada en pestañas o secciones
- Acciones contextuales (editar, eliminar, compartir)
- Navegación entre elementos similares (anterior/siguiente)
- Sidebar con info rápida

**Página de Creación/Edición:**
- Wizard multi-paso (personaje)
- Progreso visible
- Validación paso a paso
- Posibilidad de guardar borrador
- Preview antes de guardar

### 9.9 Elementos Específicos de Persona D20

**Visualización de Estadísticas:**
- Iconos para cada estadística primaria
- Barras de progreso para HP/SP/AP
- Indicadores visuales de buffs/debuffs
- Código de colores por elemento

**Iconografía:**
- Iconos para cada elemento
- Iconos para tipos de daño (físico/mágico)
- Iconos para acciones (action, bonus, reaction)
- Iconos para triggers comunes
- Consistencia en todo el sistema

**Colores por Elemento:**
- PSY: Morado/rosa
- NUKE: Verde radioactivo
- FIRE: Rojo/naranja
- ICE: Azul claro/cian
- ELEC: Amarillo brillante
- WIND: Verde claro
- CURSE: Morado oscuro/negro
- BLESS: Dorado/blanco
- ALMIGHTY: Multicolor o plateado
- SLASH/STRIKE/PIERCE: Grises diferenciados

**Efectos Visuales:**
- Partículas al usar hechizos (opcional)
- Shake en recibir daño
- Glow en críticos
- Animaciones de level up
- Transiciones al cambiar pestañas

### 9.10 Performance

**Optimizaciones:**
- Code splitting por ruta
- Lazy loading de componentes pesados
- Memoización de componentes costosos
- Virtualización de listas largas (react-window o similar)
- Debounce en búsquedas
- Throttle en scroll events

**Imágenes:**
- Formato WebP preferido
- Tamaños múltiples (responsive images)
- Lazy loading
- Placeholders durante carga

**Estado:**
- Context API para estado global
- Local state para componentes
- Cache de datos frecuentes
- Invalidación inteligente de cache

---

## 10. Requisitos Técnicos Adicionales

### 10.1 Seguridad

**Autenticación:**
- JWT tokens con expiración
- Refresh tokens
- Tokens en httpOnly cookies (recomendado)
- Logout completo (invalidación de tokens)

**Autorización:**
- Verificación de ownership
  - Usuario solo puede editar sus personajes
  - Owner de campaña tiene permisos especiales
- Middleware de validación de tokens
- Validación de permisos en cada endpoint

**Validación:**
- Validación en frontend (UX)
- Validación en backend (seguridad)
- Sanitización de inputs
- Prevención de XSS
- Prevención de SQL/NoSQL injection

### 10.2 Manejo de Errores

**Frontend:**
- Try-catch en operaciones asíncronas
- Error boundaries de React
- Mensajes de error amigables
- Fallbacks para componentes rotos
- Logging de errores (opcional: Sentry)

**Backend:**
- Manejo centralizado de errores
- Códigos de estado HTTP apropiados
- Mensajes de error descriptivos
- Logging de errores
- Stack traces solo en desarrollo

### 10.3 Testing (Recomendado)

**Frontend:**
- Unit tests: Componentes, hooks, utilities
- Integration tests: Flujos completos
- E2E tests: Casos de uso críticos

**Backend:**
- Unit tests: Controladores, servicios
- Integration tests: APIs completas
- Tests de modelos

### 10.4 Documentación

**Código:**
- Comentarios en lógica compleja
- JSDoc para funciones públicas
- README por módulo
- Convenciones de nomenclatura

**API:**
- Documentación de endpoints (Swagger/OpenAPI recomendado)
- Ejemplos de request/response
- Códigos de error documentados
- Rate limits si aplican

### 10.5 Deploy y DevOps

**Frontend:**
- Build optimizado (Next.js build)
- Variables de entorno
- HTTPS obligatorio
- CDN para assets (opcional)

**Backend:**
- Variables de entorno seguras
- Conexión a DB con autenticación
- Logs estructurados
- Health check endpoint

**Base de Datos:**
- Backups regulares
- Índices optimizados
- Límites de conexión
- Monitoreo de performance

---

## 11. Roadmap y Funcionalidades Futuras

### 11.1 Funcionalidades Planificadas

**Sistema de Combate en Tiempo Real:**
- Grid táctico
- Turnos interactivos
- Tiradas de dados en vivo
- Sincronización en tiempo real (WebSockets)
- Chat de combate

**Generador de Encuentros:**
- Calculadora de CR/dificultad
- Biblioteca de NPCs y monstruos
- Generación procedural de enemigos
- Balance automático

**Marketplace de Contenido:**
- Clases personalizadas compartibles
- Hechizos creados por comunidad
- Items únicos
- Subclases y archetipos

**Integración con Dados Físicos:**
- API para lectores de dados
- Verificación de tiradas
- Historial de tiradas

**Sistema de Logros:**
- Logros por personaje
- Logros por campaña
- Badges y reconocimientos
- Estadísticas globales

**Modo Offline:**
- PWA con service workers
- Sincronización automática
- Cache inteligente
- Datos esenciales offline

### 11.2 Mejoras de UX

**Temas Personalizables:**
- Editor de temas
- Temas por campaña
- Paletas predefinidas adicionales

**Accesibilidad Avanzada:**
- Lector de pantalla optimizado
- Navegación por voz
- Modos de alto contraste
- Tamaños de fuente ajustables

**Atajos de Teclado:**
- Shortcuts configurables
- Comandos rápidos (Cmd+K style)
- Navegación por teclado optimizada

---

## Conclusión

Este documento cubre los **requisitos funcionales completos** para la aplicación Mesa Virtual basada en el sistema Persona D20. 

**Prioridades de Implementación:**
1. Autenticación y perfil
2. Creación básica de personajes
3. Gestión de campañas
4. Sistema de hechizos y features
5. Inventario y equipamiento
6. Sistema de combate detallado
7. Optimizaciones y mejoras de UX

**Stack Tecnológico Confirmado:**
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose)
- Frontend: Next.js 14+, React, TypeScript, TailwindCSS, ShadCN UI
- Autenticación: JWT
- Estado: React Context API

El sistema está diseñado para ser extensible, permitiendo agregar nuevas clases, hechizos, y mecánicas sin reestructuración mayor.



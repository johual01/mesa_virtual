# Mesa Virtual - Documentación de API Backend

> **Versión:** 1.0  
> **Última actualización:** 2026-01-24  
> **Propósito:** Documento de referencia para implementación de servicios en el frontend. Diseñado para ser consumido por IAs en prompts posteriores.

---

## 📋 Índice

1. [Configuración Base](#configuración-base)
2. [Autenticación](#autenticación)
3. [Perfil de Usuario](#perfil-de-usuario)
4. [Campañas](#campañas)
5. [Personajes](#personajes)
6. [Rasgos del Personaje](#rasgos-del-personaje)
7. [Hechizos del Personaje](#hechizos-del-personaje)
8. [Inventario del Personaje](#inventario-del-personaje)
9. [Tipos y Enumeraciones](#tipos-y-enumeraciones)
10. [Interfaces de Datos](#interfaces-de-datos)

---

## Configuración Base

### Base URL
```
/api - Rutas protegidas (requieren token)
/login - Rutas de autenticación (públicas)
```

### Headers Requeridos
```typescript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {accessToken}" // Solo para rutas /api
}
```

### Estructura de Respuesta de Error
```typescript
interface ErrorResponse {
  errMsg: string;
  error?: any;
}
```

### Autenticación
- El backend usa JWT con access token y refresh token
- El access token se envía en el header `auth-token`
- El refresh token se almacena en una cookie HTTP-only llamada `jwt`
- El `userId` se inyecta automáticamente en `req.body.userId` por el middleware `validateToken`

---

## Autenticación

### POST `/login/login`
Inicia sesión de usuario.

**Request Body:**
```typescript
{
  email: string;       // Requerido
  password: string;    // Requerido
  rememberMe?: boolean; // Opcional - extiende duración del refresh token
}
```

**Response (200):**
```typescript
{
  message: "Usuario autenticado";
  user: {
    _id: string;
    user: string;  // username
    email: string;
  };
  token: string; // accessToken
}
```

**Headers de Respuesta:**
- `auth-token`: accessToken
- `Set-Cookie`: jwt (refresh token)

**Errores:**
- 400: Faltan datos
- 401: Credenciales inválidas

---

### POST `/login/signup`
Registra un nuevo usuario.

**Request Body:**
```typescript
{
  username: string;  // Requerido, mínimo 4 caracteres
  email: string;     // Requerido, único
  password: string;  // Requerido
}
```

**Response (200):**
```typescript
{
  message: "Usuario registrado";
  user: {
    _id: string;
    user: string;
    email: string;
  };
  token: string;
}
```

**Errores:**
- 400: Faltan datos o error al registrar (email/username duplicado)

---

### GET `/login/refresh`
Renueva el access token usando el refresh token de la cookie.

**Response (200):**
```typescript
{
  token: string; // nuevo accessToken
}
```

---

### GET `/login/logout`
Cierra la sesión eliminando la cookie del refresh token.

**Response (200):**
```typescript
{
  message: "Sesión cerrada";
}
```

---

### POST `/login/forgot-password`
Envía un correo de recuperación de contraseña.

**Request Body:**
```typescript
{
  email: string; // Requerido
}
```

**Response (200):**
```typescript
{
  message: "Si el correo existe, se ha enviado un enlace de recuperación";
}
```

> **Nota:** Por seguridad, siempre devuelve 200 aunque el email no exista.

---

### POST `/login/reset-password`
Restablece la contraseña usando el token de recuperación.

**Request Body:**
```typescript
{
  password: string; // Nueva contraseña - Requerido
  token: string;    // Token de recuperación - Requerido
}
```

**Response (200):**
```typescript
{
  message: "Contraseña actualizada correctamente";
}
```

**Errores:**
- 400: Faltan datos
- 401: Token inválido o expirado
- 404: Usuario no encontrado

---

## Perfil de Usuario

### GET `/api/getProfile/:userId`
Obtiene el perfil del usuario.

**Parámetros URL:**
- `userId`: ID del usuario (string)

**Response (200):**
```typescript
{
  _id: string;
  username: string;
  email: string;
  joinDate: Date;
  pictureRoute?: string;
}
```

**Errores:**
- 404: Usuario no encontrado

---

### PATCH `/api/alterProfile/:userId`
Modifica el perfil del usuario.

**Parámetros URL:**
- `userId`: ID del usuario

**Request Body:**
```typescript
{
  username: string;        // Requerido
  email: string;           // Requerido
  currentPassword: string; // Requerido - para verificar identidad
  password?: string;       // Opcional - nueva contraseña
  imageUrl?: string;       // Opcional - URL o base64 de imagen
}
```

**Response (200):**
```typescript
{
  message: "Usuario actualizado";
  user: {
    _id: string;
    user: string;
    email: string;
  };
  token: string; // nuevo accessToken
}
```

**Errores:**
- 400: Faltan datos
- 401: Contraseña incorrecta
- 404: Usuario no encontrado

---

## Campañas

### POST `/api/getCampaigns`
Obtiene las campañas del usuario (como dueño o jugador).

**Request Body:**
```typescript
{
  // userId se inyecta automáticamente
}
```

**Response (200):**
```typescript
{
  campaigns: Array<{
    _id: string;
    name: string;
    image?: string;
  }>;
}
```

---

### PUT `/api/createCampaign`
Crea una nueva campaña.

**Request Body:**
```typescript
{
  name: string;           // Requerido
  description: string;    // Requerido
  image?: string;         // Opcional - URL o base64
  notes?: string[];       // Opcional
  publicEntries?: string[]; // Opcional
}
```

**Response (200):**
```typescript
{
  message: "Campaña creada";
  campaign: ICampaign;
}
```

---

### GET `/api/getCampaign/:userId/:campaignId`
Abre una campaña específica con toda su información.

**Parámetros URL:**
- `userId`: ID del usuario
- `campaignId`: ID de la campaña

**Response (200):**
```typescript
{
  campaign: {
    _id: string;
    name: string;
    owner: IUser;           // Populado sin password ni email
    players: IUser[];       // Populado sin password, email ni joinDate
    characters: string[];   // IDs
    image?: string;
    description?: string;
    publicEntries?: INote[];
    notes?: INote[];        // Solo si el usuario es el dueño
    history: string[];
    state: "ACTIVE" | "INACTIVE" | "DELETED";
  };
}
```

---

### PATCH `/api/editCampaign/:campaignId`
Edita una campaña existente.

**Parámetros URL:**
- `campaignId`: ID de la campaña

**Request Body:**
```typescript
{
  name: string;           // Requerido
  description: string;    // Requerido
  image?: string;         // Opcional
  notes?: string[];       // Opcional
  publicEntries?: string[]; // Opcional
}
```

**Response (200):**
```typescript
{
  message: "Campaña actualizada";
  campaign: ICampaign;
}
```

---

### POST `/api/joinCampaign/:campaignId`
Une al usuario a una campaña.

**Parámetros URL:**
- `campaignId`: ID de la campaña

**Response (200):**
```typescript
{
  message: "Te has unido a la campaña";
}
```

**Errores:**
- 400: No puedes unirte a tu propia campaña / Ya estás en la campaña
- 404: Campaña no encontrada

---

### POST `/api/removeFromCampaign`
Remueve a un jugador de una campaña.

**Request Body:**
```typescript
{
  playerId: string;   // ID del jugador a remover
  campaignId: string; // ID de la campaña
}
```

**Response (200):**
```typescript
{
  message: "Jugador removido de la campaña";
}
```

**Errores:**
- 403: Solo el dueño puede eliminar a otro jugador
- 404: Campaña no encontrada

---

### POST `/api/deleteCampaign/:campaignId`
Elimina una campaña (soft delete).

**Parámetros URL:**
- `campaignId`: ID de la campaña

**Response (200):**
```typescript
{
  message: "Campaña eliminada";
}
```

**Errores:**
- 403: Solo el dueño puede eliminar la campaña
- 404: Campaña no encontrada

---

### PUT `/api/addRegister/:campaignId`
Añade una nota/registro a la campaña.

**Parámetros URL:**
- `campaignId`: ID de la campaña

**Request Body:**
```typescript
{
  title: string;      // Requerido
  text: string;       // Requerido
  campaignId: string; // Requerido (redundante con URL)
  isPrivate?: boolean; // Si true, va a notes; si false, a publicEntries
}
```

**Response (201):**
```typescript
{
  message: "Registro creado";
  note: INote;
}
```

---

### PATCH `/api/updateRegister/:registerId`
Actualiza una nota/registro existente.

**Parámetros URL:**
- `registerId`: ID de la nota

**Request Body:**
```typescript
{
  title: string;      // Requerido
  text: string;       // Requerido
  campaignId: string; // Requerido
  isPrivate?: boolean; // Cambia la visibilidad si se especifica
}
```

**Response (200):**
```typescript
{
  message: "Registro actualizado";
  note: INote;
}
```

---

### DELETE `/api/deleteRegister/:registerId`
Elimina una nota/registro (soft delete).

**Parámetros URL:**
- `registerId`: ID de la nota

**Request Body:**
```typescript
{
  campaignId: string; // Requerido
}
```

**Response (200):**
```typescript
{
  message: "Registro eliminado";
}
```

---

## Personajes

### GET `/api/getCreateCharacterInfo`
Obtiene información necesaria para crear un personaje.

**Response (200):**
```typescript
{
  elements: string[];           // Array de elementos disponibles
  states: string[];             // Estados del personaje
  secondaryAbilities: string[]; // Habilidades secundarias
  campaigns: Array<{            // Campañas del usuario
    _id: string;
    name: string;
  }>;
  classes: IPersonaClass[];     // Clases disponibles
}
```

---

### POST `/api/createCharacter`
Crea un nuevo personaje.

**Request Body:**
```typescript
{
  name: string;            // Requerido
  system: "PERSONAD20";    // Requerido
  state: CharacterState;   // Requerido: "ACTIVE" | "INACTIVE" | "DELETED" | "DEAD" | "NON_PLAYER"
  backstory: {
    history: string;
    personality: string;
    appearance: string;
    traits: string;
    defects: string;
    ideals: string;
    dreams: string;
    bonds: string;
    trauma: string;
  };
  pictureRoute?: string;   // Opcional - URL o base64
  characterClass: string;  // ID de la clase - Requerido
  persona: string;         // Nombre de la Persona - Requerido
  money: number;           // Requerido
  stadistics: {            // Requerido
    courage: number;
    dexterity: number;
    instincts: number;
    knowledge: number;
    charisma: number;
  };
  proficency: string[];    // Array de secondaryAbilities - Requerido
  element: Element;        // Afinidad elemental - Requerido
  weakness: Element;       // Debilidad elemental - Requerido
}
```

**Response (201):**
```typescript
{
  message: "Personaje creado";
  characterId: string;
}
```

**Errores:**
- 400: Faltan campos obligatorios / Validaciones fallidas
- 404: Usuario o clase no encontrada

---

### POST `/api/getCharacters`
Obtiene los personajes según el origen.

**Request Body:**
```typescript
{
  origin: "user" | "campaign"; // Requerido
  state?: CharacterState;      // Opcional - filtrar por estado
  campaignId?: string;         // Requerido si origin es "campaign"
}
```

**Response (200) - Array:**
```typescript
Array<{
  _id: string;
  name: string;
  system: string;
  state: string;
  pictureRoute?: string;
  characterData: {
    class: object;
    level: number;
  };
}>
```

---

### GET `/api/getCharacter/:characterId`
Obtiene los datos completos de un personaje.

**Parámetros URL:**
- `characterId`: ID del personaje

**Response (200):**
```typescript
{
  name: string;
  state: CharacterState;
  system: string;
  pictureRoute?: string;
  class: string;
  subclass?: string;
  level: number;
  persona: string;
  experience: number;
  money: number;
  proficency: number;
  stats: {
    courage: { value: number; bonus: number; isProficient: boolean; };
    dexterity: { value: number; bonus: number; isProficient: boolean; };
    instincts: { value: number; bonus: number; isProficient: boolean; };
    knowledge: { value: number; bonus: number; isProficient: boolean; };
    charisma: { value: number; bonus: number; isProficient: boolean; };
  };
  secondaryAbilities: ISecondaryAbilities;
  background: IBackstory;
  features: {
    classFeatures: IFeature[];
    subclassFeatures: IFeature[];
    itemFeatures: IFeature[];
    customFeatures: ICustomFeature[];
  };
  characterInventory: ICharacterEquipment[];
  inspiration: IInspiration;
  combatData: {
    defensiveStats: {
      HP: { total: number; modifiers: IModifier[]; };
      defense: { total: number; modifiers: IModifier[]; };
      magicDefense: { total: number; modifiers: IModifier[]; };
    };
    fisicalStats: {
      speed: { total: number; modifiers: IModifier[]; };
      initiative: { total: number; modifiers: IModifier[]; };
      rangeAttackModifiers: { total: number; modifiers: IModifier[]; };
      meleeAttackModifiers: { total: number; modifiers: IModifier[]; };
      rangeDamageModifiers: { total: number; modifiers: IModifier[]; };
      meleeDamageModifiers: { total: number; modifiers: IModifier[]; };
      criticalDamageModifiers: { total: number; modifiers: IModifier[]; };
    };
    magicalStats: {
      elements: IElementsData;
      AP: { total: number; modifiers: IModifier[]; };
      magicSave: { total: number; modifiers: IModifier[]; };
      magicLaunch: { total: number; modifiers: IModifier[]; };
      magicHealing: { total: number; modifiers: IModifier[]; };
      magicDamage: { total: number; modifiers: IModifier[]; };
      spells: ISpells;
    };
    actions: {
      actions: { total: number; modifiers: IModifier[]; };
      bonusActions: { total: number; modifiers: IModifier[]; };
      reactions: { total: number; modifiers: IModifier[]; };
    };
    critical: {
      critical: { total: number; modifiers: IModifier[]; };
      criticalFail: { total: number; modifiers: IModifier[]; };
      criticalOnFisical: { total: number; modifiers: IModifier[]; };
      criticalOnMagic: { total: number; modifiers: IModifier[]; };
    };
    resource: { name: string; };
  };
}
```

---

### PATCH `/api/editCharacter/:characterId`
Edita un personaje existente.

**Parámetros URL:**
- `characterId`: ID del personaje

**Request Body:**
```typescript
{
  name: string;
  state: CharacterState;
  backstory: IBackstory;
  pictureRoute?: string;
  persona: string;
  money: number;
  stadistics: IStadistics;
  proficency: string[];
  element: Element;
  weakness: Element;
}
```

**Response (200):**
```typescript
{
  message: "Personaje actualizado";
}
```

**Errores:**
- 400: Faltan campos / El personaje está eliminado
- 403: Sin permisos
- 404: Personaje no encontrado

---

### DELETE `/api/deleteCharacter/:characterId`
Elimina un personaje (soft delete).

**Response (200):**
```typescript
{
  message: "Personaje eliminado";
}
```

---

### PATCH `/api/addCustomModifier/:characterId`
Añade un modificador personalizado al personaje.

**Request Body:**
```typescript
{
  value: number | string;       // Requerido
  type: string;                 // Requerido
  description: string;          // Requerido
  addTo?: string | string[];    // A qué estadística se añade
  target?: TargetType;
  duration?: IDuration;
  stadistic?: PersonaStadistic; // Requerido si type es "stadistic"
  replaceStadistic?: PersonaStadistic;
}
```

**Response (201):**
```typescript
{
  message: "Modificador agregado";
}
```

---

### PATCH `/api/removeCustomModifier/:characterId/:modifierId`
Elimina un modificador personalizado.

**Response (200):**
```typescript
{
  message: "Modificador eliminado";
}
```

---

### PATCH `/api/updateXP/:characterId`
Actualiza la experiencia del personaje.

**Request Body:**
```typescript
{
  xp: number; // Requerido
}
```

**Response (200):**
```typescript
{
  message: "Experiencia actualizada";
}
```

---

### PATCH `/api/updateMoney/:characterId`
Actualiza el dinero del personaje.

**Request Body:**
```typescript
{
  money: number; // Requerido
}
```

**Response (200):**
```typescript
{
  message: "Dinero actualizado";
}
```

---

### PATCH `/api/updateInspiration/:characterId`
Actualiza la inspiración del personaje.

**Request Body:**
```typescript
{
  inspiration: IInspiration; // Requerido
}
```

**Response (200):**
```typescript
{
  message: "Inspiración actualizada";
}
```

---

### GET `/api/getLevelUpInfo/:characterId`
Obtiene información para subir de nivel.

**Response (200):**
```typescript
{
  level: number;
  HPDice: string;
  features: IFeature[];
  spells: ISpell[];
  subclassFeatures: IFeature[];
  shouldChooseSubclass: boolean;
  shouldChooseSecondaryFeatures: boolean;
  shouldChooseSecondaryAffinities: boolean;
  shouldChooseStatImprovement: boolean;
  subclasses?: IPersonaSubclass[];      // Si shouldChooseSubclass
  secondaryFeatures?: IFeature[];       // Si shouldChooseSecondaryFeatures
}
```

---

### PATCH `/api/levelUp/:characterId`
Sube de nivel al personaje.

**Request Body:**
```typescript
{
  newHP: number;                        // Requerido - vida ganada
  selectedSubclass?: string;            // ID - si corresponde
  selectedSecondaryFeatures?: string[]; // IDs - si corresponde
  selectedSecondaryAffinity?: Element;  // Si corresponde
  selectedStats?: {                     // Si corresponde
    courage?: number;
    dexterity?: number;
    instincts?: number;
    knowledge?: number;
    charisma?: number;
  };
}
```

**Response (200):**
```typescript
{
  message: "Personaje subió de nivel";
}
```

---

### GET `/api/getSecondaryFeatures/:characterId`
Obtiene las habilidades secundarias disponibles.

**Response (200):**
```typescript
{
  secondaryFeatures: Array<{
    featureId: string;
    name: string;
    description: string;
  }>;
}
```

---

### PATCH `/api/updateSelectedSecondaryFeatures/:characterId`
Actualiza las habilidades secundarias seleccionadas.

**Request Body:**
```typescript
{
  selectedSecondaryFeatures: string[]; // IDs de las features
}
```

**Response (200):**
```typescript
{
  message: "Habilidades secundarias actualizadas";
}
```

---

### GET `/api/getCharacterPDF/:characterId`
Genera un PDF de la hoja de personaje.

**Response (501):**
```typescript
{
  errMsg: "Esta función todavía no se encuentra implementada";
}
```

---

## Rasgos del Personaje

### POST `/api/changeFeatureStatus/:characterId/:featureId`
Cambia el estado de un rasgo (activo/inactivo).

**Parámetros URL:**
- `characterId`: ID del personaje
- `featureId`: ID del rasgo

**Request Body:**
```typescript
{
  status: "active" | "inactive"; // Requerido
}
```

**Response (200):**
```typescript
{
  message: "Estado del rasgo actualizado";
}
```

---

### POST `/api/addCustomFeature/:characterId`
Añade un rasgo personalizado.

**Request Body:**
```typescript
{
  name: string;        // Requerido
  description: string; // Requerido
  useType: UseType;    // Requerido: "active" | "passive"
}
```

**Response (201):**
```typescript
{
  message: "Rasgo creado";
  feature: ICustomFeature;
}
```

---

### PATCH `/api/editCustomFeature/:characterId/:featureId`
Edita un rasgo personalizado.

**Request Body:**
```typescript
{
  name: string;
  description: string;
  useType: UseType;
}
```

**Response (200):**
```typescript
{
  message: "Rasgo actualizado";
  feature: ICustomFeature;
}
```

---

## Hechizos del Personaje

### POST `/api/prepareSpell/:characterId/:spellId`
Prepara un hechizo.

**Response (200):**
```typescript
{
  message: "Hechizo preparado";
}
```

**Errores:**
- 400: No puedes preparar más hechizos / El hechizo ya está preparado
- 404: Personaje o hechizo no encontrado

---

### POST `/api/clearPreparedSpells/:characterId`
Limpia todos los hechizos preparados.

**Response (200):**
```typescript
{
  message: "Todos los hechizos preparados fueron removidos";
}
```

---

### POST `/api/addCustomSpell/:characterId`
Añade un hechizo personalizado.

**Request Body:**
```typescript
{
  name: string;           // Requerido
  cost: {                 // Requerido
    type: "AP" | "HP" | "AP and HP";
    AP?: number;
    HP?: number;
  };
  useType: UseType;       // Requerido
  category: SpellCategory; // Requerido
  description: string;    // Requerido
  concentration: boolean; // Requerido
  toList: "list" | "free" | "additional"; // Requerido
  trigger?: TriggerType;
  effects?: IEffect[];
  modifiers?: IModifier[];
}
```

**Response (201):**
```typescript
{
  message: "Hechizo personalizado agregado";
  spell: ISpell;
}
```

---

### PATCH `/api/editCustomSpell/:characterId/:spellId`
Edita un hechizo personalizado.

**Request Body:** (igual que addCustomSpell + state)
```typescript
{
  // ... todos los campos de addCustomSpell
  state: "ACTIVE" | "INACTIVE" | "DELETED";
}
```

**Response (200):**
```typescript
{
  message: "Hechizo personalizado editado";
  spell: ISpell;
}
```

---

### DELETE `/api/deleteCustomSpell/:characterId/:spellId`
Elimina un hechizo personalizado (soft delete).

**Response (200):**
```typescript
{
  message: "Hechizo personalizado eliminado";
}
```

---

## Inventario del Personaje

### GET `/api/getDefaultItems/:characterId`
Obtiene items predeterminados y del personaje.

**Response (200):**
```typescript
{
  defaultItems: IItem[];
  characterItems: ICharacterEquipment[];
}
```

---

### POST `/api/addItem/:characterId`
Añade un item al inventario.

**Request Body:**
```typescript
{
  name: string;             // Requerido
  description: string;      // Requerido
  type: EquipmentType;      // Requerido: "weapon" | "armor" | "accesory" | "consumible" | "other"
  category: string;         // Requerido - depende del tipo
  equipped: boolean;        // Requerido
  proficiency: string;      // Requerido
  canAttack: boolean;       // Requerido
  provideDefense: boolean;  // Requerido
  quantity: number;         // Requerido
  properties?: IWeaponProperties | IEffect;
  modifiers?: IModifier[];
  additionalProperties?: IFeature[];
}
```

**Response (201):**
```typescript
{
  message: "Equipo añadido correctamente";
  item: ICharacterEquipment;
}
```

---

### PATCH `/api/editItem/:characterId/:itemId`
Edita un item del inventario.

**Request Body:** (igual que addItem)

**Response (200):**
```typescript
{
  message: "Equipo editado correctamente";
  item: ICharacterEquipment;
}
```

---

### DELETE `/api/deleteItem/:characterId/:itemId`
Elimina un item del inventario (soft delete).

**Response (200):**
```typescript
{
  message: "Equipo eliminado correctamente";
}
```

---

## Tipos y Enumeraciones

### Character State
```typescript
enum CharacterState {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  DEAD = "DEAD",
  NON_PLAYER = "NON_PLAYER"
}
```

### Campaign State
```typescript
enum CampaignState {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED"
}
```

### Elements (Afinidades)
```typescript
enum Elements {
  PSY = "psy",
  NUKE = "nuke",
  FIRE = "fire",
  ICE = "ice",
  ELEC = "elec",
  WIND = "wind",
  CURSE = "curse",
  BLESS = "bless",
  ALMIGHTY = "almighty",
  SLASH = "slash",
  STRIKE = "strike",
  PIERCE = "pierce"
}
```

### Persona Statistics
```typescript
enum PersonaStadistics {
  KNOWLEDGE = "knowledge",
  INSTINCTS = "instincts",
  DEXTERITY = "dexterity",
  COURAGE = "courage",
  CHARISMA = "charisma"
}
```

### Secondary Abilities
```typescript
enum PersonaSecondaryAbilities {
  Acrobatics = "acrobatics",
  Art = "art",
  Athletics = "athletics",
  Consciousness = "consciousness",
  Empathy = "empathy",
  Expression = "expression",
  Folklore = "folklore",
  Handcraft = "handcraft",
  Investigation = "investigation",
  Meditation = "meditation",
  Mysticism = "mysticism",
  Orientation = "orientation",
  Quibble = "quibble",
  Reflexes = "reflexes",
  Speed = "speed",
  Stealth = "stealth",
  Strength = "strength",
  Technology = "technology",
  Streetwise = "streetwise",
  Willpower = "willpower"
}
```

### Use Types
```typescript
enum UseTypes {
  ACTIVE = "active",
  PASSIVE = "passive"
}
```

### Equipment Types
```typescript
enum EquipmentType {
  WEAPON = "weapon",
  ARMOR = "armor",
  ACCESORY = "accesory",
  CONSUMIBLE = "consumible",
  OTHER = "other"
}
```

### Weapon Categories
```typescript
enum WeaponCategory {
  SIMPLE = "simple",
  MARTIAL = "martial",
  EXOTIC = "exotic",
  FIRE_WEAPONS = "fire_weapons"
}
```

### Armor Categories
```typescript
enum ArmorCategory {
  ARMOR = "armor",
  SHIELD = "shield",
  DODGE = "dodge",
  MAGICAL = "magical"
}
```

### Spell Categories
```typescript
enum SpellCategories {
  ATTACK = "attack",
  BUFF = "buff",
  DEBUFF = "debuff",
  HEAL = "heal",
  SHIELD = "shield",
  COUNTER = "counter",
  UTILITY = "utility",
  SUMMONING = "summoning"
}
```

### Target Types
```typescript
enum TargetTypes {
  SELF = "self",
  ALLY = "ally",
  ENEMY = "enemy",
  ENEMIES_AT_RANGE = "enemies_at_range",
  ALLIES_AT_RANGE = "allies_at_range",
  ALL_ENEMIES = "all_enemies",
  ALL_ALLIES = "all_allies",
  ONLY_ALLY = "only_ally",
  ALLIES_ATTACKING_TARGET = "allies_attacking_target",
  ALL = "all"
}
```

### Range Types
```typescript
enum RangeTypes {
  MELEE = "melee",
  RANGED = "ranged",
  SELF = "self",
  ALL = "all"
}
```

---

## Interfaces de Datos

### IUser
```typescript
interface IUser {
  _id: string;
  username: string;
  email: string;
  joinDate: Date;
  pictureRoute?: string;
}
```

### ICampaign
```typescript
interface ICampaign {
  _id: string;
  name: string;
  owner: string | IUser;
  players: (string | IUser)[];
  characters: (string | ICharacter)[];
  image?: string;
  description?: string;
  notes?: (string | INote)[];
  publicEntries?: (string | INote)[];
  history: string[];
  state: CampaignState;
}
```

### INote
```typescript
interface INote {
  _id: string;
  title: string;
  text: string;
  owner: string;
  state: "ACTIVE" | "DELETED";
}
```

### ICharacter
```typescript
interface ICharacter {
  _id: string;
  name: string;
  player: string;
  system: "PERSONAD20";
  backstory: IBackstory;
  characterData: string | ICharacterPersonaDetail;
  state: CharacterState;
  pictureRoute?: string;
}
```

### IBackstory
```typescript
interface IBackstory {
  history: string;
  personality: string;
  appearance: string;
  traits: string;
  defects: string;
  ideals: string;
  dreams: string;
  bonds: string;
  trauma: string;
}
```

### IInspiration
```typescript
interface IInspiration {
  reroll: boolean;
  bonus: number;
  critic: boolean;
  automaticSuccess: boolean;
}
```

### ISpells
```typescript
interface ISpells {
  list: ISpell[];
  freeList: ISpell[];
  additionalList: ISpell[];
  preparedList: ISpell[];
  maxPrepared: number;
}
```

### IModifier
```typescript
interface IModifier {
  value: number | string;
  type: string;
  description: string;
  permanent?: boolean;
  origin?: string;
  featureId?: string;
  addTo?: string | string[];
  target?: TargetType;
  duration?: IDuration;
  stadistic?: PersonaStadistic;
  replaceStadistic?: PersonaStadistic;
  trigger?: TriggerType | TriggerType[];
  shouldSaveEachTurn?: boolean;
  state: "ACTIVE" | "INACTIVE";
  modifierId?: string;
  damageType?: Element;
  dice?: string;
}
```

### IFeature
```typescript
interface IFeature {
  featureId: string;
  name: string;
  description: string;
  useType: UseType;
  action?: Action;
  alternativeAction?: Action;
  modifiers?: IModifier[];
  trigger?: TriggerType | TriggerType[];
  condition?: string;
  cost?: ICost[];
  alternativeCost?: ICost[];
  range?: IRange;
  target?: TargetType;
  duration?: IDuration;
  uses?: number;
  origin?: string;
  state?: "ACTIVE" | "INACTIVE";
  effects: IEffect[];
  subFeatures?: IFeature[];
}
```

### ISpell
```typescript
interface ISpell {
  _id: string;
  name: string;
  system: "PERSONAD20";
  custom?: boolean;
  owner?: string;
  cost?: ICost[];
  alternativeCost?: ICost[];
  action?: Action;
  alternativeAction?: Action;
  useType: UseType;
  category: SpellCategory | string;
  description: string;
  trigger?: TriggerType;
  concentration: boolean;
  effects?: IEffect[];
  modifiers?: IModifier[];
  toList?: "list" | "free" | "additional";
  state: "ACTIVE" | "INACTIVE" | "DELETED";
}
```

### ICharacterEquipment
```typescript
interface ICharacterEquipment {
  _id: string;
  character: string;
  state: string;
  equipmentName: string;
  description: string;
  type: EquipmentType;
  category: string;
  equipped: boolean;
  proficiency: PersonaStadistic | "none";
  canAttack: boolean;
  provideDefense: boolean;
  quantity: number;
  properties?: IWeaponProperties | IEffect;
  modifiers?: IModifier[];
  additionalProperties?: IFeature[];
}
```

### IWeaponProperties
```typescript
interface IWeaponProperties {
  attack: {
    proficiency: PersonaStadistic | "none";
    bonus: number;
  };
  target: TargetType;
  range: IRange;
  damageType: Element;
  damage: string;
  critical: string;
  alternativeDamage: string;
  alternativeCritical: string;
  ammunition?: string;
  twoHanded: boolean;
  light: boolean;
  finesse: boolean;
  versatile: boolean;
  heavy: boolean;
  loading: boolean;
  reach: boolean;
  thrown: boolean;
}
```

### IRange
```typescript
interface IRange {
  type: RangeType;
  range?: number;
  shape?: RangeShapeType;
}
```

### IDuration
```typescript
interface IDuration {
  type: "temporal" | "permanent" | "instant" | "concentration";
  duration: number;
  medition: "rounds" | "turns" | "attacks" | "minutes" | "hours" | "days" | "combat" | "rest";
}
```

### ICost
```typescript
interface ICost {
  amount: string | number;
  type?: "temporal" | "permanent";
  resource?: string;
}
```

---

## Notas de Implementación para Frontend

### Manejo de Autenticación
1. Guardar el `token` (accessToken) en memoria o localStorage
2. Enviarlo en cada request a `/api/*` en el header `Authorization: Bearer {token}`
3. Cuando expire, llamar a `/login/refresh` para renovarlo
4. Las cookies de refresh se manejan automáticamente por el navegador

### Manejo de Imágenes
- Las imágenes se pueden enviar como URL (https://...) o como base64
- El backend detecta automáticamente el formato y las procesa
- Las imágenes locales se guardan en el servidor y devuelven una ruta

### Validaciones Comunes
- Siempre verificar que no falten campos requeridos antes de enviar
- Los IDs deben ser ObjectId válidos de MongoDB (24 caracteres hexadecimales)
- Los estados (CharacterState, CampaignState, etc.) deben usar los valores exactos del enum

### Permisos
- Un usuario solo puede editar/eliminar sus propios personajes
- Solo el dueño de una campaña puede eliminarla o editar notas privadas
- Los jugadores pueden ver notas públicas (publicEntries) pero no privadas (notes)

### Estados de Eliminación
- La mayoría de eliminaciones son "soft delete" (cambian el estado a DELETED)
- Los datos eliminados permanecen en la base de datos pero no se muestran

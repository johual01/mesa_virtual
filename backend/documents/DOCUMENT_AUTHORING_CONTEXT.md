# Contexto de Escritura de Documentos de Clase (PersonaD20)

Este documento resume el contexto usado para escribir `Connector.js` y `Dramaturgic.js`, tomando como referencia principal `Commander.js`.

## Archivos de referencia usados

- `backend/documents/Commander.js`
- `backend/documents/Connector/*.md`
- `backend/documents/Dramaturgic/*.md`
- `backend/models/PersonaD20/Class.ts`
- `backend/models/PersonaD20/Subclass.ts`
- `backend/models/Spell.ts`
- `backend/models/types.ts`
- `backend/controllers/character/character-level.controller.ts`

## Convención general de documento `.js`

Cada documento de clase sigue este flujo:

1. Crear clase base en `db.personaclasses.insertOne(...)`.
2. Crear hechizos base en `db.spells.insertMany([...])`.
3. Crear subclases en `db.personasubclasses.insertMany([...])`.
4. (Opcional) crear hechizos adicionales de subclase en `db.spells.insertMany([...])`.
5. (Opcional) enlazar `additionalSpells` por nivel con `db.personasubclasses.updateOne(...)`.
6. Cerrar con `db.personaclasses.updateOne(..., { $set: { levels: [...] } })`.

## Campos esperados en clase (`personaclasses.levels`)

Campos usados por backend al crear/subir nivel:

- `level`
- `proficency`
- `spells` (array de ObjectId)
- `features` (array)
- `APGained`
- `maxPreparedSpells` (usar este campo, no `knownSpells`)

Campos opcionales:

- `additionalSpells`
- `freeSpells`
- `selectSubclass`
- `gainSubclassFeature`
- `gainStatIncrease`
- `resourcePool` (si aplica para diseño de clase)

## Campos esperados en subclase (`personasubclasses.levels`)

Por nivel de subclase se usa:

- `level`
- `features`
- opcionalmente `spells`, `additionalSpells`, `freeSpells`, `additionalMaxPreparedSpells`

Notas: 
- `character-level.controller.ts` concatena automáticamente estos campos al subir de nivel. 
- El nivel 1 no tiene features nunca, saltalos si te lo encuentras. 
- No cambies descripciones de features sin solicitar confirmación. Si puedes resumir las descripciones que especifican niveles para cambiar valores.

## Convención de hechizos (`spells`)

Base mínima por hechizo:

- `name`
- `system: 'PERSONAD20'`
- `class`
- `useType: 'active' | 'passive'`
- `category`
- `description`
- `concentration`
- `state: 'ACTIVE'`

Campos frecuentes:

- `cost`, `alternativeCost`
- `action`, `alternativeAction`
- `effects`, `modifiers`
- `toList: 'list' | 'free' | 'additional'`
- `subclass` (si es hechizo de subclase)

## Recursos y coste

- En documentos de clase actuales se usa `resource: 'AP'` en `cost`.
- Mantener consistencia interna por clase (no mezclar SP/AP dentro del mismo documento).

## Feature IDs / ObjectIds

- Usar `new ObjectId('...')` en features/subfeatures cuando se requiera referencia estable.
- Evitar duplicar el mismo `ObjectId` en features distintos no relacionados.
- Si un feature referencia otro (`featureId` en effects), conservar el ID del feature objetivo.

## Reglas de estilo usadas

- Descripciones en espanol alineadas al texto de diseño de cada `.md`.
- Mantener la estructura y estilo de `Commander.js` para compatibilidad.
- Evitar tocar TypeScript/modelos sin confirmación explícita del usuario.

## Decisiones específicas aplicadas

### Connector

- Se implementó con `maxPreparedSpells` según tabla del documento de diseño.
- `Mezcla Anímica` modelada como feature con `subFeatures` de concentraciones.
- Subclases incluidas: `Vigilant`, `Entertainer`, `Discourager`.

### Dramaturgic

- Se implementó con `maxPreparedSpells` según tramos de la tabla.
- `Arma de Chéjov` modelada con `subFeatures` para utilería.
- Subclases incluidas: `Theatre`, `Monologue`, `Musical`.
- Hechizos adicionales de `Musical` enlazados por nivel vía `additionalSpells`.

## Checklist para futuras escrituras

- Verificar que cada nivel tenga `maxPreparedSpells`.
- Verificar que índices `spells[n]` apunten a hechizos existentes.
- Verificar `gainSubclassFeature` en niveles 4/8/13/18 si la clase usa ese patrón.
- Verificar consistencia de `toList` (`list`/`additional`).
- Verificar que no queden `knownSpells` en documentos nuevos.

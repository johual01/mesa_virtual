import { state as characterState } from './models/Character';
import { personaSecondaryAbilities } from './models/PersonaD20/CharacterDetail';
import { elements, personaStadistics } from './models/types';

// Traducciones para elementos
export const elementTranslations: Record<string, string> = {
    [elements.PSY]: 'Psíquico',
    [elements.NUKE]: 'Nuclear',
    [elements.FIRE]: 'Fuego',
    [elements.ICE]: 'Hielo',
    [elements.ELEC]: 'Eléctrico',
    [elements.WIND]: 'Viento',
    [elements.CURSE]: 'Maldición',
    [elements.BLESS]: 'Bendición',
    [elements.ALMIGHTY]: 'Todopoderoso',
    [elements.SLASH]: 'Cortante',
    [elements.STRIKE]: 'Contundente',
    [elements.PIERCE]: 'Perforante'
};

// Traducciones para estados de personaje
export const characterStateTranslations: Record<string, string> = {
    [characterState.ACTIVE]: 'Activo',
    [characterState.INACTIVE]: 'Inactivo',
    [characterState.DELETED]: 'Eliminado',
    [characterState.DEAD]: 'Muerto',
    [characterState.NON_PLAYER]: 'NPC'
};

// Traducciones para habilidades secundarias
export const secondaryAbilityTranslations: Record<string, string> = {
    [personaSecondaryAbilities.Acrobatics]: 'Acrobacias',
    [personaSecondaryAbilities.Art]: 'Arte',
    [personaSecondaryAbilities.Athletics]: 'Atletismo',
    [personaSecondaryAbilities.Consciousness]: 'Consciencia',
    [personaSecondaryAbilities.Empathy]: 'Empatía',
    [personaSecondaryAbilities.Expression]: 'Expresión',
    [personaSecondaryAbilities.Folklore]: 'Folclore',
    [personaSecondaryAbilities.Handcraft]: 'Manualidades',
    [personaSecondaryAbilities.Investigation]: 'Investigación',
    [personaSecondaryAbilities.Meditation]: 'Meditación',
    [personaSecondaryAbilities.Mysticism]: 'Mística',
    [personaSecondaryAbilities.Orientation]: 'Orientación',
    [personaSecondaryAbilities.Quibble]: 'Subterfugio',
    [personaSecondaryAbilities.Reflexes]: 'Reflejos',
    [personaSecondaryAbilities.Speed]: 'Celeridad',
    [personaSecondaryAbilities.Stealth]: 'Sigilo',
    [personaSecondaryAbilities.Strength]: 'Fuerza',
    [personaSecondaryAbilities.Streetwise]: 'Astucia',
    [personaSecondaryAbilities.Technology]: 'Tecnología',
    [personaSecondaryAbilities.Willpower]: 'Voluntad'
};

// Traducciones para estadísticas
export const statisticTranslations: Record<string, string> = {
    [personaStadistics.COURAGE]: 'Coraje',
    [personaStadistics.DEXTERITY]: 'Destreza',
    [personaStadistics.INSTINCTS]: 'Instintos',
    [personaStadistics.KNOWLEDGE]: 'Conocimiento',
    [personaStadistics.CHARISMA]: 'Carisma'
};

// Objeto con todas las traducciones para respuestas de API
export const allTranslations = {
    elements: elementTranslations,
    states: characterStateTranslations,
    secondaryAbilities: secondaryAbilityTranslations,
    statistics: statisticTranslations
};

const { ObjectId } = require('mongodb');

const characterClass = await db.personaclasses.insertOne({
    name: 'Connector',
    description: 'Soporte espiritual que equilibra daño, curación y utilidades de campo',
    HPDice: '1d6',
    salvations: ['knowledge', 'charisma'],
    resourceType: 'AP',
    levels: [],
    levelTable: {
        columns: ['Nivel', 'Beneficios', 'Competencia', 'Mezclas Anímicas'],
        rows: [
            { Nivel: '1', Beneficios: 'Afinidad Elemental, Arma predilecta', Competencia: '+2', 'Mezclas Anímicas': '-' },
            { Nivel: '2', Beneficios: 'Mezcla Anímica', Competencia: '+2', 'Mezclas Anímicas': '3' },
            { Nivel: '3', Beneficios: 'Protección Estelar', Competencia: '+2', 'Mezclas Anímicas': '3' },
            { Nivel: '4', Beneficios: 'Elección de subclase 1', Competencia: '+2', 'Mezclas Anímicas': '3' },
            { Nivel: '5', Beneficios: 'Mejora de característica o beneficio', Competencia: '+3', 'Mezclas Anímicas': '4' },
            { Nivel: '6', Beneficios: 'Restablecimiento Fugaz', Competencia: '+3', 'Mezclas Anímicas': '4' },
            { Nivel: '7', Beneficios: 'Reflejo Curativo', Competencia: '+3', 'Mezclas Anímicas': '4' },
            { Nivel: '8', Beneficios: 'Mecánica de subclase 2', Competencia: '+3', 'Mezclas Anímicas': '4' },
            { Nivel: '9', Beneficios: 'Mejora de característica o beneficio', Competencia: '+4', 'Mezclas Anímicas': '5' },
            { Nivel: '10', Beneficios: 'Amplificación de Aura', Competencia: '+4', 'Mezclas Anímicas': '5' },
            { Nivel: '11', Beneficios: 'Equilibrio Espiritual', Competencia: '+4', 'Mezclas Anímicas': '5' },
            { Nivel: '12', Beneficios: 'Restablecimiento Superior', Competencia: '+4', 'Mezclas Anímicas': '5' },
            { Nivel: '13', Beneficios: 'Mecánica de subclase 3', Competencia: '+5', 'Mezclas Anímicas': '5' },
            { Nivel: '14', Beneficios: 'Mejora de característica o beneficio', Competencia: '+5', 'Mezclas Anímicas': '6' },
            { Nivel: '15', Beneficios: 'Potenciación Anímica', Competencia: '+5', 'Mezclas Anímicas': '6' },
            { Nivel: '16', Beneficios: 'Alteración Espiritual', Competencia: '+5', 'Mezclas Anímicas': '6' },
            { Nivel: '17', Beneficios: 'Soporte Moral', Competencia: '+6', 'Mezclas Anímicas': '6' },
            { Nivel: '18', Beneficios: 'Mecánica de subclase 4', Competencia: '+6', 'Mezclas Anímicas': '6' },
            { Nivel: '19', Beneficios: 'Mejora de característica o beneficio', Competencia: '+6', 'Mezclas Anímicas': '7' },
            { Nivel: '20', Beneficios: 'Sobreestimulación', Competencia: '+6', 'Mezclas Anímicas': '8' }
        ]
    }
});

const characterClassId = characterClass.insertedId;

const listSpells = await db.spells.insertMany([
    // Nivel 1
    {
        name: 'Ataque Mágico I (I)',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '3d4', target: 'enemy', range: { type: 'ranged', range: 6 } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Común I',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 2d4 puntos de vida a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '2d4', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 2
    {
        name: 'Curación Rápida I',
        cost: [{ amount: 1, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Restauras 1d4 puntos de vida a un aliado. Acción adicional.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '1d4', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Básica (F)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +2 a todo daño infligido por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [{ value: 2, type: 'damage', description: 'Aumenta en +2 el daño', target: 'ally', addTo: 'damageModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'empowerment_damage' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Básica (P)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +2 el ataque por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [{ value: 2, type: 'attack', description: 'Aumenta en +2 el ataque', target: 'ally', addTo: 'attackModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'empowerment_attack' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Básica (D)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +2 a la defensa y +1 a la resistencia mágica por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [
            { value: 2, type: 'defense', description: 'Aumenta en +2 la defensa', target: 'ally', addTo: 'defenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'empowerment_defense' },
            { value: 1, type: 'magic_defense', description: 'Aumenta en +1 la resistencia mágica', target: 'ally', addTo: 'magicDefenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'empowerment_defense' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 3
    {
        name: 'Armadura Mágica',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'buff',
        description: 'Tu defensa y resistencia mágica se establecen en 10 + salvación de inteligencia.',
        concentration: false,
        modifiers: [
            { value: '10 + {knowledge_save}', type: 'defense', description: 'Establece la defensa', target: 'self', setValue: true, etiquette: 'magic_armor' },
            { value: '10 + {knowledge_save}', type: 'magic_defense', description: 'Establece la resistencia mágica', target: 'self', setValue: true, etiquette: 'magic_armor' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Grupal I',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 1d4 en PV a todos los aliados a 6 casillas.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '1d4', target: 'allies_at_range', range: { type: 'area', range: 6, shape: 'circle' } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Bendecir',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumentas 1d4 en las tiradas de daño, ataque y salvaciones. Dura 10 rondas.',
        concentration: true,
        modifiers: [
            { value: '1d4', type: 'dices', addTo: 'damageRollModifiers', description: 'Aumenta 1d4 al daño', target: 'ally', duration: { type: 'temporal', duration: 10, medition: 'rounds' }, etiquette: 'bless' },
            { value: '1d4', type: 'dices', addTo: 'attackModifiers', description: 'Aumenta 1d4 al ataque', target: 'ally', duration: { type: 'temporal', duration: 10, medition: 'rounds' }, etiquette: 'bless' },
            { value: '1d4', type: 'all_saving_throws', addTo: 'savingThrowsModifiers', description: 'Aumenta 1d4 a salvaciones', target: 'ally', duration: { type: 'temporal', duration: 10, medition: 'rounds' }, etiquette: 'bless' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 4
    {
        name: 'Ataque Mágico I (A)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '3d4', target: 'enemies_at_range', range: { type: 'area', range: 6, shape: 'cone' } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Escudo de Espíritu',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'shield',
        description: 'Asignas tu nivel multiplicado por 3 en PV temporales a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'temp_hp', heal: '{level * 3}', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 5
    {
        name: 'Estado Alterado (I)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'debuff',
        description: 'Causas un estado alterado de tu afinidad a un enemigo con CD 10 + salvación de carisma.',
        concentration: false,
        requireSalvation: true,
        cd: '10 + {charisma_save}',
        effects: [{ type: 'status_effect', statusType: '{elemental_affinity_equivalent_to_status}', target: 'enemy', salvation: '{statusType_save}' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Limpieza',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Cura todos los estados alterados a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'status_effect', target: 'ally', description: 'Cura estados alterados' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Escape de Emergencia',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Tú y los aliados aceptantes viajan a la última sala segura.',
        concentration: false,
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 6
    {
        name: 'Ataque Mágico II (I)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '4d6', target: 'enemy', range: { type: 'ranged', range: 6 } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Estimulación Espiritual',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'El siguiente hechizo de un aliado que no sea de daño o curación consume acción adicional en vez de acción.',
        concentration: false,
        effects: [{ type: 'change_spell_action', target: 'ally', trigger: 'next_spell', condition: 'spell is not damage and spell is not heal', value: 'bonus_action' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Común II',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 3d6 en PV a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '3d6', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 7
    {
        name: 'Curación Rápida II',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Restauras 2d4 en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '2d4', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Amplificador',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Extiendes los bonificadores de un aliado por 3 turnos adicionales.',
        concentration: false,
        effects: [{ type: 'extend_buffs', target: 'ally', value: 3 }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Restauración Zonal (C)',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'utility',
        description: 'Tu siguiente hechizo de curación se repetirá al inicio de tus dos siguientes turnos.',
        concentration: true,
        effects: [{ type: 'repeat_next_heal', target: 'self', value: 2, trigger: 'at_turn_start' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 8
    {
        name: 'Barrera Física',
        cost: [{ amount: 2, resource: 'AP' }],
        alternativeCost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        alternativeAction: 'bonus_action',
        category: 'shield',
        description: 'Previenes el siguiente daño físico a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'physical', target: 'ally', uses: 1 }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Barrera Mágica',
        cost: [{ amount: 2, resource: 'AP' }],
        alternativeCost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        alternativeAction: 'bonus_action',
        category: 'shield',
        description: 'Previenes el siguiente daño mágico a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'magical', target: 'ally', uses: 1 }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Grupal II',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 2d4 en PV a todos los aliados a 6 casillas.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '2d4', target: 'allies_at_range', range: { type: 'area', range: 6, shape: 'circle' } }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 9
    {
        name: 'Ataque Mágico II (A)',
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '4d6', target: 'enemies_at_range', range: { type: 'area', range: 6, shape: 'cone' } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Vigorizar I',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'utility',
        description: 'Al final de cada turno, lanzas 1d8. Si es 8, recuperas 1 AP. Si fallas dos seguidos, el siguiente es éxito automático.',
        concentration: false,
        internalCounter: true,
        counterCondition: 'rolls not equals 8',
        effects: [
            { type: 'recover_resource', resource: 'AP', value: 1, target: 'self', trigger: 'at_turn_end', condition: 'rolls equals 8', etiquette: 'invigorate' },
            { type: 'recover_resource', resource: 'AP', value: 1, target: 'self', trigger: 'at_turn_end', condition: 'internalCounter reached 2', etiquette: 'invigorate' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Estado Alterado (A)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'debuff',
        description: 'Causas un estado alterado de tu afinidad a los enemigos en área.',
        concentration: false,
        requireSalvation: true,
        cd: '10 + {charisma_save}',
        effects: [{ type: 'status_effect', statusType: '{elemental_affinity_equivalent_to_status}', target: 'enemies_at_range', range: { type: 'area', range: 6, shape: 'cone' }, salvation: '{statusType_save}' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 10
    {
        name: 'Potenciación Compleja (F)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [{ value: 5, type: 'damage', description: 'Aumenta en +5 el daño', target: 'ally', addTo: 'damageModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'empowerment_damage' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (P)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 el ataque por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [{ value: 3, type: 'attack', description: 'Aumenta en +3 el ataque', target: 'ally', addTo: 'attackModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'empowerment_attack' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (D)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 la defensa y +2 a la resistencia mágica por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [
            { value: 3, type: 'defense', description: 'Aumenta en +3 la defensa', target: 'ally', addTo: 'defenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'empowerment_defense' },
            { value: 2, type: 'magic_defense', description: 'Aumenta en +2 la resistencia mágica', target: 'ally', addTo: 'magicDefenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'empowerment_defense' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 11
    {
        name: 'Ataque Mágico III (I)',
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '5d8', target: 'enemy', range: { type: 'ranged', range: 6 } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Marea Curativa',
        cost: [{ amount: 1, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Tu siguiente Curación Común se replica con un dado menos a segundo objetivo y dos dados menos a un tercero.',
        concentration: false,
        effects: [{
            type: 'repeated_spell',
            target: 'allies_at_range',
            appliesTo: '^Curación Común',
            additionalTargets: 2,
            dicePenaltyByTarget: [1, 2],
            description: 'Repite tu siguiente Curación Común sobre 2 objetivos adicionales: -1 dado al segundo y -2 dados al tercero'
        }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Liberación',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Por 3 turnos, tú y todos los aliados pueden usar su acción adicional para correr, esquivar o destrabarse.',
        concentration: false,
        effects: [{ type: 'restricted_bonus_actions', target: 'all_allies', value: ['dash', 'dodge', 'disengage'], duration: { type: 'temporal', duration: 3, medition: 'rounds' } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Purificación',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Cura todos los estados alterados a ti y a todos los aliados.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'status_effect', target: 'all_allies', description: 'Limpia estados alterados' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 12
    {
        name: 'Protección contra Muerte',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'shield',
        description: 'Cuando el aliado objetivo cae a 0 PV, se establece en 1 PV y el hechizo termina.',
        concentration: true,
        effects: [{ type: 'heal', healType: 'HP', target: 'ally', trigger: 'at_ally_death', value: 1 }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Deshacer Magia',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Rompes la concentración de un enemigo y remueves sus potenciaciones.',
        concentration: false,
        effects: [
            { type: 'break_concentration', target: 'enemy' },
            { type: 'remove_buffs', target: 'enemy' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Común III',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 4d8 en PV a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '4d8', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 13
    {
        name: 'Curación Rápida III',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Restauras 3d6 en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '3d6', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Amplificación Total',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Extiendes los bonificadores de todos los aliados por 3 turnos adicionales.',
        concentration: false,
        effects: [{ type: 'extend_buffs', target: 'all_allies', value: 3 }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Barrera Total',
        cost: [{ amount: 3, resource: 'AP' }],
        alternativeCost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        alternativeAction: 'bonus_action',
        category: 'shield',
        description: 'Previenes la siguiente instancia de daño a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'almighty', target: 'ally', uses: 1 }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 14
    {
        name: 'Ataque Mágico III (A)',
        cost: [{ amount: 9, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '5d8', target: 'enemies_at_range', range: { type: 'area', range: 6, shape: 'cone' } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Completa',
        cost: [{ amount: 8, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta ataque, daño, defensa y resistencia mágica por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [
            { value: 3, type: 'attack', description: 'Aumenta en +3 el ataque', target: 'ally', addTo: 'attackModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'full_empowerment' },
            { value: 5, type: 'damage', description: 'Aumenta en +5 el daño', target: 'ally', addTo: 'damageModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'full_empowerment' },
            { value: 3, type: 'defense', description: 'Aumenta en +3 la defensa', target: 'ally', addTo: 'defenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'full_empowerment' },
            { value: 2, type: 'magic_defense', description: 'Aumenta en +2 la resistencia mágica', target: 'ally', addTo: 'magicDefenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'full_empowerment' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Grupal III',
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 3d6 en PV a todos los aliados a 6 casillas.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '3d6', target: 'allies_at_range', range: { type: 'area', range: 6, shape: 'circle' } }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 15
    {
        name: 'Purificación Completa',
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Cura todos los estados alterados y debilitaciones a ti y a todos los aliados.',
        concentration: false,
        effects: [
            { type: 'heal', healType: 'status_effect', target: 'all_allies' },
            { type: 'remove_debuffs', target: 'all_allies' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (FA)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a todos los aliados.',
        concentration: false,
        modifiers: [{ value: 5, type: 'damage', description: 'Aumenta en +5 el daño', target: 'all_allies', addTo: 'damageModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'complex_empowerment_damage_all' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (PA)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 el ataque por 3 turnos a todos los aliados.',
        concentration: false,
        modifiers: [{ value: 3, type: 'attack', description: 'Aumenta en +3 el ataque', target: 'all_allies', addTo: 'attackModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'complex_empowerment_attack_all' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (DA)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 la defensa y +2 la resistencia mágica por 3 turnos a todos los aliados.',
        concentration: false,
        modifiers: [
            { value: 3, type: 'defense', description: 'Aumenta en +3 la defensa', target: 'all_allies', addTo: 'defenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'complex_empowerment_defense_all' },
            { value: 2, type: 'magic_defense', description: 'Aumenta en +2 la resistencia mágica', target: 'all_allies', addTo: 'magicDefenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'complex_empowerment_defense_all' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 16
    {
        name: 'Ataque Mágico IV (I)',
        cost: [{ amount: 9, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '6d10', target: 'enemy', range: { type: 'ranged', range: 6 } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Concentración',
        cost: [{ amount: 8, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'El siguiente ataque mágico de ti o un aliado impactará y si impacta será crítico.',
        concentration: false,
        effects: [
            { type: 'attack', target: 'ally', trigger: 'next_spell', condition: 'attack is successful', modification: 'critical', etiquette: 'focus' },
            { type: 'attack', target: 'ally', trigger: 'next_spell', condition: 'attack is failed', modification: 'hit', etiquette: 'focus' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Común IV',
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 6d10 en PV a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '6d10', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 17
    {
        name: 'Curación Rápida IV',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Restauras 4d8 en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '4d8', target: 'ally' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Restauración Zonal (E)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Tu siguiente hechizo de daño aplicará su tirada mínima (cantidad de dados + bonificador de la tirada) como curación a todos los aliados en un radio de 6 casillas durante 3 turnos. Tu siguiente hechizo de curación aplicará su tirada mínima (cantidad de dados + bonificador de la tirada) como daño a todos los enemigos en un radio de 6 casillas durante 3 turnos.',
        concentration: true,
        effects: [
            { type: 'heal', healType: 'HP', heal: '{count_dice} + {roll_modifier}', target: 'allies_at_range', trigger: 'next_spell', condition: 'spell is damage', range: { type: 'area', range: 6, shape: 'circle' }, duration: { type: 'temporal', duration: 3, medition: 'rounds' } },
            { type: 'damage', damageType: 'affinity', dice: '{count_dice} + {roll_modifier}', target: 'enemies_at_range', trigger: 'next_spell', condition: 'spell is heal', range: { type: 'area', range: 6, shape: 'circle' }, duration: { type: 'temporal', duration: 3, medition: 'rounds' } }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Barrera Infranqueable',
        cost: [{ amount: 4, resource: 'AP' }],
        alternativeCost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        alternativeAction: 'bonus_action',
        category: 'shield',
        description: 'Previenes las dos siguientes instancias de daño a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'almighty', target: 'ally', uses: 2 }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 18
    {
        name: 'Estado Alterado (Z)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'debuff',
        description: 'Causas un estado alterado de tu afinidad a una zona de 4 casillas por hasta 5 rondas.',
        concentration: true,
        requireSalvation: true,
        cd: '10 + {charisma_save}',
        effects: [{ type: 'create_zone', zoneType: 'status_effect', statusType: '{elemental_affinity_equivalent_to_status}', target: 'all_enemies', range: { type: 'area', range: 4, shape: 'circle' }, trigger: 'at_any_turn_start', salvation: '{statusType_save}', duration: { type: 'temporal', duration: 5, medition: 'rounds' } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Ataque Mágico IV (A)',
        cost: [{ amount: 11, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '6d10', target: 'enemies_at_range', range: { type: 'area', range: 6, shape: 'cone' } }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Grupal IV',
        cost: [{ amount: 9, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 4d8 en PV a todos los aliados a 6 casillas.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '4d8', target: 'allies_at_range', range: { type: 'area', range: 6, shape: 'circle' } }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 19
    {
        name: 'Aceleración Mágica',
        cost: [{ amount: 12, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Otorga doble lanzamiento no ofensivo, +2 resistencia mágica y segunda concentración por 5 turnos.',
        concentration: true,
        effects: [
            { type: 'cast_spell', target: 'ally', spellCategory: 'not_heal_or_damage', trigger: 'at_spell', uses: 1, duration: { type: 'temporal', duration: 5, medition: 'turns' } },
            { type: 'allow_second_concentration', target: 'ally', duration: { type: 'temporal', duration: 5, medition: 'turns' } }
        ],
        modifiers: [{ value: 2, type: 'magic_defense', description: 'Aumenta en +2 la resistencia mágica', target: 'ally', addTo: 'magicDefenseModifiers', duration: { type: 'temporal', duration: 5, medition: 'turns' }, etiquette: 'magic_haste' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Destrucción Mágica',
        cost: [{ amount: 8, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Rompe concentración y remueve potenciaciones enemigas, además de remover debilitadores aliados.',
        concentration: false,
        effects: [
            { type: 'break_concentration', target: 'all_enemies' },
            { type: 'remove_buffs', target: 'all_enemies' },
            { type: 'remove_debuffs', target: 'all_allies' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Vigorizar II',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'utility',
        description: 'Al final de cada turno, lanzas 1d6. Si es 6, recuperas 2 AP. Si no, recuperas 1 AP.',
        concentration: false,
        effects: [
            { type: 'recover_resource', resource: 'AP', value: 2, target: 'self', trigger: 'at_turn_end', condition: 'rolls equals 6', etiquette: 'invigorate' },
            { type: 'recover_resource', resource: 'AP', value: 1, target: 'self', trigger: 'at_turn_end', condition: 'rolls not equals 6', etiquette: 'invigorate' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 20
    {
        name: 'Maestro en Hechizos',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'utility',
        description: 'Disminuyes el coste de tus hechizos a la mitad al momento de lanzarlos.',
        concentration: false,
        effects: [{ type: 'spell_cost_reduction', spellCategory: 'all', reduction: 0.5, target: 'self', permanent: true, etiquette: 'spell_master' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Barrera Definitiva',
        cost: [{ amount: 14, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'reaction',
        category: 'shield',
        description: 'Tras ver a un aliado recibir daño, puede volverse inmune a todo daño hasta el inicio de tu turno.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'invulnerability', target: 'ally', trigger: 'at_ally_receive_attack', duration: { type: 'temporal', duration: 1, medition: 'rounds' }, condition: 'only one target can hold effect', etiquette: 'ultimate_barrier' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Carga Concentrada',
        cost: [{ amount: 18, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'El siguiente ataque físico o mágico de ti y cada aliado impactará; si impacta será crítico.',
        concentration: false,
        effects: [
            { type: 'attack', target: 'all_allies', trigger: 'next_attack', condition: 'attack is failed', modification: 'hit', etiquette: 'focused_charge' },
            { type: 'attack', target: 'all_allies', trigger: 'next_attack', condition: 'attack is successful', modification: 'critical', etiquette: 'focused_charge' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    }
]);

const spells = listSpells.insertedIds;

const subclass = await db.personasubclasses.insertMany([
    {
        name: 'Vigilant',
        description: 'Especialista en prevención y protección táctica del equipo',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d01'),
                        name: 'Protección Superior',
                        description: 'Como acción adicional, gastas dados de protección para sanar a un aliado y otorgar PV temporales por dado.',
                        useType: 'active',
                        action: 'bonus_action',
                        effects: [
                            { type: 'heal', healType: 'HP', heal: '{protection_dice_spent}d6', target: 'ally' },
                            { type: 'heal', healType: 'temp_hp', heal: '{protection_dice_spent * protection_temp_value}', target: 'ally' }
                        ],
                        modifiers: [
                            { type: 'resource', value: '{level}', description: 'Dados de protección por incursión', target: 'self', addTo: 'protectionDicePool', permanent: true },
                            { type: 'resource', value: 1, description: 'PV temporales por dado (escala por nivel)', target: 'self', addTo: 'protectionTempValue', permanent: true }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d02'),
                        name: 'Redirección de Riesgos',
                        description: 'Marcas a un aliado como Chivo Expiatorio; al iniciar combate puedes forzar prioridad de objetivo enemiga.',
                        useType: 'active',
                        action: 'bonus_action',
                        effects: [
                            { type: 'mark_target', target: 'ally', value: 'scapegoat' },
                            { type: 'taunt_priority', target: 'all_enemies', trigger: 'at_combat_start', condition: '1d100 < {level + knowledge_save}' }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d03'),
                        name: 'Seguro de Vida',
                        description: 'Marcas a un aliado; si recibe daño este turno, obtiene PV temporales y resistencia elemental elegida.',
                        useType: 'active',
                        action: 'bonus_action',
                        effects: [
                            { type: 'heal', healType: 'temp_hp', heal: '{level * 2}', target: 'ally', trigger: 'before_ally_receive_attack', duration: { type: 'temporal', duration: 1, medition: 'turns' } }
                        ],
                        modifiers: [
                            { type: 'resistance', value: '{elemental_affinity}', description: 'Otorga resistencia elemental a elección', target: 'ally', condition: 'selection', duration: { type: 'temporal', duration: 1, medition: 'turns' } }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d0a'),
                                name: 'Reserva Duplicada',
                                description: 'Duplicas la cantidad de dados obtenida por Protección Superior al inicio de la incursión.',
                                useType: 'passive',
                                effects: [{ type: 'modify_feature_uses', featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d01'), multiplier: 2, description: 'Duplica dados de Protección Superior' }],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 18,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d04'),
                        name: 'Supresión de Presencia',
                        description: 'Una vez por combate puedes volver a un aliado imposible de notar o seleccionar por enemigos por 3 turnos.',
                        useType: 'active',
                        action: 'action',
                        uses: 1,
                        triggerForRecover: 'at_combat_end',
                        effects: [{ type: 'untargetable', target: 'ally', duration: { type: 'temporal', duration: 3, medition: 'turns' } }],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    {
        name: 'Entertainer',
        description: 'Soporte expresivo enfocado en cadenas de curación y ritmo de hechizos',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d05'),
                        name: 'Punchline',
                        description: 'Cada curación individual otorga una potenciación básica al objetivo; al lanzar hechizos te restauras PV.',
                        useType: 'passive',
                        effects: [
                            { type: 'cast_spell', target: 'ally', trigger: 'at_heal', condition: 'individual heal', spellCategory: 'buff', reduction: 1, description: 'Otorga una potenciación básica al objetivo' },
                            { type: 'heal', healType: 'HP', heal: '2 + {spell_cost}', target: 'self', trigger: 'at_spell' }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d06'),
                        name: 'Stand Up',
                        description: 'Una vez por combate, restauras 10 x nivel de PV repartidos entre aliados y lanzas un hechizo de efecto como parte de la acción.',
                        useType: 'active',
                        action: 'action',
                        uses: 1,
                        triggerForRecover: 'at_combat_end',
                        effects: [
                            { type: 'distributed_heal', target: 'all_allies', value: '{level * 10}' },
                            { type: 'cast_spell', target: 'all_allies', spellCategory: 'utility', reduction: 1 }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d07'),
                        name: 'Call Back',
                        description: 'Una vez por combate, puedes dejarte caer como reacción tras recibir un ataque para ser ignorado hasta final de turno enemigo.',
                        useType: 'active',
                        action: 'reaction',
                        uses: 1,
                        triggerForRecover: 'at_combat_end',
                        trigger: 'at_receive_attack',
                        effects: [{ type: 'untargetable', target: 'self', duration: { type: 'temporal', duration: 1, medition: 'turns' } }],
                        subFeatures: [
                            {
                                featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d0b'),
                                name: 'Punchline Complejo',
                                description: 'Punchline ahora aplica una potenciación compleja en vez de básica.',
                                useType: 'passive',
                                effects: [{ type: 'replace_effect', featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d05'), condition: 'individual heal', value: 'complex_buff' }],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 18,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d08'),
                        name: 'Catch Phrase',
                        description: 'Tras dos hechizos, el tercero se lanza dos veces; una vez por incursión puedes restaurar todos tus AP y PV.',
                        useType: 'passive',
                        internalCounter: true,
                        counterCondition: 'spell casts equals 2',
                        effects: [
                            { type: 'duplicate_next_spell', target: 'self', condition: 'counter reached', etiquette: 'catch_phrase' },
                            { type: 'double_effect_duration', target: 'self', condition: 'duplicated spell category is utility', etiquette: 'catch_phrase' }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d0c'),
                                name: 'Gran Cierre',
                                description: 'Una vez por incursión recuperas todo tu AP y PV, pero no puedes tomar reacciones hasta tu siguiente turno.',
                                useType: 'active',
                                action: 'action',
                                uses: 1,
                                triggerForRecover: 'at_combat_end',
                                effects: [
                                    { type: 'recover_resource', resource: 'AP', value: 'full', target: 'self' },
                                    { type: 'heal', healType: 'HP', heal: 'full', target: 'self' }
                                ],
                                modifiers: [{ type: 'reaction', value: -99, description: 'No puedes tomar reacciones', target: 'self', duration: { type: 'temporal', duration: 1, medition: 'turns' } }],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    {
        name: 'Discourager',
        description: 'Debilitador ofensivo con conversión de daño en soporte aliado',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d09'),
                        name: 'Robar Espíritu',
                        description: 'Al causar daño aplicas una debilitación básica por 2 rondas; si el enemigo ya tiene las tres, le rompes un escudo.',
                        useType: 'passive',
                        trigger: 'at_damage',
                        effects: [
                            { type: 'cast_spell', target: 'enemy', spellCategory: 'debuff', condition: 'basic_debuff', reduction: 1, duration: { type: 'temporal', duration: 2, medition: 'rounds' } },
                            { type: 'break_shield', target: 'enemy', value: 1, condition: 'target has all basic debuffs' }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d10'),
                        name: 'Repartición de Ánima',
                        description: 'Si dañas a un enemigo debilitado, curas a un aliado la mitad del daño. Reacción para convertir daño neutral en daño a debilidad.',
                        useType: 'passive',
                        effects: [
                            { type: 'heal', healType: 'HP', heal: '{damage / 2}', target: 'ally', trigger: 'at_damage', condition: 'target has debuff or negative effect' },
                            { type: 'convert_damage_affinity', target: 'enemy', trigger: 'at_spell', action: 'reaction', condition: 'spell damage is neutral', uses: 1, triggerForRecover: 'at_round_end' }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d11'),
                        name: 'Ecos Esotéricos',
                        description: 'Al causar daño con hechizo individual, reaplicas el daño mínimo al inicio de tus siguientes 2 turnos.',
                        useType: 'passive',
                        effects: [
                            { type: 'repeat_damage_minimum', target: 'enemy', trigger: 'at_spell_attack', condition: 'single target spell', value: 2, triggerForRecover: 'at_turn_start' },
                            { type: 'replace_effect', featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d09'), condition: 'basic_debuff', value: 'complex_debuff' }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 18,
                features: [
                    {
                        featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d12'),
                        name: 'Absorción de Éter',
                        description: 'Rompes un escudo adicional al romper escudos y mejoras severamente los beneficios de All-Out Attack.',
                        useType: 'passive',
                        effects: [
                            { type: 'break_shield', target: 'enemy', trigger: 'at_break_shield', value: 1 },
                            { type: 'debuff', target: 'all_enemies', trigger: 'at_all_out_attack', addTo: 'shieldModifiers', value: -1, permanent: true },
                            { type: 'modify_resistance_ladder', target: 'enemy', trigger: 'at_all_out_attack', value: 'absorb->immune | immune->resist | remove resist' },
                            { type: 'heal', healType: 'HP', heal: '{level}', target: 'all_allies', trigger: 'at_all_out_attack' },
                            { type: 'recover_resource', resource: 'AP', value: '{proficiency}', target: 'all_allies', trigger: 'at_all_out_attack' }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    }
]);

const subclasses = subclass.insertedIds;

await db.personaclasses.updateOne(
    { _id: characterClassId },
    {
        $set: {
            levels: [
                {
                    level: 1,
                    proficency: 2,
                    spells: [spells[0], spells[1]],
                    APGained: 6,
                    maxPreparedSpells: 6
                },
                {
                    level: 2,
                    proficency: 2,
                    spells: [spells[2], spells[3], spells[4], spells[5]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d15'),
                            name: 'Mezcla Anímica',
                            description: 'Con tu acción, utilizas tu cuerpo para canalizar y mezclar distintas concentraciones de ánimas a fin de generar hechizos adecuados para cada situación. Del listado proporcionado abajo, puedes construir un hechizo personalizado mezclando una cantidad de elementos igual a tu competencia. Puedes repetir el mismo elemento más de una vez, pero contarán como elementos distintos para la cantidad máxima indicada. Puedes utilizar este efecto una cantidad de veces por incursión igual a la cantidad de mezclas anímicas indicadas en la tabla de niveles. Al finalizar un combate, recuperas un uso de mezcla anímica.',
                            useType: 'active',
                            action: 'action',
                            usesPerLevel: [
                                { minLevel: 2, maxLevel: 4, uses: 3 },
                                { minLevel: 5, maxLevel: 8, uses: 4 },
                                { minLevel: 9, maxLevel: 13, uses: 5 },
                                { minLevel: 14, maxLevel: 18, uses: 6 },
                                { minLevel: 19, maxLevel: 19, uses: 7 },
                                { minLevel: 20, maxLevel: 20, uses: 8 }
                            ],
                            triggerForRecover: 'at_combat_end',
                            subFeatures: [
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d16'),
                                    name: 'Éter Curativo',
                                    description: 'Restauras PV a un aliado. Escala por nivel.',
                                    useType: 'active',
                                    effects: [
                                        { type: 'heal', healType: 'HP', heal: '2d4', target: 'ally', levelCondition: 2 },
                                        { type: 'heal', healType: 'HP', heal: '3d6', target: 'ally', levelCondition: 7 },
                                        { type: 'heal', healType: 'HP', heal: '4d8', target: 'ally', levelCondition: 13 },
                                        { type: 'heal', healType: 'HP', heal: '5d10', target: 'ally', levelCondition: 17 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d17'),
                                    name: 'Espíritu Limpiador',
                                    description: 'Remueves estados o efectos negativos en aliados.',
                                    useType: 'active',
                                    effects: [
                                        { type: 'heal', healType: 'status_effect', target: 'ally', value: 1, levelCondition: 2 },
                                        { type: 'heal', healType: 'status_effect', target: 'ally', value: 2, levelCondition: 7 },
                                        { type: 'remove_debuffs', target: 'ally', levelCondition: 14 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d18'),
                                    name: 'Concentración Elemental',
                                    description: 'Causas daño de afinidad a un enemigo. Escala por nivel.',
                                    useType: 'active',
                                    effects: [
                                        { type: 'damage', damageType: 'affinity', dice: '2d6', target: 'enemy', levelCondition: 2 },
                                        { type: 'damage', damageType: 'affinity', dice: '3d8', target: 'enemy', levelCondition: 7 },
                                        { type: 'damage', damageType: 'affinity', dice: '4d10', target: 'enemy', levelCondition: 13 },
                                        { type: 'damage', damageType: 'affinity', dice: '5d12', target: 'enemy', levelCondition: 17 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d19'),
                                    name: 'Ánima de Corrupción',
                                    description: 'Remueves estados positivos en enemigos.',
                                    useType: 'active',
                                    levelCondition: 5,
                                    effects: [
                                        { type: 'remove_buffs', target: 'enemy', value: 1, levelCondition: 5 },
                                        { type: 'remove_buffs', target: 'enemy', levelCondition: 13 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d20'),
                                    name: 'Éter de Protección',
                                    description: 'Otorgas PV temporales a un aliado. Escala por nivel.',
                                    useType: 'active',
                                    levelCondition: 5,
                                    effects: [
                                        { type: 'heal', healType: 'temp_hp', heal: '3d4', target: 'ally', levelCondition: 5 },
                                        { type: 'heal', healType: 'temp_hp', heal: '4d6', target: 'ally', levelCondition: 9 },
                                        { type: 'heal', healType: 'temp_hp', heal: '5d8', target: 'ally', levelCondition: 15 },
                                        { type: 'heal', healType: 'temp_hp', heal: '6d10', target: 'ally', levelCondition: 19 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d21'),
                                    name: 'Espíritu Potenciador',
                                    description: 'Otorgas una potenciación básica; a nivel 13 pasa a compleja.',
                                    useType: 'active',
                                    levelCondition: 5,
                                    effects: [
                                        { type: 'cast_spell', target: 'ally', spellCategory: 'buff', condition: 'basic_buff', levelCondition: 5 },
                                        { type: 'cast_spell', target: 'ally', spellCategory: 'buff', condition: 'complex_buff', levelCondition: 13 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d22'),
                                    name: 'Ánima de Expansión',
                                    description: 'Las concentraciones se aplican a todos los aliados o enemigos. Cuenta como dos concentraciones.',
                                    useType: 'active',
                                    levelCondition: 9,
                                    effects: [{ type: 'modify_concentration_target', target: 'all', value: 'all_targets', levelCondition: 9 }],
                                    cost: [{ amount: 2, resource: 'concentrations' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d23'),
                                    name: 'Concentración Superior',
                                    description: 'Las concentraciones se aplican dos veces. Cuenta como dos concentraciones.',
                                    useType: 'active',
                                    levelCondition: 9,
                                    effects: [{ type: 'duplicate_concentration', target: 'self', levelCondition: 9 }],
                                    cost: [{ amount: 2, resource: 'concentrations' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d24'),
                                    name: 'Espíritu Resistente',
                                    description: 'Otorgas resistencia elemental temporal a un aliado.',
                                    useType: 'active',
                                    levelCondition: 9,
                                    modifiers: [
                                        { type: 'resistance', value: '{elemental_affinity}', target: 'ally', condition: 'selection', duration: { type: 'temporal', duration: 1, medition: 'turns' } }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d25'),
                                    name: 'Éter Crítico',
                                    description: 'Otorgas crítico adicional por 3 turnos.',
                                    useType: 'active',
                                    levelCondition: 14,
                                    modifiers: [
                                        { type: 'critical', value: 5, target: 'ally', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, levelCondition: 14 },
                                        { type: 'critical', value: 10, target: 'ally', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, levelCondition: 19 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d26'),
                                    name: 'Ánima Destructora',
                                    description: 'Un aliado rompe escudos adicionales por 3 turnos; duración doble en nivel 19.',
                                    useType: 'active',
                                    levelCondition: 14,
                                    effects: [
                                        { type: 'break_shield', target: 'ally', value: 1, trigger: 'at_break_shield', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, levelCondition: 14 },
                                        { type: 'break_shield', target: 'ally', value: 1, trigger: 'at_break_shield', duration: { type: 'temporal', duration: 6, medition: 'rounds' }, levelCondition: 19 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d27'),
                                    name: 'Concentración Debilitadora',
                                    description: 'Otorgas el efecto de una debilitación compleja a un enemigo.',
                                    useType: 'active',
                                    levelCondition: 14,
                                    effects: [{ type: 'cast_spell', target: 'enemy', spellCategory: 'debuff', condition: 'complex_debuff', levelCondition: 14 }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d28'),
                                    name: 'Espíritu de Extensión',
                                    description: 'Aumentas 3 turnos la duración de efectos positivos y negativos activos.',
                                    useType: 'active',
                                    levelCondition: 20,
                                    effects: [
                                        { type: 'extend_buffs', target: 'all_allies', value: 3, levelCondition: 20 }, 
                                        { type: 'extend_debuffs', target: 'all_enemies', value: 3, levelCondition: 20 }
                                    ],
                                    cost: [{ amount: 2, resource: 'concentrations' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d29'),
                                    name: 'Éter de Atenuación',
                                    description: 'Eliminas resistencias, inmunidades y absorciones a un enemigo por 3 turnos.',
                                    useType: 'active',
                                    levelCondition: 20,
                                    effects: [{ type: 'remove_resistance', target: 'enemy', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, value: 'all', levelCondition: 20 }],
                                    cost: [{ amount: 2, resource: 'concentrations' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d30'),
                                    name: 'Ánima de Aceleración',
                                    description: 'Un aliado gana una acción extra en su siguiente turno.',
                                    useType: 'active',
                                    levelCondition: 20,
                                    effects: [{ type: 'extra_action', target: 'ally', trigger: 'at_turn_start', uses: 1, levelCondition: 20 }],
                                    cost: [{ amount: 3, resource: 'concentrations' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d31'),
                                    name: 'Concentración Espiritual',
                                    description: 'Restauras AP y PV a un aliado.',
                                    useType: 'active',
                                    effects: [
                                        { type: 'recover_resource', resource: 'AP', value: '2d4 + 2', target: 'ally', levelCondition: 20 },
                                        { type: 'heal', healType: 'HP', heal: '6d6', target: 'ally', levelCondition: 20 }
                                    ],
                                    cost: [{ amount: 2, resource: 'concentrations' }],
                                    state: 'ACTIVE'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 6
                },
                {
                    level: 3,
                    proficency: 2,
                    spells: [spells[6], spells[7], spells[8]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d32'),
                            name: 'Protección Estelar',
                            description: 'Cuando un aliado recibirá un ataque cuando tiene menos de la mitad de sus puntos de vida totales puedes utilizar tu reacción para otorgarle tu nivel en PV temporales hasta el inicio de tu siguiente turno.',
                            useType: 'active',
                            action: 'reaction',
                            trigger: 'before_ally_receive_attack',
                            effects: [{ type: 'heal', healType: 'temp_hp', heal: '{level}', target: 'ally', condition: 'ally current HP is lower than half max HP', duration: { type: 'temporal', duration: 1, medition: 'turns' } }],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 6
                },
                {
                    level: 4,
                    proficency: 2,
                    spells: [spells[9], spells[10]],
                    features: [],
                    APGained: 2,
                    maxPreparedSpells: 7,
                    selectSubclass: true,
                    gainSubclassFeature: true
                },
                {
                    level: 5,
                    proficency: 3,
                    spells: [spells[11], spells[12], spells[13]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 7,
                    gainStatIncrease: true
                },
                {
                    level: 6,
                    proficency: 3,
                    spells: [spells[14], spells[15], spells[16]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d33'),
                            name: 'Restablecimiento Fugaz',
                            description: 'Puedes utilizar tu reacción para restaurar a un aliado caído en combate, curarle el doble de tu nivel en PV y darle la resistencia a todo daño hasta el inicio de tu siguiente turno. Solo puedes activar este efecto una vez por incursión.',
                            useType: 'active',
                            action: 'reaction',
                            uses: 1,
                            triggerForRecover: 'at_combat_end',
                            trigger: 'at_ally_death',
                            effects: [
                                { type: 'heal', healType: 'HP', heal: '{level * 2}', target: 'ally' },
                                { type: 'add_resistance', target: 'ally', value: 'all', duration: { type: 'temporal', duration: 1, medition: 'turns' } }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 7
                },
                {
                    level: 7,
                    proficency: 3,
                    spells: [spells[17], spells[18], spells[19]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d34'),
                            name: 'Reflejo Curativo',
                            description: 'Cuando sanas a un aliado con un hechizo o efecto tuyo, restauras la mitad a otro aliado adicional.',
                            useType: 'passive',
                            trigger: 'at_heal',
                            effects: [{ type: 'heal', healType: 'HP', heal: '{healed_amount / 2}', target: 'ally', condition: 'different target' }],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 7
                },
                {
                    level: 8,
                    proficency: 3,
                    spells: [spells[20], spells[21], spells[22]],
                    features: [],
                    APGained: 2,
                    maxPreparedSpells: 10,
                    gainSubclassFeature: true
                },
                {
                    level: 9,
                    proficency: 4,
                    spells: [spells[23], spells[24], spells[25]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 10,
                    gainStatIncrease: true
                },
                {
                    level: 10,
                    proficency: 4,
                    spells: [spells[26], spells[27], spells[28]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d35'),
                            name: 'Amplificación de Aura',
                            description: 'Aumentas 3 casillas el rango de hechizos no ofensivos. Una vez por combate, una salvación aliada es éxito automático.',
                            useType: 'passive',
                            modifiers: [{ type: 'range', value: 3, description: 'Rango extra para hechizos no ofensivos', target: 'self', addTo: 'spellRangeNonDamageModifiers', permanent: true }],
                            subFeatures: [
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d36'),
                                    name: 'Destino Favorable',
                                    description: 'Una vez por combate, la siguiente salvación requerida por aliados es éxito automático.',
                                    useType: 'active',
                                    action: 'reaction',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [{ type: 'automatic_save_success', target: 'all_allies', trigger: 'before_save' }],
                                    state: 'ACTIVE'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 10
                },
                {
                    level: 11,
                    proficency: 4,
                    spells: [spells[29], spells[30], spells[31], spells[32]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d37'),
                            name: 'Equilibrio Espiritual',
                            description: 'Generas Black Marks y White Marks según tus acciones para habilitar conversiones tácticas.',
                            useType: 'passive',
                            effects: [
                                { type: 'generate_marks', target: 'enemy', value: '{is_area ? 1 : 2}', trigger: 'at_spell_attack', resource: 'Black Marks' },
                                { type: 'generate_marks', target: 'ally', value: '{is_area ? 1 : 2}', trigger: 'at_heal', resource: 'White Marks' },
                                { type: 'unlock_mark_actions', target: 'self', resource: ['Black Marks', 'White Marks'] }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 10
                },
                {
                    level: 12,
                    proficency: 4,
                    spells: [spells[33], spells[34], spells[35]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d38'),
                            name: 'Restablecimiento Superior',
                            description: 'Restablecimiento Fugaz pasa a otorgar inmunidad temporal y luego resistencia elemental elegida por 3 turnos.',
                            useType: 'passive',
                            effects: [
                                { type: 'replace_effect', featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d33'), condition: 'resistance_all', value: 'immunity_all' },
                                { type: 'add_followup_effect', featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d33'), value: 'elemental_resistance_selection_3_rounds' }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 11
                },
                {
                    level: 13,
                    proficency: 5,
                    spells: [spells[36], spells[37], spells[38]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 11,
                    gainSubclassFeature: true
                },
                {
                    level: 14,
                    proficency: 5,
                    spells: [spells[39], spells[40], spells[41]],
                    features: [],
                    APGained: 2,
                    maxPreparedSpells: 11,
                    gainStatIncrease: true
                },
                {
                    level: 15,
                    proficency: 5,
                    spells: [spells[42], spells[43], spells[44], spells[45]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d39'),
                            name: 'Potenciación Anímica',
                            description: 'Al inicio del combate puedes lanzar una potenciación compleja a todos los aliados sin coste. También potencias daño o curación con carisma.',
                            useType: 'passive',
                            effects: [
                                { type: 'cast_spell', target: 'all_allies', trigger: 'at_combat_start', spellCategory: 'buff', condition: 'complex_buff', reduction: 1 },
                                { type: 'amplify_spell_by_stat', target: 'self', stat: 'charisma_save', uses: '{proficiency}', condition: 'spell category is attack or heal' }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 11
                },
                {
                    level: 16,
                    proficency: 5,
                    spells: [spells[46], spells[47], spells[48]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d40'),
                            name: 'Alteración Espiritual',
                            description: 'Ganas tres técnicas especiales, una vez por combate cada una.',
                            useType: 'passive',
                            subFeatures: [
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d41'),
                                    name: 'Objetivos Totales',
                                    description: 'Un hechizo de objetivo único pasa a todos los objetivos disponibles.',
                                    useType: 'active',
                                    action: 'free_action',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [{ type: 'modify_next_spell_target', target: 'all', condition: 'single target spell' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d42'),
                                    name: 'Ritmo Acelerado',
                                    description: 'Lanzas un hechizo que no causa daño como acción adicional.',
                                    useType: 'active',
                                    action: 'free_action',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [{ type: 'change_spell_action', target: 'self', value: 'bonus_action', condition: 'spell does not deal damage' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d43'),
                                    name: 'Curación Perfecta',
                                    description: 'Tu siguiente hechizo de curación restaura la tirada máxima.',
                                    useType: 'active',
                                    action: 'free_action',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [{ type: 'maximize_next_heal', target: 'self' }],
                                    state: 'ACTIVE'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 14
                },
                {
                    level: 17,
                    proficency: 6,
                    spells: [spells[49], spells[50], spells[51]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d44'),
                            name: 'Soporte Moral',
                            description: 'Al inicio de cada ronda, en 6+ en 1d8 todos los aliados ganan Carga y Concentración; si no, ganas una reacción adicional.',
                            useType: 'passive',
                            trigger: 'at_round_start',
                            effects: [
                                { type: 'cast_spell', target: 'all_allies', condition: '1d8 >= 6', spellCategory: 'buff', value: ['charge', 'concentration'], duration: { type: 'temporal', duration: 1, medition: 'rounds' } },
                                { type: 'buff', target: 'self', condition: '1d8 < 6', modifiers: [{ type: 'reaction', value: 1, addTo: 'reactionModifiers', duration: { type: 'temporal', duration: 1, medition: 'rounds' } }] }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 14
                },
                {
                    level: 18,
                    proficency: 6,
                    spells: [spells[52], spells[53], spells[54]],
                    features: [],
                    APGained: 2,
                    maxPreparedSpells: 14,
                    gainSubclassFeature: true
                },
                {
                    level: 19,
                    proficency: 6,
                    spells: [spells[55], spells[56], spells[57]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 14,
                    gainStatIncrease: true
                },
                {
                    level: 20,
                    proficency: 6,
                    spells: [spells[58], spells[59], spells[60]],
                    features: [
                        {
                            featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d45'),
                            name: 'Sobreestimulación',
                            description: 'Como acción, una vez por ronda, otorgas un turno adicional a un aliado (máximo 3 aliados distintos por combate).',
                            useType: 'active',
                            action: 'action',
                            uses: 3,
                            triggerForRecover: 'at_combat_end',
                            effects: [{ type: 'extra_turn', target: 'ally', condition: 'target has not benefited from this feature in current combat' }],
                            subFeatures: [
                                {
                                    featureId: new ObjectId('7f8f4b3b3f1d9a001f2b3d46'),
                                    name: 'Reinicio de Incursión',
                                    description: 'Una vez por incursión restauras el estado de un aliado a como estaba antes de iniciar la incursión.',
                                    useType: 'active',
                                    action: 'action',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [{ type: 'restore_pre_incursion_state', target: 'ally', condition: 'does not retrigger at_combat_start features' }],
                                    state: 'ACTIVE'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 18
                }
            ]
        }
    }
);

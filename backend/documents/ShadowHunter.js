const { ObjectId } = require('mongodb');

// Crear la clase base Shadow Hunter
const characterClassId = new ObjectId();
db.characterClass.insertOne({
    _id: characterClassId,
    name: 'Shadow Hunter',
    description: 'Cazador experto en combate físico, concentración y marcado de objetivos.',
    HPDice: '2d4',
    salvations: ['dexterity', 'wisdom'],
});

// Insertar los hechizos de Shadow Hunter
db.spell.insertMany([
    // Nivel 1
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico I (I)',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario.',
        cost: 2,
        damage: '2d4',
        levelRequirement: 1,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 2
    {
        spellId: new ObjectId(),
        name: 'Potenciación Básica (F)',
        description: 'Aumenta en +2 a todo daño infligido por 3 turnos a ti o a un aliado.',
        cost: 2,
        damage: null,
        levelRequirement: 2,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        modifiers: [
            {
                value: 2,
                type: 'damage',
                description: 'Aumenta en +2 a todo daño infligido',
                target: 'ally',
                addTo: 'damageModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_damage'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Básica (P)',
        description: 'Aumenta en +2 el ataque por 3 turnos a ti o a un aliado.',
        cost: 2,
        damage: null,
        levelRequirement: 2,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        modifiers: [
            {
                value: 2,
                type: 'attack',
                description: 'Aumenta en +2 el ataque',
                target: 'ally',
                addTo: 'attackModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_attack'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 3
    {
        spellId: new ObjectId(),
        name: 'Encantamiento de Arma I',
        description: 'Aplicas un elemento a una de tus armas, cambiando su tipo de daño a una afinidad previamente establecida.',
        cost: 3,
        damage: null,
        levelRequirement: 3,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'weapon_enchantment',
                value: 'change_element',
                target: 'weapon'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 4
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico I (A)',
        description: 'Inflige daño de objetivo en área de la afinidad física del usuario.',
        cost: 4,
        damage: '2d4',
        levelRequirement: 4,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 5
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico II (I)',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario.',
        cost: 4,
        damage: '3d6',
        levelRequirement: 5,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico I (E)',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario con 10% (18-20) de porcentaje de crítico aumentado, pero con un porcentaje de pifia aumentado en 10% (1-3).',
        cost: 3,
        damage: '4d2',
        levelRequirement: 5,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        effects: [
            {
                type: 'crit_chance_increase',
                value: 10,
                critRange: '18-20'
            },
            {
                type: 'fumble_chance_increase',
                value: 10,
                fumbleRange: '1-3'
            }
        ],
        state: 'ACTIVE'
    },
    // Nivel 6
    {
        spellId: new ObjectId(),
        name: 'Aim',
        description: 'Por este turno, recibes un +2 al daño físico. Acción adicional.',
        cost: 2,
        damage: null,
        levelRequirement: 6,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        duration: 1,
        effects: [
            {
                type: 'damage_buff',
                value: 2,
                target: 'self',
                damageType: 'physical',
                duration: 1
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Acelerar',
        description: 'Obtienes +1 a defensa y +1 a tu resistencia mágica, +3 al daño y una reacción adicional en cada asalto durante 5 turnos. Se puede utilizar 1 vez por combate.',
        cost: 4,
        damage: null,
        levelRequirement: 6,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 5,
        usesPerCombat: 1,
        effects: [
            {
                type: 'defense_buff',
                value: 1,
                target: 'self',
                duration: 5
            },
            {
                type: 'magic_resistance_buff',
                value: 1,
                target: 'self',
                duration: 5
            },
            {
                type: 'damage_buff',
                value: 3,
                target: 'self',
                duration: 5
            },
            {
                type: 'extra_reaction',
                value: 1,
                target: 'self',
                duration: 5
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 7
    {
        spellId: new ObjectId(),
        name: 'Encantamiento de Arma II',
        description: 'Aplicas un elemento a una de tus armas, cambiando su tipo de daño a una afinidad previamente establecida. Aumentas el daño de tu arma en 1d6.',
        cost: 5,
        damage: null,
        levelRequirement: 7,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'weapon_enchantment',
                value: 'change_element',
                target: 'weapon'
            },
            {
                type: 'weapon_damage_increase',
                value: '1d6',
                target: 'weapon'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 8
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico II (A)',
        description: 'Inflige daño de objetivo en área de la afinidad física del usuario.',
        cost: 6,
        damage: '3d6',
        levelRequirement: 8,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 9
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico II (E)',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario con 10% (18-20) de porcentaje de crítico aumentado, pero con un porcentaje de pifia aumentado en 10% (1-3).',
        cost: 5,
        damage: '8d2',
        levelRequirement: 9,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        effects: [
            {
                type: 'crit_chance_increase',
                value: 10,
                critRange: '18-20'
            },
            {
                type: 'fumble_chance_increase',
                value: 10,
                fumbleRange: '1-3'
            }
        ],
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Regenerar I',
        description: 'Al final de cada turno, restauras 1d8 PV. Aumenta a 2d4 a nivel 13 y 2d6 a nivel 17.',
        cost: 0,
        damage: null,
        levelRequirement: 9,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'regeneration',
                value: '1d8',
                target: 'self',
                trigger: 'end_of_turn',
                scaling: [
                    { level: 13, value: '2d4' },
                    { level: 17, value: '2d6' }
                ]
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 10
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico III (I)',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario.',
        cost: 6,
        damage: '4d8',
        levelRequirement: 10,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Rebelión',
        description: 'Incrementa ratio de crítico en 5% (19-20) en ataques a ti y a todos los aliados durante 3 turnos.',
        cost: 6,
        damage: null,
        levelRequirement: 10,
        targetType: 'all_allies',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'crit_chance_increase',
                value: 5,
                critRange: '19-20',
                target: 'all_allies',
                duration: 3
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 11
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (F)',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a ti o a un aliado.',
        cost: 3,
        damage: null,
        levelRequirement: 11,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        modifiers: [
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta en +5 a todo daño infligido',
                target: 'ally',
                addTo: 'damageModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_damage'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (P)',
        description: 'Aumenta en +3 el ataque por 3 turnos a ti o a un aliado.',
        cost: 3,
        damage: null,
        levelRequirement: 11,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta en +3 el ataque',
                target: 'ally',
                addTo: 'attackModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_attack'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 12
    {
        spellId: new ObjectId(),
        name: 'Aim+',
        description: 'Por este turno, recibes un +4 al daño físico y +2 al ataque. Acción adicional.',
        cost: 4,
        damage: null,
        levelRequirement: 12,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        duration: 1,
        effects: [
            {
                type: 'damage_buff',
                value: 4,
                target: 'self',
                damageType: 'physical',
                duration: 1
            },
            {
                type: 'attack_buff',
                value: 2,
                target: 'self',
                duration: 1
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 13
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico III (A)',
        description: 'Inflige daño de objetivo en área de la afinidad física del usuario.',
        cost: 8,
        damage: '4d8',
        levelRequirement: 13,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico III (E)',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario con 10% (18-20) de porcentaje de crítico aumentado, pero con un porcentaje de pifia aumentado en 10% (1-3).',
        cost: 7,
        damage: '8d4',
        levelRequirement: 13,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        effects: [
            {
                type: 'crit_chance_increase',
                value: 10,
                critRange: '18-20'
            },
            {
                type: 'fumble_chance_increase',
                value: 10,
                fumbleRange: '1-3'
            }
        ],
        state: 'ACTIVE'
    },
    // Nivel 14
    {
        spellId: new ObjectId(),
        name: 'Encantamiento de Arma III',
        description: 'Aplicas un elemento a una de tus armas, cambiando su tipo de daño a una afinidad previamente establecida. Aumentas el daño de tu arma en 1d6. Aplica un estado alterado con dificultad igual a la mitad de tu tirada de ataque.',
        cost: 7,
        damage: null,
        levelRequirement: 14,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'weapon_enchantment',
                value: 'change_element',
                target: 'weapon'
            },
            {
                type: 'weapon_damage_increase',
                value: '1d6',
                target: 'weapon'
            },
            {
                type: 'apply_status_on_hit',
                dc: 'half_attack_roll',
                target: 'enemy'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 15
    {
        spellId: new ObjectId(),
        name: 'Potenciación Completa',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos a ti o a un aliado.',
        cost: 6,
        damage: null,
        levelRequirement: 15,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta +3 a tu ataque',
                target: 'ally',
                addTo: 'attackModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_complete'
            },
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta +5 al daño infligido',
                target: 'ally',
                addTo: 'damageModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_complete'
            },
            {
                value: 3,
                type: 'defense',
                description: 'Aumenta +3 a la Defensa',
                target: 'ally',
                addTo: 'defenseModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_complete'
            },
            {
                value: 2,
                type: 'magic_defense',
                description: 'Aumenta +2 a la Resistencia Mágica',
                target: 'ally',
                addTo: 'magicDefenseModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_complete'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico IV (I)',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario.',
        cost: 8,
        damage: '6d10',
        levelRequirement: 15,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 16
    {
        spellId: new ObjectId(),
        name: 'Avance Valiente',
        description: 'Incrementa ratio de crítico en 10% (18-20) en ataques a ti y a todos los aliados durante 3 turnos.',
        cost: 10,
        damage: null,
        levelRequirement: 16,
        targetType: 'all_allies',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'crit_chance_increase',
                value: 10,
                critRange: '18-20',
                target: 'all_allies',
                duration: 3
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Encantamiento de Malicia',
        description: 'Otorgas a todas tus armas un 5% de porcentaje de crítico adicional en ataques. Cuando realizas un ataque crítico, agrega un 3d6 de daño adicional (no afectado por el crítico).',
        cost: 7,
        damage: null,
        levelRequirement: 16,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'crit_chance_increase',
                value: 5,
                target: 'self',
                applyTo: 'all_weapons'
            },
            {
                type: 'bonus_damage_on_crit',
                value: '3d6',
                target: 'self',
                notAffectedByCrit: true
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 17
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico IV (A)',
        description: 'Inflige daño de objetivo en área de la afinidad física del usuario.',
        cost: 10,
        damage: '6d10',
        levelRequirement: 17,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Ataque Físico IV (E)',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario con 10% (18-20) de porcentaje de crítico aumentado, pero con un porcentaje de pifia aumentado en 10% (1-3).',
        cost: 9,
        damage: '12d4',
        levelRequirement: 17,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_affinity',
        castingAttribute: 'courage',
        effects: [
            {
                type: 'crit_chance_increase',
                value: 10,
                critRange: '18-20'
            },
            {
                type: 'fumble_chance_increase',
                value: 10,
                fumbleRange: '1-3'
            }
        ],
        state: 'ACTIVE'
    },
    // Nivel 18
    {
        spellId: new ObjectId(),
        name: 'Carga',
        description: 'El siguiente golpe físico impactará. Si la tirada de ataque es exitosa, será un crítico.',
        cost: 6,
        damage: null,
        levelRequirement: 18,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'auto_hit',
                target: 'next_physical_attack'
            },
            {
                type: 'auto_crit',
                target: 'next_physical_attack',
                condition: 'attack_roll_success'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Encantamiento de Arma IV',
        description: 'Aplicas un elemento a tu arma, cambiando su tipo de daño a una afinidad previamente establecida. Aumentas el daño de tu arma en 2d6. Aplica un estado alterado con dificultad igual a la mitad de tu tirada de ataque.',
        cost: 8,
        damage: null,
        levelRequirement: 18,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'weapon_enchantment',
                value: 'change_element',
                target: 'weapon'
            },
            {
                type: 'weapon_damage_increase',
                value: '2d6',
                target: 'weapon'
            },
            {
                type: 'apply_status_on_hit',
                dc: 'half_attack_roll',
                target: 'enemy'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 19
    {
        spellId: new ObjectId(),
        name: 'Regenerar II',
        description: 'Al final de cada turno, restauras 4d6 PV.',
        cost: 0,
        damage: null,
        levelRequirement: 19,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'regeneration',
                value: '4d6',
                target: 'self',
                trigger: 'end_of_turn'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Desplazamiento Acelerado',
        description: 'En un destello, te teletransportas hasta 6 casillas a un lugar sin ocupar que puedas ver.',
        cost: 5,
        damage: null,
        levelRequirement: 19,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'teleport',
                range: 6,
                target: 'self',
                condition: 'unoccupied_visible_space'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Focus',
        description: 'Por este turno, recibes ventaja en tu ataque. Acción adicional.',
        cost: 6,
        damage: null,
        levelRequirement: 19,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        duration: 1,
        effects: [
            {
                type: 'advantage',
                target: 'self',
                applyTo: 'attack_rolls',
                duration: 1
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 20
    {
        spellId: new ObjectId(),
        name: 'Maestro en Armas',
        description: 'Disminuyes el coste de tus hechizos de daño a la mitad. Puedes decidir no reducirlos a cambio de aumentar dos dados adicionales la tirada de daño.',
        cost: 0,
        damage: null,
        levelRequirement: 20,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'ap_cost_reduction',
                value: 0.5,
                target: 'self',
                applyTo: 'damage_spells',
                unit: 'multiplier'
            },
            {
                type: 'damage_increase_option',
                value: '2d',
                target: 'self',
                condition: 'no_cost_reduction'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
]);

// Insertar las características de la clase
const afinidadElementalFeature = {
    featureId: new ObjectId(),
    name: 'Afinidad Elemental',
    description: 'Elige una afinidad elemental que determina tu tipo de daño físico.',
    useType: 'passive',
    modifiers: [
        {
            value: 'elemental_choice',
            type: 'damage_type',
            description: 'Define el tipo de daño físico',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

const armaPredilectaFeature = {
    featureId: new ObjectId(),
    name: 'Arma Predilecta',
    description: 'Eliges un arma como tu arma predilecta, ganando bonificaciones con ella.',
    useType: 'passive',
    modifiers: [
        {
            value: 1,
            type: 'weapon_proficiency',
            description: 'Bonificación con arma predilecta',
            target: 'self',
            applyTo: 'favorite_weapon'
        }
    ],
    state: 'ACTIVE'
};

const concentracionFeature = {
    featureId: new ObjectId(),
    name: 'Concentración',
    description: 'Sistema de Puntos de Concentración (PC) que permite realizar ataques de concentración especiales. Recuperas 1 PC al impactar crítico.',
    useType: 'active',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Ataque de Precisión',
            description: 'Cuando realizas un ataque con arma contra un enemigo, puedes gastar 1 PC para intentar derribar al objetivo. Si aciertas, el objetivo adicionalmente debe realizar una salvación de coraje o caer derribado.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            trigger: 'weapon_attack',
            effects: [
                {
                    type: 'save_or_prone',
                    save: 'courage',
                    dc: '8 + proficiency + wisdom_modifier',
                    target: 'enemy',
                    condition: 'attack_hits'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ataque en Amplitud',
            description: 'Cuando realizas un ataque con arma cuerpo a cuerpo contra un enemigo, puedes gastar 1 PC para impactar a todos los enemigos que estén a rango cuerpo a cuerpo tuyo. Si aciertas, aplicas el daño a todos los enemigos a rango cuerpo cuerpo tuyo.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            trigger: 'melee_attack',
            effects: [
                {
                    type: 'aoe_melee',
                    target: 'all_adjacent_enemies',
                    condition: 'attack_hits'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ataque Contundente',
            description: 'Cuando realizas un ataque con arma contra un enemigo, puedes gastar 1 PC para intentar marear a tu oponente. Si aciertas, el objetivo adicionalmente debe realizar una salvación de coraje o sufrir desventaja en sus ataques hasta el final de su próximo turno.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            trigger: 'weapon_attack',
            effects: [
                {
                    type: 'save_or_disadvantage',
                    save: 'courage',
                    dc: '8 + proficiency + wisdom_modifier',
                    disadvantageOn: 'attacks',
                    duration: 'end_of_next_turn',
                    target: 'enemy',
                    condition: 'attack_hits'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ataque de Distracción',
            description: 'Inmediatamente después de atacar, puedes gastar 1 PC para realizar la acción de desenganchar como una acción adicional.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            trigger: 'after_attack',
            effects: [
                {
                    type: 'disengage_bonus_action',
                    target: 'self'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Disparo Penetrante',
            description: 'Cuando realizas un ataque con arma a distancia contra un enemigo, puedes gastar 1 PC para atravesar con tu disparo en línea recta. Si aciertas, el objetivo sufre el daño normal y realizas una tirada de ataque contra cada enemigo detrás de él hasta el rango máximo de tu arma.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            trigger: 'ranged_attack',
            effects: [
                {
                    type: 'penetrating_shot',
                    target: 'line',
                    range: 'weapon_max_range',
                    condition: 'attack_hits'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ataque en Combo',
            description: 'Cuando impactas un ataque con arma contra una criatura, puedes gastar 1 PC para obtener ventaja en las siguientes tiradas de ataque por el turno.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            trigger: 'weapon_attack_hits',
            effects: [
                {
                    type: 'advantage',
                    target: 'self',
                    applyTo: 'next_attacks_this_turn'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ataque de Arremetida',
            description: 'Gastando 1 PC, puedes, como parte de tu acción de ataque, moverte 2 casillas para entrar en rango de ataque.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            trigger: 'as_part_of_attack',
            effects: [
                {
                    type: 'movement',
                    value: 2,
                    target: 'self',
                    condition: 'enter_attack_range'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Llamada de Atención',
            description: 'Gastando 1 PC y tu acción adicional, puedes añadir a un aliado tu DC en PV temporales.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            action: 'bonus',
            effects: [
                {
                    type: 'grant_temp_hp',
                    value: '{8 + proficiency + wisdom_modifier}',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Maestría Dual',
            description: 'Gastando 1 PC y tu acción adicional, puedes causar que durante 3 turnos que, cuando realices ataques con la propiedad liviana, puedes realizar un ataque adicional con el arma que sostienes en tu mano no dominante como parte del ataque.',
            useType: 'active',
            cost: { type: 'PC', value: 1 },
            action: 'bonus',
            duration: 3,
            effects: [
                {
                    type: 'extra_attack',
                    target: 'self',
                    condition: 'light_weapon_attack',
                    weapon: 'off_hand',
                    duration: 3
                }
            ],
            state: 'ACTIVE'
        }
    ],
    effects: [
        {
            type: 'pc_recovery',
            value: 1,
            trigger: 'critical_hit',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

const depredadorNatoFeature = {
    featureId: new ObjectId(),
    name: 'Depredador Nato',
    description: 'Como el depredador más hábil, tienes ventaja en iniciativa, ventaja en ataques del primer turno contra criaturas sin acción, y ataque adicional con arma secundaria ligera.',
    useType: 'passive',
    modifiers: [
        {
            value: 'advantage',
            type: 'initiative',
            description: 'Ventaja en iniciativa',
            target: 'self'
        }
    ],
    effects: [
        {
            type: 'advantage_on_attacks',
            target: 'creatures_without_action',
            trigger: 'first_turn'
        },
        {
            type: 'extra_attack',
            target: 'self',
            weapon: 'off_hand_light',
            condition: 'as_part_of_attack'
        }
    ],
    state: 'ACTIVE'
};

const multiataqueFeature = {
    featureId: new ObjectId(),
    name: 'Multiataque',
    description: 'Puedes realizar múltiples ataques en tu acción de ataque. Ganas 1 ataque adicional a nivel 5, 2 a nivel 10, y 3 a nivel 17.',
    useType: 'passive',
    modifiers: [
        {
            value: 1,
            type: 'extra_attacks',
            description: 'Ataques adicionales',
            target: 'self',
            scaling: [
                { level: 5, value: 1 },
                { level: 10, value: 2 },
                { level: 17, value: 3 }
            ]
        }
    ],
    state: 'ACTIVE'
};

const marcaDeCazaFeature = {
    featureId: new ObjectId(),
    name: 'Marca de Caza',
    description: 'Como acción adicional, marcas a un enemigo visible por 1 hora. Infliges daño adicional al marcado, rompes escudos extra, aumentas crítico en 5%, y tienes ventaja en percepción/supervivencia para encontrarlo.',
    useType: 'active',
    action: 'bonus',
    duration: 3600,
    effects: [
        {
            type: 'mark_target',
            target: 'visible_creature',
            duration: 3600
        },
        {
            type: 'bonus_damage_vs_marked',
            value: 'scaling_by_level',
            trigger: 'first_damage_per_turn',
            scaling: [
                { level: 6, value: '1d6' },
                { level: 11, value: '2d4' },
                { level: 16, value: '2d6' },
                { level: 20, value: '2d8' }
            ]
        },
        {
            type: 'extra_shield_break',
            value: 1,
            target: 'marked_target'
        },
        {
            type: 'crit_chance_increase',
            value: 5,
            target: 'marked_target'
        },
        {
            type: 'advantage',
            target: 'self',
            applyTo: 'perception_survival',
            condition: 'finding_marked_target'
        }
    ],
    state: 'ACTIVE'
};

const sentidosAgudizadosFeature = {
    featureId: new ObjectId(),
    name: 'Sentidos Agudizados',
    description: 'Detectas activamente presencia (no ubicación) de trampas en línea de visión. Presientes peligro en salas antes de entrar.',
    useType: 'active',
    effects: [
        {
            type: 'detect_traps',
            range: 'line_of_sight',
            detail: 'presence_only',
            target: 'self'
        },
        {
            type: 'sense_danger',
            range: 'room',
            trigger: 'before_entering',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

const acecharFeature = {
    featureId: new ObjectId(),
    name: 'Acechar',
    description: 'Si observas enemigo 1 minuto antes de combate: conoces escudos/defensa/RM, salvación coraje/destreza, ganas +5% crítico/+2 ataque/+5 daño contra él, y recargas mitad PC.',
    useType: 'active',
    trigger: 'observe_target_1_minute',
    effects: [
        {
            type: 'reveal_stats',
            target: 'observed_enemy',
            reveals: ['shields', 'defense', 'magic_resistance', 'courage_save', 'dexterity_save']
        },
        {
            type: 'crit_chance_increase',
            value: 5,
            target: 'observed_enemy'
        },
        {
            type: 'attack_buff',
            value: 2,
            target: 'observed_enemy'
        },
        {
            type: 'damage_buff',
            value: 5,
            target: 'observed_enemy'
        },
        {
            type: 'pc_recovery',
            value: 'half_spent',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

const reflejosAmplificadosFeature = {
    featureId: new ObjectId(),
    name: 'Reflejos Amplificados',
    description: 'Reacción adicional. Ataque de oportunidad si enemigo falla ataque contra ti. +1 Defensa y RM por cada instancia de daño hasta tu próximo turno.',
    useType: 'passive',
    modifiers: [
        {
            value: 1,
            type: 'extra_reaction',
            description: 'Reacción adicional',
            target: 'self'
        }
    ],
    effects: [
        {
            type: 'opportunity_attack',
            trigger: 'enemy_misses_attack',
            target: 'self'
        },
        {
            type: 'defense_buff',
            value: 1,
            trigger: 'per_damage_instance',
            duration: 'until_next_turn',
            target: 'self',
            stacking: true
        },
        {
            type: 'magic_resistance_buff',
            value: 1,
            trigger: 'per_damage_instance',
            duration: 'until_next_turn',
            target: 'self',
            stacking: true
        }
    ],
    state: 'ACTIVE'
};

const reaccionMarcadaFeature = {
    featureId: new ObjectId(),
    name: 'Reacción Marcada',
    description: 'Si objetivo de Marca de Caza te requiere salvación, usa reacción para ataque de oportunidad antes de tirar. Si impactas, tienes ventaja en la salvación.',
    useType: 'active',
    action: 'reaction',
    trigger: 'marked_target_forces_save',
    effects: [
        {
            type: 'opportunity_attack',
            timing: 'before_save',
            target: 'marked_target'
        },
        {
            type: 'advantage',
            target: 'self',
            applyTo: 'save_roll',
            condition: 'attack_hits'
        }
    ],
    state: 'ACTIVE'
};

const precisionSalvajeFeature = {
    featureId: new ObjectId(),
    name: 'Precisión Salvaje',
    description: 'En cada turno, puedes agregar bonificador sabiduría a tirada de ataque O salvación sabiduría a tirada de daño. Decides antes/después de tirar, pero antes de aplicar efectos.',
    useType: 'active',
    trigger: 'each_turn',
    effects: [
        {
            type: 'add_wisdom_to_attack',
            target: 'self',
            option: 1
        },
        {
            type: 'add_wisdom_save_to_damage',
            target: 'self',
            option: 2
        }
    ],
    state: 'ACTIVE'
};

const cazadorImplacableFeature = {
    featureId: new ObjectId(),
    name: 'Cazador Implacable',
    description: 'Efectos de Acechar no requieren observar previamente. Daño adicional de Marca de Caza aplica a todos tus ataques, no solo el primero.',
    useType: 'passive',
    modifiers: [
        {
            value: 'no_observation_required',
            type: 'feature_enhancement',
            description: 'Acechar sin observación previa',
            applyTo: 'acechar_feature',
            target: 'self'
        },
        {
            value: 'all_attacks',
            type: 'feature_enhancement',
            description: 'Daño Marca de Caza en todos los ataques',
            applyTo: 'marca_de_caza_damage',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Actualizar la clase con los niveles
db.characterClass.updateOne(
    { _id: characterClassId },
    {
        $set: {
            levels: [
                {
                    level: 1,
                    features: [afinidadElementalFeature, armaPredilectaFeature],
                    APGained: 6,
                    knownSpells: 2
                },
                {
                    level: 2,
                    features: [concentracionFeature],
                    APGained: 1,
                    knownSpells: 2,
                    concentrationPoints: 2
                },
                {
                    level: 3,
                    features: [depredadorNatoFeature],
                    APGained: 0,
                    knownSpells: 2,
                    concentrationPoints: 3
                },
                {
                    level: 4,
                    features: [],
                    APGained: 1,
                    knownSpells: 3,
                    concentrationPoints: 3,
                    subclassFeature: true
                },
                {
                    level: 5,
                    features: [multiataqueFeature],
                    APGained: 0,
                    knownSpells: 3,
                    concentrationPoints: 3,
                    multiattack: 1
                },
                {
                    level: 6,
                    features: [marcaDeCazaFeature],
                    APGained: 1,
                    knownSpells: 3,
                    concentrationPoints: 4,
                    huntMark: '1d6'
                },
                {
                    level: 7,
                    features: [sentidosAgudizadosFeature],
                    APGained: 0,
                    knownSpells: 3,
                    concentrationPoints: 4,
                    huntMark: '1d6'
                },
                {
                    level: 8,
                    features: [],
                    APGained: 1,
                    knownSpells: 4,
                    concentrationPoints: 4,
                    huntMark: '1d6',
                    subclassFeature: true
                },
                {
                    level: 9,
                    features: [],
                    APGained: 0,
                    knownSpells: 4,
                    concentrationPoints: 5,
                    huntMark: '1d6'
                },
                {
                    level: 10,
                    features: [],
                    APGained: 1,
                    knownSpells: 4,
                    concentrationPoints: 5,
                    huntMark: '1d6',
                    multiattack: 2
                },
                {
                    level: 11,
                    features: [acecharFeature],
                    APGained: 0,
                    knownSpells: 4,
                    concentrationPoints: 5,
                    huntMark: '2d4'
                },
                {
                    level: 12,
                    features: [reflejosAmplificadosFeature],
                    APGained: 1,
                    knownSpells: 5,
                    concentrationPoints: 6,
                    huntMark: '2d4'
                },
                {
                    level: 13,
                    features: [],
                    APGained: 0,
                    knownSpells: 5,
                    concentrationPoints: 6,
                    huntMark: '2d4',
                    subclassFeature: true
                },
                {
                    level: 14,
                    features: [],
                    APGained: 1,
                    knownSpells: 5,
                    concentrationPoints: 6,
                    huntMark: '2d4'
                },
                {
                    level: 15,
                    features: [reaccionMarcadaFeature],
                    APGained: 0,
                    knownSpells: 5,
                    concentrationPoints: 7,
                    huntMark: '2d4'
                },
                {
                    level: 16,
                    features: [precisionSalvajeFeature],
                    APGained: 1,
                    knownSpells: 6,
                    concentrationPoints: 7,
                    huntMark: '2d6'
                },
                {
                    level: 17,
                    features: [],
                    APGained: 0,
                    knownSpells: 6,
                    concentrationPoints: 7,
                    huntMark: '2d6',
                    multiattack: 3
                },
                {
                    level: 18,
                    features: [],
                    APGained: 1,
                    knownSpells: 6,
                    concentrationPoints: 8,
                    huntMark: '2d6',
                    subclassFeature: true
                },
                {
                    level: 19,
                    features: [],
                    APGained: 0,
                    knownSpells: 6,
                    concentrationPoints: 8,
                    huntMark: '2d6'
                },
                {
                    level: 20,
                    features: [cazadorImplacableFeature],
                    APGained: 1,
                    knownSpells: 8,
                    concentrationPoints: 9,
                    huntMark: '2d8'
                }
            ]
        }
    }
);

// Insertar las subclases
db.subclass.insertMany([
    // Subclase: Juggler
    {
        name: 'Juggler',
        description: 'Especialista en armas arrojadizas, las clava en enemigos y las reclama para daño continuo.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Lanzamiento Preciso',
                        description: 'Ignoras penalizador por atacar a larga distancia con armas arrojadizas. Si el daño es cortante/perforante, el arma se clava al objetivo. Ataques cuerpo a cuerpo contra objetivos con arma clavada tienen ventaja y recuperas el arma si impactas.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 0,
                                type: 'ignore_range_penalty',
                                description: 'Ignora penalizador larga distancia',
                                target: 'self',
                                applyTo: 'thrown_weapons'
                            }
                        ],
                        effects: [
                            {
                                type: 'stick_weapon',
                                target: 'enemy',
                                condition: 'damage_type_piercing_or_slashing',
                                trigger: 'ranged_attack_hits'
                            },
                            {
                                type: 'advantage',
                                target: 'self',
                                applyTo: 'melee_attacks',
                                condition: 'target_has_stuck_weapon'
                            },
                            {
                                type: 'recover_weapon',
                                trigger: 'melee_hit',
                                condition: 'target_has_stuck_weapon'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Reclamar',
                        description: 'Acción adicional: haz que arma lanzada a menos de 6 casillas vuelva a tu mano. Enemigos en el camino realizan salvación destreza (DC ataque de concentración) o sufren daño del arma. Si estaba clavada, el objetivo sufre daño sin salvación.',
                        useType: 'active',
                        action: 'bonus',
                        range: 6,
                        effects: [
                            {
                                type: 'recall_weapon',
                                range: 6,
                                target: 'thrown_weapon'
                            },
                            {
                                type: 'save_or_damage',
                                save: 'dexterity',
                                dc: '8 + proficiency + wisdom_modifier',
                                damage: 'weapon_damage',
                                target: 'enemies_in_path'
                            },
                            {
                                type: 'automatic_damage',
                                damage: 'weapon_damage',
                                target: 'stuck_target',
                                condition: 'weapon_was_stuck'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Persecución',
                        description: 'Ganas +2 Velocidad hacia objetivos con arma clavada. Al impactar ataque de oportunidad, puedes clavar dicha arma. Ganas Ataques de Concentración: Lanzamiento Raudo y Presteza.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 2,
                                type: 'speed_buff',
                                description: 'Velocidad hacia objetivos',
                                target: 'self',
                                condition: 'moving_towards_stuck_target'
                            }
                        ],
                        effects: [
                            {
                                type: 'stick_weapon_on_opportunity',
                                trigger: 'opportunity_attack_hits',
                                target: 'enemy'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Lanzamiento Raudo',
                                description: 'Como acción adicional y gastando 1 PC, puedes realizar un ataque a distancia con un arma arrojadiza. Puedes desenvainar el arma como parte de este ataque.',
                                useType: 'active',
                                action: 'bonus',
                                cost: { type: 'PC', value: 1 },
                                effects: [
                                    {
                                        type: 'ranged_attack',
                                        weapon: 'thrown',
                                        target: 'enemy',
                                        includesDraw: true
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Presteza',
                                description: 'Cuando un enemigo sale del alcance de un arma arrojadiza, puedes gastar tu reacción y 1 PC para realizar un ataque de oportunidad.',
                                useType: 'active',
                                action: 'reaction',
                                cost: { type: 'PC', value: 1 },
                                trigger: 'enemy_leaves_thrown_weapon_range',
                                effects: [
                                    {
                                        type: 'opportunity_attack',
                                        weapon: 'thrown',
                                        target: 'enemy'
                                    }
                                ],
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
                        featureId: new ObjectId(),
                        name: 'Control Avanzado',
                        description: 'Al Reclamar, puedes recuperar cualquier cantidad de armas. Todos los que reciban daño de Reclamar o se les clave un arma reciben Sangrado. Duplicas modificador destreza del daño con armas arrojadizas.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 'unlimited',
                                type: 'feature_enhancement',
                                description: 'Reclamar múltiples armas',
                                applyTo: 'reclamar_feature',
                                target: 'self'
                            },
                            {
                                value: 2,
                                type: 'damage_multiplier',
                                description: 'Duplica modificador destreza',
                                target: 'self',
                                applyTo: 'thrown_weapons',
                                modifier: 'dexterity'
                            }
                        ],
                        effects: [
                            {
                                type: 'apply_bleeding',
                                target: 'damaged_by_reclaim',
                                trigger: 'reclaim_damage'
                            },
                            {
                                type: 'apply_bleeding',
                                target: 'enemy',
                                trigger: 'weapon_stuck'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Sniper
    {
        name: 'Sniper',
        description: 'Tirador de élite con precisión letal, ignora cobertura y realiza ataques de reacción devastadores.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Precisión Insuperable',
                        description: 'Tus ataques a distancia ganan +2. Como acción adicional, apuntas a enemigo visible a rango. Hasta fin del turno: ignoras cobertura media/tres cuartos, infliges daño adicional igual a 2 + mitad de tu nivel. 3 usos por combate.',
                        useType: 'active',
                        action: 'bonus',
                        usesPerCombat: 3,
                        modifiers: [
                            {
                                value: 2,
                                type: 'attack_buff',
                                description: 'Bonificación a ataques a distancia',
                                target: 'self',
                                applyTo: 'ranged_weapons'
                            }
                        ],
                        effects: [
                            {
                                type: 'aim',
                                target: 'visible_enemy',
                                range: 'weapon_range',
                                duration: 'end_of_turn'
                            },
                            {
                                type: 'ignore_cover',
                                coverTypes: ['half', 'three_quarters'],
                                target: 'aimed_target'
                            },
                            {
                                type: 'bonus_damage',
                                value: '2 + {level / 2}',
                                target: 'aimed_target',
                                trigger: 'ranged_hit'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Contramedidas',
                        description: 'Cuando enemigo objetivo de Precisión Insuperable realiza ataque, puedes usar reacción para atacarlo con arma a distancia. Ganas reacción adicional.',
                        useType: 'active',
                        action: 'reaction',
                        trigger: 'aimed_target_attacks',
                        modifiers: [
                            {
                                value: 1,
                                type: 'extra_reaction',
                                description: 'Reacción adicional',
                                target: 'self'
                            }
                        ],
                        effects: [
                            {
                                type: 'ranged_attack',
                                target: 'aimed_target',
                                weapon: 'ranged'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Maestría en Tiro',
                        description: 'Ataques a distancia a 2 o menos casillas no tienen desventaja. Objetivo impactado no puede tomar reacciones hasta fin de tu turno. Si tienes ventaja, puedes prescindir de ella para hacer ataque a distancia adicional vs mismo objetivo como acción adicional.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 'no_disadvantage',
                                type: 'ignore_disadvantage',
                                description: 'No desventaja a corta distancia',
                                target: 'self',
                                applyTo: 'ranged_attacks',
                                condition: 'range_2_or_less'
                            }
                        ],
                        effects: [
                            {
                                type: 'disable_reactions',
                                target: 'hit_target',
                                duration: 'end_of_your_turn',
                                trigger: 'ranged_hit_close_range'
                            },
                            {
                                type: 'trade_advantage_for_attack',
                                target: 'same_target',
                                action: 'bonus',
                                weapon: 'ranged',
                                condition: 'have_advantage'
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
                        featureId: new ObjectId(),
                        name: 'Concentración del Cazador',
                        description: 'Al usar Precisión Insuperable, ganas +5% crítico contra objetivo marcado. Cada crítico recupera 2 usos de Precisión Insuperable. Si atacas en tu primer turno, realizas ataque a distancia adicional como parte de esa acción.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 5,
                                type: 'crit_chance_increase',
                                description: 'Crítico aumentado',
                                target: 'self',
                                condition: 'precision_insuperable_active'
                            }
                        ],
                        effects: [
                            {
                                type: 'recover_uses',
                                feature: 'Precisión Insuperable',
                                amount: 2,
                                trigger: 'critical_hit'
                            },
                            {
                                type: 'extra_ranged_attack',
                                target: 'any',
                                trigger: 'attack_action_first_turn',
                                asPartOf: 'attack_action'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Weapon Master
    {
        name: 'Weapon Master',
        description: 'Maestro en combate con múltiples armas, intercambia armas para acumular bonificaciones y críticos devastadores.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Armamentista',
                        description: 'Puedes intercambiar arma una vez después de cada ataque de forma gratuita (aplica por cada multiataque). Ganas +1 movimiento. Por cada multiataque que poseas, ganas un arma predilecta adicional.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 1,
                                type: 'movement_buff',
                                description: 'Bonificación movimiento',
                                target: 'self'
                            },
                            {
                                value: 'per_multiattack',
                                type: 'extra_favorite_weapon',
                                description: 'Armas predilectas adicionales',
                                target: 'self',
                                scaling: 'multiattack_count'
                            }
                        ],
                        effects: [
                            {
                                type: 'free_weapon_swap',
                                frequency: 'after_each_attack',
                                target: 'self'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Agarre Maestro',
                        description: 'Armas versátiles usan su daño más alto. Puedes usar arma de dos manos en cada mano sin perder beneficios. Armas lanzadas hacen daño completo. Recuperar arma lanzada por primera vez en turno es acción gratuita.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 'highest',
                                type: 'weapon_damage',
                                description: 'Daño máximo versátiles',
                                target: 'self',
                                applyTo: 'versatile_weapons'
                            }
                        ],
                        effects: [
                            {
                                type: 'dual_wield_two_handed',
                                target: 'self',
                                keepBenefits: true
                            },
                            {
                                type: 'full_damage_thrown',
                                target: 'self',
                                applyTo: 'thrown_weapons'
                            },
                            {
                                type: 'free_weapon_recovery',
                                frequency: 'first_per_turn',
                                target: 'self'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Pericia',
                        description: 'Ganas +2 daño cada vez que intercambias arma en turno. Por cada 2 intercambios en mismo turno: +5% crítico con armas. Críticos con arma obtienen uno de: rompe escudo adicional, provoca sangrado (DC Rasgos Violentos), o reduce curación 50% por 3 turnos.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 2,
                                type: 'damage_buff',
                                description: 'Bonificación por intercambio',
                                target: 'self',
                                trigger: 'weapon_swap',
                                stacking: true
                            },
                            {
                                value: 5,
                                type: 'crit_chance_increase',
                                description: 'Crítico por intercambios',
                                target: 'self',
                                condition: 'per_2_swaps',
                                stacking: true
                            }
                        ],
                        effects: [
                            {
                                type: 'critical_effect_choice',
                                options: [
                                    {
                                        effect: 'break_extra_shield',
                                        value: 1
                                    },
                                    {
                                        effect: 'apply_bleeding',
                                        dc: 'violent_traits'
                                    },
                                    {
                                        effect: 'reduce_healing',
                                        value: 0.5,
                                        duration: 3
                                    }
                                ],
                                trigger: 'weapon_critical_hit'
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
                        featureId: new ObjectId(),
                        name: 'Combo Breaker',
                        description: 'Ganas multiataque adicional. Por cada ataque impactado: +1 carga Juggle. Gasta 3 cargas para ventaja en siguiente ataque, o 10 cargas para All-Out Attack contra un enemigo.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 1,
                                type: 'extra_multiattack',
                                description: 'Multiataque adicional',
                                target: 'self'
                            }
                        ],
                        effects: [
                            {
                                type: 'gain_juggle_charge',
                                value: 1,
                                trigger: 'attack_hits',
                                target: 'self'
                            },
                            {
                                type: 'spend_juggle_for_advantage',
                                cost: 3,
                                effect: 'advantage_next_attack',
                                target: 'self'
                            },
                            {
                                type: 'spend_juggle_for_all_out',
                                cost: 10,
                                effect: 'all_out_attack',
                                target: 'single_enemy'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
]);

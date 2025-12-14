const { ObjectId } = require('mongodb');

// Crear la clase base Trickster
const characterClassId = new ObjectId();
db.characterClass.insertOne({
    _id: characterClassId,
    name: 'Trickster',
    description: 'Maestro del sigilo y las sombras que elimina enemigos con golpes precisos.',
    HPDice: '1d8',
    salvations: ['dexterity', 'charisma'],
});

// Insertar los hechizos de Trickster
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
        description: 'Aumenta en +2 a todo daño infligido por 3 turnos al usuario.',
        cost: 2,
        damage: null,
        levelRequirement: 2,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'damage_buff',
                value: 2,
                target: 'self',
                duration: 3
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Básica (P)',
        description: 'Aumenta en +2 el ataque por 3 turnos al usuario.',
        cost: 2,
        damage: null,
        levelRequirement: 2,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_buff',
                value: 2,
                target: 'self',
                duration: 3
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 3
    {
        spellId: new ObjectId(),
        name: 'Alteración de Arma I',
        description: 'Aplicas un efecto adicional a tu arma con DC igual a la mitad de la tirada de ataque.',
        cost: 3,
        damage: null,
        levelRequirement: 3,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'weapon_status_effect',
                dc: 'half_attack_roll',
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
        critBonus: 10,
        criticalFailPenalty: 10,
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
                damageType: 'physical',
                target: 'self',
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
        name: 'Interferencia',
        description: 'Como reacción, puedes interrumpir el lanzamiento de un hechizo de daño. Disminuyes la tirada en 5, y si la tirada es 5 o menos, será considerada una pifia.',
        cost: 6,
        damage: null,
        levelRequirement: 7,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        action: 'reaction',
        effects: [
            {
                type: 'interrupt_spell',
                penalty: -5,
                criticalFail: 'if_5_or_less',
                target: 'enemy'
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
        critBonus: 10,
        criticalFailPenalty: 10,
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
                trigger: 'end_of_turn',
                target: 'self',
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
        targetType: 'self_and_all_allies',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'crit_chance_buff',
                value: 5,
                unit: 'percent',
                target: 'self_and_all_allies',
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
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos al usuario.',
        cost: 2,
        damage: null,
        levelRequirement: 11,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'damage_buff',
                value: 5,
                target: 'self',
                duration: 3
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (P)',
        description: 'Aumenta en +3 el ataque por 3 turnos al usuario.',
        cost: 2,
        damage: null,
        levelRequirement: 11,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_buff',
                value: 3,
                target: 'self',
                duration: 3
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
                damageType: 'physical',
                target: 'self',
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
        critBonus: 10,
        criticalFailPenalty: 10,
        state: 'ACTIVE'
    },
    // Nivel 14
    {
        spellId: new ObjectId(),
        name: 'Alteración de Arma II',
        description: 'Aplicas un efecto adicional a tu arma con DC igual a la tirada de ataque.',
        cost: 6,
        damage: null,
        levelRequirement: 14,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'weapon_status_effect',
                dc: 'full_attack_roll',
                target: 'weapon'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    // Nivel 15
    {
        spellId: new ObjectId(),
        name: 'Potenciación Completa',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos al usuario.',
        cost: 7,
        damage: null,
        levelRequirement: 15,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_buff',
                value: 3,
                target: 'self',
                duration: 3
            },
            {
                type: 'damage_buff',
                value: 5,
                target: 'self',
                duration: 3
            },
            {
                type: 'defense_buff',
                value: 3,
                target: 'self',
                duration: 3
            },
            {
                type: 'magic_resistance_buff',
                value: 2,
                target: 'self',
                duration: 3
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
        targetType: 'self_and_all_allies',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'crit_chance_buff',
                value: 10,
                unit: 'percent',
                target: 'self_and_all_allies',
                duration: 3
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Destructor de Alma',
        description: 'Aplicas a tu arma la siguiente propiedad: quemas un uso de hechizo disponible al objetivo al impactar el ataque.',
        cost: 9,
        damage: null,
        levelRequirement: 16,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'burn_spell_use',
                trigger: 'weapon_hit',
                target: 'enemy'
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
        critBonus: 10,
        criticalFailPenalty: 10,
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
                type: 'guaranteed_hit',
                upgrade: 'becomes_crit_on_success',
                target: 'next_physical_attack'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Destructor de Fuerza',
        description: 'Aplicas a tu arma la siguiente propiedad: Al impactar un ataque, disminuye -4 al ataque y -5 al daño hasta el inicio de tu siguiente turno y pierdes esta propiedad. Acción adicional.',
        cost: 7,
        damage: null,
        levelRequirement: 18,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        effects: [
            {
                type: 'weapon_debuff',
                trigger: 'weapon_hit',
                debuffs: [
                    {
                        type: 'attack_debuff',
                        value: -4,
                        target: 'enemy',
                        duration: 'until_your_next_turn'
                    },
                    {
                        type: 'damage_debuff',
                        value: -5,
                        target: 'enemy',
                        duration: 'until_your_next_turn'
                    }
                ],
                consumeProperty: true
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
                trigger: 'end_of_turn',
                target: 'self'
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Roba Hechizos',
        description: 'Puedes reaccionar ante el lanzamiento de un hechizo. Realizas una tirada de lanzamiento de hechizos enfrentada, y el que gana utiliza el efecto del hechizo lanzado.',
        cost: 12,
        damage: null,
        levelRequirement: 19,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        action: 'reaction',
        effects: [
            {
                type: 'contested_spellcasting',
                success: 'steal_spell_effect',
                trigger: 'enemy_casts_spell',
                target: 'enemy'
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
                type: 'advantage_attack',
                target: 'self',
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
                unit: 'multiplier',
                alternative: {
                    type: 'extra_damage_dice',
                    value: 2,
                    condition: 'if_not_reduced'
                }
            }
        ],
        castingAttribute: 'courage',
        state: 'ACTIVE'
    },
]);

// Insertar las características de la clase

// Afinidad Elemental (Nivel 1)
const afinidadElementalFeature = {
    featureId: new ObjectId(),
    name: 'Afinidad Elemental',
    description: 'Selecciona un elemento que se ajuste a tu personaje. Cada vez que lances un hechizo de Ataque Físico, aplicará el elemento elegido.',
    levelRequirement: 1,
    class: characterClassId,
    choices: ['slashing', 'piercing', 'bludgeoning', 'poison'],
    state: 'ACTIVE'
};

// Arma Predilecta (Nivel 1)
const armaPredilectaFeature = {
    featureId: new ObjectId(),
    name: 'Arma Predilecta',
    description: 'Tienes afinidad con un tipo de arma en la que siempre tienes proficiencia. Siempre estarás concentrado en un arma elegida, aún si esta no se encuentra en tu inventario (tu arma predilecta no ocupará ningún espacio en tu equipo). Además, como acción adicional, puedes materializar y desmaterializar tu arma predilecta de manera instantánea.',
    levelRequirement: 1,
    class: characterClassId,
    effects: [
        {
            type: 'weapon_proficiency',
            target: 'chosen_weapon'
        },
        {
            type: 'summon_weapon',
            action: 'bonus',
            target: 'predilect_weapon'
        }
    ],
    state: 'ACTIVE'
};

// Golpe de las Sombras (Nivel 2)
const golpeDeLasSombrasFeature = {
    featureId: new ObjectId(),
    name: 'Golpe de las Sombras',
    description: 'Una vez por turno, puedes infligir el daño adicional de tu nivel indicado en la tabla si tenías ventaja. El ataque debe usar un arma de sutileza, a distancia o de lanzamiento. No necesitas tener ventaja si el enemigo tiene un aliado tuyo a distancia cuerpo a cuerpo, ese aliado no está incapacitado y tú no tienes desventaja.',
    levelRequirement: 2,
    class: characterClassId,
    usesPerTurn: 1,
    weaponTypes: ['finesse', 'ranged', 'thrown'],
    scaling: [
        { level: 2, damage: '1d6' },
        { level: 3, damage: '2d6' },
        { level: 5, damage: '3d6' },
        { level: 7, damage: '4d6' },
        { level: 9, damage: '5d6' },
        { level: 11, damage: '6d6' },
        { level: 13, damage: '7d6' },
        { level: 15, damage: '8d6' },
        { level: 17, damage: '9d6' },
        { level: 19, damage: '10d6' }
    ],
    conditions: [
        {
            type: 'have_advantage'
        },
        {
            type: 'alternative',
            condition: 'ally_adjacent_to_enemy_and_not_incapacitated_and_no_disadvantage'
        }
    ],
    state: 'ACTIVE'
};

// Uno con la Oscuridad (Nivel 3)
const unoConLaOscuridadFeature = {
    featureId: new ObjectId(),
    name: 'Uno con la Oscuridad',
    description: 'Obtienes ventaja en la tirada de sigilo. Además, adquieres una acción adicional en cada uno de tus turnos, que solo puede ser utilizada para correr, desengancharse o entrar en sigilo.',
    levelRequirement: 3,
    class: characterClassId,
    effects: [
        {
            type: 'advantage_stealth',
            target: 'self'
        },
        {
            type: 'bonus_action',
            allowedActions: ['dash', 'disengage', 'hide'],
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Agilidad Asombrosa (Nivel 6)
const agilidadAsombrosaFeature = {
    featureId: new ObjectId(),
    name: 'Agilidad Asombrosa',
    description: 'Obtienes los siguientes efectos: Como parte de tu acción de Correr, puedes realizar la acción de ataque a un enemigo. Usando tu acción adicional puedes volverte resistente al daño del siguiente ataque físico. Aumenta tu porcentaje de crítico un 5% en ataques.',
    levelRequirement: 6,
    class: characterClassId,
    effects: [
        {
            type: 'attack_after_dash',
            target: 'self'
        },
        {
            type: 'bonus_action_resistance',
            action: 'bonus',
            effect: 'resist_next_physical_attack',
            target: 'self'
        },
        {
            type: 'crit_chance_buff',
            value: 5,
            unit: 'percent',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Pericia (Nivel 10)
const periciaFeature = {
    featureId: new ObjectId(),
    name: 'Pericia',
    description: 'Obtienes cuatro puntos de pericia. Puedes gastar un punto para obtener competencia en una habilidad secundaria o duplicar dicha competencia en una habilidad secundaria en la que ya eres competente. Además, cuando impactas un ataque con arma, reduces la velocidad de un enemigo en 2 casillas hasta el inicio de tu siguiente turno. No acumulable.',
    levelRequirement: 10,
    class: characterClassId,
    expertisePoints: 4,
    effects: [
        {
            type: 'expertise_points',
            value: 4,
            target: 'self'
        },
        {
            type: 'speed_reduction_on_hit',
            value: 2,
            duration: 'until_your_next_turn',
            stacking: false,
            target: 'enemy'
        }
    ],
    state: 'ACTIVE'
};

// Penumbra (Nivel 11)
const penumbraFeature = {
    featureId: new ObjectId(),
    name: 'Penumbra',
    description: 'Puedes usar tu acción para esconderte en un instante, incluso a la vista de enemigos. Entras en sigilo invisible, siempre y cuando no te estén buscando activamente. Mientras estés en este sigilo, la percepción pasiva de los enemigos se reducirá en -5 contra ti y tendrán desventaja en sus tiradas de percepción para detectarte; además de reducir tu velocidad a la mitad. También entras en este estado si acabas un turno sin realizar ninguna acción ofensiva. Obtienes competencia en Sigilo, si ya la tienes obtienes un punto de pericia adicional.',
    levelRequirement: 11,
    class: characterClassId,
    effects: [
        {
            type: 'invisible_stealth',
            action: 'action',
            condition: 'not_actively_searched',
            target: 'self'
        },
        {
            type: 'enemy_perception_penalty',
            value: -5,
            disadvantage: true,
            target: 'enemies'
        },
        {
            type: 'speed_reduction',
            value: 0.5,
            unit: 'multiplier',
            target: 'self'
        },
        {
            type: 'auto_enter',
            condition: 'end_turn_without_offensive_action',
            target: 'self'
        },
        {
            type: 'stealth_proficiency_or_expertise',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Evasión (Nivel 12)
const evasionFeature = {
    featureId: new ObjectId(),
    name: 'Evasión',
    description: 'Cuando fallan un ataque mágico o físico con Persona contra ti con afinidad neutra, en vez de recibir la mitad de daño, no recibes daño alguno.',
    levelRequirement: 12,
    class: characterClassId,
    effects: [
        {
            type: 'no_damage_on_failed_save',
            condition: 'neutral_affinity_person_attack',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Golpes Profundos (Nivel 16)
const golpesProfundosFeature = {
    featureId: new ObjectId(),
    name: 'Golpes Profundos',
    description: 'En el turno en el que sales de Penumbra, obtienes un 5% de porcentaje de crítico aumentado en ataques, una reacción adicional y cada vez que rompes un escudo, rompes uno adicional.',
    levelRequirement: 16,
    class: characterClassId,
    trigger: 'exit_penumbra',
    effects: [
        {
            type: 'crit_chance_buff',
            value: 5,
            unit: 'percent',
            target: 'self',
            duration: 'turn'
        },
        {
            type: 'extra_reaction',
            value: 1,
            target: 'self',
            duration: 'turn'
        },
        {
            type: 'break_extra_shield',
            value: 1,
            target: 'self',
            duration: 'turn'
        }
    ],
    state: 'ACTIVE'
};

// Elusivo (Nivel 17)
const elusivoFeature = {
    featureId: new ObjectId(),
    name: 'Elusivo',
    description: 'Ningún ataque contra ti tiene ventaja mientras no estés incapacitado. Además, mientras estás en "Penumbra", obtienes resistencia a todo daño.',
    levelRequirement: 17,
    class: characterClassId,
    effects: [
        {
            type: 'negate_advantage',
            condition: 'not_incapacitated',
            target: 'self'
        },
        {
            type: 'resistance_all_damage',
            condition: 'in_penumbra',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Final del Juego (Nivel 20)
const finalDelJuegoFeature = {
    featureId: new ObjectId(),
    name: 'Final del Juego',
    description: 'Cuando sales de "Penumbra", obtienes ventaja en todos tus ataques durante ese turno y haces 2 dados de daño de arma adicionales. Además, una vez por sesión, puedes decidir lograr un éxito en una tirada que hayas fallado previamente.',
    levelRequirement: 20,
    class: characterClassId,
    trigger: 'exit_penumbra',
    effects: [
        {
            type: 'advantage_all_attacks',
            target: 'self',
            duration: 'turn'
        },
        {
            type: 'extra_weapon_damage_dice',
            value: 2,
            target: 'self',
            duration: 'turn'
        },
        {
            type: 'reroll_failure',
            usesPerSession: 1,
            effect: 'turn_failure_into_success',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Actualizar la clase con los niveles y características
db.characterClass.updateOne(
    { _id: characterClassId },
    {
        $set: {
            levels: [
                // Nivel 1
                {
                    level: 1,
                    features: [
                        afinidadElementalFeature,
                        armaPredilectaFeature
                    ],
                    AP: 5,
                    proficiencyBonus: 2,
                    knownSpells: 2,
                    multiattack: false,
                    shadowStrike: null
                },
                // Nivel 2
                {
                    level: 2,
                    features: [golpeDeLasSombrasFeature],
                    AP: 6,
                    proficiencyBonus: 2,
                    knownSpells: 2,
                    multiattack: false,
                    shadowStrike: '1d6'
                },
                // Nivel 3
                {
                    level: 3,
                    features: [unoConLaOscuridadFeature],
                    AP: 7,
                    proficiencyBonus: 2,
                    knownSpells: 2,
                    multiattack: false,
                    shadowStrike: '2d6'
                },
                // Nivel 4
                {
                    level: 4,
                    features: [],
                    subclassFeature: true,
                    AP: 8,
                    proficiencyBonus: 2,
                    knownSpells: 4,
                    multiattack: false,
                    shadowStrike: '2d6'
                },
                // Nivel 5
                {
                    level: 5,
                    features: [],
                    AP: 9,
                    proficiencyBonus: 3,
                    knownSpells: 4,
                    multiattack: false,
                    shadowStrike: '3d6'
                },
                // Nivel 6
                {
                    level: 6,
                    features: [agilidadAsombrosaFeature],
                    AP: 10,
                    proficiencyBonus: 3,
                    knownSpells: 4,
                    multiattack: false,
                    shadowStrike: '3d6'
                },
                // Nivel 7
                {
                    level: 7,
                    features: [],
                    AP: 11,
                    proficiencyBonus: 3,
                    knownSpells: 4,
                    multiattack: true,
                    shadowStrike: '4d6'
                },
                // Nivel 8
                {
                    level: 8,
                    features: [],
                    subclassFeature: true,
                    AP: 12,
                    proficiencyBonus: 3,
                    knownSpells: 5,
                    multiattack: true,
                    shadowStrike: '4d6'
                },
                // Nivel 9
                {
                    level: 9,
                    features: [],
                    AP: 13,
                    proficiencyBonus: 4,
                    knownSpells: 5,
                    multiattack: true,
                    shadowStrike: '5d6'
                },
                // Nivel 10
                {
                    level: 10,
                    features: [periciaFeature],
                    AP: 14,
                    proficiencyBonus: 4,
                    knownSpells: 5,
                    multiattack: true,
                    shadowStrike: '5d6'
                },
                // Nivel 11
                {
                    level: 11,
                    features: [penumbraFeature],
                    AP: 15,
                    proficiencyBonus: 4,
                    knownSpells: 5,
                    multiattack: true,
                    shadowStrike: '6d6'
                },
                // Nivel 12
                {
                    level: 12,
                    features: [evasionFeature],
                    AP: 16,
                    proficiencyBonus: 4,
                    knownSpells: 7,
                    multiattack: true,
                    shadowStrike: '6d6'
                },
                // Nivel 13
                {
                    level: 13,
                    features: [],
                    subclassFeature: true,
                    AP: 17,
                    proficiencyBonus: 5,
                    knownSpells: 7,
                    multiattack: true,
                    shadowStrike: '7d6'
                },
                // Nivel 14
                {
                    level: 14,
                    features: [],
                    AP: 18,
                    proficiencyBonus: 5,
                    knownSpells: 7,
                    multiattack: true,
                    shadowStrike: '7d6'
                },
                // Nivel 15
                {
                    level: 15,
                    features: [],
                    AP: 19,
                    proficiencyBonus: 5,
                    knownSpells: 7,
                    multiattack: true,
                    multiattackCount: 2,
                    shadowStrike: '8d6'
                },
                // Nivel 16
                {
                    level: 16,
                    features: [golpesProfundosFeature],
                    AP: 20,
                    proficiencyBonus: 5,
                    knownSpells: 8,
                    multiattack: true,
                    multiattackCount: 2,
                    shadowStrike: '8d6'
                },
                // Nivel 17
                {
                    level: 17,
                    features: [elusivoFeature],
                    AP: 21,
                    proficiencyBonus: 6,
                    knownSpells: 8,
                    multiattack: true,
                    multiattackCount: 2,
                    shadowStrike: '9d6'
                },
                // Nivel 18
                {
                    level: 18,
                    features: [],
                    subclassFeature: true,
                    AP: 22,
                    proficiencyBonus: 6,
                    knownSpells: 8,
                    multiattack: true,
                    multiattackCount: 2,
                    shadowStrike: '9d6'
                },
                // Nivel 19
                {
                    level: 19,
                    features: [],
                    AP: 23,
                    proficiencyBonus: 6,
                    knownSpells: 10,
                    multiattack: true,
                    multiattackCount: 2,
                    shadowStrike: '10d6'
                },
                // Nivel 20
                {
                    level: 20,
                    features: [finalDelJuegoFeature],
                    AP: 24,
                    proficiencyBonus: 6,
                    knownSpells: 10,
                    multiattack: true,
                    multiattackCount: 2,
                    shadowStrike: '10d6'
                }
            ]
        }
    }
);

// Insertar las subclases

// ============================================
// ASSASSIN - Subclase de Asesino
// ============================================
db.subclass.insertMany([
    {
        _id: new ObjectId(),
        name: 'Assassin',
        description: 'Asesino letal especializado en eliminar objetivos con golpes devastadores y efectos debilitantes.',
        class: characterClassId,
        features: [
            // Nivel 4: Golpe Asesino
            {
                featureId: new ObjectId(),
                name: 'Golpe Asesino',
                description: 'Obtienes los siguientes efectos: Tienes ventaja en ataques contra enemigos que no hayan tomado una acción en combate todavía. Sumas tu competencia a tu iniciativa. El primer golpe que impactas en cada ronda añade tu nivel como daño adicional.',
                levelRequirement: 4,
                effects: [
                    {
                        type: 'advantage_vs_inactive_enemies',
                        condition: 'enemy_has_not_acted',
                        target: 'self'
                    },
                    {
                        type: 'initiative_buff',
                        value: '{proficiency_bonus}',
                        target: 'self'
                    },
                    {
                        type: 'first_hit_bonus_damage',
                        value: '{level}',
                        frequency: 'once_per_round',
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 8: Daga de Descomposición
            {
                featureId: new ObjectId(),
                name: 'Daga de Descomposición',
                description: 'Cuando impactas un ataque de las sombras, puedes forzar al objetivo a hacer una tirada de salvación de coraje (DC de 8 + Inteligencia + Competencia). En caso de fallar, el objetivo recibirá el estado de enfermo. Además, mientras dure dicho estado, el objetivo recibe uno de los siguientes efectos: El objetivo no puede recuperar PV, La velocidad del objetivo se reduce en 2, El objetivo no puede tomar reacciones. Puedes usar esta propiedad una cantidad iguales a tu bonificador de Inteligencia, hasta finalizar la incursión.',
                levelRequirement: 8,
                usesPerIncursion: '{intelligence_modifier}',
                dc: '8 + {intelligence_modifier} + {proficiency_bonus}',
                effects: [
                    {
                        type: 'apply_status_on_shadow_strike',
                        status: 'sickened',
                        save: 'courage',
                        additionalEffects: [
                            {
                                name: 'No puede recuperar PV',
                                type: 'prevent_healing'
                            },
                            {
                                name: 'Velocidad reducida',
                                type: 'speed_reduction',
                                value: 2
                            },
                            {
                                name: 'Sin reacciones',
                                type: 'prevent_reactions'
                            }
                        ],
                        chooseOne: true,
                        target: 'enemy'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 13: Enfermedad Persistente
            {
                featureId: new ObjectId(),
                name: 'Enfermedad Persistente',
                description: 'Cuando causas el estado de enfermo, el objetivo también tendrá desventaja en una tirada de salvación a tu elección mientras dure dicho efecto. Además, consigues un bonificador a las tiradas de daño contra gente con dicho estado igual a tu bonificador por competencia.',
                levelRequirement: 13,
                effects: [
                    {
                        type: 'add_disadvantage_on_save',
                        condition: 'sickened_status',
                        choiceType: 'any_save',
                        target: 'enemy'
                    },
                    {
                        type: 'damage_buff_vs_sickened',
                        value: '{proficiency_bonus}',
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 18: Sellar Destino
            {
                featureId: new ObjectId(),
                name: 'Sellar Destino',
                description: 'Cuando impactas a un enemigo con un ataque con arma, puedes decidir que el daño total de tu ataque es duplicado, y automáticamente falla su salvación de "Daga de Descomposición". Solo puedes usar esta propiedad una vez por combate.',
                levelRequirement: 18,
                usesPerCombat: 1,
                effects: [
                    {
                        type: 'double_damage',
                        trigger: 'weapon_hit',
                        target: 'enemy'
                    },
                    {
                        type: 'auto_fail_save',
                        feature: 'daga_de_descomposicion',
                        target: 'enemy'
                    }
                ],
                state: 'ACTIVE'
            }
        ],
        state: 'ACTIVE'
    },
    // ============================================
    // EDGERUNNER - Subclase de Velocidad
    // ============================================
    {
        _id: new ObjectId(),
        name: 'Edgerunner',
        description: 'Guerrero veloz que obtiene poder a través del movimiento constante.',
        class: characterClassId,
        features: [
            // Nivel 4: Golpear y Correr
            {
                featureId: new ObjectId(),
                name: 'Golpear y Correr',
                description: 'Durante tu turno, si impactas un ataque cuerpo a cuerpo contra un objetivo, dicho objetivo no puede realizar ataques de oportunidad contra ti durante el resto del turno. Además, ganas una forma adicional de hacer tu Golpe de las sombras. No necesitas ventaja en tu tirada de ataque contra un objetivo si este está cuerpo a cuerpo de ti y no hay otros enemigos a cuerpo a cuerpo de ti, y no tienes desventaja en dicha tirada de ataque.',
                levelRequirement: 4,
                effects: [
                    {
                        type: 'prevent_opportunity_attacks',
                        trigger: 'melee_hit',
                        duration: 'rest_of_turn',
                        target: 'hit_enemy'
                    },
                    {
                        type: 'alternative_shadow_strike',
                        condition: 'enemy_adjacent_and_no_other_enemies_adjacent_and_no_disadvantage',
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 8: Aceleración
            {
                featureId: new ObjectId(),
                name: 'Aceleración',
                description: 'Adquieres 2 de velocidad adicional. Si terminas tu turno habiendo gastado el total de tu velocidad y no te han golpeado, obtienes efectos acumulativos por turnos consecutivos: +2 Defensa/RM → Rompe escudo adicional → +2 ataque → Dado adicional de daño → +5% crítico → Ataque adicional.',
                levelRequirement: 8,
                stackingEffects: [
                    {
                        turn: 1,
                        effects: [
                            {
                                type: 'defense_buff',
                                value: 2,
                                target: 'self'
                            },
                            {
                                type: 'magic_resistance_buff',
                                value: 2,
                                target: 'self'
                            }
                        ]
                    },
                    {
                        turn: 2,
                        effects: [
                            {
                                type: 'break_extra_shield',
                                value: 1,
                                target: 'self'
                            }
                        ]
                    },
                    {
                        turn: 3,
                        effects: [
                            {
                                type: 'attack_buff',
                                value: 2,
                                target: 'self'
                            }
                        ]
                    },
                    {
                        turn: 4,
                        effects: [
                            {
                                type: 'extra_damage_die',
                                value: 1,
                                target: 'self'
                            }
                        ]
                    },
                    {
                        turn: 5,
                        effects: [
                            {
                                type: 'crit_chance_buff',
                                value: 5,
                                unit: 'percent',
                                target: 'self'
                            }
                        ]
                    },
                    {
                        turn: 6,
                        effects: [
                            {
                                type: 'extra_attack',
                                value: 1,
                                target: 'self'
                            }
                        ]
                    }
                ],
                baseEffect: {
                    type: 'speed_buff',
                    value: 2,
                    target: 'self'
                },
                condition: 'end_turn_with_full_movement_spent_and_not_hit',
                resetOn: 'get_hit',
                state: 'ACTIVE'
            },
            // Nivel 13: Redirección
            {
                featureId: new ObjectId(),
                name: 'Redirección',
                description: 'Cuando eres objetivo de un ataque mientras hay un individuo a distancia cuerpo a cuerpo de ti, puedes usar tu reacción para hacer que el objetivo de este ataque sea ese individuo. Puedes usar esta propiedad una cantidad igual a tu modificador de destreza por combate.',
                levelRequirement: 13,
                usesPerCombat: '{dexterity_modifier}',
                action: 'reaction',
                effects: [
                    {
                        type: 'redirect_attack',
                        condition: 'adjacent_individual_exists',
                        target: 'adjacent_individual'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 18: Descarga de Adrenalina
            {
                featureId: new ObjectId(),
                name: 'Descarga de Adrenalina',
                description: 'Tu rasgo de aceleración no se pierde si te golpean. Además, al inicio del combate, tomas un segundo turno. La iniciativa de este turno será igual a tu iniciativa - 10.',
                levelRequirement: 18,
                effects: [
                    {
                        type: 'prevent_acceleration_reset',
                        condition: 'get_hit',
                        target: 'self'
                    },
                    {
                        type: 'extra_turn_on_combat_start',
                        initiative: '{initiative - 10}',
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            }
        ],
        state: 'ACTIVE'
    },
    // ============================================
    // GHOST - Subclase de Invisibilidad y Sigilo
    // ============================================
    {
        _id: new ObjectId(),
        name: 'Ghost',
        description: 'Maestro del sigilo que se desvanece en las sombras y aparece donde menos se espera.',
        class: characterClassId,
        features: [
            // Nivel 4: Sin Ataduras
            {
                featureId: new ObjectId(),
                name: 'Sin Ataduras',
                description: 'Tienes ventaja en salvaciones contra efectos que reducirán tu velocidad o te impidan el uso o te fuercen salir del sigilo. Además, una vez por combate, puedes entrar en sigilo como acción adicional. Obtienes un bonificador de daño igual a tu competencia en el turno que sales del sigilo.',
                levelRequirement: 4,
                usesPerCombat: 1,
                effects: [
                    {
                        type: 'advantage_saves',
                        condition: 'speed_reduction_or_stealth_prevention',
                        target: 'self'
                    },
                    {
                        type: 'bonus_action_stealth',
                        action: 'bonus',
                        target: 'self'
                    },
                    {
                        type: 'damage_buff_on_exit_stealth',
                        value: '{proficiency_bonus}',
                        duration: 'turn',
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 8: Paso de las Sombras
            {
                featureId: new ObjectId(),
                name: 'Paso de las Sombras',
                description: 'Puedes usar tu acción adicional para teletransportarte a un espacio no ocupado a 6 casillas de ti. Si impactas un ataque el mismo turno que utilizas esta propiedad, el objetivo será rodeado por la oscuridad y su velocidad se reducirá a la mitad hasta el inicio de tu siguiente turno. Puedes usar este rasgo dos veces por combate, y ganas un uso adicional a nivel 13 y 18.',
                levelRequirement: 8,
                usesPerCombat: 2,
                action: 'bonus',
                range: 6,
                effects: [
                    {
                        type: 'teleport',
                        distance: 6,
                        condition: 'unoccupied_space',
                        target: 'self'
                    },
                    {
                        type: 'darkness_and_slow_on_hit',
                        condition: 'attack_hits_same_turn',
                        speedReduction: 0.5,
                        duration: 'until_your_next_turn',
                        target: 'enemy'
                    }
                ],
                scaling: [
                    { level: 13, usesPerCombat: 3 },
                    { level: 18, usesPerCombat: 4 }
                ],
                state: 'ACTIVE'
            },
            // Nivel 13: Capa de las Sombras
            {
                featureId: new ObjectId(),
                name: 'Capa de las Sombras',
                description: 'Puedes usar tu reacción para imponer desventaja en una tirada de ataque que vaya dirigido contra ti. Luego de resolver dicho ataque, entrarás en Penumbra. Puedes usar este rasgo un total de veces igual a tu competencia por incursión. Todos los efectos de "Sin Ataduras" aplican para Penumbra.',
                levelRequirement: 13,
                usesPerIncursion: '{proficiency_bonus}',
                action: 'reaction',
                effects: [
                    {
                        type: 'impose_disadvantage',
                        trigger: 'attacked',
                        target: 'attacker'
                    },
                    {
                        type: 'enter_penumbra',
                        timing: 'after_attack_resolved',
                        target: 'self'
                    },
                    {
                        type: 'apply_sin_ataduras_to_penumbra',
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 18: Velo del Engaño
            {
                featureId: new ObjectId(),
                name: 'Velo del Engaño',
                description: 'Puedes crear una copia de ti mismo cuando entras en Penumbra. Dicha copia aguardará en el lugar donde hayas entrado en penumbra y servirá como un cebo. Esta replica podrá tomar ataques de oportunidad y podrás intercambiar lugares entre ambos con acción adicional. La copia desaparecerá al final del turno donde salgas de Penumbra. Además, el efecto de "Sin ataduras" para entrar en Penumbra tendrá dos usos adicionales.',
                levelRequirement: 18,
                effects: [
                    {
                        type: 'create_decoy',
                        trigger: 'enter_penumbra',
                        capabilities: ['take_opportunity_attacks'],
                        target: 'self'
                    },
                    {
                        type: 'swap_places_with_decoy',
                        action: 'bonus',
                        target: 'self'
                    },
                    {
                        type: 'decoy_disappears',
                        timing: 'end_of_turn_after_exit_penumbra',
                        target: 'decoy'
                    },
                    {
                        type: 'increase_sin_ataduras_uses',
                        value: 2,
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            }
        ],
        state: 'ACTIVE'
    },
    // ============================================
    // SHADOW TAMER - Subclase de Compañero de Sombra
    // ============================================
    {
        _id: new ObjectId(),
        name: 'Shadow Tamer',
        description: 'Domador de sombras que establece vínculos profundos con criaturas oscuras.',
        class: characterClassId,
        features: [
            // Nivel 4: Enlazar Sombra
            {
                featureId: new ObjectId(),
                name: 'Enlazar Sombra',
                description: 'Puedes conectar con una sombra que hayas derrotado y negociar con ella. Si estableces una relación con dicha sombra, puedes enlazarte con ella. Desde entonces, dicha sombra será tu compañera y podrá ser convocada y desconvocada por ti utilizando tu acción adicional. La sombra participará en los combates justo luego de tu turno, y podrás darle indicaciones para realizar acciones específicas, siempre y cuando le resulten razonables. En caso de querer enlazar con una nueva sombra, tendrás que romper la conexión con la anterior. Opcionalmente, el director de juego podrá mejorar la sombra en relación al progreso de tu personaje y su subida de nivel.',
                levelRequirement: 4,
                action: 'bonus',
                effects: [
                    {
                        type: 'bind_shadow_companion',
                        summon: 'bonus_action',
                        turnOrder: 'after_your_turn',
                        limit: 1,
                        target: 'defeated_shadow'
                    },
                    {
                        type: 'give_commands',
                        condition: 'reasonable_actions',
                        target: 'shadow_companion'
                    },
                    {
                        type: 'companion_scales',
                        scaling: 'dm_discretion',
                        target: 'shadow_companion'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 8: Conexión Profunda
            {
                featureId: new ObjectId(),
                name: 'Conexión Profunda',
                description: 'Tu conexión con tu compañero se profundizará, permitiéndote las siguientes acciones: Cuando realizas un ataque contra un enemigo, si tu compañero está en rango de ataque, puedes usar tu reacción para que este realice un ataque contra dicho enemigo. Puedes utilizar tu reacción para advertir a tu compañero cuando un ataque se realizará contra él, dándole resistencia a todo daño hecho por dicho ataque si impacta. Puedes utilizar tu acción adicional para permitir que tu compañero realice inmediatamente una acción de Correr, Destrabarse, Esquivar o Ayuda sin consumir su acción.',
                levelRequirement: 8,
                effects: [
                    {
                        type: 'companion_reaction_attack',
                        action: 'reaction',
                        trigger: 'you_attack_enemy',
                        condition: 'companion_in_range',
                        target: 'same_enemy'
                    },
                    {
                        type: 'protect_companion',
                        action: 'reaction',
                        effect: 'resistance_all_damage',
                        trigger: 'companion_attacked',
                        target: 'companion'
                    },
                    {
                        type: 'companion_bonus_action',
                        action: 'bonus',
                        allowedActions: ['dash', 'disengage', 'dodge', 'help'],
                        target: 'companion'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 13: Influencia Mutua
            {
                featureId: new ObjectId(),
                name: 'Influencia Mutua',
                description: 'Tu tiempo gastado con tu compañero te empieza a influenciar, otorgándote uno de los siguientes efectos: Ventaja en ataque si compañero está adyacente al enemigo (aplica también al compañero). Línea recta de 4 casillas + ataque cuerpo a cuerpo = salvación de coraje o caer (aplica también al compañero). Reducir enemigo a 0 PV = acción adicional para moverte mitad de velocidad y hacer otro ataque (aplica también al compañero). Además, tu compañero aprenderá uno de tus rasgos y tú aprenderás un rasgo de tu compañero.',
                levelRequirement: 13,
                chooseOne: [
                    {
                        name: 'Ventaja con Aliado Adyacente',
                        effects: [
                            {
                                type: 'advantage_attack',
                                condition: 'companion_adjacent_to_enemy',
                                target: 'self_and_companion'
                            }
                        ]
                    },
                    {
                        name: 'Carga Derribadora',
                        effects: [
                            {
                                type: 'knockdown_on_charge',
                                condition: 'straight_line_4_squares_then_melee',
                                save: 'courage',
                                dc: 'concentration_attack_dc',
                                target: 'self_and_companion'
                            }
                        ]
                    },
                    {
                        name: 'Ataque Extra al Derribar',
                        effects: [
                            {
                                type: 'extra_attack_on_kill',
                                action: 'bonus',
                                movement: 'half_speed',
                                target: 'self_and_companion'
                            }
                        ]
                    }
                ],
                effects: [
                    {
                        type: 'share_trait',
                        direction: 'companion_learns_your_trait',
                        count: 1
                    },
                    {
                        type: 'share_trait',
                        direction: 'you_learn_companion_trait',
                        count: 1
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 18: Uno Solo
            {
                featureId: new ObjectId(),
                name: 'Uno Solo',
                description: 'Adquieres los siguientes efectos: Cuando recibas un efecto beneficioso, tu compañero también será afectado por dicho efectos. Recibes los otros dos efectos de Influencia Mutua no seleccionados. Tu compañero aprenderá otro de tus rasgos y tú aprenderás otro rasgo de tu compañero.',
                levelRequirement: 18,
                effects: [
                    {
                        type: 'share_buffs',
                        trigger: 'receive_beneficial_effect',
                        target: 'companion'
                    },
                    {
                        type: 'gain_remaining_mutual_influence_effects',
                        count: 2,
                        target: 'self'
                    },
                    {
                        type: 'share_trait',
                        direction: 'companion_learns_your_trait',
                        count: 1,
                        total: 2
                    },
                    {
                        type: 'share_trait',
                        direction: 'you_learn_companion_trait',
                        count: 1,
                        total: 2
                    }
                ],
                state: 'ACTIVE'
            }
        ],
        state: 'ACTIVE'
    }
]);

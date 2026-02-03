const { ObjectId } = require('mongodb');

// Crear la clase base Shapeshifter
const characterClassId = new ObjectId();
db.characterClass.insertOne({
    _id: characterClassId,
    name: 'Shapeshifter',
    description: 'Cambiaformas que puede adoptar tres formas espirituales distintas: guardián defensivo, depredador ágil o gobernante místico.',
    HPDice: '1d8',
    salvations: ['courage', 'instincts'],
});

// Insertar los hechizos de Shapeshifter
db.spell.insertMany([
    // Nivel 1
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico/Físico I (I)',
        description: 'Inflige daño de objetivo individual de la afinidad física o mágica del usuario.',
        cost: 3,
        damage: '3d4',
        levelRequirement: 1,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_or_magical_affinity',
        castingAttribute: 'varies',
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
        castingAttribute: 'varies',
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
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 3
    {
        spellId: new ObjectId(),
        name: 'Curación Rápida I',
        description: 'Restauras 1d4 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        cost: 1,
        damage: null,
        levelRequirement: 3,
        targetType: 'ally',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        effects: [
            {
                type: 'healing',
                value: '1d4 + {spellcasting_modifier}',
                target: 'ally'
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 4
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico/Físico I (A)',
        description: 'Inflige daño de objetivo en área de la afinidad física o mágica del usuario.',
        cost: 5,
        damage: '3d4',
        levelRequirement: 4,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'physical_or_magical_affinity',
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 5
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico/Físico II (I)',
        description: 'Inflige daño de objetivo individual de la afinidad física o mágica del usuario.',
        cost: 5,
        damage: '4d6',
        levelRequirement: 5,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_or_magical_affinity',
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 6
    {
        spellId: new ObjectId(),
        name: 'Aceleración',
        description: 'Obtienes +1 a defensa y +1 a tu resistencia mágica, +1 iniciativa y una reacción adicional. Se puede utilizar 1 vez por combate.',
        cost: 5,
        damage: null,
        levelRequirement: 6,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        usesPerCombat: 1,
        effects: [
            {
                type: 'defense_buff',
                value: 1,
                target: 'self'
            },
            {
                type: 'magic_resistance_buff',
                value: 1,
                target: 'self'
            },
            {
                type: 'initiative_buff',
                value: 1,
                target: 'self'
            },
            {
                type: 'extra_reaction',
                value: 1,
                target: 'self'
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 7
    {
        spellId: new ObjectId(),
        name: 'Modificar Forma',
        description: 'En contacto con un aliado, le otorgas una DE las siguientes propiedades: ventaja en salvaciones y un beneficio específico según la salvación elegida.',
        cost: 5,
        damage: null,
        levelRequirement: 7,
        targetType: 'ally',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'choose_save_advantage',
                options: [
                    {
                        save: 'courage',
                        bonus: { type: 'temp_hp', value: '2d8' }
                    },
                    {
                        save: 'dexterity',
                        bonus: { type: 'extra_reaction', value: 1 }
                    },
                    {
                        save: 'knowledge',
                        bonus: { type: 'ap_recovery', value: '2d4' }
                    },
                    {
                        save: 'instincts',
                        bonus: { type: 'advantage', applyTo: 'next_attack' }
                    },
                    {
                        save: 'charisma',
                        bonus: { type: 'resistance', applyTo: 'next_magical_damage' }
                    }
                ]
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 8
    {
        spellId: new ObjectId(),
        name: 'Curación Rápida II',
        description: 'Restauras 2d4 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        cost: 2,
        damage: null,
        levelRequirement: 8,
        targetType: 'ally',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        effects: [
            {
                type: 'healing',
                value: '2d4 + {spellcasting_modifier}',
                target: 'ally'
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 9
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico/Físico II (A)',
        description: 'Inflige daño de objetivo en área de la afinidad física o mágica del usuario.',
        cost: 7,
        damage: '4d6',
        levelRequirement: 9,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'physical_or_magical_affinity',
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 10
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico/Físico III (I)',
        description: 'Inflige daño de objetivo individual de la afinidad física o mágica del usuario.',
        cost: 7,
        damage: '5d8',
        levelRequirement: 10,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_or_magical_affinity',
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 11
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (F)',
        description: 'Aumentas en +5 a todo daño que causes por 3 turnos.',
        cost: 3,
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
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (P)',
        description: 'Aumentas en +3 tu ataque por 3 turnos.',
        cost: 3,
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
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 12
    {
        spellId: new ObjectId(),
        name: 'Ícaro',
        description: 'Mientras tengas este hechizo activo, puedes utilizar hasta 6 casillas de tu movimiento como velocidad de vuelo. Mientras estés en el aire, no recibirás ataques de oportunidad cuerpo a cuerpo y tendrán desventaja en ataques de oportunidad a distancia. Al acabar tu turno, volverás al suelo. Obtienes una reacción adicional.',
        cost: 8,
        damage: null,
        levelRequirement: 12,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'flight',
                value: 6,
                target: 'self'
            },
            {
                type: 'immune_melee_opportunity',
                target: 'self',
                condition: 'while_flying'
            },
            {
                type: 'disadvantage_ranged_opportunity',
                target: 'attackers',
                condition: 'while_flying'
            },
            {
                type: 'extra_reaction',
                value: 1,
                target: 'self'
            },
            {
                type: 'land_at_end_of_turn',
                target: 'self'
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 13
    {
        spellId: new ObjectId(),
        name: 'Curación Rápida III',
        description: 'Restauras 3d6 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        cost: 3,
        damage: null,
        levelRequirement: 13,
        targetType: 'ally',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        effects: [
            {
                type: 'healing',
                value: '3d6 + {spellcasting_modifier}',
                target: 'ally'
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 14
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico/Físico III (A)',
        description: 'Inflige daño de objetivo en área de la afinidad física o mágica del usuario.',
        cost: 9,
        damage: '5d8',
        levelRequirement: 14,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'physical_or_magical_affinity',
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 15
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico/Físico IV (I)',
        description: 'Inflige daño de objetivo individual de la afinidad física o mágica del usuario.',
        cost: 9,
        damage: '6d10',
        levelRequirement: 15,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'physical_or_magical_affinity',
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
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
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 16
    {
        spellId: new ObjectId(),
        name: 'Formar Espacio',
        description: 'Alteras las propiedades del terreno actual, que se adapta a la primera forma que adoptes o tengas activa. Bulwark: distribuye daño al terreno. Predator: +5% crítico y +10% combo al salir de sigilo. Ruler: hechizos <3 SP con acción adicional + DoT +2 turnos.',
        cost: 12,
        damage: null,
        levelRequirement: 16,
        targetType: 'area',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'terrain_adaptation',
                bulwarkEffect: {
                    type: 'distribute_damage',
                    value: 'half_damage_to_terrain',
                    max: '{defense_value}',
                    target: 'self_and_allies'
                },
                predatorEffect: {
                    type: 'stealth_bonuses',
                    critIncrease: 5,
                    comboIncrease: 10,
                    trigger: 'exit_stealth'
                },
                rulerEffect: {
                    type: 'spell_enhancements',
                    bonusActionSpells: { maxCost: 3 },
                    dotExtension: 2
                }
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 17
    {
        spellId: new ObjectId(),
        name: 'Curación Rápida IV',
        description: 'Restauras 4d8 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        cost: 5,
        damage: null,
        levelRequirement: 17,
        targetType: 'ally',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        effects: [
            {
                type: 'healing',
                value: '4d8 + {spellcasting_modifier}',
                target: 'ally'
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 18
    {
        spellId: new ObjectId(),
        name: 'Desplazamiento Acelerado',
        description: 'En un destello, te teletransportas hasta 6 casillas a un lugar sin ocupar que puedas ver.',
        cost: 5,
        damage: null,
        levelRequirement: 18,
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
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico/Físico IV (A)',
        description: 'Inflige daño de objetivo en área de la afinidad física o mágica del usuario.',
        cost: 9,
        damage: '6d10',
        levelRequirement: 18,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'physical_or_magical_affinity',
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 19
    {
        spellId: new ObjectId(),
        name: 'Dotar Forma',
        description: 'Dotas de la forma de una sombra previamente vista a un objeto inanimado. El mismo replicará las propiedades básicas de la misma según las condiciones del material inicial.',
        cost: 15,
        damage: null,
        levelRequirement: 19,
        targetType: 'object',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'animate_object',
                target: 'inanimate_object',
                replicates: 'shadow_properties',
                basedOn: 'material_conditions'
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
    // Nivel 20
    {
        spellId: new ObjectId(),
        name: 'Maestro en Hechizos',
        description: 'Disminuyes el coste de tus hechizos a la mitad.',
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
                applyTo: 'all_spells',
                unit: 'multiplier'
            }
        ],
        castingAttribute: 'varies',
        state: 'ACTIVE'
    },
]);

// Insertar las características de la clase
const afinidadElementalFeature = {
    featureId: new ObjectId(),
    name: 'Afinidad Elemental',
    description: 'Elige una afinidad elemental que determina tu tipo de daño físico o mágico.',
    useType: 'passive',
    modifiers: [
        {
            value: 'elemental_choice',
            type: 'damage_type',
            description: 'Define el tipo de daño',
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

const cambiaformasFeature = {
    featureId: new ObjectId(),
    name: 'Cambiaformas',
    description: 'Gastando 3 SP y acción adicional, asumes una de tres formas: Bulwark Spirit (guardián defensivo), Predator Spirit (depredador ágil) o Ruler Spirit (gobernante místico). Mantienes stats/personalidad, no lanzas hechizos (excepto Ruler), equipamiento se mantiene.',
    useType: 'active',
    cost: { type: 'SP', value: 3 },
    action: 'bonus',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Bulwark Spirit',
            description: 'Forma de guardián monstruoso: defensa suma coraje, resistencia a elemento físico no débil, ventaja salvación coraje, provocar enemigos 4 casillas (DC 8+Cor+comp, desventaja 3 turnos).',
            useType: 'active',
            modifiers: [
                {
                    value: '{courage_modifier}',
                    type: 'defense_buff',
                    description: 'Defensa suma coraje',
                    target: 'self'
                },
                {
                    value: 'advantage',
                    type: 'save_advantage',
                    description: 'Ventaja salvación coraje',
                    target: 'self',
                    applyTo: 'courage_saves'
                }
            ],
            effects: [
                {
                    type: 'resistance',
                    target: 'self',
                    element: 'physical_non_weak'
                },
                {
                    type: 'taunt',
                    range: 4,
                    dc: '8 + courage_modifier + proficiency',
                    save: 'courage',
                    duration: 3,
                    effect: 'disadvantage_non_offensive_vs_you'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Predator Spirit',
            description: 'Forma de bestia ágil: ventaja sigilo, ventaja percepción rastreo, mover 4 casillas derriba enemigo (DC 8+Des+comp), +1d6 daño a enemigos en suelo.',
            useType: 'active',
            modifiers: [
                {
                    value: 'advantage',
                    type: 'skill_advantage',
                    description: 'Ventaja sigilo',
                    target: 'self',
                    applyTo: 'stealth'
                },
                {
                    value: 'advantage',
                    type: 'skill_advantage',
                    description: 'Ventaja percepción rastreo',
                    target: 'self',
                    applyTo: 'tracking_perception'
                },
                {
                    value: '1d6',
                    type: 'damage_buff',
                    description: 'Daño vs enemigos en suelo',
                    target: 'prone_enemies'
                }
            ],
            effects: [
                {
                    type: 'knockdown',
                    trigger: 'move_4_squares_before_attack',
                    dc: '8 + dexterity_modifier + proficiency',
                    save: 'courage',
                    target: 'attack_target'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ruler Spirit',
            description: 'Forma de gobernante místico: defensa aumenta por sabiduría en vez de destreza, puedes lanzar hechizos, hechizos siempre hacen mínimo mitad daño, salvación mágica +2 DC.',
            useType: 'active',
            modifiers: [
                {
                    value: 'wisdom_instead_dexterity',
                    type: 'defense_calculation',
                    description: 'Defensa usa sabiduría',
                    target: 'self'
                },
                {
                    value: 2,
                    type: 'spell_dc_increase',
                    description: 'Salvación mágica +2 DC',
                    target: 'self'
                }
            ],
            effects: [
                {
                    type: 'enable_spellcasting',
                    target: 'self'
                },
                {
                    type: 'minimum_spell_damage',
                    value: 'half_rolled',
                    target: 'self'
                }
            ],
            state: 'ACTIVE'
        }
    ],
    effects: [
        {
            type: 'maintain_stats',
            target: 'self'
        },
        {
            type: 'damage_carries_over',
            target: 'self'
        },
        {
            type: 'no_spellcasting',
            target: 'self',
            exception: 'ruler_spirit'
        },
        {
            type: 'maintain_concentration',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

const espirituSalvajeFeature = {
    featureId: new ObjectId(),
    name: 'Espíritu Salvaje',
    description: 'Al cambiar de forma, velocidad +1. Cada vez que causas daño a enemigo, ganas tu nivel en PV temporales (no acumulables).',
    useType: 'passive',
    modifiers: [
        {
            value: 1,
            type: 'speed_buff',
            description: 'Velocidad aumentada',
            target: 'self',
            condition: 'shapeshift_active'
        }
    ],
    effects: [
        {
            type: 'temp_hp_on_damage',
            value: '{level}',
            target: 'self',
            trigger: 'deal_damage',
            stacking: false
        }
    ],
    state: 'ACTIVE'
};

const indomitoFeature = {
    featureId: new ObjectId(),
    name: 'Indómito',
    description: 'Mientras estés en cambio de forma: doblas velocidad en tu turno (1x combate hasta terminar turno sin moverte), resistencia vs salvaciones que restringen movimiento, ventaja en tirada cualquiera 1x combate.',
    useType: 'passive',
    effects: [
        {
            type: 'double_speed',
            target: 'self',
            trigger: 'move_in_combat',
            usesPerCombat: 1,
            duration: 'end_of_turn',
            recharge: 'turn_without_movement'
        },
        {
            type: 'resistance',
            target: 'self',
            applyTo: 'movement_restriction_saves'
        },
        {
            type: 'advantage_any_roll',
            target: 'self',
            usesPerCombat: 1
        }
    ],
    state: 'ACTIVE'
};

const salvajismoFeature = {
    featureId: new ObjectId(),
    name: 'Salvajismo',
    description: 'Al impactar crítico, agregas dado adicional a daño. Aumenta crítico con ataques/hechizos en 5%.',
    useType: 'passive',
    modifiers: [
        {
            value: '1d',
            type: 'extra_crit_damage',
            description: 'Dado adicional en crítico',
            target: 'self',
            trigger: 'critical_hit'
        },
        {
            value: 5,
            type: 'crit_chance_increase',
            description: 'Crítico aumentado',
            target: 'self',
            applyTo: 'attacks_and_spells'
        }
    ],
    state: 'ACTIVE'
};

const multiataqueFeature = {
    featureId: new ObjectId(),
    name: 'Multiataque',
    description: 'Puedes realizar múltiples ataques en tu acción de ataque. Ganas 1 ataque adicional a nivel 10, 2 a nivel 17.',
    useType: 'passive',
    modifiers: [
        {
            value: 1,
            type: 'extra_attacks',
            description: 'Ataques adicionales',
            target: 'self',
            scaling: [
                { level: 10, value: 1 },
                { level: 17, value: 2 }
            ]
        }
    ],
    state: 'ACTIVE'
};

const afinidadEspiritualFeature = {
    featureId: new ObjectId(),
    name: 'Afinidad Espiritual',
    description: 'Sistema de Afinidad de Sombras (AS). Puedes gastar AS para: resistencia todo daño 1 turno (1 AS), +5% crítico 3 turnos (1 AS), curar 30% daño causado este turno (1 AS), cambiar afinidad daño este turno (1 AS).',
    useType: 'active',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Resistencia Total',
            description: 'Resistencia a todo daño hasta inicio siguiente turno.',
            useType: 'active',
            cost: { type: 'AS', value: 1 },
            effects: [
                {
                    type: 'resistance',
                    target: 'self',
                    applyTo: 'all_damage',
                    duration: 'until_next_turn'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Crítico Aumentado',
            description: 'Aumenta crítico con ataques/hechizos en 5% por 3 turnos.',
            useType: 'active',
            cost: { type: 'AS', value: 1 },
            effects: [
                {
                    type: 'crit_chance_increase',
                    value: 5,
                    target: 'self',
                    duration: 3
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Drenaje Vital',
            description: 'Te curas 30% del daño causado en este turno.',
            useType: 'active',
            cost: { type: 'AS', value: 1 },
            effects: [
                {
                    type: 'lifesteal',
                    value: 0.3,
                    target: 'self',
                    duration: 'this_turn'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Cambio Elemental',
            description: 'Cambias afinidad del daño infligido en este turno.',
            useType: 'active',
            cost: { type: 'AS', value: 1 },
            effects: [
                {
                    type: 'change_damage_element',
                    target: 'self',
                    duration: 'this_turn'
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};

const movimientoEnergizanteFeature = {
    featureId: new ObjectId(),
    name: 'Movimiento Energizante',
    description: 'Si mueves 14+ casillas en turno, recuperas 1 AS. Si impactas crítico: velocidad base como velocidad adicional + sin ataques de oportunidad este turno.',
    useType: 'passive',
    effects: [
        {
            type: 'as_recovery',
            value: 1,
            trigger: 'move_14_or_more',
            target: 'self'
        },
        {
            type: 'extra_speed',
            value: '{base_speed}',
            trigger: 'critical_hit',
            target: 'self'
        },
        {
            type: 'no_opportunity_attacks',
            trigger: 'critical_hit',
            target: 'self',
            duration: 'this_turn'
        }
    ],
    state: 'ACTIVE'
};

const respuestaNegativaFeature = {
    featureId: new ObjectId(),
    name: 'Respuesta Negativa',
    description: 'Mientras forma cambiada: cada golpe recibido infliges bonificador sabiduría en daño al oponente (duplicado si crítico). Resistencia a elemento neutro.',
    useType: 'passive',
    modifiers: [
        {
            value: '{wisdom_modifier}',
            type: 'damage_on_hit',
            description: 'Daño de respuesta',
            target: 'attacker',
            trigger: 'receive_hit',
            doubled: 'if_critical'
        }
    ],
    effects: [
        {
            type: 'resistance',
            target: 'self',
            element: 'neutral_element'
        }
    ],
    state: 'ACTIVE'
};

const claridadFeature = {
    featureId: new ObjectId(),
    name: 'Claridad',
    description: 'Al consumir todo movimiento en turno: restauras tu nivel en PV O cuarto de nivel en SP. 1x combate: restaura tu nivel en SP y doble nivel en PV a aliado.',
    useType: 'active',
    effects: [
        {
            type: 'recovery_on_full_movement',
            options: [
                { type: 'hp', value: '{level}' },
                { type: 'sp', value: '{level / 4}' }
            ],
            trigger: 'consume_all_movement',
            target: 'self'
        },
        {
            type: 'ally_recovery',
            hp: '{level * 2}',
            sp: '{level}',
            target: 'ally',
            usesPerCombat: 1
        }
    ],
    state: 'ACTIVE'
};

const formaDefinitivaFeature = {
    featureId: new ObjectId(),
    name: 'Forma Definitiva',
    description: 'Mejoras de formas: Bulwark (resistencia todo daño físico + inmunidad elemento resistente), Predator (ataque adicional + combo extra vs enemigos en suelo), Ruler (coste hechizos a mitad + 2d6 daño extra).',
    useType: 'passive',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Bulwark Definitivo',
            description: 'Resistencia a todo daño físico e inmunidad a elemento resistente.',
            useType: 'passive',
            effects: [
                {
                    type: 'resistance',
                    target: 'self',
                    applyTo: 'all_physical_damage'
                },
                {
                    type: 'immunity',
                    target: 'self',
                    element: 'resistant_element'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Predator Definitivo',
            description: 'Ataque adicional. Atacar enemigo en suelo genera combo extra.',
            useType: 'passive',
            modifiers: [
                {
                    value: 1,
                    type: 'extra_attack',
                    description: 'Ataque adicional',
                    target: 'self'
                }
            ],
            effects: [
                {
                    type: 'extra_combo_point',
                    trigger: 'attack_prone_enemy',
                    target: 'self'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ruler Definitivo',
            description: 'Coste de hechizos a mitad. Cada instancia de daño +2d6.',
            useType: 'passive',
            modifiers: [
                {
                    value: 0.5,
                    type: 'ap_cost_multiplier',
                    description: 'Reduce coste',
                    target: 'self',
                    applyTo: 'all_spells',
                    unit: 'multiplier'
                },
                {
                    value: '2d6',
                    type: 'damage_buff',
                    description: 'Daño adicional',
                    target: 'self',
                    applyTo: 'each_damage_instance'
                }
            ],
            state: 'ACTIVE'
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
                    APGained: 5,
                    knownSpells: 3
                },
                {
                    level: 2,
                    features: [cambiaformasFeature],
                    APGained: 1,
                    knownSpells: 3
                },
                {
                    level: 3,
                    features: [espirituSalvajeFeature],
                    APGained: 1,
                    knownSpells: 3
                },
                {
                    level: 4,
                    features: [],
                    APGained: 2,
                    knownSpells: 4,
                    subclassFeature: true
                },
                {
                    level: 5,
                    features: [],
                    APGained: 1,
                    knownSpells: 4
                },
                {
                    level: 6,
                    features: [indomitoFeature],
                    APGained: 1,
                    knownSpells: 4
                },
                {
                    level: 7,
                    features: [salvajismoFeature],
                    APGained: 1,
                    knownSpells: 4
                },
                {
                    level: 8,
                    features: [],
                    APGained: 2,
                    knownSpells: 5,
                    subclassFeature: true
                },
                {
                    level: 9,
                    features: [],
                    APGained: 1,
                    knownSpells: 5
                },
                {
                    level: 10,
                    features: [multiataqueFeature],
                    APGained: 1,
                    knownSpells: 5,
                    multiattack: 1
                },
                {
                    level: 11,
                    features: [afinidadEspiritualFeature],
                    APGained: 1,
                    knownSpells: 5,
                    shadowAffinity: 4
                },
                {
                    level: 12,
                    features: [movimientoEnergizanteFeature],
                    APGained: 2,
                    knownSpells: 7,
                    shadowAffinity: 4
                },
                {
                    level: 13,
                    features: [],
                    APGained: 1,
                    knownSpells: 7,
                    shadowAffinity: 4,
                    subclassFeature: true
                },
                {
                    level: 14,
                    features: [],
                    APGained: 1,
                    knownSpells: 7,
                    shadowAffinity: 4
                },
                {
                    level: 15,
                    features: [respuestaNegativaFeature],
                    APGained: 1,
                    knownSpells: 7,
                    shadowAffinity: 5
                },
                {
                    level: 16,
                    features: [claridadFeature],
                    APGained: 2,
                    knownSpells: 8,
                    shadowAffinity: 5
                },
                {
                    level: 17,
                    features: [],
                    APGained: 1,
                    knownSpells: 8,
                    shadowAffinity: 5,
                    multiattack: 2
                },
                {
                    level: 18,
                    features: [],
                    APGained: 1,
                    knownSpells: 8,
                    shadowAffinity: 5,
                    subclassFeature: true
                },
                {
                    level: 19,
                    features: [],
                    APGained: 1,
                    knownSpells: 8,
                    shadowAffinity: 5
                },
                {
                    level: 20,
                    features: [formaDefinitivaFeature],
                    APGained: 2,
                    knownSpells: 10,
                    shadowAffinity: 6
                }
            ]
        }
    }
);

// Insertar las subclases
db.personasubclasses.insertMany([
    // Subclase: Bulwark Spirit
    {
        name: 'Bulwark Spirit',
        description: 'Guardián defensivo que absorbe daño, cura con sangrado y protege aliados.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Frenesí Sangriento',
                        description: 'Ataques normales tienen probabilidad de causar sangrado (DC nivel + bonificador coraje). Todo daño de sangrado en enemigos a 2 casillas o menos se aplica como curación a ti.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'bleeding_on_attack',
                                dc: '{level} + {courage_modifier}',
                                save: 'courage',
                                target: 'enemy'
                            },
                            {
                                type: 'bleeding_to_healing',
                                range: 2,
                                target: 'self',
                                source: 'bleeding_damage_within_range'
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
                        name: 'Inmortal',
                        description: 'Al subir nivel, sumas competencia a tirada aumento PV. Inmunidad a elemento resistente. Duplicas curación de Frenesí Sangriento.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: '{proficiency}',
                                type: 'hp_gain_buff',
                                description: 'Competencia a aumento PV',
                                target: 'self',
                                trigger: 'level_up'
                            },
                            {
                                value: 2,
                                type: 'healing_multiplier',
                                description: 'Duplica curación',
                                target: 'self',
                                applyTo: 'frenesi_sangriento'
                            }
                        ],
                        effects: [
                            {
                                type: 'immunity',
                                target: 'self',
                                element: 'resistant_element'
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
                        name: 'Afinidad Guardiana',
                        description: 'Capacidades AS adicionales: inmunidad elemento no físico siguiente turno (1 AS), reduce crítico enemigo 5% 3 rondas (1 AS), mitad daño aliado redirigido a ti siguiente turno (1 AS). Ataques oportunidad reducen velocidad a mitad + pierden reacción.',
                        useType: 'passive',
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Inmunidad Elemental',
                                description: 'Inmunidad a elemento no físico elegido hasta inicio siguiente turno.',
                                useType: 'active',
                                cost: { type: 'AS', value: 1 },
                                effects: [
                                    {
                                        type: 'immunity',
                                        target: 'self',
                                        element: 'chosen_non_physical',
                                        duration: 'until_next_turn'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Reducir Crítico',
                                description: 'Reduce probabilidad crítico enemigo 5% por 3 rondas (no acumulable).',
                                useType: 'active',
                                cost: { type: 'AS', value: 1 },
                                effects: [
                                    {
                                        type: 'crit_chance_decrease',
                                        value: 5,
                                        target: 'enemy',
                                        duration: 3,
                                        stacking: false
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Redirigir Daño',
                                description: 'Mitad del daño que reciba aliado se redirige a ti hasta inicio siguiente turno.',
                                useType: 'active',
                                cost: { type: 'AS', value: 1 },
                                effects: [
                                    {
                                        type: 'redirect_damage',
                                        value: 0.5,
                                        target: 'ally',
                                        redirectTo: 'self',
                                        duration: 'until_next_turn'
                                    }
                                ],
                                state: 'ACTIVE'
                            }
                        ],
                        effects: [
                            {
                                type: 'opportunity_attack_debuff',
                                target: 'enemy',
                                effects: [
                                    { type: 'reduce_speed', value: 0.5 },
                                    { type: 'lose_reaction', value: 1 }
                                ]
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
                        name: 'Defensor de la Manada',
                        description: 'Enemigos a 2 casillas o menos tienen desventaja en acciones ofensivas contra cualquiera que no seas tú. 1x ronda: muévete mitad velocidad como acción gratuita cuando enemigo ataque. Ataques oportunidad contra ti con desventaja.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'disadvantage_offensive',
                                range: 2,
                                target: 'enemies',
                                condition: 'target_not_you'
                            },
                            {
                                type: 'free_movement',
                                value: 'half_speed',
                                trigger: 'enemy_attacks',
                                frequency: 'once_per_round',
                                target: 'self'
                            },
                            {
                                type: 'disadvantage',
                                target: 'attackers',
                                applyTo: 'opportunity_attacks_vs_you'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Predator Spirit
    {
        name: 'Predator Spirit',
        description: 'Depredador ágil que genera combo points para ejecutar acciones de caza devastadoras.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Aceleración de la Caza',
                        description: 'Ganas multiataque. Generas combo points (max 5) al: atacar enemigo en suelo, tirar 15+ en ataque, moverte 6 casillas en turno. Puedes usar puntos para Acciones de Caza (consumen todos los puntos).',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 1,
                                type: 'extra_attack',
                                description: 'Multiataque',
                                target: 'self'
                            }
                        ],
                        effects: [
                            {
                                type: 'generate_combo',
                                max: 5,
                                triggers: [
                                    'attack_prone_enemy',
                                    'attack_roll_15_or_more',
                                    'move_6_squares'
                                ],
                                target: 'self'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Salto Mortal',
                                description: 'Acción adicional: saltas distancia igual a doble puntos combo gastados. Puedes realizar ataque adicional. Movimiento aplica para derribo.',
                                useType: 'active',
                                action: 'bonus',
                                cost: { type: 'combo', value: 'all' },
                                effects: [
                                    {
                                        type: 'leap',
                                        distance: '{combo_points * 2}',
                                        target: 'free_space'
                                    },
                                    {
                                        type: 'extra_attack',
                                        target: 'any',
                                        asPartOf: 'leap'
                                    },
                                    {
                                        type: 'applies_to_knockdown',
                                        condition: 'movement_counts'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Golpe Brutal',
                                description: 'Al impactar ataque: por cada punto combo gastado, +1d8 daño.',
                                useType: 'active',
                                trigger: 'attack_hits',
                                cost: { type: 'combo', value: 'all' },
                                effects: [
                                    {
                                        type: 'bonus_damage',
                                        value: '{combo_points}d8',
                                        target: 'attack'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Instintos de Supervivencia',
                                description: 'Al recibir ataque, reacción: por cada punto gastado, tu nivel en PV temporales resto de ronda.',
                                useType: 'active',
                                action: 'reaction',
                                trigger: 'receive_attack',
                                cost: { type: 'combo', value: 'all' },
                                effects: [
                                    {
                                        type: 'temp_hp',
                                        value: '{combo_points * level}',
                                        target: 'self',
                                        duration: 'rest_of_round'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Destripar',
                                description: 'Acción adicional: golpe desprotege enemigo hasta inicio siguiente turno. Dado adicional sangrado por punto + doble puntos en % daño físico aumentado de todas fuentes (no acumulable).',
                                useType: 'active',
                                action: 'bonus',
                                cost: { type: 'combo', value: 'all' },
                                effects: [
                                    {
                                        type: 'extra_bleeding_dice',
                                        value: '{combo_points}d',
                                        target: 'enemy',
                                        duration: 'until_next_turn'
                                    },
                                    {
                                        type: 'physical_damage_increase',
                                        value: '{combo_points * 2}%',
                                        target: 'enemy',
                                        duration: 'until_next_turn',
                                        stacking: false
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Azote',
                                description: 'Acción adicional: hasta final turno, ataques causan sangrado (DC doble puntos + nivel, salvación coraje).',
                                useType: 'active',
                                action: 'bonus',
                                cost: { type: 'combo', value: 'all' },
                                effects: [
                                    {
                                        type: 'apply_bleeding',
                                        dc: '{combo_points * 2} + {level}',
                                        save: 'courage',
                                        target: 'enemy',
                                        duration: 'end_of_turn'
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
                level: 8,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Acechar',
                        description: 'Si no te has movido, acción adicional: reduce velocidad a mitad para entrar en sigilo al final turno. No puedes tomar acción que llame atención. Ganas ventaja en iniciativa.',
                        useType: 'active',
                        action: 'bonus',
                        condition: 'not_moved_yet',
                        modifiers: [
                            {
                                value: 'advantage',
                                type: 'initiative',
                                description: 'Ventaja iniciativa',
                                target: 'self'
                            }
                        ],
                        effects: [
                            {
                                type: 'enter_stealth',
                                cost: 'half_speed',
                                timing: 'end_of_turn',
                                target: 'self',
                                restriction: 'no_attention_actions'
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
                        name: 'Rey de la Jungla',
                        description: 'Reacción adicional. Cuando enemigo impacta aliado en cuerpo a cuerpo de ti: ataque con reacción. Con reacción: reduce a mitad daño que vayas a recibir (usos = competencia).',
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
                                type: 'reaction_attack',
                                trigger: 'ally_hit_near_you',
                                range: 'melee',
                                target: 'attacker'
                            },
                            {
                                type: 'halve_damage',
                                action: 'reaction',
                                target: 'self',
                                usesPerCombat: '{proficiency}'
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
                        name: 'Depredador Supremo',
                        description: '+5% crítico con ataques. Daño vs enemigos en suelo 3d6. Duplicas bonificador coraje para tumbar. Sigilo = invisibilidad. Si terminas turno sin usar acción: duplica combo (max 10, ignora límite 5). Salir sigilo de espaldas: reduce defensa por bonificador coraje resto turno.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 5,
                                type: 'crit_chance_increase',
                                description: 'Crítico aumentado',
                                target: 'self',
                                applyTo: 'attacks'
                            },
                            {
                                value: '3d6',
                                type: 'damage_buff',
                                description: 'Daño vs suelo',
                                target: 'prone_enemies'
                            },
                            {
                                value: 2,
                                type: 'knockdown_multiplier',
                                description: 'Duplica coraje para tumbar',
                                target: 'self',
                                applyTo: 'courage_knockdown'
                            }
                        ],
                        effects: [
                            {
                                type: 'invisibility',
                                target: 'self',
                                condition: 'while_in_stealth'
                            },
                            {
                                type: 'double_combo',
                                max: 10,
                                trigger: 'end_turn_without_action',
                                ignoresLimit: true,
                                target: 'self'
                            },
                            {
                                type: 'reduce_defense',
                                value: '{courage_modifier}',
                                trigger: 'exit_stealth_from_behind',
                                target: 'enemy',
                                duration: 'rest_of_turn',
                                applyTo: 'first_attack'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Ruler Spirit
    {
        name: 'Ruler Spirit',
        description: 'Gobernante místico que acumula Poder Astral y lanza hechizos celestiales devastadores.',
        class: characterClassId,
        spells: [
            {
                spellId: new ObjectId(),
                name: 'Quemadura Solar',
                description: 'Daño todopoderoso que causa instancia inmediata + 3 turnos de DoT.',
                cost: 3,
                damage: '2d6 + 1d6/ronda',
                levelRequirement: 4,
                targetType: 'single',
                class: characterClassId,
                concentration: false,
                element: 'todopoderoso',
                effects: [
                    {
                        type: 'immediate_damage',
                        value: '2d6'
                    },
                    {
                        type: 'dot',
                        value: '1d6',
                        duration: 3,
                        trigger: 'start_of_target_turn'
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            },
            {
                spellId: new ObjectId(),
                name: 'Quemadura Lunar',
                description: 'Daño todopoderoso que causa 3 turnos de DoT + daño final.',
                cost: 3,
                damage: '1d6/ronda + 3d6',
                levelRequirement: 4,
                targetType: 'single',
                class: characterClassId,
                concentration: false,
                element: 'todopoderoso',
                effects: [
                    {
                        type: 'dot',
                        value: '1d6',
                        duration: 3,
                        trigger: 'start_of_target_turn'
                    },
                    {
                        type: 'final_damage',
                        value: '3d6',
                        trigger: 'effect_ends'
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            },
            {
                spellId: new ObjectId(),
                name: 'Fuego Estelar',
                description: 'Daño de cualquier tipo a elección que genera doble AP.',
                cost: 3,
                damage: '3d6',
                levelRequirement: 8,
                targetType: 'single',
                class: characterClassId,
                concentration: false,
                element: 'choice',
                effects: [
                    {
                        type: 'double_pa_generation',
                        target: 'self'
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            },
            {
                spellId: new ObjectId(),
                name: 'Destello Astral',
                description: 'Daño todopoderoso que causa debilitación básica. Lanzable múltiples veces como parte misma acción. No genera AP.',
                cost: 40,
                costType: 'PA',
                damage: '4d6',
                levelRequirement: 8,
                targetType: 'single',
                class: characterClassId,
                concentration: false,
                element: 'todopoderoso',
                effects: [
                    {
                        type: 'apply_weakness',
                        severity: 'basic',
                        target: 'enemy'
                    },
                    {
                        type: 'multi_cast',
                        asPartOf: 'same_action'
                    },
                    {
                        type: 'no_pa_generation'
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            },
            {
                spellId: new ObjectId(),
                name: 'Caída Estelar',
                description: 'Daño todopoderoso por turno en área designada (radio 3 casillas) mientras concentras. Cancelar no consume acción.',
                cost: 5,
                damage: '4d8',
                levelRequirement: 13,
                targetType: 'area',
                class: characterClassId,
                concentration: true,
                element: 'todopoderoso',
                areaRadius: 3,
                effects: [
                    {
                        type: 'persistent_damage',
                        trigger: 'per_turn_in_concentration',
                        target: 'area'
                    },
                    {
                        type: 'free_cancel',
                        cost: 0
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            },
            {
                spellId: new ObjectId(),
                name: 'Descarga Estelar',
                description: 'Por cada 5 PA gastados: 1d4 daño todopoderoso. Resto suma como daño plano.',
                cost: 'all_PA',
                damage: '{PA/5}d4 + {PA%5}',
                levelRequirement: 13,
                targetType: 'single',
                class: characterClassId,
                concentration: false,
                element: 'todopoderoso',
                effects: [
                    {
                        type: 'consume_all_pa',
                        calculation: 'per_5_is_1d4_plus_remainder'
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            },
            {
                spellId: new ObjectId(),
                name: 'Solsticio',
                description: 'Por 3 turnos: duplica daño Quemadura Solar, cada Solar activa +5% crítico mágico. Al impactar crítico: lanza Eclipse gratis y termina efecto. Acción adicional.',
                cost: 6,
                damage: null,
                levelRequirement: 18,
                targetType: 'self',
                class: characterClassId,
                concentration: false,
                action: 'bonus',
                duration: 3,
                effects: [
                    {
                        type: 'double_damage',
                        applyTo: 'quemadura_solar',
                        duration: 3
                    },
                    {
                        type: 'crit_chance_per_stack',
                        value: 5,
                        stackSource: 'active_quemadura_solar',
                        applyTo: 'magical_attacks'
                    },
                    {
                        type: 'trigger_on_crit',
                        spell: 'Eclipse',
                        cost: 0,
                        endEffect: true
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            },
            {
                spellId: new ObjectId(),
                name: 'Eclipse',
                description: 'Por 3 turnos: Quemadura Lunar hace crítico, cada Lunar activa +5% pifia. Al pifiar: cuenta como crítico en debilidad, lanza Solsticio gratis y termina efecto. Acción adicional.',
                cost: 6,
                damage: null,
                levelRequirement: 18,
                targetType: 'self',
                class: characterClassId,
                concentration: false,
                action: 'bonus',
                duration: 3,
                effects: [
                    {
                        type: 'auto_crit',
                        applyTo: 'quemadura_lunar',
                        duration: 3
                    },
                    {
                        type: 'fumble_chance_per_stack',
                        value: 5,
                        stackSource: 'active_quemadura_lunar'
                    },
                    {
                        type: 'trigger_on_fumble',
                        converts: 'to_crit_on_weakness',
                        spell: 'Solsticio',
                        cost: 0,
                        endEffect: true
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            },
            {
                spellId: new ObjectId(),
                name: 'Alineamiento Celestial',
                description: 'Eliminas todas resistencias, inmunidades y absorciones de enemigo y provocas debilidad a daño todopoderoso.',
                cost: 12,
                damage: null,
                levelRequirement: 20,
                targetType: 'single',
                class: characterClassId,
                concentration: false,
                element: 'todopoderoso',
                effects: [
                    {
                        type: 'remove_resistances',
                        target: 'enemy'
                    },
                    {
                        type: 'remove_immunities',
                        target: 'enemy'
                    },
                    {
                        type: 'remove_absorptions',
                        target: 'enemy'
                    },
                    {
                        type: 'apply_weakness',
                        element: 'todopoderoso',
                        target: 'enemy'
                    }
                ],
                castingAttribute: 'varies',
                state: 'ACTIVE'
            }
        ],
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Gobernante Celeste',
                        description: 'Generas 1 Poder Astral (PA) por cada punto daño hechizos + doble por casilla no usada fin turno. Gasta PA para: nivel x10 PA = lanza hechizo dos veces, nivel x2 PA = +mitad nivel daño este turno (no genera PA), nivel x5 PA = hechizos daño causan estado alterado DC 10+Cor+comp. Eliges 2 hechizos adicionales.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 2,
                                type: 'extra_known_spells',
                                description: 'Hechizos adicionales',
                                target: 'self'
                            }
                        ],
                        effects: [
                            {
                                type: 'generate_pa',
                                sources: [
                                    { type: 'spell_damage', value: 1 },
                                    { type: 'unused_movement', value: 2 }
                                ],
                                target: 'self'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Lanzamiento Doble',
                                description: 'Lanzas hechizo dos veces.',
                                useType: 'active',
                                cost: { type: 'PA', value: '{level * 10}' },
                                effects: [
                                    {
                                        type: 'double_cast',
                                        target: 'chosen_spell'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Potencia Astral',
                                description: 'Aumenta daño mitad nivel por resto turno (no genera PA).',
                                useType: 'active',
                                cost: { type: 'PA', value: '{level * 2}' },
                                effects: [
                                    {
                                        type: 'damage_buff',
                                        value: '{level / 2}',
                                        target: 'self',
                                        duration: 'rest_of_turn',
                                        noPA: true
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Estado Alterado Astral',
                                description: 'Hechizos de daño causan estado alterado mental/elemental DC 10+Cor+comp.',
                                useType: 'active',
                                cost: { type: 'PA', value: '{level * 5}' },
                                effects: [
                                    {
                                        type: 'apply_status',
                                        dc: '10 + courage_modifier + proficiency',
                                        statusType: 'mental_or_elemental',
                                        target: 'damage_spells',
                                        duration: 'this_turn'
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
                level: 8,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Castigo Soberano',
                        description: 'Ataques oportunidad pueden usar hechizos ≤3 SP. Cuando enemigo entra en 2 casillas: ataque oportunidad con reacción.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'spell_opportunity_attack',
                                maxCost: 3,
                                target: 'enemy'
                            },
                            {
                                type: 'opportunity_attack',
                                trigger: 'enemy_enters_2_squares',
                                action: 'reaction',
                                target: 'enemy'
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
                        name: 'Imposición de Autocracia',
                        description: 'Duplicas daño Quemadura Solar/Lunar. Capacidades AS: duplica efecto/duración DoT activo (1 AS), elimina resistencia enemigo 3 turnos (1 AS), reacción adicional 2 turnos (1 AS). Reacción: cancela hechizo enfrentando tiradas (comp usos/incursión).',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 2,
                                type: 'damage_multiplier',
                                description: 'Duplica quemaduras',
                                target: 'self',
                                applyTo: ['quemadura_solar', 'quemadura_lunar']
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Potenciar DoT',
                                description: 'Duplicas efecto y duración de DoT activo en objetivo.',
                                useType: 'active',
                                cost: { type: 'AS', value: 1 },
                                effects: [
                                    {
                                        type: 'double_dot',
                                        target: 'active_dot_on_enemy'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Eliminar Resistencia',
                                description: 'Eliminas resistencia enemigo a elemento por 3 turnos.',
                                useType: 'active',
                                cost: { type: 'AS', value: 1 },
                                effects: [
                                    {
                                        type: 'remove_resistance',
                                        target: 'enemy',
                                        element: 'chosen',
                                        duration: 3
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Reacción Extra',
                                description: 'Reacción adicional por 2 turnos.',
                                useType: 'active',
                                cost: { type: 'AS', value: 1 },
                                effects: [
                                    {
                                        type: 'extra_reaction',
                                        value: 1,
                                        target: 'self',
                                        duration: 2
                                    }
                                ],
                                state: 'ACTIVE'
                            }
                        ],
                        effects: [
                            {
                                type: 'counterspell',
                                action: 'reaction',
                                mechanic: 'opposed_spellcasting_rolls',
                                usesPerIncursion: '{proficiency}',
                                target: 'enemy_caster'
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
                        name: 'Decreto del Emperador',
                        description: 'Como parte lanzar hechizo: usa hechizo ≤3 SP. Mientras consciente: enemigos pierden resistencia, al perder escudo pierden 2, doble daño lanzado con Fuego Estelar.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'bonus_spell',
                                maxCost: 3,
                                trigger: 'as_part_of_spell_cast',
                                target: 'self'
                            },
                            {
                                type: 'enemy_lose_resistance',
                                target: 'all_enemies',
                                condition: 'while_conscious'
                            },
                            {
                                type: 'double_shield_break',
                                target: 'enemies',
                                condition: 'while_conscious'
                            },
                            {
                                type: 'double_damage',
                                applyTo: 'fuego_estelar',
                                target: 'self'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
]);

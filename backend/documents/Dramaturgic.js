const { ObjectId } = require('mongodb');

// Insertar la clase Dramaturgic
const characterClassId = new ObjectId();
db.characterClass.insertOne({
    _id: characterClassId,
    name: 'Dramaturgic',
    HPDice: '1d8',
    salvations: ['courage', 'charisma']
});

// Insertar los hechizos de Dramaturgic
const spells = [];
db.spells.insertMany([
    // Nivel 1
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico I (I)',
        level: 1,
        cost: [{ stat: 'AP', value: 3 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '3d4',
                target: 'single_enemy'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 2 - Potenciaciones Básicas
    {
        _id: new ObjectId(),
        name: 'Potenciación Básica (F)',
        description: 'Aumenta en +2 a todo daño infligido por 3 turnos a ti o a un aliado.',
        level: 2,
        cost: [{ stat: 'AP', value: 2 }],
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
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Potenciación Básica (P)',
        description: 'Aumenta en +2 el ataque por 3 turnos a ti o a un aliado.',
        level: 2,
        cost: [{ stat: 'AP', value: 2 }],
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
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Potenciación Básica (D)',
        description: 'Aumenta en +2 a la defensa y +1 a la resistencia mágica por 3 turnos a ti o a un aliado.',
        level: 2,
        cost: [{ stat: 'AP', value: 2 }],
        modifiers: [
            {
                value: 2,
                type: 'defense',
                description: 'Aumenta en +2 la defensa',
                target: 'ally',
                addTo: 'defenseModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_defense'
            },
            {
                value: 1,
                type: 'magic_defense',
                description: 'Aumenta en +1 la resistencia mágica',
                target: 'ally',
                addTo: 'magicDefenseModifiers',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_defense'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 3
    {
        _id: new ObjectId(),
        name: 'Anticipación',
        level: 3,
        cost: [{ stat: 'AP', value: 2 }],
        effects: [
            {
                type: 'move_initiative',
                target: 'consenting_ally',
                description: 'Mueve a un aliado a cualquier posición en iniciativa'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Replica',
        level: 3,
        cost: [{ stat: 'AP', value: 1 }],
        effects: [
            {
                type: 'repeat_ally_spell',
                target: 'any',
                description: 'Repites un hechizo lanzado por un aliado esta ronda',
                additionalCost: true
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 4
    {
        _id: new ObjectId(),
        name: 'Salida de Escena',
        level: 4,
        cost: [{ stat: 'AP', value: 4 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '3d6',
                target: 'single_enemy'
            },
            {
                type: 'forced_movement',
                movementType: 'push',
                distance: 'full_movement',
                target: 'same_enemy',
                saveType: 'instincts',
                saveDC: 'spell_save_dc',
                condition: 'uses_reaction'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico I (A)',
        level: 4,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '3d4',
                target: 'area'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 5
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico II (I)',
        level: 5,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '4d6',
                target: 'single_enemy'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Barrera Mágica',
        level: 5,
        cost: [{ stat: 'AP', value: 2 }],
        effects: [
            {
                type: 'prevent_damage',
                damageType: 'magic',
                instances: 1,
                target: 'self_or_ally'
            }
        ],
        modifiers: [
            {
                value: 2,
                type: 'additional_cost',
                description: 'Cuesta 2 SP adicionales si se lanza con acción adicional',
                condition: 'bonus_action_cast'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'defense',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 6
    {
        _id: new ObjectId(),
        name: 'Establecer el Escenario',
        level: 6,
        cost: [{ stat: 'AP', value: 4 }],
        effects: [
            {
                type: 'create_zone',
                zoneType: 'damage_modifier',
                range: 4,
                radius: 4,
                target: 'area',
                description: 'Área con modificadores de daño físico/mágico'
            }
        ],
        modifiers: [
            {
                value: -3,
                type: 'physical_damage_debuff',
                description: 'Reduce daño y ataque físico',
                target: 'all_in_zone',
                switchable: true
            },
            {
                value: 3,
                type: 'magic_damage_buff',
                description: 'Aumenta daño y ataque mágico',
                target: 'all_in_zone',
                switchable: true
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Amplificador',
        level: 6,
        cost: [{ stat: 'AP', value: 3 }],
        effects: [
            {
                type: 'extend_buffs',
                duration: 3,
                target: 'single_ally',
                description: 'Extiende bonificadores por 3 turnos adicionales'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 7
    {
        _id: new ObjectId(),
        name: 'Barrera Física',
        level: 7,
        cost: [{ stat: 'AP', value: 2 }],
        effects: [
            {
                type: 'prevent_damage',
                damageType: 'physical',
                instances: 1,
                target: 'self_or_ally'
            }
        ],
        modifiers: [
            {
                value: 2,
                type: 'additional_cost',
                description: 'Cuesta 2 SP adicionales si se lanza con acción adicional',
                condition: 'bonus_action_cast'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'defense',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Dramatismo',
        level: 7,
        cost: [{ stat: 'AP', value: 3 }],
        effects: [
            {
                type: 'create_zone',
                zoneType: 'no_restoration',
                range: 4,
                radius: 3,
                target: 'area',
                description: 'Área donde no se pueden restaurar PV o SP'
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 8
    {
        _id: new ObjectId(),
        name: 'Distorsionar Imagen',
        level: 8,
        cost: [{ stat: 'AP', value: 6 }],
        modifiers: [
            {
                value: -1,
                type: 'disadvantage',
                description: 'Ataques individuales tienen desventaja',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 10,
                    medition: 'rounds'
                }
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'defense',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico II (A)',
        level: 8,
        cost: [{ stat: 'AP', value: 7 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '4d6',
                target: 'area'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 9
    {
        _id: new ObjectId(),
        name: 'Uso de utilería',
        level: 9,
        cost: [{ stat: 'AP', value: 2 }],
        modifiers: [
            {
                value: -3,
                type: 'spell_cost_reduction',
                description: 'Reduce coste del siguiente hechizo',
                target: 'single_ally',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'spell'
                }
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Purificación',
        level: 9,
        cost: [{ stat: 'AP', value: 6 }],
        effects: [
            {
                type: 'cleanse',
                cleanseType: 'status_effects',
                target: 'self_and_all_allies'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 10
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico III (I)',
        level: 10,
        cost: [{ stat: 'AP', value: 7 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '5d8',
                target: 'single_enemy'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Pausa Intermedia',
        level: 10,
        cost: [{ stat: 'AP', value: 4 }],
        effects: [
            {
                type: 'reduce_debuff_duration',
                duration: -1,
                target: 'self_and_all_allies'
            },
            {
                type: 'extend_buff_duration',
                duration: 1,
                target: 'self_and_all_allies'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 11 - Potenciaciones Complejas
    {
        _id: new ObjectId(),
        name: 'Potenciación Compleja (F)',
        level: 11,
        cost: [{ stat: 'AP', value: 3 }],
        modifiers: [
            {
                value: 5,
                type: 'buff',
                description: 'Aumenta todo daño infligido',
                target: 'self_or_ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                },
                etiquette: 'empowerment_complex'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Potenciación Compleja (P)',
        level: 11,
        cost: [{ stat: 'AP', value: 3 }],
        modifiers: [
            {
                value: 3,
                type: 'attack_buff',
                description: 'Aumenta el ataque',
                target: 'self_or_ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                },
                etiquette: 'empowerment_complex'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Potenciación Compleja (D)',
        level: 11,
        cost: [{ stat: 'AP', value: 3 }],
        modifiers: [
            {
                value: 3,
                type: 'defense_buff',
                description: 'Aumenta defensa',
                target: 'self_or_ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                },
                etiquette: 'empowerment_complex'
            },
            {
                value: 2,
                type: 'magic_resistance_buff',
                description: 'Aumenta resistencia mágica',
                target: 'self_or_ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                },
                etiquette: 'empowerment_complex'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 12
    {
        _id: new ObjectId(),
        name: 'Cono de la Vergüenza',
        level: 12,
        cost: [{ stat: 'AP', value: 6 }],
        effects: [
            {
                type: 'status_effect',
                statusType: 'cone_of_shame',
                target: 'single_enemy_melee',
                saveType: 'instincts',
                saveDC: 'spell_save_dc',
                duration: {
                    type: 'temporal',
                    duration: 10,
                    medition: 'rounds'
                },
                options: [
                    'disadvantage_on_saves_chosen_stat',
                    'disadvantage_attack_vs_caster',
                    'action_loss_on_fail',
                    'extra_1d8_damage_from_caster'
                ]
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'debuff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Barrera Total',
        level: 12,
        cost: [{ stat: 'AP', value: 3 }],
        effects: [
            {
                type: 'prevent_damage',
                damageType: 'all',
                instances: 1,
                target: 'self_or_ally'
            }
        ],
        modifiers: [
            {
                value: 2,
                type: 'additional_cost',
                description: 'Cuesta 2 SP adicionales si se lanza con acción adicional',
                condition: 'bonus_action_cast'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'defense',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 13
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico III (A)',
        level: 13,
        cost: [{ stat: 'AP', value: 9 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '5d8',
                target: 'area'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Purificación Completa',
        level: 13,
        cost: [{ stat: 'AP', value: 7 }],
        effects: [
            {
                type: 'cleanse',
                cleanseType: 'status_effects_and_debuffs',
                target: 'self_and_all_allies'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 14
    {
        _id: new ObjectId(),
        name: 'Amplificación Total',
        level: 14,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'extend_buffs',
                duration: 3,
                target: 'self_and_all_allies',
                description: 'Extiende bonificadores de todos los aliados por 3 turnos'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Explosión Mágica',
        level: 14,
        cost: [{ stat: 'AP', value: 9 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '5d8',
                target: 'area',
                radius: 4,
                center: 'self'
            }
        ],
        modifiers: [
            {
                value: '1d6',
                type: 'weapon_damage_buff',
                description: 'Aumenta daño de arma',
                target: 'self',
                damageType: 'elemental_affinity',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                }
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 15
    {
        _id: new ObjectId(),
        name: 'Potenciación Completa',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos a ti o a un aliado.',
        level: 15,
        cost: [{ stat: 'AP', value: 6 }],
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta ataque',
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
                description: 'Aumenta daño infligido',
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
                description: 'Aumenta defensa',
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
                description: 'Aumenta resistencia mágica',
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
        concentration: false,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico IV (I)',
        level: 15,
        cost: [{ stat: 'AP', value: 9 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '6d10',
                target: 'single_enemy'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 16
    {
        _id: new ObjectId(),
        name: 'Devolución',
        level: 16,
        cost: [{ stat: 'AP', value: 0 }],
        effects: [
            {
                type: 'counter_attack',
                trigger: 'enemy_attack_roll_1_to_5',
                target: 'attacking_enemy',
                description: 'Realiza ataque con arma interrumpiendo el ataque enemigo'
            }
        ],
        concentration: false,
        actionType: 'passive',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Desplazamiento Acelerado',
        level: 16,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'teleport',
                distance: 6,
                target: 'self',
                description: 'Teletransporte a 6 casillas'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 17
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico IV (A)',
        level: 17,
        cost: [{ stat: 'AP', value: 11 }],
        effects: [
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '6d10',
                target: 'area'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Barrera Infranqueable',
        level: 17,
        cost: [{ stat: 'AP', value: 4 }],
        effects: [
            {
                type: 'prevent_damage',
                damageType: 'all',
                instances: 2,
                target: 'self_or_ally'
            }
        ],
        modifiers: [
            {
                value: 2,
                type: 'additional_cost',
                description: 'Cuesta 2 SP adicionales si se lanza con acción adicional',
                condition: 'bonus_action_cast'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'defense',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 18
    {
        _id: new ObjectId(),
        name: 'Hechizo Impactante',
        level: 18,
        cost: [{ stat: 'AP', value: 6 }],
        modifiers: [
            {
                value: 1,
                type: 'stun_on_next_spell',
                description: 'Siguiente hechizo de daño puede aturdir',
                target: 'self',
                saveType: 'courage',
                saveDC: 'spell_attack',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'spell'
                }
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Destrucción Mágica',
        level: 18,
        cost: [{ stat: 'AP', value: 8 }],
        effects: [
            {
                type: 'break_concentration',
                target: 'all_enemies'
            },
            {
                type: 'remove_buffs',
                target: 'all_enemies'
            },
            {
                type: 'remove_debuffs',
                target: 'all_allies'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 19
    {
        _id: new ObjectId(),
        name: 'Luces, Cámara, Acción',
        level: 19,
        cost: [{ stat: 'AP', value: 10 }],
        effects: [
            {
                type: 'force_target',
                target: 'all_enemies',
                saveType: 'willpower',
                saveDC: 'spell_save_dc',
                forcedTarget: 'caster_or_consenting_ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                damageAccumulation: true
            },
            {
                type: 'damage',
                damageType: 'elemental_affinity',
                damage: '{accumulated_damage}',
                target: 'cone',
                range: 6,
                trigger: 'bonus_action_release'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Corte de Escena',
        level: 19,
        cost: [{ stat: 'AP', value: 12 }],
        effects: [
            {
                type: 'prevent_spell_casting',
                target: 'all_enemies',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'turns'
                }
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'debuff',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 20
    {
        _id: new ObjectId(),
        name: 'Maestro en Hechizos',
        level: 20,
        cost: [{ stat: 'AP', value: 0 }],
        modifiers: [
            {
                value: 0.5,
                type: 'spell_cost_multiplier',
                description: 'Reduce coste de hechizos a la mitad',
                target: 'self',
                duration: {
                    type: 'permanent',
                    duration: 0,
                    medition: 'none'
                }
            }
        ],
        concentration: false,
        actionType: 'passive',
        category: 'passive',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Aceleración Mágica',
        level: 20,
        cost: [{ stat: 'AP', value: 12 }],
        modifiers: [
            {
                value: 1,
                type: 'extra_non_damage_spell',
                description: 'Puede lanzar segundo hechizo no dañino',
                target: 'self_or_consenting_ally',
                duration: {
                    type: 'temporal',
                    duration: 5,
                    medition: 'turns'
                }
            },
            {
                value: 2,
                type: 'magic_resistance_buff',
                description: 'Aumenta resistencia mágica',
                target: 'same',
                duration: {
                    type: 'temporal',
                    duration: 5,
                    medition: 'turns'
                }
            },
            {
                value: 1,
                type: 'extra_concentration',
                description: 'Puede mantener segunda concentración',
                target: 'same',
                duration: {
                    type: 'temporal',
                    duration: 5,
                    medition: 'turns'
                }
            }
        ],
        effects: [
            {
                type: 'status_effect',
                statusType: 'exhaustion',
                target: 'same',
                trigger: 'after_duration_end',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'turns'
                }
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    }
]);

// Características principales de Dramaturgic
const armaDeChejovFeature = {
    featureId: new ObjectId(),
    name: 'Arma de Chéjov',
    description: 'Puedes crear elementos útiles para modificar las reglas de la situación. Puedes materializar elementos de utilería en el terreno.',
    useType: 'active',
    action: 'bonus_action',
    uses: '{utility_uses_table}',
    triggerForRecover: 'at_combat_end',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Pantano',
            description: 'Causas que una zona sea terreno difícil en un radio de 2 casillas alrededor del elemento hasta el inicio de tu siguiente turno. Radio aumenta con nivel: 3 (nivel 7), 4 (nivel 15), 6 (nivel 20).',
            useType: 'active',
            action: 'bonus_action',
            effects: [
                {
                    type: 'create_difficult_terrain',
                    radius: 2,
                    target: 'area',
                    center: 'utility_element',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'turns'
                    },
                    scaling: [
                        { level: 7, radius: 3 },
                        { level: 15, radius: 4 },
                        { level: 20, radius: 6 }
                    ]
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Escudo',
            description: 'En rango de 3 casillas del elemento, otorgas resistencia al daño mágico (nivel 2-6), físico también (nivel 7+), duración aumenta con nivel.',
            useType: 'active',
            action: 'reaction',
            effects: [
                {
                    type: 'grant_resistance',
                    resistanceType: 'magic',
                    target: 'self_or_ally',
                    range: 3,
                    trigger: 'before_magic_attack_hits',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'instances'
                    }
                },
                {
                    type: 'grant_resistance',
                    resistanceType: 'physical',
                    target: 'self_or_ally',
                    range: 3,
                    trigger: 'before_attack_hits',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'turns'
                    },
                    levelRequired: 7
                },
                {
                    type: 'grant_resistance',
                    resistanceType: 'damage_type',
                    target: 'self_or_ally',
                    range: 3,
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'rounds'
                    },
                    levelRequired: 15
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Pistola',
            description: 'Atacas a un enemigo a 12 casillas del elemento con tu afinidad elemental. Daño escala con nivel.',
            useType: 'active',
            action: 'bonus_action',
            effects: [
                {
                    type: 'damage',
                    damageType: 'elemental_affinity',
                    damage: '1d6',
                    target: 'single_enemy',
                    range: 12,
                    scaling: [
                        { level: 2, damage: '1d6' },
                        { level: 5, damage: '2d6' },
                        { level: 11, damage: '3d6' },
                        { level: 17, damage: '4d6' },
                        { level: 20, damage: '6d6' }
                    ]
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Corriente',
            description: 'Aumentas velocidad en 3 a ti y aliados en radio de 3 casillas. Efectos mejoran con nivel.',
            useType: 'active',
            action: 'bonus_action',
            modifiers: [
                {
                    value: 3,
                    type: 'speed_buff',
                    description: 'Aumenta velocidad',
                    target: 'self_and_allies_in_radius',
                    radius: 3,
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'turns'
                    }
                }
            ],
            effects: [
                {
                    type: 'ignore_difficult_terrain',
                    target: 'buffed_allies',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'turns'
                    },
                    levelRequired: 7
                },
                {
                    type: 'double_base_speed',
                    target: 'buffed_allies',
                    levelRequired: 15
                },
                {
                    type: 'double_radius',
                    levelRequired: 20
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Bomba',
            description: 'Todos los enemigos en radio del elemento reciben ataque mágico. Daño y radio escalan con nivel.',
            useType: 'active',
            action: 'bonus_action',
            effects: [
                {
                    type: 'damage',
                    damageType: 'elemental_affinity',
                    damage: '2d8',
                    target: 'all_enemies_in_radius',
                    radius: 2,
                    scaling: [
                        { level: 2, damage: '2d8', radius: 2 },
                        { level: 10, damage: '4d8', radius: 4 },
                        { level: 20, damage: '6d8', radius: 8 }
                    ]
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Auriculares',
            description: 'Tú y aliados en radio del elemento tienen ventaja en concentración. Radio y efecto mejoran con nivel.',
            useType: 'active',
            action: 'bonus_action',
            modifiers: [
                {
                    value: 1,
                    type: 'advantage',
                    description: 'Ventaja en concentración de hechizos',
                    target: 'self_and_allies_in_radius',
                    radius: 2,
                    applyTo: 'concentration_checks',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'turns'
                    },
                    scaling: [
                        { level: 2, radius: 2 },
                        { level: 7, radius: 4 },
                        { level: 15, radius: 8 }
                    ]
                }
            ],
            effects: [
                {
                    type: 'prevent_concentration_loss',
                    target: 'self_and_allies_in_radius',
                    radius: 8,
                    condition: 'in_range',
                    levelRequired: 20
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Vendas',
            description: 'Un aliado en radio del elemento gana HP temporales igual a tu nivel hasta inicio de tu siguiente turno. Duplica a nivel 10.',
            useType: 'active',
            action: 'bonus_action',
            effects: [
                {
                    type: 'temp_hp',
                    heal: '{level}',
                    target: 'single_ally',
                    range: 3,
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'turns'
                    },
                    scaling: [
                        { level: 10, multiplier: 2 }
                    ]
                }
            ],
            state: 'ACTIVE'
        }
    ],
    modifiers: [
        {
            value: 1,
            type: 'move_utility_element',
            description: 'Puede mover elemento a otro punto a 6 casillas',
            target: 'utility_element',
            levelRequired: 10,
            action: 'bonus_action'
        }
    ],
    state: 'ACTIVE'
};

const puestaEnEscenaFeature = {
    featureId: new ObjectId(),
    name: 'Puesta en Escena',
    description: 'Tus hechizos tienen crítico aumentado en 5%. Hechizos no ofensivos pueden resultar críticos (duplicando efectos). Hechizos no ofensivos reciben mitad de crítico aumentado (redondeado arriba).',
    useType: 'passive',
    modifiers: [
        {
            value: 5,
            type: 'crit_chance_increase',
            description: 'Aumenta crítico de hechizos',
            target: 'self',
            applyTo: 'all_spells',
            unit: 'percentage'
        },
        {
            value: 2,
            type: 'enable_non_offensive_crit',
            description: 'Hechizos no ofensivos pueden criticar',
            target: 'self',
            effectMultiplier: 2
        },
        {
            value: 0.5,
            type: 'crit_modifier',
            description: 'Mitad de crítico aumentado para hechizos no ofensivos',
            target: 'self',
            applyTo: 'non_offensive_spells',
            roundUp: true
        }
    ],
    state: 'ACTIVE'
};

const clicheFeature = {
    featureId: new ObjectId(),
    name: 'Cliché',
    description: 'A través de narración épica y cliché, accedes a efectos especiales: recuperar SP (1×incursión) y repetir tiradas (1×combate, auto-éxito desde nivel 15).',
    useType: 'active',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Recuperación de SP',
            description: 'Recuperas tu nivel en SP.',
            useType: 'active',
            uses: 1,
            triggerForRecover: 'at_incursion_end',
            effects: [
                {
                    type: 'recover',
                    recoverType: 'AP',
                    recover: '{level}',
                    target: 'self'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Repetir Tirada',
            description: 'Puedes repetir una tirada. Auto-éxito desde nivel 15.',
            useType: 'active',
            uses: 1,
            triggerForRecover: 'at_combat_end',
            effects: [
                {
                    type: 'reroll',
                    target: 'self',
                    applyTo: 'any_roll'
                },
                {
                    type: 'auto_success',
                    target: 'self',
                    levelRequired: 15
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};

const bisFeature = {
    featureId: new ObjectId(),
    name: 'Bis',
    description: 'Si fallas el lanzamiento de un hechizo, puedes usar tu acción adicional para repetir dicho hechizo contra objetivo distinto a 6 casillas del original. 3 usos por combate, +1 uso a nivel 15 y 20.',
    useType: 'active',
    action: 'bonus_action',
    uses: 3,
    triggerForRecover: 'at_combat_end',
    trigger: 'after_spell_fail',
    effects: [
        {
            type: 'repeat_spell',
            target: 'different_target',
            range: 6,
            condition: 'spell_failed'
        }
    ],
    modifiers: [
        {
            value: 1,
            type: 'extra_use',
            description: 'Uso adicional',
            levelRequired: 15
        },
        {
            value: 1,
            type: 'extra_use',
            description: 'Uso adicional',
            levelRequired: 20
        }
    ],
    state: 'ACTIVE'
};

const fantasiaMaterializadaFeature = {
    featureId: new ObjectId(),
    name: 'Fantasía Materializada',
    description: 'Al lanzar un hechizo con descripción épica, realizas tirada de interpretación vs voluntad del objetivo. Si superas, causas efecto adicional acordado con el DM.',
    useType: 'active',
    trigger: 'on_spell_cast',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Destello Gemelo',
            description: 'Adelantas lanzamiento de hechizo de aliado autorizado a tu turno, mezclando hechizos y aumentando daño de cada uno en un dado adicional.',
            useType: 'active',
            effects: [
                {
                    type: 'advance_ally_spell',
                    target: 'consenting_ally',
                    trigger: 'your_turn'
                }
            ],
            modifiers: [
                {
                    value: '1d',
                    type: 'damage_buff',
                    description: 'Aumenta daño de ambos hechizos',
                    target: 'both_spells'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Eco',
            description: 'Causas daño mínimo del hechizo a cambio de realizar nuevamente tirada de daño al final del turno del oponente.',
            useType: 'active',
            effects: [
                {
                    type: 'damage',
                    damageType: 'spell_element',
                    damage: '{min_spell_damage}',
                    target: 'spell_target',
                    immediate: true
                },
                {
                    type: 'damage',
                    damageType: 'spell_element',
                    damage: '{spell_damage_reroll}',
                    target: 'same_target',
                    trigger: 'end_of_opponent_turn'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Rebote',
            description: 'Causas que efecto de hechizo impacte en objetivo adicional aumentando su coste.',
            useType: 'active',
            effects: [
                {
                    type: 'additional_target',
                    target: 'extra_enemy',
                    costIncrease: true
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Cambio Elemental',
            description: 'Causas que hechizo cause mitad de daño total a cambio de cambiarle el elemento.',
            useType: 'active',
            modifiers: [
                {
                    value: 0.5,
                    type: 'damage_multiplier',
                    description: 'Reduce daño a la mitad',
                    target: 'spell'
                },
                {
                    value: 1,
                    type: 'element_change',
                    description: 'Cambia elemento del hechizo',
                    target: 'spell',
                    newElement: 'selected'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Destello',
            description: 'Duplicas efectos de hechizo no dañino a cambio de reducir su duración a un turno.',
            useType: 'active',
            modifiers: [
                {
                    value: 2,
                    type: 'effect_multiplier',
                    description: 'Duplica efectos',
                    target: 'non_damage_spell',
                    condition: 'reduce_duration_to_1_turn'
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};

const cambioDePanoramaFeature = {
    featureId: new ObjectId(),
    name: 'Cambio de Panorama',
    description: 'Obtienes acción adicional extra para elementos que no causen daño. Además, puedes tener 2 elementos activos en combate.',
    useType: 'passive',
    modifiers: [
        {
            value: 1,
            type: 'extra_bonus_action',
            description: 'Acción adicional extra para no-daño',
            target: 'self',
            condition: 'non_damage_actions'
        },
        {
            value: 2,
            type: 'active_utility_elements',
            description: 'Puede tener 2 elementos activos',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

const giroArgumentalFeature = {
    featureId: new ObjectId(),
    name: 'Giro Argumental',
    description: 'Habilidades especiales de manipulación de fantasía y beneficios de combate.',
    useType: 'active',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Activación Automática de Fantasía',
            description: 'Una vez por sesión, una fantasía se activa sin tirada.',
            useType: 'active',
            uses: 1,
            triggerForRecover: 'at_session_end',
            effects: [
                {
                    type: 'auto_fantasy_success',
                    target: 'self'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Recuperar Beneficios de Combate',
            description: 'Una vez por sesión, recuperas todos los beneficios de inicio de combate de ti o aliado.',
            useType: 'active',
            uses: 1,
            triggerForRecover: 'at_session_end',
            effects: [
                {
                    type: 'recover_combat_benefits',
                    target: 'self_or_ally',
                    includesDuration: true
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};

const flashbackFeature = {
    featureId: new ObjectId(),
    name: 'Flashback',
    description: 'Cada impacto sucesivo de hechizos acumulas 1d4. Puedes gastar dado para aumentar tirada antes de saber resultado. Si fallas hechizo, pierdes todos los dados. Si lo sumas a daño, puedes duplicar valor.',
    useType: 'active',
    internalCounter: true,
    counterIncrement: '1d4',
    trigger: 'after_spell_hit',
    effects: [
        {
            type: 'add_to_roll',
            value: '1d4',
            target: 'self',
            timing: 'before_result',
            requiresDescription: true
        },
        {
            type: 'double_value',
            target: 'flashback_die',
            condition: 'added_to_damage_roll'
        }
    ],
    modifiers: [
        {
            value: 0,
            type: 'reset_counter',
            description: 'Pierde todos los dados acumulados',
            trigger: 'on_spell_fail'
        }
    ],
    state: 'ACTIVE'
};

const deusExMachinaFeature = {
    featureId: new ObjectId(),
    name: 'Deus Ex Machina',
    description: 'Como reacción, interrumpes acción de enemigo con tirada enfrentada de interpretación. Usos = bonificador carisma + 1. Si empiezas combate sin usos, obtienes 1 adicional.',
    useType: 'active',
    action: 'reaction',
    uses: '{charisma_modifier + 1}',
    triggerForRecover: 'at_incursion_end',
    trigger: 'enemy_action',
    effects: [
        {
            type: 'contested_check',
            checkType: 'performance',
            target: 'acting_enemy',
            onSuccess: 'interrupt_action'
        },
        {
            type: 'grant_use',
            condition: 'start_combat_with_zero_uses',
            uses: 1,
            duration: 'this_combat'
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
                    APGained: 6,
                    spells: [spells[0]],
                    knownSpells: 4,
                    features: []
                },
                {
                    level: 2,
                    APGained: 1,
                    spells: [spells[1], spells[2], spells[3]],
                    knownSpells: 4,
                    features: [armaDeChejovFeature]
                },
                {
                    level: 3,
                    APGained: 2,
                    spells: [spells[4], spells[5]],
                    knownSpells: 4,
                    features: [puestaEnEscenaFeature]
                },
                {
                    level: 4,
                    APGained: 1,
                    spells: [spells[6], spells[7]],
                    knownSpells: 6,
                    features: []
                },
                {
                    level: 5,
                    APGained: 1,
                    spells: [spells[8], spells[9]],
                    knownSpells: 6,
                    features: []
                },
                {
                    level: 6,
                    APGained: 2,
                    spells: [spells[10], spells[11]],
                    knownSpells: 6,
                    features: [clicheFeature]
                },
                {
                    level: 7,
                    APGained: 1,
                    spells: [spells[12], spells[13]],
                    knownSpells: 6,
                    features: []
                },
                {
                    level: 8,
                    APGained: 1,
                    spells: [spells[14], spells[15]],
                    knownSpells: 7,
                    features: []
                },
                {
                    level: 9,
                    APGained: 2,
                    spells: [spells[16], spells[17]],
                    knownSpells: 7,
                    features: []
                },
                {
                    level: 10,
                    APGained: 1,
                    spells: [spells[18], spells[19]],
                    knownSpells: 7,
                    features: [bisFeature]
                },
                {
                    level: 11,
                    APGained: 1,
                    spells: [spells[20], spells[21], spells[22]],
                    knownSpells: 7,
                    features: [fantasiaMaterializadaFeature]
                },
                {
                    level: 12,
                    APGained: 2,
                    spells: [spells[23], spells[24]],
                    knownSpells: 9,
                    features: [cambioDePanoramaFeature]
                },
                {
                    level: 13,
                    APGained: 1,
                    spells: [spells[25], spells[26]],
                    knownSpells: 9,
                    features: []
                },
                {
                    level: 14,
                    APGained: 1,
                    spells: [spells[27], spells[28]],
                    knownSpells: 9,
                    features: []
                },
                {
                    level: 15,
                    APGained: 2,
                    spells: [spells[29], spells[30]],
                    knownSpells: 9,
                    features: []
                },
                {
                    level: 16,
                    APGained: 1,
                    spells: [spells[31], spells[32]],
                    knownSpells: 10,
                    features: [flashbackFeature]
                },
                {
                    level: 17,
                    APGained: 1,
                    spells: [spells[33], spells[34]],
                    knownSpells: 10,
                    features: [giroArgumentalFeature]
                },
                {
                    level: 18,
                    APGained: 2,
                    spells: [spells[35], spells[36]],
                    knownSpells: 10,
                    features: []
                },
                {
                    level: 19,
                    APGained: 1,
                    spells: [spells[37], spells[38]],
                    knownSpells: 10,
                    features: []
                },
                {
                    level: 20,
                    APGained: 1,
                    spells: [spells[39], spells[40]],
                    knownSpells: 14,
                    features: [deusExMachinaFeature]
                }
            ]
        }
    }
);

// Insertar las subclases
db.personasubclasses.insertMany([
    // Subclase: Monologue
    {
        name: 'Monologue',
        description: 'Especialista en acumular poder de hechizos en ataques físicos, enfocado en rendimiento individual.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Acaparador',
                        description: 'Cada vez que lanzas un hechizo de daño, acumulas un dado del daño del hechizo en tu arma. Por los siguientes 3 ataques que impactes, puedes sumar dicho dado al daño realizado. Acumulas hasta 3 dados. El daño es del elemento del hechizo.',
                        useType: 'passive',
                        trigger: 'after_damage_spell_cast',
                        internalCounter: true,
                        counterMax: 3,
                        effects: [
                            {
                                type: 'accumulate_dice',
                                source: 'spell_damage_die',
                                target: 'weapon',
                                maxDice: 3,
                                elementType: 'spell_element'
                            },
                            {
                                type: 'add_damage_to_attack',
                                source: 'accumulated_dice',
                                target: 'weapon_attack',
                                duration: 3,
                                durationType: 'successful_hits'
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
                        name: 'Narcisista',
                        description: 'El crítico aumentado entre hechizos y ataques físicos es equiparado al mayor. Cada hechizo no dañino aumenta 5% crítico de hechizos y ataques por 2 turnos, máximo 10%.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 1,
                                type: 'equalize_crit',
                                description: 'Crítico equiparado al mayor',
                                target: 'self',
                                applyTo: ['spells', 'physical_attacks']
                            },
                            {
                                value: 5,
                                type: 'crit_chance_increase',
                                description: 'Aumenta crítico por hechizo no dañino',
                                target: 'self',
                                trigger: 'after_non_damage_spell',
                                duration: {
                                    type: 'temporal',
                                    duration: 2,
                                    medition: 'turns'
                                },
                                stackable: true,
                                maxStacks: 2,
                                unit: 'percentage'
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
                        name: 'Egoísta',
                        description: 'La acción adicional de "Cambio de Panorama" se puede usar para ofensivos. Ventaja en tiradas de voluntad de "Fantasía Materializada". Cada hechizo lanzado recupera 1 SP.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 1,
                                type: 'remove_restriction',
                                description: 'Acción adicional para ofensivos',
                                target: 'self',
                                applyTo: 'Cambio de Panorama'
                            },
                            {
                                value: 1,
                                type: 'advantage',
                                description: 'Ventaja en Fantasía Materializada',
                                target: 'self',
                                applyTo: 'willpower_rolls_fantasy'
                            }
                        ],
                        effects: [
                            {
                                type: 'recover',
                                recoverType: 'AP',
                                recover: 1,
                                target: 'self',
                                trigger: 'after_spell_cast'
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
                        name: 'Solista',
                        description: 'Aumentas cantidad máxima de dados por "Acaparador" a 5. Como parte de hechizo de daño, lanzas hechizo de acción adicional gratis. Una vez por incursión, recuperas todos tus SP (no podrás restaurar HP/SP resto de incursión).',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 5,
                                type: 'increase_max',
                                description: 'Máximo de dados acumulados',
                                target: 'self',
                                applyTo: 'Acaparador'
                            }
                        ],
                        effects: [
                            {
                                type: 'cast_bonus_action_spell',
                                spellType: 'non_damage',
                                target: 'any',
                                trigger: 'as_part_of_damage_spell',
                                cost: 0
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Recuperación Total de SP',
                                description: 'Recuperas todos tus SP. No podrás restaurar HP o SP durante resto de incursión.',
                                useType: 'active',
                                action: 'action',
                                uses: 1,
                                triggerForRecover: 'at_incursion_end',
                                effects: [
                                    {
                                        type: 'full_restore',
                                        restoreType: 'AP',
                                        target: 'self'
                                    },
                                    {
                                        type: 'status_effect',
                                        statusType: 'no_restoration',
                                        target: 'self',
                                        duration: {
                                            type: 'temporal',
                                            duration: 0,
                                            medition: 'incursion'
                                        }
                                    }
                                ],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Musical
    {
        name: 'Musical',
        description: 'Soporte con habilidades de curación y sintonías que potencian aliados.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Flashmob',
                        description: 'Ganas habilidad de moverte en superficies verticales. Como acción adicional, causas a aliados en radio de 6 casillas una de tres sintonías.',
                        useType: 'active',
                        modifiers: [
                            {
                                value: 1,
                                type: 'wall_walking',
                                description: 'Movimiento en superficies verticales',
                                target: 'self',
                                condition: 'hands_free'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Sintonía de Curación',
                                description: 'Objetivos restauran tu nivel en PV.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [
                                    {
                                        type: 'heal',
                                        healType: 'HP',
                                        heal: '{level}',
                                        target: 'all_allies_in_radius',
                                        radius: 6
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Sintonía de Velocidad',
                                description: 'Objetivos tienen velocidad duplicada hasta inicio de tu siguiente turno.',
                                useType: 'active',
                                action: 'bonus_action',
                                modifiers: [
                                    {
                                        value: 2,
                                        type: 'speed_multiplier',
                                        description: 'Duplica velocidad',
                                        target: 'all_allies_in_radius',
                                        radius: 6,
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        }
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Sintonía de Potencia',
                                description: 'Hechizos lanzados por objetivos tienen +2 daño y causan dos instancias separadas. Daño se duplica a nivel 10 y nuevamente a nivel 20.',
                                useType: 'active',
                                action: 'bonus_action',
                                modifiers: [
                                    {
                                        value: 2,
                                        type: 'spell_damage_buff',
                                        description: 'Aumenta daño de hechizos',
                                        target: 'all_allies_in_radius',
                                        radius: 6,
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        },
                                        scaling: [
                                            { level: 4, value: 2 },
                                            { level: 10, value: 4 },
                                            { level: 20, value: 8 }
                                        ]
                                    },
                                    {
                                        value: 2,
                                        type: 'damage_instances',
                                        description: 'Causa dos instancias de daño',
                                        target: 'buffed_allies',
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        }
                                    }
                                ],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                spells: [
                    {
                        _id: new ObjectId(),
                        name: 'Curación Común I',
                        level: 4,
                        cost: [{ stat: 'AP', value: 2 }],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '2d4 + {spell_casting_modifier}',
                                target: 'single_ally'
                            }
                        ],
                        concentration: false,
                        actionType: 'action',
                        category: 'heal',
                        toList: true,
                        subclass: 'Musical',
                        state: 'ACTIVE'
                    },
                    {
                        _id: new ObjectId(),
                        name: 'Curación Rápida I',
                        level: 4,
                        cost: [{ stat: 'AP', value: 1 }],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '1d4 + {spell_casting_modifier}',
                                target: 'single_ally'
                            }
                        ],
                        concentration: false,
                        actionType: 'bonus_action',
                        category: 'heal',
                        toList: true,
                        subclass: 'Musical',
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Synthwave',
                        description: 'Reacción para empujar enemigo atacante con onda de sonido. Además, puedes duplicar Sintonía de Curación y restaurar SP.',
                        useType: 'active',
                        action: 'reaction',
                        trigger: 'enemy_attack',
                        effects: [
                            {
                                type: 'forced_movement',
                                movementType: 'push',
                                distance: 2,
                                direction: 'away_from_caster',
                                target: 'attacking_enemy',
                                saveType: 'charisma',
                                saveDC: 'spell_save_dc'
                            }
                        ],
                        modifiers: [
                            {
                                value: -1,
                                type: 'disadvantage',
                                description: 'Desventaja en ataques consecuentes',
                                target: 'pushed_enemy',
                                applyTo: 'attacks',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                }
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Duplicar Sintonía de Curación',
                                description: 'Duplicas valor de Sintonía de Curación y restauras mitad de nivel en SP.',
                                useType: 'active',
                                uses: '{charisma_save}',
                                triggerForRecover: 'at_combat_end',
                                modifiers: [
                                    {
                                        value: 2,
                                        type: 'healing_multiplier',
                                        description: 'Duplica curación',
                                        target: 'self',
                                        applyTo: 'Sintonía de Curación'
                                    }
                                ],
                                effects: [
                                    {
                                        type: 'recover',
                                        recoverType: 'AP',
                                        recover: '{level / 2}',
                                        target: 'self'
                                    }
                                ],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                spells: [
                    {
                        _id: new ObjectId(),
                        name: 'Curación Común II',
                        level: 8,
                        cost: [{ stat: 'AP', value: 3 }],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '3d6 + {spell_casting_modifier}',
                                target: 'single_ally'
                            }
                        ],
                        concentration: false,
                        actionType: 'action',
                        category: 'heal',
                        toList: true,
                        subclass: 'Musical',
                        state: 'ACTIVE'
                    },
                    {
                        _id: new ObjectId(),
                        name: 'Curación Rápida II',
                        level: 8,
                        cost: [{ stat: 'AP', value: 2 }],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '2d4 + {spell_casting_modifier}',
                                target: 'single_ally'
                            }
                        ],
                        concentration: false,
                        actionType: 'bonus_action',
                        category: 'heal',
                        toList: true,
                        subclass: 'Musical',
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Blue Soul',
                        description: 'Efectos adicionales para cada sintonía de Flashmob: velocidad→hechizo como acción adicional, curación→limpia efectos negativos, potencia→rompe escudo extra y All-Out Attack. Fantasía exitosa activa dos sintonías.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'cast_action_spell_as_bonus',
                                target: 'one_ally',
                                trigger: 'when_using_speed_synergy'
                            },
                            {
                                type: 'cleanse',
                                cleanseType: 'negative_effects_and_status',
                                target: 'one_ally',
                                trigger: 'when_using_healing_synergy'
                            },
                            {
                                type: 'extra_shield_break',
                                target: 'one_ally',
                                trigger: 'when_using_power_synergy'
                            },
                            {
                                type: 'enable_all_out_attack',
                                target: 'one_ally',
                                condition: 'breaks_all_shields',
                                trigger: 'when_using_power_synergy'
                            },
                            {
                                type: 'activate_two_synergies',
                                target: 'self',
                                trigger: 'after_successful_fantasy',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'uses'
                                }
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                spells: [
                    {
                        _id: new ObjectId(),
                        name: 'Curación Común III',
                        level: 13,
                        cost: [{ stat: 'AP', value: 5 }],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '4d8 + {spell_casting_modifier}',
                                target: 'single_ally'
                            }
                        ],
                        concentration: false,
                        actionType: 'action',
                        category: 'heal',
                        toList: true,
                        subclass: 'Musical',
                        state: 'ACTIVE'
                    },
                    {
                        _id: new ObjectId(),
                        name: 'Curación Rápida III',
                        level: 13,
                        cost: [{ stat: 'AP', value: 3 }],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '3d6 + {spell_casting_modifier}',
                                target: 'single_ally'
                            }
                        ],
                        concentration: false,
                        actionType: 'bonus_action',
                        category: 'heal',
                        toList: true,
                        subclass: 'Musical',
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 18,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Low Fidelity',
                        description: 'Como acción, activas defensa musical en hasta 6 aliados en rango Flashmob. Obtienen 200 HP temporales que decaen 100 por turno. Mientras activo, todos los hechizos se lanzan dos veces. Una vez por incursión.',
                        useType: 'active',
                        action: 'action',
                        uses: 1,
                        triggerForRecover: 'at_incursion_end',
                        effects: [
                            {
                                type: 'temp_hp',
                                heal: 200,
                                target: 'up_to_6_allies',
                                range: 6,
                                decay: {
                                    amount: 100,
                                    timing: 'start_of_caster_turn'
                                }
                            },
                            {
                                type: 'double_cast_spells',
                                target: 'all_allies',
                                duration: {
                                    type: 'temporal',
                                    duration: 0,
                                    medition: 'until_temp_hp_ends'
                                }
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                spells: [
                    {
                        _id: new ObjectId(),
                        name: 'Curación Común IV',
                        level: 18,
                        cost: [{ stat: 'AP', value: 7 }],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '6d10 + {spell_casting_modifier}',
                                target: 'single_ally'
                            }
                        ],
                        concentration: false,
                        actionType: 'action',
                        category: 'heal',
                        toList: true,
                        subclass: 'Musical',
                        state: 'ACTIVE'
                    },
                    {
                        _id: new ObjectId(),
                        name: 'Curación Rápida IV',
                        level: 18,
                        cost: [{ stat: 'AP', value: 5 }],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '4d8 + {spell_casting_modifier}',
                                target: 'single_ally'
                            }
                        ],
                        concentration: false,
                        actionType: 'bonus_action',
                        category: 'heal',
                        toList: true,
                        subclass: 'Musical',
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Theatre
    {
        name: 'Theatre',
        description: 'Controlador de marionetas que reemplazan elementos de utilería y actúan como extensiones del usuario.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Levantar el Telón',
                        description: 'Tus elementos de "Arma de Chéjov" son reemplazados por marionetas. Las marionetas tienen estadísticas propias y turno independiente justo después del tuyo. Puedes conectar tus sentidos usando acción adicional.',
                        useType: 'active',
                        action: 'action',
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Marioneta',
                                description: 'Criatura controlada con estadísticas escalables.',
                                useType: 'summon',
                                stats: {
                                    defense: 10,
                                    magicResistance: 10,
                                    hp: '{level * 2}',
                                    movement: 5,
                                    salvations: {
                                        mental: 'immune',
                                        physical: -4
                                    },
                                    affinities: 'same_as_user',
                                    scaling: [
                                        { level: 10, defense: 12, magicResistance: 12, movement: 6 },
                                        { level: 15, defense: 14, magicResistance: 14 },
                                        { level: 20, defense: 16, magicResistance: 16, movement: 8 }
                                    ]
                                },
                                effects: [
                                    {
                                        type: 'independent_turn',
                                        timing: 'after_caster_turn',
                                        canUse: 'utility_element_ability'
                                    },
                                    {
                                        type: 'share_turn',
                                        condition: 'two_or_more_puppets'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Conectar Sentidos',
                                description: 'Ves, escuchas y/o hablas a través de la marioneta.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [
                                    {
                                        type: 'sensory_connection',
                                        senses: ['sight', 'hearing', 'speech'],
                                        target: 'puppet',
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        }
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
                        name: 'Hilar y Coser',
                        description: 'Puedes usar marionetas como punto de lanzamiento de hechizos y usar su movimiento durante tu turno. Reacción para mover marioneta a cuerpo a cuerpo y convertirla en objetivo de ataque.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 1,
                                type: 'spell_origin_point',
                                description: 'Lanzar desde marioneta',
                                target: 'self',
                                applyTo: 'puppets'
                            },
                            {
                                value: 1,
                                type: 'use_puppet_movement',
                                description: 'Usa movimiento de marioneta en tu turno',
                                target: 'self'
                            }
                        ],
                        effects: [
                            {
                                type: 'move_puppet',
                                distance: 'melee_range',
                                target: 'puppet',
                                action: 'reaction',
                                trigger: 'before_ranged_attack_or_spell'
                            },
                            {
                                type: 'redirect_attack',
                                newTarget: 'puppet',
                                condition: 'moved_during_attack'
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
                        name: 'Atar el Destino',
                        description: 'Puedes atar dos entidades con hilos (máx 24 casillas entre ellas). Duran 1 minuto. Enemigos realizan salvación de destreza. Mientras atados, puedes realizar acciones especiales cada turno.',
                        useType: 'active',
                        effects: [
                            {
                                type: 'create_tether',
                                target: 'two_entities',
                                maxDistance: 24,
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'minutes'
                                },
                                saveType: 'dexterity',
                                saveDC: 'spell_save_dc',
                                condition: 'if_enemy_targeted'
                            },
                            {
                                type: 'prevent_leaving_range',
                                saveType: 'strength',
                                saveDC: 'spell_save_dc',
                                onSuccess: 'break_tether'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Fluctuación de Espíritu',
                                description: 'Robas 1d6 SP a un objetivo y los restauras al otro.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [
                                    {
                                        type: 'steal',
                                        stealType: 'AP',
                                        steal: '1d6',
                                        target: 'one_tethered',
                                        transferTo: 'other_tethered'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Compartir Vitalidad',
                                description: 'Cuando un objetivo es curado, divides curación a la mitad y restauras ambos.',
                                useType: 'active',
                                action: 'reaction',
                                trigger: 'tethered_target_healed',
                                effects: [
                                    {
                                        type: 'split_healing',
                                        divisor: 2,
                                        target: 'both_tethered'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Anclar',
                                description: 'Decides punto de ancla. Puedes reducir distancia entre objetivos en 2 casillas con acción adicional.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [
                                    {
                                        type: 'set_anchor',
                                        target: 'one_tethered'
                                    },
                                    {
                                        type: 'reduce_distance',
                                        distance: 2,
                                        target: 'tethered_pair'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Dividir Dolor',
                                description: 'Cuando un objetivo recibirá daño, divides daño a la mitad y envías al otro objetivo.',
                                useType: 'active',
                                action: 'reaction',
                                trigger: 'tethered_target_receives_damage',
                                effects: [
                                    {
                                        type: 'split_damage',
                                        divisor: 2,
                                        target: 'both_tethered'
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
                        name: 'Maestro Titiritero',
                        description: 'Duplicas cantidad de marionetas (4 activas). Aumentas rango de movimiento de marionetas a 6 casillas. Acción adicional para marcar objetivo: aliados tienen ventaja. Primera vez por combate causa sorpresa (salvación inteligencia) con todos los ataques críticos.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 4,
                                type: 'max_puppets',
                                description: 'Máximo de marionetas activas',
                                target: 'self'
                            },
                            {
                                value: 6,
                                type: 'puppet_move_range',
                                description: 'Rango de movimiento de marionetas',
                                target: 'self'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Marcar Objetivo',
                                description: 'Eliges objetivo a 2 casillas de marioneta. Aliados tienen ventaja contra él. Primera vez por combate puede causar sorpresa.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [
                                    {
                                        type: 'mark_target',
                                        target: 'enemy_near_puppet',
                                        range: 2,
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        }
                                    }
                                ],
                                modifiers: [
                                    {
                                        value: 1,
                                        type: 'advantage',
                                        description: 'Ventaja para aliados',
                                        target: 'all_allies',
                                        applyTo: 'attacks_vs_marked',
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        }
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Sorpresa del Titiritero',
                                description: 'Primera vez por combate que marcas, el objetivo puede ser sorprendido (salvación inteligencia). Sorprendido: todos los golpes son críticos.',
                                useType: 'active',
                                trigger: 'first_mark_per_combat',
                                effects: [
                                    {
                                        type: 'status_effect',
                                        statusType: 'surprised',
                                        target: 'marked_enemy',
                                        saveType: 'knowledge',
                                        saveDC: 'spell_save_dc',
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        }
                                    }
                                ],
                                modifiers: [
                                    {
                                        value: 1,
                                        type: 'auto_crit',
                                        description: 'Todos los golpes son críticos',
                                        target: 'surprised_enemy',
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        }
                                    }
                                ],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    }
]);

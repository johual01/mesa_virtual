const { ObjectId } = require('mongodb');

// Insertar la clase Evocator
const characterClassId = new ObjectId();
db.characterClass.insertOne({
    _id: characterClassId,
    name: 'Evocator',
    HPDice: '1d6',
    salvations: ['intelligence', 'wisdom']
});

// Insertar los hechizos de Evocator
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
        name: 'Armadura Mágica',
        level: 3,
        cost: [{ stat: 'AP', value: 3 }],
        modifiers: [
            {
                value: '{10 + intelligence_save}',
                type: 'set_defense',
                description: 'Establece defensa',
                target: 'self',
                ignoreArmor: true
            },
            {
                value: '{10 + intelligence_save}',
                type: 'set_magic_resistance',
                description: 'Establece resistencia mágica',
                target: 'self'
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'buff',
        toList: true,
        combatOnly: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Todopoderoso I (I)',
        level: 3,
        cost: [{ stat: 'AP', value: 4 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '4d4',
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
        name: 'Ataque Mágico I (A)',
        level: 3,
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
    // Nivel 4
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico I (2AE)',
        level: 4,
        cost: [{ stat: 'AP', value: 3 }],
        effects: [
            {
                type: 'damage',
                damageType: 'second_elemental_affinity',
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
    {
        _id: new ObjectId(),
        name: 'Reflejo Arcano I',
        level: 4,
        cost: [{ stat: 'AP', value: 1 }],
        effects: [
            {
                type: 'cast_spell',
                trigger: 'enemy_attack_roll_1_to_2',
                target: 'any',
                costRequired: true,
                description: 'Lanza hechizo cuando enemigo falla con 1-2'
            }
        ],
        concentration: false,
        actionType: 'reaction',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico II (I)',
        level: 4,
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
    // Nivel 5
    {
        _id: new ObjectId(),
        name: 'Hechizo Inestable',
        level: 5,
        cost: [{ stat: 'AP', value: 2 }],
        modifiers: [
            {
                value: 5,
                type: 'crit_chance_increase',
                description: 'Aumenta crítico',
                target: 'self',
                applyTo: 'next_damage_spell',
                unit: 'percentage',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'spell'
                }
            },
            {
                value: 5,
                type: 'fumble_chance_increase',
                description: 'Aumenta pifia',
                target: 'self',
                applyTo: 'next_damage_spell',
                unit: 'percentage',
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
        name: 'Contrahechizo',
        level: 5,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'counter_spell',
                target: 'casting_enemy',
                autoSuccess: 'spell_cost_5_or_less',
                contestedCheck: {
                    condition: 'spell_cost_6_or_more',
                    checkType: 'spell_casting',
                    dc: '{8 + spell_cost}'
                }
            }
        ],
        concentration: false,
        actionType: 'reaction',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Todopoderoso I (A)',
        level: 5,
        cost: [{ stat: 'AP', value: 6 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '4d4',
                target: 'area'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 6
    {
        _id: new ObjectId(),
        name: 'Hechizo de Negación',
        level: 6,
        cost: [{ stat: 'AP', value: 3 }],
        effects: [
            {
                type: 'status_effect',
                statusType: 'no_restoration',
                target: 'damaged_enemy',
                trigger: 'next_damage_spell_hits',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'turns'
                }
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'debuff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Vigorizar I',
        level: 6,
        cost: [{ stat: 'AP', value: 0 }],
        effects: [
            {
                type: 'recover',
                recoverType: 'AP',
                recover: 1,
                target: 'self',
                trigger: 'end_of_turn',
                diceCheck: {
                    die: '1d8',
                    successValue: 8,
                    autoSuccessAfter: 2
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
        name: 'Hechizo de Eco',
        level: 6,
        cost: [{ stat: 'AP', value: 2 }],
        effects: [
            {
                type: 'damage_echo',
                damageValue: '{spell_damage}',
                target: 'damaged_enemy',
                trigger: 'next_damage_spell',
                timing: 'start_of_next_turn'
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 7
    {
        _id: new ObjectId(),
        name: 'Santuario de Hechicería',
        level: 7,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'create_zone',
                zoneType: 'concentration_advantage',
                radius: 3,
                target: 'area',
                center: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                }
            }
        ],
        modifiers: [
            {
                value: 1,
                type: 'advantage',
                description: 'Ventaja en concentración',
                target: 'self_and_allies_in_zone',
                applyTo: 'concentration_checks'
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
        name: 'Ataque Todopoderoso II (I)',
        level: 7,
        cost: [{ stat: 'AP', value: 6 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '5d6',
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
        name: 'Ataque Mágico II (A)',
        level: 7,
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
    // Nivel 8
    {
        _id: new ObjectId(),
        name: 'Reflejo Arcano II',
        level: 8,
        cost: [{ stat: 'AP', value: 1 }],
        effects: [
            {
                type: 'cast_spell',
                trigger: 'enemy_attack_roll_1_to_3',
                target: 'any',
                costRequired: true,
                description: 'Lanza hechizo cuando enemigo falla con 1-3'
            }
        ],
        concentration: false,
        actionType: 'reaction',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Arma Espiritual',
        level: 8,
        cost: [{ stat: 'AP', value: 7 }],
        modifiers: [
            {
                value: 1,
                type: 'replace_weapon_modifier',
                description: 'Reemplaza bonificador con inteligencia',
                target: 'self',
                applyTo: 'weapon',
                newModifier: 'intelligence'
            },
            {
                value: 1,
                type: 'attack_with_spell',
                description: 'Ataca como parte del hechizo sin restricción de rango',
                target: 'self'
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico II (2AE)',
        level: 8,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'damage',
                damageType: 'second_elemental_affinity',
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
    // Nivel 9
    {
        _id: new ObjectId(),
        name: 'Hechizo de Reducción',
        level: 9,
        cost: [{ stat: 'AP', value: 3 }],
        effects: [
            {
                type: 'reduce_element_resistance',
                reduction: 1,
                target: 'damaged_enemy',
                trigger: 'next_damage_spell_hits'
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'debuff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Todopoderoso II (A)',
        level: 9,
        cost: [{ stat: 'AP', value: 8 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '5d6',
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
        name: 'Ataque Mágico III (I)',
        level: 9,
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
    // Nivel 10 - Potenciaciones Complejas
    {
        _id: new ObjectId(),
        name: 'Potenciación Compleja (F)',
        level: 10,
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
        level: 10,
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
        level: 10,
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
    // Nivel 11
    {
        _id: new ObjectId(),
        name: 'Robo de Hechizo',
        level: 11,
        cost: [{ stat: 'AP', value: 8 }],
        effects: [
            {
                type: 'steal_spell_effects',
                target: 'single_enemy',
                contestedCheck: {
                    checkType: 'spell_casting',
                    vsCheck: 'willpower'
                },
                requiresConcentration: 'per_stolen_concentration_spell'
            }
        ],
        concentration: 'depends',
        actionType: 'action',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Hechizo Pesado',
        level: 11,
        cost: [{ stat: 'AP', value: 5 }],
        modifiers: [
            {
                value: '2d',
                type: 'damage_buff',
                description: 'Aumenta daño',
                target: 'self',
                applyTo: 'next_spell',
                condition: 'speed_zero_no_movement',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'spell'
                }
            },
            {
                value: 5,
                type: 'crit_chance_increase',
                description: 'Aumenta crítico',
                target: 'self',
                applyTo: 'next_spell',
                unit: 'percentage',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'spell'
                }
            }
        ],
        concentration: true,
        actionType: 'bonus_action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Ataque Quintaescencia (I)',
        level: 11,
        cost: [{ stat: 'AP', value: 1 }],
        effects: [
            {
                type: 'damage',
                damageType: 'any_element_chosen',
                damage: '1d6',
                target: 'single_enemy'
            }
        ],
        concentration: false,
        actionType: 'action',
        category: 'attack',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 12
    {
        _id: new ObjectId(),
        name: 'Vigorizar II',
        level: 12,
        cost: [{ stat: 'AP', value: 0 }],
        effects: [
            {
                type: 'recover',
                recoverType: 'AP',
                recover: 2,
                target: 'self',
                trigger: 'end_of_turn',
                diceCheck: {
                    die: '1d6',
                    successValue: 6,
                    partialRecover: 1
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
        name: 'Ataque Todopoderoso III (I)',
        level: 12,
        cost: [{ stat: 'AP', value: 8 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '6d8',
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
        name: 'Ataque Mágico III (A)',
        level: 12,
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
    // Nivel 13
    {
        _id: new ObjectId(),
        name: 'Reflejo Arcano III',
        level: 13,
        cost: [{ stat: 'AP', value: 2 }],
        effects: [
            {
                type: 'cast_spell',
                trigger: 'enemy_attack_roll_1_to_4',
                target: 'any',
                costRequired: true,
                description: 'Lanza hechizo cuando enemigo falla con 1-4'
            }
        ],
        concentration: false,
        actionType: 'reaction',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Hechizo Glorificado',
        level: 13,
        cost: [{ stat: 'AP', value: 4 }],
        modifiers: [
            {
                value: 2,
                type: 'range_multiplier',
                description: 'Duplica alcance',
                target: 'self',
                applyTo: 'next_damage_spell',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'spell'
                }
            },
            {
                value: 2,
                type: 'radius_multiplier',
                description: 'Duplica rango',
                target: 'self',
                applyTo: 'next_damage_spell',
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
        name: 'Ataque Mágico III (2AE)',
        level: 13,
        cost: [{ stat: 'AP', value: 7 }],
        effects: [
            {
                type: 'damage',
                damageType: 'second_elemental_affinity',
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
    // Nivel 14
    {
        _id: new ObjectId(),
        name: 'Hechizo Alterado',
        level: 14,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'add_save_effect',
                saveType: 'element_related',
                target: 'damaged_enemy',
                trigger: 'next_damage_spell_hits'
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'debuff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Potenciación Completa',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos a ti o a un aliado.',
        level: 14,
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
        level: 14,
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
    // Nivel 15
    {
        _id: new ObjectId(),
        name: 'Ataque Todopoderoso III (A)',
        level: 15,
        cost: [{ stat: 'AP', value: 10 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '6d8',
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
        name: 'Hechizo Impactante',
        level: 15,
        cost: [{ stat: 'AP', value: 6 }],
        effects: [
            {
                type: 'status_effect',
                statusType: 'stunned',
                target: 'damaged_enemy',
                trigger: 'next_damage_spell_hits',
                saveType: 'courage',
                saveDC: 'spell_attack'
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'debuff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Desplazamiento Acelerado',
        level: 15,
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
    // Nivel 16
    {
        _id: new ObjectId(),
        name: 'Ataque Todopoderoso IV (I)',
        level: 16,
        cost: [{ stat: 'AP', value: 10 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '7d10',
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
        name: 'Destrucción Mágica',
        level: 16,
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
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico IV (A)',
        level: 16,
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
    // Nivel 17
    {
        _id: new ObjectId(),
        name: 'Ataque Quintaescencia (A)',
        level: 17,
        cost: [{ stat: 'AP', value: 3 }],
        effects: [
            {
                type: 'damage',
                damageType: 'any_element_chosen',
                damage: '1d6',
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
        name: 'Concentración',
        level: 17,
        cost: [{ stat: 'AP', value: 8 }],
        effects: [
            {
                type: 'auto_hit',
                target: 'next_magic_attack',
                description: 'Siguiente ataque impacta automáticamente'
            },
            {
                type: 'auto_crit',
                target: 'next_magic_attack',
                condition: 'if_attack_roll_hits',
                description: 'Si impacta, es crítico'
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
        name: 'Reflejo Arcano IV',
        level: 17,
        cost: [{ stat: 'AP', value: 2 }],
        effects: [
            {
                type: 'cast_spell',
                trigger: 'enemy_attack_roll_1_to_5',
                target: 'any',
                costRequired: true,
                description: 'Lanza hechizo cuando enemigo falla con 1-5'
            }
        ],
        concentration: false,
        actionType: 'reaction',
        category: 'utility',
        toList: true,
        state: 'ACTIVE'
    },
    // Nivel 18
    {
        _id: new ObjectId(),
        name: 'Ataque Mágico IV (2AE)',
        level: 18,
        cost: [{ stat: 'AP', value: 9 }],
        effects: [
            {
                type: 'damage',
                damageType: 'second_elemental_affinity',
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
    {
        _id: new ObjectId(),
        name: 'Ataque Todopoderoso IV (A)',
        level: 18,
        cost: [{ stat: 'AP', value: 12 }],
        effects: [
            {
                type: 'damage',
                damageType: 'almighty',
                damage: '7d10',
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
        name: 'Aceleración Mágica',
        level: 18,
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
    },
    // Nivel 19
    {
        _id: new ObjectId(),
        name: 'Armas Espirituales',
        level: 19,
        cost: [{ stat: 'AP', value: 11 }],
        modifiers: [
            {
                value: 2,
                type: 'replace_weapon_modifier',
                description: 'Reemplaza bonificadores con inteligencia',
                target: 'self',
                applyTo: 'two_weapons',
                newModifier: 'intelligence'
            },
            {
                value: 1,
                type: 'attack_with_spell',
                description: 'Ataca como parte del hechizo sin restricción de rango',
                target: 'self',
                weaponCount: 2
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Hechizo Desequilibrante',
        level: 19,
        cost: [{ stat: 'AP', value: 4 }],
        effects: [
            {
                type: 'reduce_buff_duration',
                reduction: 3,
                target: 'damaged_enemy',
                trigger: 'next_damage_spell_hits'
            },
            {
                type: 'shield_break',
                shieldsToBreak: 2,
                target: 'damaged_enemy',
                trigger: 'next_damage_spell_hits'
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'debuff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Vigorizar III',
        level: 19,
        cost: [{ stat: 'AP', value: 0 }],
        effects: [
            {
                type: 'recover',
                recoverType: 'AP',
                recover: 3,
                target: 'self',
                trigger: 'end_of_turn',
                diceCheck: {
                    die: '1d4',
                    successValue: 4,
                    partialRecover: 1
                }
            }
        ],
        concentration: false,
        actionType: 'passive',
        category: 'passive',
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
        name: 'Inmolación',
        level: 20,
        cost: [{ stat: 'AP', value: 10 }],
        modifiers: [
            {
                value: 1,
                type: 'cast_additional_spell',
                description: 'Lanza hechizo adicional como parte del hechizo',
                target: 'self'
            }
        ],
        effects: [
            {
                type: 'damage',
                damageType: 'self_damage',
                damage: '12d6',
                target: 'self',
                trigger: 'end_of_turn',
                unrecoverable: 'until_incursion_end'
            },
            {
                type: 'prevent_rejoin_combat',
                condition: 'if_downed_by_this',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 0,
                    medition: 'incursion'
                }
            }
        ],
        concentration: true,
        actionType: 'action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    },
    {
        _id: new ObjectId(),
        name: 'Acaparador Mágico',
        level: 20,
        cost: [{ stat: 'AP', value: 5 }],
        effects: [
            {
                type: 'combine_next_spell_buffs',
                target: 'self',
                description: 'Usa todos los hechizos "Tu siguiente hechizo de daño" como parte de esta acción'
            }
        ],
        concentration: false,
        actionType: 'bonus_action',
        category: 'buff',
        toList: true,
        state: 'ACTIVE'
    }
]);

// Características principales de Evocator
const secretosArcanosFeature = {
    featureId: new ObjectId(),
    name: 'Secretos Arcanos',
    description: 'Puedes sobrecargar hechizos consumiendo SP adicional. Escoges secretos arcanos que aumentan según nivel.',
    useType: 'active',
    uses: '{arcane_secrets_table}',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Aceleración de Hechizo',
            description: 'Cambias tiempo de lanzamiento a acción adicional.',
            useType: 'active',
            cost: [{ stat: 'AP', value: 'variable' }],
            costTable: [
                { originalCost: 'less_than_3', additionalCost: 1 },
                { originalCost: '3_to_6', additionalCost: 2 },
                { originalCost: '7_to_9', additionalCost: 4 },
                { originalCost: 'more_than_9', additionalCost: 8 }
            ],
            modifiers: [
                {
                    value: 1,
                    type: 'change_action_type',
                    description: 'Cambia a acción adicional',
                    target: 'spell',
                    newActionType: 'bonus_action'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Eco Arcano',
            description: 'Cuando fallas tirada de ataque de hechizo, puedes gastar coste para volver a tirar.',
            useType: 'active',
            cost: [{ stat: 'AP', value: 'spell_cost' }],
            effects: [
                {
                    type: 'reroll',
                    trigger: 'spell_attack_miss',
                    target: 'd20',
                    mustUseNew: true
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Duplicación de Hechizo',
            description: 'Afectas segundo objetivo con hechizo de objetivo individual.',
            useType: 'active',
            cost: [{ stat: 'AP', value: 'variable' }],
            costTable: [
                { originalCost: 'less_than_3', additionalCost: 1 },
                { originalCost: '3_to_6', additionalCost: 2 },
                { originalCost: '7_to_9', additionalCost: 4 },
                { originalCost: 'more_than_9', additionalCost: 8 }
            ],
            effects: [
                {
                    type: 'additional_target',
                    target: 'second_target',
                    condition: 'single_target_spell'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Prolongación de Hechizo',
            description: 'Duplicas duración de un hechizo.',
            useType: 'active',
            cost: [{ stat: 'AP', value: 'variable' }],
            costTable: [
                { originalCost: 'less_than_3', additionalCost: 1 },
                { originalCost: '3_to_6', additionalCost: 2 },
                { originalCost: '7_to_9', additionalCost: 4 },
                { originalCost: 'more_than_9', additionalCost: 8 }
            ],
            modifiers: [
                {
                    value: 2,
                    type: 'duration_multiplier',
                    description: 'Duplica duración',
                    target: 'spell'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Extensión de Alcance',
            description: 'Duplicas alcance de lanzamiento de hechizo.',
            useType: 'active',
            cost: [{ stat: 'AP', value: 'variable' }],
            costTable: [
                { originalCost: 'less_than_3', additionalCost: 1 },
                { originalCost: '3_to_6', additionalCost: 2 },
                { originalCost: '7_to_9', additionalCost: 4 },
                { originalCost: 'more_than_9', additionalCost: 8 }
            ],
            modifiers: [
                {
                    value: 2,
                    type: 'range_multiplier',
                    description: 'Duplica alcance',
                    target: 'spell'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Sobrecarga Arcana',
            description: 'Aumentas coste a la mitad para aumentar dados de daño a la mitad.',
            useType: 'active',
            cost: [{ stat: 'AP', value: 'half_spell_cost' }],
            modifiers: [
                {
                    value: 0.5,
                    type: 'damage_dice_multiplier',
                    description: 'Aumenta dados de daño',
                    target: 'spell',
                    roundUp: true
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};

const reciclajeDeEspirituFeature = {
    featureId: new ObjectId(),
    name: 'Reciclaje de Espíritu',
    description: 'Al lanzar hechizo de daño después de impactar dos seguidos, recuperas mitad del coste del hechizo actual tras impactarlo (sin costes aumentados).',
    useType: 'passive',
    trigger: 'after_third_consecutive_spell_hit',
    internalCounter: true,
    counterCondition: 'consecutive_hits equals 2',
    effects: [
        {
            type: 'recover',
            recoverType: 'AP',
            recover: '{spell_base_cost / 2}',
            target: 'self',
            trigger: 'after_spell_hit'
        }
    ],
    state: 'ACTIVE'
};

const arteMortalFeature = {
    featureId: new ObjectId(),
    name: 'Arte Mortal',
    description: 'Gastas acción adicional para que siguientes dos hechizos ofensivos ignoren cobertura media/tres cuartos y causen mitad de nivel + 2 de daño adicional. 3 usos por combate (+1 a nivel 14, +1 a nivel 20).',
    useType: 'active',
    action: 'bonus_action',
    uses: 3,
    triggerForRecover: 'at_combat_end',
    modifiers: [
        {
            value: 1,
            type: 'ignore_cover',
            description: 'Ignora cobertura media y tres cuartos',
            target: 'self',
            applyTo: 'next_2_offensive_spells',
            coverTypes: ['medium', 'three_quarters']
        },
        {
            value: '{level / 2 + 2}',
            type: 'damage_buff',
            description: 'Daño adicional',
            target: 'self',
            applyTo: 'next_2_offensive_spells'
        }
    ],
    effects: [
        {
            type: 'extra_use',
            levelRequired: 14,
            uses: 1
        },
        {
            type: 'extra_use',
            levelRequired: 20,
            uses: 1
        }
    ],
    state: 'ACTIVE'
};

const espirituInquebrantableFeature = {
    featureId: new ObjectId(),
    name: 'Espíritu Inquebrantable',
    description: 'Hechizos de daño de tu afinidad causan, como mínimo, la mitad del daño de la tirada.',
    useType: 'passive',
    modifiers: [
        {
            value: 0.5,
            type: 'minimum_damage',
            description: 'Mínimo mitad de daño',
            target: 'self',
            applyTo: 'affinity_damage_spells'
        }
    ],
    state: 'ACTIVE'
};

const potenciaDeHechiceriaFeature = {
    featureId: new ObjectId(),
    name: 'Potencia de Hechicería',
    description: 'Hechizos suman tu salvación de inteligencia al daño. Ventaja en mantener concentración.',
    useType: 'passive',
    modifiers: [
        {
            value: '{intelligence_save}',
            type: 'damage_buff',
            description: 'Suma salvación de inteligencia',
            target: 'self',
            applyTo: 'all_spells'
        },
        {
            value: 1,
            type: 'advantage',
            description: 'Ventaja en concentración',
            target: 'self',
            applyTo: 'concentration_checks'
        }
    ],
    state: 'ACTIVE'
};

const sincronizacionArcanaFeature = {
    featureId: new ObjectId(),
    name: 'Sincronización Arcana',
    description: 'Al impactar crítico, aumentas 5% crítico y 1d8 daño. Pierdes si pasas dos turnos sin crítico. Reinicia duración por cada crítico. Acumula hasta 3 veces.',
    useType: 'passive',
    trigger: 'on_spell_crit',
    internalCounter: true,
    counterMax: 3,
    modifiers: [
        {
            value: 5,
            type: 'crit_chance_increase',
            description: 'Aumenta crítico por stack',
            target: 'self',
            stackable: true,
            maxStacks: 3,
            unit: 'percentage'
        },
        {
            value: '1d8',
            type: 'damage_buff',
            description: 'Daño adicional por stack',
            target: 'self',
            stackable: true,
            maxStacks: 3
        }
    ],
    effects: [
        {
            type: 'reset_counter',
            trigger: 'two_turns_without_crit'
        },
        {
            type: 'refresh_duration',
            trigger: 'on_crit'
        }
    ],
    state: 'ACTIVE'
};

const lanzamientoMinuciosoFeature = {
    featureId: new ObjectId(),
    name: 'Lanzamiento Minucioso',
    description: 'Aumentas crítico de hechizos en 5%. Al realizar crítico, recuperas mitad del coste del hechizo base.',
    useType: 'passive',
    modifiers: [
        {
            value: 5,
            type: 'crit_chance_increase',
            description: 'Aumenta crítico',
            target: 'self',
            applyTo: 'all_spells',
            unit: 'percentage'
        }
    ],
    effects: [
        {
            type: 'recover',
            recoverType: 'AP',
            recover: '{spell_base_cost / 2}',
            target: 'self',
            trigger: 'on_spell_crit'
        }
    ],
    state: 'ACTIVE'
};

const ecoArcanoFeature = {
    featureId: new ObjectId(),
    name: 'Eco Arcano',
    description: 'Cuando lanzas hechizo de daño con tu acción, puedes lanzar segundo hechizo de daño que cueste 3 SP o menos.',
    useType: 'passive',
    trigger: 'after_damage_spell_with_action',
    effects: [
        {
            type: 'cast_additional_spell',
            spellType: 'damage',
            maxCost: 3,
            target: 'any'
        }
    ],
    state: 'ACTIVE'
};

const explosionDeAnimaFeature = {
    featureId: new ObjectId(),
    name: 'Explosión de Ánima',
    description: 'Al impactar ataque mágico, puedes causar daño máximo. Primera vez sin efectos adversos. Segunda vez: 1d12 por SP gastado. Siguientes duplican dados.',
    useType: 'active',
    trigger: 'on_spell_hit',
    internalCounter: true,
    effects: [
        {
            type: 'maximize_damage',
            target: 'spell',
            description: 'Daño máximo en vez de tirada'
        },
        {
            type: 'self_damage',
            damage: '0',
            target: 'self',
            condition: 'first_use_per_incursion'
        },
        {
            type: 'self_damage',
            damage: '{1d12 * spell_cost}',
            target: 'self',
            condition: 'second_use_per_incursion'
        },
        {
            type: 'self_damage',
            damage: '{previous_dice * 2}',
            target: 'self',
            condition: 'subsequent_uses'
        }
    ],
    state: 'ACTIVE'
};

const maestriaDeHechizosFeature = {
    featureId: new ObjectId(),
    name: 'Maestría de Hechizos',
    description: 'Reduces coste de hechizos de 5 SP o menos en 2 SP. Aumentas daño de hechizos de 6 SP o más en 2 dados.',
    useType: 'passive',
    modifiers: [
        {
            value: -2,
            type: 'cost_reduction',
            description: 'Reduce coste',
            target: 'self',
            applyTo: 'spells_cost_5_or_less'
        },
        {
            value: '2d',
            type: 'damage_buff',
            description: 'Aumenta daño',
            target: 'self',
            applyTo: 'spells_cost_6_or_more'
        }
    ],
    state: 'ACTIVE'
};

const especialistaFeature = {
    featureId: new ObjectId(),
    name: 'Especialista',
    description: 'Eliges 3 hechizos (≤3 SP, 4-7 SP, ≥8 SP) que no ocupan espacio en listado. Cada uno recibe beneficios únicos.',
    useType: 'passive',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Hechizo Menor Especializado',
            description: 'Coste 3 o menor: coste reducido a cero o lanzado como acción adicional.',
            useType: 'passive',
            modifiers: [
                {
                    value: 0,
                    type: 'set_cost',
                    description: 'Coste cero o acción adicional',
                    target: 'chosen_spell_3_or_less'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Hechizo Medio Especializado',
            description: 'Coste 4-7: recibe beneficio de Secreto Arcano gratis.',
            useType: 'passive',
            modifiers: [
                {
                    value: 1,
                    type: 'free_arcane_secret',
                    description: 'Secreto Arcano sin coste',
                    target: 'chosen_spell_4_to_7'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Hechizo Mayor Especializado',
            description: 'Coste 8+: una vez por incursión, lanzar sin SP o impactar como crítico automático.',
            useType: 'active',
            uses: 1,
            triggerForRecover: 'at_incursion_end',
            effects: [
                {
                    type: 'free_cast_or_auto_crit',
                    target: 'chosen_spell_8_or_more',
                    options: ['no_cost', 'auto_crit']
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
                    APGained: 5,
                    spells: [spells[0]],
                    knownSpells: 6,
                    features: []
                },
                {
                    level: 2,
                    APGained: 2,
                    spells: [spells[1], spells[2], spells[3]],
                    knownSpells: 6,
                    features: [secretosArcanosFeature]
                },
                {
                    level: 3,
                    APGained: 2,
                    spells: [spells[4], spells[5], spells[6]],
                    knownSpells: 6,
                    features: [reciclajeDeEspirituFeature]
                },
                {
                    level: 4,
                    APGained: 2,
                    spells: [spells[7], spells[8], spells[9]],
                    knownSpells: 8,
                    features: []
                },
                {
                    level: 5,
                    APGained: 2,
                    spells: [spells[10], spells[11], spells[12]],
                    knownSpells: 8,
                    features: []
                },
                {
                    level: 6,
                    APGained: 2,
                    spells: [spells[13], spells[14], spells[15]],
                    knownSpells: 8,
                    features: [arteMortalFeature]
                },
                {
                    level: 7,
                    APGained: 2,
                    spells: [spells[16], spells[17], spells[18]],
                    knownSpells: 8,
                    features: [espirituInquebrantableFeature]
                },
                {
                    level: 8,
                    APGained: 2,
                    spells: [spells[19], spells[20], spells[21]],
                    knownSpells: 10,
                    features: []
                },
                {
                    level: 9,
                    APGained: 2,
                    spells: [spells[22], spells[23], spells[24]],
                    knownSpells: 10,
                    features: []
                },
                {
                    level: 10,
                    APGained: 2,
                    spells: [spells[25], spells[26], spells[27]],
                    knownSpells: 10,
                    features: [potenciaDeHechiceriaFeature]
                },
                {
                    level: 11,
                    APGained: 2,
                    spells: [spells[28], spells[29], spells[30]],
                    knownSpells: 10,
                    features: [sincronizacionArcanaFeature]
                },
                {
                    level: 12,
                    APGained: 2,
                    spells: [spells[31], spells[32], spells[33]],
                    knownSpells: 14,
                    features: [lanzamientoMinuciosoFeature]
                },
                {
                    level: 13,
                    APGained: 2,
                    spells: [spells[34], spells[35], spells[36]],
                    knownSpells: 14,
                    features: []
                },
                {
                    level: 14,
                    APGained: 2,
                    spells: [spells[37], spells[38], spells[39]],
                    knownSpells: 14,
                    features: []
                },
                {
                    level: 15,
                    APGained: 2,
                    spells: [spells[40], spells[41], spells[42]],
                    knownSpells: 14,
                    features: [ecoArcanoFeature]
                },
                {
                    level: 16,
                    APGained: 2,
                    spells: [spells[43], spells[44], spells[45]],
                    knownSpells: 16,
                    features: [explosionDeAnimaFeature]
                },
                {
                    level: 17,
                    APGained: 2,
                    spells: [spells[46], spells[47], spells[48]],
                    knownSpells: 16,
                    features: [maestriaDeHechizosFeature]
                },
                {
                    level: 18,
                    APGained: 2,
                    spells: [spells[49], spells[50], spells[51]],
                    knownSpells: 16,
                    features: []
                },
                {
                    level: 19,
                    APGained: 2,
                    spells: [spells[52], spells[53], spells[54]],
                    knownSpells: 16,
                    features: []
                },
                {
                    level: 20,
                    APGained: 2,
                    spells: [spells[55], spells[56], spells[57]],
                    knownSpells: 20,
                    features: [especialistaFeature]
                }
            ]
        }
    }
);

// Insertar las subclases
db.subclass.insertMany([
    // Subclase: Control
    {
        name: 'Control',
        description: 'Especialista en control de campo y debilitación de enemigos mediante regulación espiritual.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Regulación Espiritual',
                        description: 'Con acción adicional, te estableces como punto de regulación por 1 minuto. Infliges daño de afinidad igual a nivel a enemigos que inicien/terminen turno en radio de 3 casillas (1× por ronda). 3 turnos consecutivos → debilitado (+2 dados daño mágico). 3 usos por incursión.',
                        useType: 'active',
                        action: 'bonus_action',
                        uses: 3,
                        triggerForRecover: 'at_incursion_end',
                        effects: [
                            {
                                type: 'create_aura',
                                auraType: 'damage_on_entry_exit',
                                radius: 3,
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'minutes'
                                }
                            },
                            {
                                type: 'damage',
                                damageType: 'elemental_affinity',
                                damage: '{level}',
                                target: 'enemies_in_aura',
                                trigger: 'start_or_end_turn',
                                maxPerRound: 1
                            },
                            {
                                type: 'status_effect',
                                statusType: 'weakened',
                                target: 'enemy',
                                condition: '3_consecutive_turns_damaged',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                }
                            }
                        ],
                        modifiers: [
                            {
                                value: '2d',
                                type: 'damage_buff',
                                description: 'Enemigos debilitados reciben daño adicional',
                                target: 'weakened_enemies',
                                applyTo: 'magic_attacks'
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
                        name: 'Disminución de Ánima',
                        description: 'Al infligir daño con hechizo, reduces velocidad máxima enemiga en 1 por 3 turnos. Acumula hasta 6 veces. Velocidad 0 → debilitado. Además, ganas Secreto Arcano "Afección Profunda".',
                        useType: 'passive',
                        trigger: 'after_spell_damage',
                        effects: [
                            {
                                type: 'reduce_speed',
                                reduction: 1,
                                target: 'damaged_enemy',
                                duration: {
                                    type: 'temporal',
                                    duration: 3,
                                    medition: 'turns'
                                },
                                maxStacks: 6
                            },
                            {
                                type: 'status_effect',
                                statusType: 'weakened',
                                target: 'enemy',
                                condition: 'speed_reduced_to_zero',
                                duration: {
                                    type: 'temporal',
                                    duration: 0,
                                    medition: 'while_speed_zero'
                                }
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Afección Profunda',
                                description: 'Al impactar hechizo, estableces mitad de tu lanzamiento como DC de estado alterado del elemento.',
                                useType: 'active',
                                trigger: 'on_spell_hit',
                                effects: [
                                    {
                                        type: 'status_effect',
                                        statusType: 'element_related',
                                        target: 'damaged_enemy',
                                        saveDC: '{spell_casting_roll / 2}'
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
                level: 13,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Destrucción de Fuerzas',
                        description: 'Al impactar hechizo de daño, enemigos afectados tiran salvación de coraje (DC = mitad lanzamiento). Fallo → pierden reacciones. Hechizo individual: siempre reduce velocidad a la mitad, fallo adicional → velocidad 0.',
                        useType: 'passive',
                        trigger: 'after_damage_spell_hit',
                        effects: [
                            {
                                type: 'save_or_lose_reactions',
                                saveType: 'courage',
                                saveDC: '{spell_casting_roll / 2}',
                                target: 'all_affected_enemies'
                            },
                            {
                                type: 'reduce_speed',
                                reduction: 0.5,
                                target: 'damaged_enemy',
                                condition: 'single_target_spell'
                            },
                            {
                                type: 'reduce_speed_to_zero',
                                target: 'damaged_enemy',
                                condition: 'single_target_spell_and_failed_save'
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
                        name: 'Dominio Espiritual',
                        description: 'Cuando HP reducen a cero, restauras nivel + bonificador inteligencia en HP. Cada enemigo recibe mismo daño y queda debilitado 3 turnos. Si en Regulación Espiritual, duplicas cantidades y efecto acaba. 1× por combate. Además, enemigos debilitados: +1 dado daño, +1 escudo roto, +5% crítico.',
                        useType: 'passive',
                        trigger: 'hp_reduced_to_zero',
                        uses: 1,
                        triggerForRecover: 'at_combat_end',
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '{level + intelligence_modifier}',
                                target: 'self'
                            },
                            {
                                type: 'damage',
                                damageType: 'elemental_affinity',
                                damage: '{level + intelligence_modifier}',
                                target: 'all_enemies'
                            },
                            {
                                type: 'status_effect',
                                statusType: 'weakened',
                                target: 'all_enemies',
                                duration: {
                                    type: 'temporal',
                                    duration: 3,
                                    medition: 'turns'
                                }
                            },
                            {
                                type: 'double_values',
                                condition: 'in_regulacion_espiritual'
                            },
                            {
                                type: 'end_effect',
                                effectName: 'Regulación Espiritual',
                                condition: 'in_regulacion_espiritual',
                                timing: 'immediately'
                            }
                        ],
                        modifiers: [
                            {
                                value: '1d',
                                type: 'damage_buff',
                                description: 'Daño adicional a debilitados',
                                target: 'weakened_enemies',
                                applyTo: 'all_attacks'
                            },
                            {
                                value: 1,
                                type: 'extra_shield_break',
                                description: 'Escudo extra roto',
                                target: 'weakened_enemies'
                            },
                            {
                                value: 5,
                                type: 'crit_chance_increase',
                                description: 'Crítico aumentado vs debilitados',
                                target: 'weakened_enemies',
                                unit: 'percentage'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Destruction
    {
        name: 'Destruction',
        description: 'Máximo poder destructivo, ignora resistencias/inmunidades y potencia críticos.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Lanzador Experimentado',
                        description: 'Cuando enemigo provoca ataque de oportunidad, puedes lanzar hechizo de daño individual en su lugar. Sumas bonificador inteligencia a iniciativa.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: '{intelligence_modifier}',
                                type: 'initiative_buff',
                                description: 'Suma inteligencia a iniciativa',
                                target: 'self'
                            }
                        ],
                        effects: [
                            {
                                type: 'replace_opportunity_attack',
                                replacement: 'single_target_damage_spell',
                                target: 'provoking_enemy',
                                action: 'reaction'
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
                        name: 'Potencia Bruta',
                        description: 'Antes de lanzar ataque mágico: penalización -5 a tirada de ataque para +10 al daño si impacta. Ignoras resistencias. Ganas Secreto Arcano "Hechizo Triturador".',
                        useType: 'active',
                        trigger: 'before_magic_attack',
                        modifiers: [
                            {
                                value: -5,
                                type: 'attack_penalty',
                                description: 'Penalización a ataque',
                                target: 'self',
                                applyTo: 'magic_attack',
                                optional: true
                            },
                            {
                                value: 10,
                                type: 'damage_buff',
                                description: 'Bonificación a daño',
                                target: 'self',
                                condition: 'spell_hits',
                                appliesWhen: 'attack_penalty_taken'
                            },
                            {
                                value: 1,
                                type: 'ignore_resistance',
                                description: 'Ignora resistencias',
                                target: 'self',
                                applyTo: 'all_spells'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Hechizo Triturador',
                                description: 'Antes de lanzar: aumentas crítico en 10% a cambio de aumentar pifia en 5%.',
                                useType: 'active',
                                trigger: 'before_spell_cast',
                                modifiers: [
                                    {
                                        value: 10,
                                        type: 'crit_chance_increase',
                                        description: 'Aumenta crítico',
                                        target: 'self',
                                        applyTo: 'spell',
                                        unit: 'percentage'
                                    },
                                    {
                                        value: 5,
                                        type: 'fumble_chance_increase',
                                        description: 'Aumenta pifia',
                                        target: 'self',
                                        applyTo: 'spell',
                                        unit: 'percentage'
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
                level: 13,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Poder Sobrecogedor',
                        description: 'Puedes aumentar hasta 5 dados el daño del siguiente hechizo, recibiendo esa cantidad como daño residual. Inicias combate con Sincronización Arcana activa (+1 turno duración). Reacción: consume SP para reducir daño enemigo (5 por SP).',
                        useType: 'active',
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Sobrecarga de Poder',
                                description: 'Aumenta hasta 5 dados de daño, recibes misma cantidad como daño residual.',
                                useType: 'active',
                                modifiers: [
                                    {
                                        value: '1d-5d',
                                        type: 'damage_buff',
                                        description: 'Aumenta daño',
                                        target: 'next_spell',
                                        maxDice: 5
                                    }
                                ],
                                effects: [
                                    {
                                        type: 'self_damage',
                                        damage: '{dice_added}',
                                        target: 'self',
                                        trigger: 'after_spell_cast'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId(),
                                name: 'Reducción Mágica',
                                description: 'Consume SP para reducir daño recibido de hechizo enemigo (5 por SP).',
                                useType: 'active',
                                action: 'reaction',
                                trigger: 'before_receive_spell_damage',
                                effects: [
                                    {
                                        type: 'reduce_damage',
                                        reduction: '{5 * AP_consumed}',
                                        target: 'self'
                                    }
                                ],
                                state: 'ACTIVE'
                            }
                        ],
                        modifiers: [
                            {
                                value: 1,
                                type: 'start_with_effect',
                                description: 'Inicia con Sincronización Arcana',
                                target: 'self',
                                effectName: 'Sincronización Arcana',
                                trigger: 'combat_start'
                            },
                            {
                                value: 1,
                                type: 'duration_increase',
                                description: 'Aumenta duración',
                                target: 'self',
                                applyTo: 'Sincronización Arcana',
                                increase: 1,
                                unit: 'turns'
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
                        name: 'Sobrecarga Arcana',
                        description: 'Ignoras inmunidades y absorciones en hechizos de daño. Aumentas límite Sincronización Arcana a 5. Hechizos individuales causan daño en radio 3 del objetivo. Reacción tras enemigo recibe crítico: lanza hechizo de daño coste ≤5.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 1,
                                type: 'ignore_immunity_absorption',
                                description: 'Ignora inmunidades y absorciones',
                                target: 'self',
                                applyTo: 'damage_spells'
                            },
                            {
                                value: 5,
                                type: 'increase_max_stacks',
                                description: 'Aumenta límite',
                                target: 'self',
                                applyTo: 'Sincronización Arcana'
                            },
                            {
                                value: 3,
                                type: 'add_aoe',
                                description: 'Hechizos individuales causan AoE',
                                target: 'self',
                                applyTo: 'single_target_spells',
                                radius: 3
                            }
                        ],
                        effects: [
                            {
                                type: 'cast_spell_on_crit',
                                spellType: 'damage',
                                maxCost: 5,
                                target: 'any',
                                trigger: 'enemy_receives_crit',
                                action: 'reaction'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Quintessence
    {
        name: 'Quintessence',
        description: 'Dominio elemental, descubre y explota debilidades elementales para destruir escudos.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Cambio Elemental',
                        description: 'Descubrir debilidad elemental de enemigo reintegra mitad del coste del hechizo. Ganas Secreto Arcano "Ajuste Elemental".',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'refund_ap_on_weakness_discovery',
                                amount: 'half_spell_cost',
                                target: 'self',
                                trigger: 'weakness_discovered'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Ajuste Elemental',
                                description: 'Cambias elemento de hechizo ya lanzado sin costes adicionales.',
                                useType: 'active',
                                trigger: 'after_spell_cast',
                                effects: [
                                    {
                                        type: 'change_element',
                                        target: 'cast_spell',
                                        cost: 0
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
                        name: 'Ajuste de Precisión',
                        description: 'Impactar debilidad elemental recupera 2 SP y rompe 1 escudo adicional. Puedes lanzar hechizo de daño ≤3 SP como bonificación.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'ap_recovery_on_weakness_hit',
                                amount: 2,
                                target: 'self',
                                trigger: 'weakness_hit'
                            },
                            {
                                type: 'break_extra_shield',
                                amount: 1,
                                target: 'enemy',
                                trigger: 'weakness_hit'
                            },
                            {
                                type: 'cast_bonus_spell',
                                spellType: 'damage',
                                maxCost: 3,
                                target: 'any',
                                trigger: 'weakness_hit',
                                action: 'bonus'
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
                        name: 'Conocimiento Total',
                        description: 'Todos elementos descubiertos reintegran mitad SP. Ajuste Elemental también afecta Todopoderoso. Cualquier impacto rompe 1 escudo.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'refund_ap_on_any_element_discovered',
                                amount: 'half_spell_cost',
                                target: 'self',
                                trigger: 'any_element_discovered'
                            },
                            {
                                type: 'expand_feature_to_spell',
                                featureName: 'Ajuste Elemental',
                                spellName: 'Todopoderoso',
                                target: 'self'
                            },
                            {
                                type: 'break_shield_on_hit',
                                amount: 1,
                                target: 'enemy',
                                trigger: 'any_hit'
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
                        name: 'Destructor de Esencia',
                        description: 'Hechizos con Ataque a Mansalva cuestan cuarto del SP total. Tus impactos reducen escudo máximo en 1. Enemigo con 0 escudo máximo muere.',
                        useType: 'passive',
                        modifiers: [
                            {
                                value: 0.25,
                                type: 'ap_cost_multiplier',
                                description: 'Reduce coste a cuarto',
                                target: 'self',
                                applyTo: 'spells_with_all_out_attack',
                                unit: 'multiplier'
                            }
                        ],
                        effects: [
                            {
                                type: 'reduce_max_shield',
                                amount: 1,
                                target: 'enemy',
                                trigger: 'on_hit'
                            },
                            {
                                type: 'instant_death',
                                target: 'enemy',
                                trigger: 'max_shield_reaches_zero',
                                condition: 'max_shield == 0'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
]);

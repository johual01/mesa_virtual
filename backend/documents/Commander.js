const { ObjectId } = require('mongodb');

const characterClass = await db.personaclasses.insertOne({
    name: 'Commander',
    description: 'Líder táctico que potencia a sus aliados y coordina el campo de batalla',
    HPDice: '1d8',
    salvations: ['dexterity', 'knowledge'],
    resourceType: 'Morale Points',
    levels: []
})

const characterClassId = characterClass.insertedId;

const listSpells = await db.spells.insertMany([
    // Nivel 1
    {
        name: 'Ataque Físico I (I)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '2d4',
                range: {
                    type: 'ranged',
                    range: 6
                },
                target: 'enemy',
                bonus: 0
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 2 - Potenciaciones Básicas
    {
        name: 'Potenciación Básica (F)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +2 a todo daño infligido por 3 turnos a ti o a un aliado.',
        concentration: false,
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
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 3
    {
        name: 'Bendecir',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumentas 1d4 en las tiradas de daño, ataque y salvaciones a ti o a un aliado. Dura 10 rondas.',
        concentration: true,
        modifiers: [
            {
                value: '1d4',
                type: 'dices',
                addTo: 'damageRollModifiers',
                description: 'Aumenta 1d4 en las tiradas de daño',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 10,
                    medition: 'rounds'
                },
                etiquette: 'bless'
            },
            {
                value: '1d4',
                type: 'dices',
                addTo: 'attackRollModifiers',
                description: 'Aumenta 1d4 en las tiradas de ataque',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 10,
                    medition: 'rounds'
                },
                etiquette: 'bless'
            },
            {
                value: '1d4',
                type: 'all_saving_throws',
                addTo: 'savingThrowsModifiers',
                description: 'Aumenta 1d4 en las tiradas de salvación',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 10,
                    medition: 'rounds'
                },
                etiquette: 'bless'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 4
    {
        name: 'Ataque Físico I (A)',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad física del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '2d4',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                target: 'enemies_at_range',
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Básica',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras tus puntos de vida en la mitad de tu nivel en d6.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '{half_level}d6',
                target: 'self',
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 5
    {
        name: 'Ataque Físico II (I)',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '3d6',
                range: {
                    type: 'ranged',
                    range: 6
                },
                target: 'enemy',
                bonus: 0
            }
        ],
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
        effects: [
            {
                type: 'heal',
                healType: 'status_effect',
                target: 'ally',
                description: 'Cura todos los estados alterados'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 6
    {
        name: 'Escudo de Espíritu',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'shield',
        description: 'Asignas tu nivel multiplicado por 3 en PV temporales a ti o a un aliado.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'temp_hp',
                heal: '{level * 3}',
                target: 'ally',
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Desmantelar',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'debuff',
        description: 'Tu siguiente ataque otorgará -2 a la defensa y -1 a la resistencia mágica al enemigo impactado por dos turnos. Acción adicional.',
        concentration: false,
        modifiers: [
            {
                value: -2,
                type: 'defense',
                description: 'Reduce en -2 la defensa',
                target: 'enemy',
                trigger: 'next_attack',
                duration: {
                    type: 'temporal',
                    duration: 2,
                    medition: 'rounds'
                },
                etiquette: 'dismantle'
            },
            {
                value: -1,
                type: 'magic_defense',
                description: 'Reduce en -1 la resistencia mágica',
                target: 'enemy',
                trigger: 'next_attack',
                duration: {
                    type: 'temporal',
                    duration: 2,
                    medition: 'rounds'
                },
                etiquette: 'dismantle'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 7
    {
        name: 'Amplificador',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Extiendes los bonificadores de un aliado por 3 turnos adicionales.',
        concentration: false,
        effects: [
            {
                type: 'extend_buffs',
                target: 'ally',
                value: 3,
                description: 'Extiende los bonificadores por 3 turnos adicionales'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 8
    {
        name: 'Ataque Físico II (A)',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad física del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '3d6',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                target: 'enemies_at_range',
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Regenerar I',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'heal',
        description: 'Al final de cada turno, restauras 1d8 PV. Aumenta a 2d4 a nivel 13 y 2d6 a nivel 17. No se acumula con otros Regenerar.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '1d8',
                target: 'self',
                trigger: 'at_turn_end',
                etiquette: 'regenerate',
                levelCondition: 8
            },
            {
                type: 'heal',
                healType: 'HP',
                heal: '2d4',
                target: 'self',
                trigger: 'at_turn_end',
                etiquette: 'regenerate',
                levelCondition: 13
            },
            {
                type: 'heal',
                healType: 'HP',
                heal: '2d6',
                target: 'self',
                trigger: 'at_turn_end',
                etiquette: 'regenerate',
                levelCondition: 17
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 9
    {
        name: 'Vigorizar I',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'utility',
        description: 'Al final de cada turno, lanzas 1d8. Si es 8, recuperas 1 AP. Si fallas dos Vigorizar consecutivos, la siguiente tirada será un éxito automático. No acumulable con otros efectos de Vigorizar.',
        concentration: false,
        internalCounter: true,
        counterCondition: 'rolls not equals 8',
        effects: [
            {
                type: 'recover_resource',
                resource: 'AP',
                value: 1,
                target: 'self',
                trigger: 'at_turn_end',
                condition: 'internalCounter reached 2',
                etiquette: 'invigorate'
            },
            {
                type: 'recover_resource',
                resource: 'AP',
                value: 1,
                target: 'self',
                trigger: 'at_turn_end',
                condition: 'rolls equals 8',
                etiquette: 'invigorate',
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Barrera Física',
        cost: [{ amount: 2, resource: 'AP' }],
        alternativeCost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        action: 'action',
        alternativeAction: 'bonus_action',
        useType: 'active',
        category: 'shield',
        description: 'Previenes el siguiente daño físico a ti o a un aliado. Consume 2 AP adicionales si se desea lanzar con acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'barrier',
                barrierType: 'physical',
                target: 'ally',
                uses: 1,
                description: 'Previene el siguiente daño físico'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Barrera Mágica',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        alternativeAction: 'bonus_action',
        category: 'shield',
        description: 'Previenes el siguiente daño mágico a ti o a un aliado. Consume 2 AP adicionales si se desea lanzar con acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'barrier',
                barrierType: 'magical',
                target: 'ally',
                uses: 1,
                description: 'Previene el siguiente daño mágico'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 10
    {
        name: 'Ataque Físico III (I)',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '4d8',
                range: {
                    type: 'ranged',
                    range: 6
                },
                target: 'enemy',
                bonus: 0
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Rebelión',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Incrementa ratio de crítico en 5% (19-20) en ataques a ti y a todos los aliados durante 3 turnos.',
        concentration: false,
        modifiers: [
            {
                value: 5,
                type: 'critical',
                description: 'Incrementa ratio de crítico en 5% (19-20)',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'rebellion'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 11 - Potenciaciones Complejas
    {
        name: 'Potenciación Compleja (F)',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a ti o a un aliado.',
        concentration: false,
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
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (P)',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 el ataque por 3 turnos a ti o a un aliado.',
        concentration: false,
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
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (D)',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 la defensa y +2 a la resistencia mágica a ti o a un aliado.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'defense',
                description: 'Aumenta en +3 la defensa',
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
                value: 2,
                type: 'magic_defense',
                description: 'Aumenta en +2 la resistencia mágica',
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
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 12
    {
        name: 'Barrera Total',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        action: 'action',
        alternativeAction: 'bonus_action',
        useType: 'active',
        category: 'shield',
        description: 'Previenes el siguiente daño a ti o a un aliado. Consume 2 AP adicionales si se desea lanzar con acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'barrier',
                barrierType: 'almighty',
                target: 'ally',
                uses: 1,
                description: 'Previene el siguiente daño'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 13
    {
        name: 'Ataque Físico III (A)',
        cost: [{ amount: 8, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad física del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '4d8',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                target: 'enemies_at_range',
            }
        ],
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
            {
                type: 'break_concentration',
                target: 'enemy',
                description: 'Rompe la concentración del enemigo'
            },
            {
                type: 'remove_buffs',
                target: 'enemy',
                description: 'Remueve las potenciaciones del enemigo'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 14
    {
        name: 'Amplificación Total',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Extiendes los bonificadores de todos los aliados por 3 turnos adicionales (incluido tú mismo).',
        concentration: false,
        effects: [
            {
                type: 'extend_buffs',
                target: 'all_allies',
                value: 3,
                description: 'Extiende los bonificadores de todos los aliados por 3 turnos adicionales'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Devolución',
        system: 'PERSONAD20',
        useType: 'passive',
        category: 'counter',
        description: 'Si la tirada de un ataque físico de un enemigo contra ti es 1-5, puedes realizar un ataque con arma de forma gratuita interrumpiendo dicho ataque.',
        concentration: false,
        effects: [
            {
                type: 'attack_with_weapon',
                target: 'enemy',
                trigger: 'before_receive_attack',
                condition: 'attack is between 1 and 5',
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 15
    {
        name: 'Potenciación Completa',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos a ti o a un aliado.',
        concentration: false,
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
                etiquette: 'empowerment_complete'
            },
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta en +5 el daño infligido',
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
                description: 'Aumenta en +3 la Defensa',
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
                description: 'Aumenta en +2 la Resistencia Mágica',
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
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Ataque Físico IV (I)',
        cost: [{ amount: 8, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '6d10',
                range: {
                    type: 'ranged',
                    range: 6
                },
                target: 'enemy',
                bonus: 0
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 16
    {
        name: 'Avance Valiente',
        cost: [{ amount: 10, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Incrementa ratio de crítico en 10% (18-20) en ataques a ti y a todos los aliados durante 3 turnos.',
        concentration: false,
        modifiers: [
            {
                value: 10,
                type: 'critical_chance',
                description: 'Incrementa ratio de crítico en 10% (18-20)',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'brave_advance'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Regenerar II',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'heal',
        description: 'Al final de cada turno, restauras 4d4 PV. Aumenta a 4d6 a nivel 17. No se acumula con otros Regenerar.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '4d4',
                target: 'self',
                trigger: 'at_turn_end',
                etiquette: 'regenerate',
                levelCondition: 16
            },
            {
                type: 'heal',
                healType: 'HP',
                heal: '4d6',
                target: 'self',
                trigger: 'at_turn_end',
                etiquette: 'regenerate',
                levelCondition: 17
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 17
    {
        name: 'Ataque Físico IV (A)',
        cost: [{ amount: 10, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad física del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '6d10',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                target: 'enemies_at_range',
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Explosión Mágica',
        cost: [{ amount: 9, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'En un radio de 4 casillas contigo como centro, realizas un ataque mágico de tu afinidad elemental. Aumenta el daño de tu arma en 1d6 de daño de tu afinidad durante 3 turnos.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '5d8',
                range: {
                    type: 'area',
                    range: 4,
                    shape: 'circle'
                },
                target: 'enemies_at_range',
            }
        ],
        modifiers: [
            {
                value: '1d6',
                type: 'weapon_damage',
                description: 'Aumenta el daño de tu arma en 1d6',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'magic_explosion'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 18
    {
        name: 'Carga',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'El siguiente golpe físico impactará. Si la tirada de ataque es exitosa, será un crítico.',
        concentration: false,
        effects: [
            {
                type: 'attack',
                target: 'enemy',
                trigger: 'next_physical_attack',
                condition: 'attack is successful',
                modification: 'critical',
                etiquette: 'charge'
            },
            {
                type: 'attack',
                target: 'enemy',
                trigger: 'next_physical_attack',
                condition: 'attack is failed',
                modification: 'hit',
                etiquette: 'charge'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Grito de Guerra',
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Otorgas a ti y a tus aliados +5 al daño infligido y aumentas en 5% su porcentaje de crítico en ataques y reduces en -3 la Defensa y -2 a la Resistencia Mágica a los enemigos por tres turnos.',
        concentration: false,
        modifiers: [
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta en +5 el daño infligido',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'war_cry'
            },
            {
                value: 5,
                type: 'critical_chance',
                description: 'Aumenta en 5% el porcentaje de crítico',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'war_cry'
            },
            {
                value: -3,
                type: 'defense',
                description: 'Reduce en -3 la Defensa',
                target: 'all_enemies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'war_cry'
            },
            {
                value: -2,
                type: 'magic_defense',
                description: 'Reduce en -2 la Resistencia Mágica',
                target: 'all_enemies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'war_cry'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 19
    {
        name: 'Vigorizar II',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'utility',
        description: 'Al final de cada turno, lanzas 1d6. Si es 6, recuperas 2 AP. Si no, recuperas 1 AP. No acumulable con otros efectos de Vigorizar.',
        concentration: false,
        effects: [
            {
                type: 'recover_resource',
                resource: 'AP',
                value: 2,
                target: 'self',
                trigger: 'at_turn_end',
                condition: 'rolls equals 6',
                etiquette: 'invigorate'
            },
            {
                type: 'recover_resource',
                resource: 'AP',
                value: 1,
                target: 'self',
                trigger: 'at_turn_end',
                condition: 'rolls not equals 6',
                etiquette: 'invigorate'
            }
        ],
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
        description: 'Rompes la concentración de todos los enemigos y remueves sus potenciaciones, además de remover debilitadores aliados.',
        concentration: false,
        effects: [
            {
                type: 'break_concentration',
                target: 'all_enemies',
                description: 'Rompe la concentración de todos los enemigos'
            },
            {
                type: 'remove_buffs',
                target: 'all_enemies',
                description: 'Remueve las potenciaciones de todos los enemigos'
            },
            {
                type: 'remove_debuffs',
                target: 'all_allies',
                description: 'Remueve los debilitadores de todos los aliados'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 20
    {
        name: 'Espíritu de Batalla',
        cost: [{ amount: 12, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Mandas al enemigo a la última posición del listado de iniciativa y tus aliados obtienen +5 a todo daño por el resto del combate.',
        concentration: false,
        effects: [
            {
                type: 'change_initiative',
                target: 'enemy',
                value: 'last',
                description: 'Manda al enemigo a la última posición del listado de iniciativa'
            }
        ],
        modifiers: [
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta en +5 el daño',
                target: 'all_allies',
                permanent: true,
                etiquette: 'battle_spirit'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Maestro en Armas',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'utility',
        description: 'Disminuyes el coste de tus hechizos de daño a la mitad. Puedes decidir no reducirlos a cambio de aumentar dos dados adicionales la tirada de daño.',
        concentration: false,
        effects: [
            {
                type: 'spell_cost_reduction',
                spellCategory: 'attack',
                reduction: 0.5,
                target: 'self',
                etiquette: 'weapon_master',
                condition: 'selection'
            },
            {
                type: 'damage',
                spellCategory: 'attack',
                dice: 2,
                target: 'self',
                etiquette: 'weapon_master',
                condition: 'selection'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    }
])

const spells = listSpells.insertedIds;

const subclass = await db.personasubclasses.insertMany([
    {
        name: 'Leader',
        description: 'Especialista en potenciar y renovar a los aliados en combate',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c15'),
                        name: 'Espíritu Combatiente',
                        description: 'Todos los aliados que se encuentre en un radio de 2 casillas alrededor tuyo tendrán un bonificador al daño igual a tu competencia. Cada vez que los aliados realicen un crítico o eliminen a un enemigo, puedes lanzar un hechizo de efecto que lo tenga como objetivo sin pagar el coste como reacción.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'damage',
                                value: '{proficiency}',
                                description: 'Aumenta el daño de aliados cercanos',
                                target: 'allies_at_range',
                                range: {
                                    type: 'area',
                                    range: 2,
                                    shape: 'circle'
                                },
                                permanent: true,
                                etiquette: 'fighting_spirit'
                            }
                        ],
                        effects: [
                            {
                                type: 'cast_spell',
                                target: 'ally',
                                trigger: ['at_ally_critical', 'at_enemy_death'],
                                action: 'reaction',
                                spellCategory: 'effect',
                                reduction: 1,
                                description: 'Lanza un hechizo de efecto sin coste como reacción'
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
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c16'),
                        name: 'Explotar Debilidad',
                        description: 'El efecto de redada aplicará a todos los ataques que realicen los aliados sin importar la distancia a la que estén del enemigo siempre que tú estés en el rango requerido. Además, como reacción cuando ves que un escudo se rompe puedes romper uno adicional.',
                        useType: 'passive',
                        action: 'reaction',
                        effects: [
                            {
                                type: 'replace_effect',
                                target: 'all_allies',
                                description: 'Redada aplica a todos los aliados sin importar la distancia',
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c04'),
                                effects: [
                                    {
                                        type: 'buff',
                                        target: 'all_allies',
                                        trigger: 'at_ally_attack',
                                        condition: 'enemy in your weapon range and you have melee weapon',
                                        modifiers: [
                                            {
                                                type: 'attack',
                                                description: 'Ventaja al atacar enemigos en tu rango con arma cuerpo a cuerpo',
                                                value: 'advantage',
                                                addTo: 'attackModifiers',
                                                etiquette: 'raid_melee_attack'
                                            }
                                        ],
                                        description: 'Los aliados tienen ventaja al atacar enemigos en tu rango con arma cuerpo a cuerpo'
                                    }
                                ]
                            },
                            {
                                type: 'break_shield',
                                target: 'enemy',
                                trigger: 'at_break_shield',
                                action: 'reaction',
                                value: 1,
                                description: 'Rompe un escudo adicional como reacción'
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
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c17'),
                        name: 'Renovar Espíritu',
                        description: 'Cada vez que causas el efecto de "Despertar Espíritu", limpias al objetivo de todos sus efectos negativos además de tomar como objetivo a un aliado adicional para su beneficio.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'remove_debuffs',
                                target: 'ally',
                                trigger: 'at_trigger',
                                triggerActivatedFor: new ObjectId('6f8f4b3b3f1d9a001f2b3c08'),
                                description: 'Limpia efectos negativos al usar Despertar Espíritu'
                            },
                            {
                                type: 'additional_target',
                                target: 'ally',
                                trigger: 'at_trigger',
                                triggerActivatedFor: new ObjectId('6f8f4b3b3f1d9a001f2b3c08'),
                                value: 1,
                                description: 'Afecta a un aliado adicional con Despertar Espíritu'
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
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c18'),
                        name: 'Ampliar Potencia',
                        description: 'Mientras estés en combate, todos los hechizos de potenciación que lances sumarán sus efectos y renovarán la duración al acumularse, hasta un máximo de tres veces.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'stack_buffs',
                                target: 'all_allies',
                                maxStacks: 3,
                                condition: 'spell was cast by you',
                                description: 'Los hechizos de potenciación se acumulan y renuevan duración'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    {
        name: 'Convoy',
        description: 'Protector especializado en reacciones y ataques de oportunidad',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c19'),
                        name: 'Desvío',
                        description: 'Cuando ves un ataque que realiza un enemigo a distancia cuerpo a cuerpo de ti, puedes utilizar tu reacción para realizar una tirada de ataque. Si el ataque impacta, el daño que causarías con tu arma reducirá el daño del ataque del enemigo. Las cantidades sobrantes, tanto tuyas como las del enemigo, se aplicarán como daño correspondiente.',
                        useType: 'active',
                        action: 'reaction',
                        trigger: 'at_enemy_attack_at_range',
                        effects: [
                            {
                                type: 'attack_with_weapon',
                                target: 'enemy',
                                description: 'Realiza un ataque que reduce el daño enemigo'
                            },
                            {
                                type: 'reduce_damage',
                                target: 'enemy',
                                value: '{weapon_damage}',
                                description: 'Reduce el daño del ataque enemigo por el daño de tu arma'
                            },
                            {
                                type: 'damage',
                                target: 'enemy',
                                condition: 'if attack impacts',
                                value: '({weapon_damage} - {enemy_attack_damage} < 0) ? 0 : ({weapon_damage} - {enemy_attack_damage})',
                                description: 'Reduce el daño de tu ataque por el daño del ataque enemigo'
                            },
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c1a'),
                        name: 'Ojo Avizor',
                        description: 'Adquieres una reacción adicional. Si impactas a un enemigo con un ataque de oportunidad, su velocidad desciende a 0 durante el resto del turno. Podrás hacer ataques de oportunidad incluso contra aquellos enemigos que realicen una acción de Destrabarse antes de salir de tu alcance.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'reaction',
                                value: 1,
                                description: 'Obtienes una reacción adicional',
                                addTo: 'reactionModifiers',
                                target: 'self',
                                permanent: true
                            }
                        ],
                        effects: [
                            {
                                type: 'debuff',
                                target: 'enemy',
                                trigger: 'at_impact_opportunity_attack',
                                addTo: 'speedModifiers',
                                value: 'set_to_0',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'rounds'
                                },
                                description: 'Reduce la velocidad del enemigo a 0 al impactar ataque de oportunidad'
                            },
                            {
                                type: 'opportunity_attack',
                                target: 'enemy',
                                trigger: 'at_enemy_disengage_action',
                                description: 'Puedes hacer ataques de oportunidad contra enemigos que se destraben'
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
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c1b'),
                        name: 'Resguardo Avanzado',
                        description: 'Duplicas la cantidad máxima de usos de Resguardo Defensivo. Además, cuando un enemigo falla un ataque contra el objetivo al que tiene activo el efecto de "Resguardo Defensivo" puedes realizar un ataque de oportunidad como parte de dicho ataque. Tendrás ventaja en dicho ataque.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'modify_feature_uses',
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c05'),
                                multiplier: 2,
                                description: 'Duplica los usos de Resguardo Defensivo'
                            },
                            {
                                type: 'opportunity_attack',
                                target: 'enemy',
                                trigger: 'at_enemy_failed_attack',
                                condition: 'target has defensive_guard',
                                advantage: true,
                                description: 'Ataque de oportunidad con ventaja cuando fallan contra aliado protegido'
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
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c1c'),
                        name: 'Resquebrajar',
                        description: 'Todos los enemigos que reciban un ataque de oportunidad de tu parte perderán un escudo al impactar, tendrá desventaja en toda salvación que le requieran y un multiataque por 2 turnos.',
                        useType: 'passive',
                        trigger: 'at_impact_opportunity_attack',
                        effects: [
                            {
                                type: 'break_shield',
                                target: 'enemy',
                                value: 1,
                                description: 'Rompe un escudo al impactar ataque de oportunidad'
                            },
                            {
                                type: 'debuff',
                                target: 'enemy',
                                addTo: 'savingThrowModifiers',
                                modifiers: [
                                    {
                                        type: 'all_saving_throws',
                                        value: 'disadvantage',
                                        description: 'Desventaja en todas las tiradas de salvación',
                                        target: 'self',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        }
                                    }
                                ],
                                description: 'El enemigo tiene desventaja en salvaciones'
                            },
                            {
                                type: 'attack_with_weapon',
                                target: 'enemy',
                                trigger: 'at_attack',
                                value: -1,
                                duration: {
                                    type: 'temporal',
                                    duration: 2,
                                    medition: 'rounds'
                                },
                                description: 'Reduce un multiataque del enemigo'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    {
        name: 'Pacifier',
        description: 'Combatiente reactivo especializado en debilitaciones y contraataques',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c1d'),
                        name: 'Karma',
                        description: 'Obtienes una reacción adicional. Además, cada vez que te realizan un ataque, puedes realizar un ataque de oportunidad como reacción. Tienes ventaja en todos los ataques que realices fuera de tu turno.',
                        modifiers: [
                            {
                                type: 'reaction',
                                value: 1,
                                description: 'Obtienes una reacción adicional',
                                addTo: 'reactionModifiers',
                                target: 'self',
                                permanent: true
                            },
                            {
                                type: 'attack',
                                value: 'advantage',
                                condition: 'is not your turn',
                                description: 'Tienes ventaja en ataques fuera de tu turno',
                                addTo: 'attackModifiers',
                                target: 'self',
                                permanent: true
                            }
                        ],
                        effects: [
                            {
                                type: 'opportunity_attack',
                                target: 'enemy',
                                trigger: 'at_receive_attack',
                                advantage: true,
                                description: 'Realiza un ataque de oportunidad al recibir un ataque'
                            },
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c1e'),
                        name: 'Deflexión',
                        description: 'Cada vez que realizas un efecto negativo en un enemigo, obtienes un bonificador de daño igual a tu competencia hasta el final de tu siguiente turno. Los ataques que fallen en tu contra no te causarán ningún tipo de daño y te darán ventaja en ataques contra el enemigo que realizó el ataque hasta el final de tu siguiente turno.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'damage',
                                value: '{proficiency}',
                                description: 'Aumenta el daño al aplicar efecto negativo',
                                target: 'self',
                                trigger: 'at_apply_negative_effect',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'rounds'
                                },
                                etiquette: 'deflection'
                            }
                        ],
                        effects: [
                            {
                                type: 'reduce_damage',
                                target: 'self',
                                multiplier: 0,
                                trigger: 'at_enemy_failed_receive_attack',
                                description: 'Los ataques fallidos no causan daño'
                            },
                            {
                                type: 'buff',
                                target: 'self',
                                trigger: 'at_enemy_failed_receive_attack',
                                modifiers: [
                                    {
                                        type: 'attack',
                                        value: 'advantage',
                                        description: 'Ventaja al atacar al enemigo que falló',
                                        target: 'self',
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'rounds'
                                        },
                                        condition: 'against trigger target',
                                        triggeredBy: '{enemy_id}'
                                    }
                                ],
                                description: 'Tienes ventaja contra el enemigo que falló'
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
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c1f'),
                        name: 'Fluidez',
                        description: 'Cuando impactas un ataque, una vez por turno, obtienes un bonificador a tu defensa y resistencia mágica igual a la mitad de tu competencia redondeada hacia abajo hasta el inicio de tu siguiente turno. Además, tus hechizos que tengan como objetivo a un enemigo tendrán el coste reducido a la mitad durante el transcurso de tus ataques.',
                        useType: 'passive',
                        trigger: 'at_attack',
                        modifiers: [
                            {
                                type: 'defense',
                                value: 'floor({proficiency / 2})',
                                description: 'Aumenta la defensa',
                                target: 'self',
                                trigger: 'at_attack',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'rounds'
                                },
                                etiquette: 'fluidity'
                            },
                            {
                                type: 'magic_defense',
                                value: 'floor({proficiency / 2})',
                                description: 'Aumenta la resistencia mágica',
                                target: 'self',
                                trigger: 'at_attack',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'rounds'
                                },
                                etiquette: 'fluidity'
                            }
                        ],
                        effects: [
                            {
                                type: 'spell_cost_reduction',
                                target: 'self',
                                condition: 'spell targets enemy and during your attacks',
                                reduction: 0.5,
                                description: 'Reduce el coste de hechizos contra enemigos a la mitad'
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
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c20'),
                        name: 'Asura',
                        description: 'Una vez en tu turno, cuando lanzas un hechizo como parte de tu ataque puedes lanzar un hechizo de daño. Además, obtienes una reacción adicional y todas tus armas tienen un dado adicional de daño y un bonificador igual a la cantidad máxima de dados del arma como daño adicional.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'reaction',
                                value: 1,
                                description: 'Obtienes una reacción adicional',
                                addTo: 'reactionModifiers',
                                target: 'self',
                                permanent: true
                            },
                            {
                                type: 'damage',
                                value: '1d{max_die_size} + {count_dice}',
                                description: 'Todas tus armas tienen un dado adicional y un bonificador igual a la cantidad máxima de dados del arma como daño adicional',
                                target: 'self',
                                condition: 'is a weapon attack',
                                permanent: true,
                                etiquette: 'asura'
                            },
                        ],
                        effects: [
                            {
                                type: 'cast_spell',
                                target: 'enemy',
                                spellCategory: 'attack',
                                trigger: 'at_spell_cast_during_attack',
                                uses: 1,
                                triggerForRecover: 'at_turn_start',
                                description: 'Puedes lanzar un hechizo de daño como parte de tu ataque'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ],
        additionalSpells: 2
    }
])

const pacifierSubclassId = subclass.insertedIds[2];

// Hechizos adicionales para Pacifier
const pacifierAdditionalSpells = await db.spells.insertMany([
    // Nivel 4 - Debilitaciones Básicas
    {
        name: 'Debilitación Básica (F)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -2 a todo daño infligido por 3 turnos a un enemigo.',
        concentration: false,
        modifiers: [
            {
                value: -2,
                type: 'damage',
                description: 'Reduce en -2 a todo daño infligido',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_damage'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Básica (P)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -2 el ataque por 3 turnos a un enemigo.',
        concentration: false,
        modifiers: [
            {
                value: -2,
                type: 'attack',
                description: 'Reduce en -2 el ataque',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_attack'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Básica (D)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -2 a la defensa y -1 a la resistencia mágica a un enemigo.',
        concentration: false,
        modifiers: [
            {
                value: -2,
                type: 'defense',
                description: 'Reduce en -2 la defensa',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_defense'
            },
            {
                value: -1,
                type: 'magic_defense',
                description: 'Reduce en -1 la resistencia mágica',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_defense'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    // Nivel 8
    {
        name: 'Zona de Restricción',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'utility',
        description: 'Estableces una zona de 2 casillas de radio en el mapa. Nadie podrá entrar de esta zona por 3 turnos. Los individuos que se encuentren en dicha área saldrán por el lado más próximo del punto de inicio.',
        concentration: true,
        effects: [
            {
                type: 'create_zone',
                zoneType: 'restriction',
                range: {
                    type: 'area',
                    range: 2,
                    shape: 'circle'
                },
                target: 'all',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                description: 'Nadie puede entrar en la zona, los que están dentro son expulsados'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Desviar Hechizo',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        action: 'reaction',
        category: 'counter',
        description: 'Intentas interrumpir el lanzamiento de hechizo de una criatura como reacción. Si el hechizo cuesta 3 AP o menos, el lanzamiento de hechizos falla. Si el coste es 3 AP o mayor, requerirá una tirada de ataque por tu parte. La dificultad a superar será 12 más la cantidad de AP gastado. Si tienes éxito, el lanzamiento falla y su hechizo no tiene efecto. Aplicarás el daño de tu arma en el enemigo si logras el fallo de su hechizo.',
        concentration: false,
        effects: [
            {
                type: 'counterspell',
                target: 'enemy',
                trigger: 'at_enemy_spell_cast',
                condition: 'target spell cost <=3',
                description: 'El hechizo falla automáticamente si cuesta 3 AP o menos'
            },
            {
                type: 'counterspell',
                target: 'enemy',
                trigger: 'at_enemy_spell_cast',
                condition: 'target spell cost >3',
                cd: '12 + {spell_cost}',
                description: 'Requiere tirada de ataque vs CD 12 + coste del hechizo'
            },
            {
                type: 'damage',
                target: 'enemy',
                condition: 'counterspell success',
                value: '{weapon_damage}',
                description: 'Aplica daño de arma si el hechizo falla'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Estado Alterado (A)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Causas un estado alterado de tu afinidad a los enemigos con dificultad igual a 10 + salvación de carisma.',
        concentration: false,
        requireSalvation: true,
        cd: '10 + {charisma_save}',
        effects: [
            {
                type: 'status_effect',
                statusType: '{elemental_affinity_equivalent_to_status}',
                target: 'enemies_at_range',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                salvation: '{statusType_save}',
                description: 'Aplica estado alterado de tu afinidad'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    // Nivel 13 - Debilitaciones Complejas
    {
        name: 'Debilitación Compleja (F)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -5 a todo daño infligido por 3 turnos a un enemigo.',
        concentration: false,
        modifiers: [
            {
                value: -5,
                type: 'damage',
                description: 'Reduce en -5 a todo daño infligido',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_damage_complex'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Compleja (P)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -4 el ataque por 3 turnos a un enemigo.',
        concentration: false,
        modifiers: [
            {
                value: -4,
                type: 'attack',
                description: 'Reduce en -4 el ataque',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_attack_complex'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Compleja (D)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -3 a la defensa y -2 a la resistencia mágica a un enemigo.',
        concentration: false,
        modifiers: [
            {
                value: -3,
                type: 'defense',
                description: 'Reduce en -3 la defensa',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_defense_complex'
            },
            {
                value: -2,
                type: 'magic_defense',
                description: 'Reduce en -2 la resistencia mágica',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_defense_complex'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    // Nivel 18 - Debilitaciones Totales
    {
        name: 'Debilitación Total (F)',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -5 a todo daño infligido por 3 turnos a todos los enemigos.',
        concentration: false,
        modifiers: [
            {
                value: -5,
                type: 'damage',
                description: 'Reduce en -5 a todo daño infligido',
                target: 'all_enemies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_damage_total'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Total (P)',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -4 el ataque por 3 turnos a todos los enemigos.',
        concentration: false,
        modifiers: [
            {
                value: -4,
                type: 'attack',
                description: 'Reduce en -4 el ataque',
                target: 'all_enemies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_attack_total'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Total (D)',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: pacifierSubclassId,
        useType: 'active',
        category: 'debuff',
        description: 'Reduce en -3 a la defensa y -2 a la resistencia mágica a todos los enemigos.',
        concentration: false,
        modifiers: [
            {
                value: -3,
                type: 'defense',
                description: 'Reduce en -3 la defensa',
                target: 'all_enemies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_defense_total'
            },
            {
                value: -2,
                type: 'magic_defense',
                description: 'Reduce en -2 la resistencia mágica',
                target: 'all_enemies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'debilitation_defense_total'
            }
        ],
        toList: 'additional',
        state: 'ACTIVE'
    }
])

const subclasses = subclass.insertedIds;

// Ahora actualizamos la clase con los niveles completos
await db.personaclasses.updateOne(
    { _id: characterClassId },
    { $set: {
        levels: [
            {
                level: 1,
                proficency: 2,
                spells: [spells[0]],
                features: [],
                APGained: 5,
                knownSpells: 4,
            },
            {
                level: 2,
                proficency: 2,
                spells: [spells[1], spells[2], spells[3]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c03'),
                        name: 'Orden de Mando',
                        description: 'Cuando impactas un ataque con arma, puedes lanzar un hechizo como parte de dicha acción que no te tenga como objetivo. No puedes lanzar hechizos de daño directo con este efecto.',
                        useType: 'passive',
                        trigger: 'at_attack',
                        effects: [
                            {
                                type: 'cast_spell',
                                target: 'ally',
                                trigger: 'at_attack',
                                condition: 'attack is with weapon and spell is not damage spell and spell target is not self',
                                description: 'Lanza un hechizo como parte del ataque con arma'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 1,
                knownSpells: 4,
            },
            {
                level: 3,
                proficency: 2,
                spells: [spells[4]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c04'),
                        name: 'Redada',
                        description: 'Todos los aliados que ataquen cuerpo a cuerpo a un enemigo que está en tu rango de ataque tendrán ventaja al atacar. Este efecto no aplica cuando tienes armas a distancia.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'buff',
                                target: 'all_allies',
                                trigger: 'at_ally_attack',
                                condition: 'ally is using melee weapon and enemy in your weapon range and you have melee weapon',
                                modifiers: [
                                    {
                                        type: 'attack',
                                        description: 'Ventaja al atacar enemigos en tu rango con arma cuerpo a cuerpo',
                                        value: 'advantage',
                                        addTo: 'attackModifiers',
                                        etiquette: 'raid_melee_attack'
                                    }
                                ],
                                description: 'Los aliados tienen ventaja al atacar enemigos en tu rango con arma cuerpo a cuerpo'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 1,
                knownSpells: 4,
            },
            {
                level: 4,
                proficency: 2,
                spells: [spells[5], spells[6]],
                features: [],
                APGained: 2,
                knownSpells: 6,
                selectSubclass: true,
                gainSubclassFeature: true
            },
            {
                level: 5,
                proficency: 3,
                spells: [spells[7], spells[8]],
                gainStatIncrease: true,
                APGained: 1,
                knownSpells: 6,
            },
            {
                level: 6,
                proficency: 3,
                spells: [spells[9], spells[10]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c05'),
                        name: 'Resguardo Defensivo',
                        description: 'Obtienes una reacción adicional. Como reacción cuando un ataque se dirija a un aliado, aumentas su Defensa y Resistencia Mágica hasta el final del turno actual en una cantidad igual a tu competencia. Puedes usar este rasgo 3 veces por combate.',
                        useType: 'active',
                        action: 'reaction',
                        trigger: 'before_ally_receive_attack',
                        usesPerLevel: [
                            { minLevel: 6, maxLevel: 9, uses: 3 },
                            { minLevel: 10, maxLevel: 14, uses: 4 },
                            { minLevel: 15, maxLevel: 19, uses: 5 },
                            { minLevel: 20, maxLevel: 20, uses: 6 }
                        ],
                        triggerForRecover: 'at_combat_end',
                        modifiers: [
                            {
                                type: 'reaction',
                                value: 1,
                                description: 'Obtienes una reacción adicional',
                                addTo: 'reactionModifiers',
                                target: 'self',
                                permanent: true
                            },
                            {
                                type: 'defense',
                                value: '{proficiency}',
                                description: 'Aumenta la defensa del aliado',
                                target: 'ally',
                                trigger: 'before_ally_receive_attack',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                },
                                etiquette: 'defensive_shelter'
                            },
                            {
                                type: 'magic_defense',
                                value: '{proficiency}',
                                description: 'Aumenta la resistencia mágica del aliado',
                                target: 'ally',
                                trigger: 'before_ally_receive_attack',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                },
                                etiquette: 'defensive_shelter'
                            }
                        ],
                        effects: [],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 1,
                knownSpells: 6,
            },
            {
                level: 7,
                proficency: 3,
                spells: [spells[11]],
                features: [
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4a'),
                        name: 'Multi Ataque I',
                        description: 'Puedes realizar un ataque adicional con arma como parte de un ataque con arma o hechizo.',
                        useType: 'passive',
                        action: 'free_action',
                        effects: [
                            {
                                type: 'attack_with_weapon',
                                target: 'enemy',
                                description: 'Realiza un ataque adicional con arma como parte de un ataque con arma o hechizo.',
                                trigger: 'at_attack'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 1,
                knownSpells: 6,
            },
            {
                level: 8,
                proficency: 3,
                spells: [spells[12], spells[13]],
                features: [],
                APGained: 2,
                knownSpells: 7,
                gainSubclassFeature: true
            },
            {
                level: 9,
                proficency: 4,
                spells: [spells[14], spells[15], spells[16]],
                gainStatIncrease: true,
                APGained: 1,
                knownSpells: 7,
            },
            {
                level: 10,
                proficency: 4,
                spells: [spells[17], spells[18]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c07'),
                        name: 'Maestría Armamentística',
                        description: 'Obtienes una casilla adicional de rango con todas las armas a cuerpo a cuerpo, o tres casillas más en el caso de armas a distancia. Puedes reducir en uno la cantidad de dados de daño del arma por el resto del turno al impactar para realizar un ataque adicional que no suma bonificador en el daño como parte de un ataque. Puedes realizar esta acción en cada multiataque.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'range',
                                value: 1,
                                description: 'Aumenta el rango de armas cuerpo a cuerpo',
                                addTo: 'meleeWeaponRangeModifiers',
                                target: 'self',
                                permanent: true
                            },
                            {
                                type: 'range',
                                value: 3,
                                description: 'Aumenta el rango de armas a distancia',
                                addTo: 'rangedWeaponRangeModifiers',
                                target: 'self',
                                permanent: true
                            }
                        ],
                        effects: [
                            {
                                type: 'attack_with_weapon',
                                target: 'enemy',
                                trigger: 'at_attack',
                                condition: 'selection',
                                etiquette: 'weapon_mastery_attack',
                                modifiers: [
                                    {
                                        type: 'damage',
                                        dice: -1,
                                        description: 'Reduce un dado de daño',
                                        target: 'self',
                                        duration: {
                                            type: 'temporal',
                                            duration: 1,
                                            medition: 'turns'
                                        }
                                    },
                                    {
                                        type: 'damage',
                                        value: 0,
                                        description: 'Ataque adicional sin bonificador',
                                        target: 'self',
                                        forEtiquette: 'weapon_mastery_attack',
                                        setValue: true
                                    }
                                ],
                                description: 'Reduce un dado de daño para obtener un ataque adicional sin bonificador'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 1,
                knownSpells: 7,
            },
            {
                level: 11,
                proficency: 4,
                spells: [spells[19], spells[20], spells[21]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c08'),
                        name: 'Despertar Espíritu',
                        description: 'Cada vez que impactas un ataque, puedes utilizar un punto de ánimo (PA) para activar un Estímulo en un aliado. Cada vez que impactas un crítico a un enemigo o lo matas recuperas 1 PA. La acumulación de Estímulos extenderá su duración con cada acumulación, hasta un máximo de 6 rondas.',
                        useType: 'active',
                        trigger: 'at_attack',
                        cost: [{ amount: 1, resource: 'Morale Points' }],
                        resource: 'Morale Points',
                        effects: [
                            {
                                type: 'recover_resource',
                                resource: 'Morale Points',
                                value: 1,
                                target: 'self',
                                trigger: ['at_critical_attack', 'at_enemy_death'],
                                description: 'Recupera 1 PA al hacer crítico o matar enemigo'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c09'),
                                name: 'Estímulo: Aceleración',
                                description: 'Aumentas a un aliado su velocidad en 2 y, si así lo desea, una posición más arriba en el listado de iniciativa por 2 turnos.',
                                useType: 'active',
                                modifiers: [
                                    {
                                        type: 'buff',
                                        value: 2,
                                        description: 'Aumenta la velocidad',
                                        target: 'ally',
                                        addTo: 'speedModifiers',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        etiquette: 'stimulus_acceleration'
                                    }
                                ],
                                effects: [
                                    {
                                        type: 'change_initiative',
                                        target: 'ally',
                                        value: 1,
                                        condition: 'selection',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        description: 'Aumenta una posición en iniciativa'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c0a'),
                                name: 'Estímulo: Precisión',
                                description: 'Aumentas a un aliado en un 5% de crítico por 2 turnos.',
                                useType: 'active',
                                modifiers: [
                                    {
                                        type: 'buff',
                                        value: 0.05,
                                        description: 'Aumenta el ratio de crítico',
                                        target: 'ally',
                                        addTo: 'criticalModifiers',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        etiquette: 'stimulus_precision'
                                    }
                                ],
                                effects: [],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c0b'),
                                name: 'Estímulo: Brutalidad',
                                description: 'Le proporcionas a un aliado la habilidad de romper un escudo adicional y recuperar tu competencia en AP y el triple de tu competencia en PV temporales cuando rompe un escudo por 2 turnos.',
                                useType: 'active',
                                effects: [
                                    {
                                        type: 'break_shield',
                                        target: 'ally',
                                        value: 1,
                                        trigger: 'at_break_shield',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        description: 'Rompe un escudo adicional'
                                    },
                                    {
                                        type: 'recover_resource',
                                        resource: 'AP',
                                        value: '{proficiency}',
                                        target: 'ally',
                                        trigger: 'at_break_shield',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        description: 'Recupera AP al romper escudo'
                                    },
                                    {
                                        type: 'heal',
                                        healType: 'temp_hp',
                                        heal: '{proficiency * 3}',
                                        target: 'ally',
                                        trigger: 'at_break_shield',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        description: 'Obtiene PV temporales al romper escudo'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c0c'),
                                name: 'Estímulo: Refugio',
                                description: 'Le otorgas a un aliado resistencia a un elemento y le otorgas dos escudos adicionales por 2 turnos.',
                                useType: 'active',
                                modifiers: [
                                    {
                                        type: 'resistance',
                                        value: '{elemental_affinity}',
                                        description: 'Resistencia a un elemento',
                                        target: 'ally',
                                        condition: 'selection',
                                        options: '{elemental_affinities}',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        etiquette: 'stimulus_refuge'
                                    }
                                ],
                                effects: [
                                    {
                                        type: 'buff',
                                        target: 'ally',
                                        addTo: 'shieldModifiers',
                                        value: 2,
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        description: 'Otorga dos escudos adicionales'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c0d'),
                                name: 'Estímulo: Protección',
                                description: 'Le otorgas a un aliado el cuádruple de tu competencia en PV temporales. Este Estímulo se acumulará sobre sí mismo sumando los PV temporales.',
                                useType: 'active',
                                effects: [
                                    {
                                        type: 'heal',
                                        healType: 'accumulative_temp_hp',
                                        heal: '{proficiency * 4}',
                                        target: 'ally',
                                        etiquette: 'stimulus_protection',
                                        description: 'Otorga PV temporales acumulables'
                                    }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c0e'),
                                name: 'Estímulo: Debilitación',
                                description: 'Le otorgas a un aliado un +3 a su Salvación Mágica y a todas sus tiradas de salvación por 2 turnos.',
                                useType: 'active',
                                modifiers: [
                                    {
                                        type: 'magic_defense',
                                        value: 3,
                                        description: 'Aumenta la resistencia a salvaciones mágicas',
                                        target: 'ally',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        etiquette: 'stimulus_debilitation'
                                    },
                                    {
                                        type: 'all_saving_throws',
                                        value: 3,
                                        description: 'Aumenta todas las tiradas de salvación',
                                        target: 'ally',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        etiquette: 'stimulus_debilitation'
                                    }
                                ],
                                effects: [],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c0f'),
                                name: 'Estímulo: Estilo',
                                description: 'Aumentas en 1 el rango de ataque cuerpo a cuerpo y en 2 el rango de ataques a distancias a un aliado por dos turnos.',
                                useType: 'active',
                                modifiers: [
                                    {
                                        type: 'range',
                                        value: 1,
                                        description: 'Aumenta el rango de armas cuerpo a cuerpo',
                                        addTo: 'meleeWeaponRangeModifiers',
                                        target: 'ally',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        etiquette: 'stimulus_style'
                                    },
                                    {
                                        type: 'range',
                                        value: 2,
                                        description: 'Aumenta el rango de armas a distancia',
                                        addTo: 'rangedWeaponRangeModifiers',
                                        target: 'ally',
                                        duration: {
                                            type: 'temporal',
                                            duration: 2,
                                            medition: 'rounds'
                                        },
                                        etiquette: 'stimulus_style'
                                    }
                                ],
                                effects: [],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 1,
                resourcePool: 8,
                knownSpells: 7,
            },
            {
                level: 12,
                proficency: 4,
                spells: [spells[22]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c10'),
                        name: 'Ejecución Combinada',
                        description: 'Cada vez que tu equipo realice un All-Out Attack o eliminen a un enemigo, te restauras tu competencia en AP y otorgas el efecto de una Potenciación Básica a ti y a todos los aliados de forma permanente por el resto del combate. Este efecto puede acumularse sin restricciones y no puede ser limpiado por efectos.',
                        useType: 'passive',
                        trigger: ['at_all_out_attack', 'at_enemy_death'],
                        effects: [
                            {
                                type: 'recover_resource',
                                resource: 'AP',
                                value: '{proficiency}',
                                target: 'self',
                                description: 'Recupera AP'
                            },
                            {
                                type: 'cast_spell',
                                action: 'free',
                                spellCategory: 'effect',
                                reduction: 1,
                                condition: 'basic_buff',
                                target: 'all_allies',
                                modifiers: [
                                    {
                                        type: 'change_property',
                                        property: 'is_accumulative',
                                        value: true,
                                        description: 'Hace que el efecto sea acumulativo',
                                        target: 'self'
                                    },
                                    {
                                        type: 'change_property',
                                        property: 'is_dispellable',
                                        value: false,
                                        description: 'Hace que el efecto no pueda ser disipado',
                                        target: 'self'
                                    }
                                ],
                                description: 'Otorga Potenciación Básica permanente y acumulable'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 2,
                resourcePool: 8,
                knownSpells: 9,
            },
            {
                level: 13,
                proficency: 5,
                spells: [spells[23], spells[24]],
                features: [],
                APGained: 1,
                resourcePool: 8,
                knownSpells: 9,
                gainSubclassFeature: true
            },
            {
                level: 14,
                proficency: 5,
                spells: [spells[25], spells[26]],
                APGained: 1,
                resourcePool: 9,
                knownSpells: 9,
                gainStatIncrease: true
            },
            {
                level: 15,
                proficency: 5,
                spells: [spells[27], spells[28]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c11'),
                        name: 'Multiataque II',
                        description: 'Puedes realizar un ataque adicional más con arma como parte de un ataque con arma o hechizo.',
                        useType: 'passive',
                        action: 'free_action',
                        effects: [
                            {
                                type: 'attack_with_weapon',
                                target: 'enemy',
                                description: 'Realiza un ataque adicional con arma como parte de un ataque con arma o hechizo.',
                                trigger: 'at_attack'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 1,
                resourcePool: 9,
                knownSpells: 9,
            },
            {
                level: 16,
                proficency: 5,
                spells: [spells[29], spells[30]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c12'),
                        name: 'Unidad de Combate',
                        description: 'Como acción adicional, obtienes un +1 a tu ataque por cada cinco efectos positivos y +1 a tu daño por cada dos efectos positivos que tengan los aliados (Los potenciadores en área cuentan por cada aliado) por el resto del turno.',
                        useType: 'active',
                        action: 'bonus_action',
                        modifiers: [
                            {
                                type: 'attack',
                                value: '{positive_effects / 5}',
                                description: 'Aumenta el ataque por efectos positivos de aliados',
                                target: 'self',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                },
                                etiquette: 'combat_unity'
                            },
                            {
                                type: 'damage',
                                value: '{positive_effects / 2}',
                                description: 'Aumenta el daño por efectos positivos de aliados',
                                target: 'self',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                },
                                etiquette: 'combat_unity'
                            }
                        ],
                        effects: [],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 2,
                resourcePool: 9,
                knownSpells: 10,
            },
            {
                // Te quedaste acá
                level: 17,
                proficency: 6,
                spells: [spells[31], spells[32]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c13'),
                        name: 'Repetición Marcial',
                        description: 'Cuando realizas un Estímulo, otorgas dicho efecto a un aliado adicional. El efecto de "Maestría Armamentística" ahora te permite reducir cualquier cantidad de dados, ganando dicha cantidad de ataques adicionales.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'additional_target',
                                value: 1,
                                description: 'Permite afectar a un aliado adicional con cualquier Estímulo',
                                target: 'self',
                                permanent: true,
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c08'),
                            }
                        ],
                        effects: [
                            {
                                type: 'modify_feature_uses',
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c07'),
                                uses: 'selection',
                                target: 'self',
                                description: 'Mejora de Maestría Armamentística: ahora puedes reducir cualquier cantidad de dados de daño, obteniendo un ataque adicional por cada dado reducido sin bonificador de daño'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 1,
                resourcePool: 9,
                knownSpells: 10,
            },
            {
                level: 18,
                proficency: 6,
                spells: [spells[33], spells[34]],
                features: [],
                APGained: 1,
                resourcePool: 10,
                knownSpells: 10,
                gainSubclassFeature: true
            },
            {
                level: 19,
                proficency: 6,
                spells: [spells[35], spells[36]],
                gainStatIncrease: true,
                APGained: 1,
                resourcePool: 10,
                knownSpells: 10,
            },
            {
                level: 20,
                proficency: 6,
                spells: [spells[37], spells[38]],
                features: [
                    {
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c14'),
                        name: 'Líder del Batallón',
                        description: 'Cuando estás en combate, la cantidad máxima de escudos de los enemigos se reduce en 2. Los enemigos sin escudos son eliminados por tu presencia de forma directa. Cuando ves que un escudo es roto, puedes utilizar tu reacción para reducir un escudo adicional. Además, como acción y una vez por combate, puedes provocar un All-Out Attack que tenga como objetivo a un solo enemigo. Este enemigo perderá un escudo de forma permanente y cada aliado recibirá +3 al daño contra él por el resto del combate.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'buff',
                                value: -2,
                                description: 'Reduce la cantidad máxima de escudos enemigos',
                                target: 'all_enemies',
                                addTo: 'shieldModifiers',
                                permanent: true,
                                etiquette: 'battalion_leader'
                            }
                        ],
                        effects: [
                            {
                                type: 'instant_kill',
                                target: 'all_enemies',
                                condition: 'enemy has total shields equals to 0',
                                description: 'Elimina enemigos sin escudos'
                            },
                            {
                                type: 'break_shield',
                                target: 'enemy',
                                trigger: 'at_break_shield',
                                value: 1,
                                action: 'reaction',
                                description: 'Rompe un escudo adicional como reacción'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c26'),
                                name: 'All-Out Attack Especial',
                                description: 'Provoca un All-Out Attack contra un enemigo que pierde un escudo permanentemente y los aliados obtienen +3 al daño contra él.',
                                useType: 'active',
                                action: 'action',
                                uses: 1,
                                triggerForRecover: 'at_combat_end',
                                modifiers: [
                                    {
                                        type: 'damage',
                                        value: 3,
                                        description: 'Aumenta el daño contra el objetivo',
                                        target: 'all_allies',
                                        permanent: true,
                                        condition: 'against target',
                                        etiquette: 'battalion_leader_all_out'
                                    }
                                ],
                                effects: [
                                    {
                                        type: 'debuff',
                                        target: 'enemy',
                                        value: -1,
                                        addTo: 'shieldModifiers',
                                        permanent: true,
                                        description: 'Pierde un escudo permanentemente'
                                    }
                                ],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                APGained: 2,
                resourcePool: 12,
                knownSpells: 14,
            }
        ]
    }}
)

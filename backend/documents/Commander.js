const { ObjectId } = require('mongodb');

// Primero creamos la clase para tener su ID
const characterClass = await db.class.insertOne({
    name: 'Commander',
    description: 'Líder táctico que potencia a sus aliados y coordina el campo de batalla',
    HPDice: '1d8',
    salvations: ['dexterity', 'intelligence'],
    resourceType: 'Morale Points',
    levels: [] // Lo llenaremos después
})

const characterClassId = characterClass.insertedId;

// Ahora creamos los hechizos con referencia a la clase
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
        description: 'Aumenta en +2 la defensa y +1 la resistencia mágica por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [
            {
                value: 2,
                type: 'defense',
                description: 'Aumenta en +2 la defensa',
                target: 'ally',
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
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos al usuario.',
        concentration: false,
        modifiers: [
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta en +5 a todo daño infligido',
                target: 'self',
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
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 el ataque por 3 turnos al usuario.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta en +3 el ataque',
                target: 'self',
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
        cost: [{ amount: 2, resource: 'AP' }],
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
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos al usuario.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta en +3 el ataque',
                target: 'self',
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
                target: 'self',
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
                target: 'self',
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
                target: 'self',
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

const subclass = await db.subclass.insertMany([
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
                                type: 'modify_effect',
                                target: 'all_allies',
                                description: 'Redada aplica a todos los aliados sin importar la distancia',
                                featureId: 'TODAVIA POR COMPLETAR'
                            },
                            {
                                type: 'break_shield',
                                target: 'enemy',
                                trigger: 'at_break_shield',
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
                                type: 'cleanse_negative_effects',
                                target: 'ally',
                                trigger: 'at_awaken_spirit',
                                description: 'Limpia efectos negativos al usar Despertar Espíritu'
                            },
                            {
                                type: 'additional_target',
                                target: 'ally',
                                trigger: 'at_awaken_spirit',
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
                                type: 'stack_empowerments',
                                target: 'self',
                                maxStacks: 3,
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
                                type: 'counter_attack',
                                target: 'enemy',
                                description: 'Realiza un ataque que reduce el daño enemigo'
                            },
                            {
                                type: 'damage_reduction',
                                target: 'self',
                                value: '{weapon_damage}',
                                description: 'Reduce el daño del ataque enemigo por el daño de tu arma'
                            },
                            {
                                type: 'overflow_damage',
                                description: 'Las cantidades sobrantes se aplican como daño'
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
                                type: 'reduce_speed',
                                target: 'enemy',
                                trigger: 'at_opportunity_attack',
                                value: 'to_0',
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
                                condition: 'disengage_action',
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
                                trigger: 'at_failed_attack_on_sheltered_ally',
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
                        trigger: 'at_opportunity_attack',
                        effects: [
                            {
                                type: 'break_shield',
                                target: 'enemy',
                                trigger: 'at_opportunity_attack',
                                value: 1,
                                description: 'Rompe un escudo al impactar ataque de oportunidad'
                            },
                            {
                                type: 'grant_disadvantage',
                                target: 'enemy',
                                trigger: 'at_opportunity_attack',
                                type_affected: 'all_saving_throws',
                                duration: {
                                    type: 'temporal',
                                    duration: 2,
                                    medition: 'rounds'
                                },
                                description: 'El enemigo tiene desventaja en salvaciones'
                            },
                            {
                                type: 'reduce_multiattack',
                                target: 'enemy',
                                trigger: 'at_opportunity_attack',
                                value: 1,
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
                        description: 'Obtienes una reacción adicional. Además, cada vez que te van a realizar un ataque, puedes realizar un ataque de oportunidad como reacción. Tienes ventaja en todos los ataques que realices fuera de tu turno.',
                        useType: 'passive',
                        action: 'reaction',
                        trigger: 'at_receive_attack',
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
                                type: 'opportunity_attack',
                                target: 'enemy',
                                trigger: 'at_receive_attack',
                                advantage: true,
                                description: 'Realiza un ataque de oportunidad al recibir un ataque'
                            },
                            {
                                type: 'grant_advantage',
                                target: 'self',
                                condition: 'attacks_outside_turn',
                                description: 'Tienes ventaja en ataques fuera de tu turno'
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
                        featureId: new ObjectId('6f8f4b3b3f1d9a001f2b3c1e'),
                        name: 'Deflexión',
                        description: 'Cada vez que realizas un efecto negativo en un enemigo, obtienes un bonificador de daño igual a tu competencia. Los ataques que fallen en tu contra no te causarán ningún tipo de daño y te darán ventaja en ataques contra el enemigo que realizó el ataque hasta el final de tu siguiente turno.',
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
                                type: 'negate_damage',
                                target: 'self',
                                trigger: 'at_failed_receive_attack',
                                description: 'Los ataques fallidos no causan daño'
                            },
                            {
                                type: 'grant_advantage',
                                target: 'self',
                                trigger: 'at_failed_receive_attack',
                                condition: 'attacks_against_attacker',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                },
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
                        description: 'Cuando impactas un ataque, una vez por turno, obtienes un bonificador a tu defensa y resistencia mágica igual a la mitad de tu competencia redondeada hacia abajo. Además, tus hechizos que tengan como objetivo a un enemigo tendrán el coste reducido a la mitad durante el transcurso de tus ataques.',
                        useType: 'passive',
                        trigger: 'at_attack',
                        modifiers: [
                            {
                                type: 'defense',
                                value: '{proficiency / 2}',
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
                                value: '{proficiency / 2}',
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
                                condition: 'enemy_targeting_spells_during_attacks',
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
                                type: 'weapon_damage_dice',
                                value: 1,
                                description: 'Todas tus armas tienen un dado adicional de daño',
                                target: 'self',
                                permanent: true,
                                etiquette: 'asura'
                            },
                            {
                                type: 'weapon_damage',
                                value: '{max_weapon_dice}',
                                description: 'Bonificador igual a la cantidad máxima del dado del arma',
                                target: 'self',
                                permanent: true,
                                etiquette: 'asura'
                            }
                        ],
                        effects: [
                            {
                                type: 'cast_damage_spell',
                                target: 'enemy',
                                trigger: 'at_spell_cast_during_attack',
                                uses: 1,
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
const pacifierSpells = await db.spells.insertMany([
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
        subclass: 'Pacifier',
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
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Básica (D)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
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
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    // Nivel 8
    {
        name: 'Zona de Restricción',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
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
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    {
        name: 'Desviar Hechizo',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
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
                condition: 'spell_cost_3_or_less',
                description: 'El hechizo falla automáticamente si cuesta 3 AP o menos'
            },
            {
                type: 'counterspell',
                target: 'enemy',
                trigger: 'at_enemy_spell_cast',
                condition: 'spell_cost_greater_than_3',
                cd: '12 + {spell_cost}',
                description: 'Requiere tirada de ataque vs CD 12 + coste del hechizo'
            },
            {
                type: 'attack_with_weapon',
                target: 'enemy',
                condition: 'counterspell_success',
                description: 'Aplica daño de arma si el hechizo falla'
            }
        ],
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    {
        name: 'Estado Alterado (A)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
        useType: 'active',
        category: 'debuff',
        description: 'Causas un estado alterado de tu afinidad a los enemigos con dificultad igual a 10 + salvación de carisma.',
        concentration: false,
        requireSalvation: true,
        cd: '10 + {charisma_save}',
        effects: [
            {
                type: 'status_effect',
                statusType: 'affinity',
                target: 'enemies_at_range',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                salvation: 'charisma',
                description: 'Aplica estado alterado de tu afinidad'
            }
        ],
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    // Nivel 13 - Debilitaciones Complejas
    {
        name: 'Debilitación Compleja (F)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
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
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Compleja (P)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
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
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Compleja (D)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
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
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    // Nivel 18 - Debilitaciones Totales
    {
        name: 'Debilitación Total (F)',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
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
        toList: 'pacifier',
        state: 'ACTIVE'
    },
    {
        name: 'Debilitación Total (P)',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: 'Pacifier',
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
        subclass: 'Pacifier',
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
        toList: 'pacifier',
        state: 'ACTIVE'
    }
])

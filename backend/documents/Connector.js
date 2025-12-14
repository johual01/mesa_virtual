const { ObjectId } = require('mongodb');

// Primero creamos la clase para tener su ID
const characterClass = await db.class.insertOne({
    name: 'Connector',
    description: 'Canalizador de ánimas que mezcla energías espirituales para crear hechizos personalizados y apoyar a sus aliados',
    HPDice: '1d6',
    salvations: ['wisdom', 'charisma'],
    levels: [] // Lo llenaremos después
})

const characterClassId = characterClass.insertedId;

// Ahora creamos los hechizos con referencia a la clase
const listSpells = await db.spells.insertMany([
    // Nivel 1
    {
        name: 'Ataque Mágico I (I)',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '3d4',
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
        name: 'Curación Común I',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'heal',
        description: 'Restauras 2d4 más lanzamiento de hechizos en PV a un aliado.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '2d4',
                target: 'ally',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
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
        description: 'Restauras 1d4 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '1d4',
                target: 'ally',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Básica (F)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
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
        action: 'action',
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
        action: 'action',
        category: 'buff',
        description: 'Aumenta en +2 a la defensa y +1 a la resistencia mágica por 3 turnos a ti o a un aliado.',
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
        name: 'Armadura Mágica',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'buff',
        description: 'Tu defensa se establece en diez más tu salvación de inteligencia y tu resistencia mágica se establece en diez más tu salvación de inteligencia. Ignoras las propiedades de la armadura que llevas equipada. Solo puede lanzarse en combate y consume acción adicional.',
        concentration: false,
        modifiers: [
            {
                value: '10 + {intelligence_bonifier}',
                type: 'defense',
                description: 'Defensa establecida en 10 + salvación de inteligencia',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'magical_armor'
            },
            {
                value: '10 + {intelligence_bonifier}',
                type: 'magic_defense',
                description: 'Resistencia mágica establecida en 10 + salvación de inteligencia',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'magical_armor'
            }
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
        action: 'action',
        category: 'heal',
        description: 'Restauras 1d4 más lanzamiento de hechizos en PV a todos los aliados a 6 casillas de ti.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '1d4',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'circle'
                },
                target: 'all_allies',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Bendecir',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
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
                type: 'dices',
                addTo: 'salvationRollModifiers',
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
        name: 'Ataque Mágico I (A)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '3d4',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                target: 'enemies_at_range',
                bonus: 0
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Escudo de Espíritu',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Asignas tu nivel multiplicado por 3 en PV temporales a ti o a un aliado.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'temp_hp',
                heal: '{level * 3}',
                target: 'ally'
            }
        ],
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
        action: 'action',
        category: 'debuff',
        description: 'Causas un estado alterado de tu afinidad a un enemigo con dificultad igual a 10 + salvación de carisma.',
        concentration: false,
        requireSalvation: true,
        cd: '10 + {charisma_bonifier}',
        effects: [
            {
                type: 'status_effect',
                statusType: 'affinity',
                target: 'enemy',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                }
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
        action: 'action',
        category: 'utility',
        description: 'Cura todos los estados alterados a ti o a un aliado.',
        concentration: false,
        effects: [
            {
                type: 'cleanse',
                cleanseType: 'all_status_effects',
                target: 'ally'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Escape de Emergencia',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'utility',
        description: 'Causas que tú y todos los aliados que lo acepten viajen a la última sala segura. Este efecto no puede aplicarse en combates de jefes o en zonas de movilidad restringida.',
        concentration: false,
        effects: [
            {
                type: 'teleport',
                teleportType: 'safe_room',
                target: 'all_allies',
                condition: 'not_boss_fight'
            }
        ],
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
        action: 'action',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '4d6',
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
        name: 'Estimulación Espiritual',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Haces que el siguiente hechizo que no sea de daño o curación de un aliado consuma acción adicional en vez de acción.',
        concentration: false,
        modifiers: [
            {
                value: 1,
                type: 'action_conversion',
                description: 'Siguiente hechizo no-daño/curación consume acción adicional',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'actions'
                },
                etiquette: 'spiritual_stimulation'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Común II',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'heal',
        description: 'Restauras 3d6 más lanzamiento de hechizos en PV a un aliado.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '3d6',
                target: 'ally',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
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
        description: 'Restauras 2d4 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '2d4',
                target: 'ally',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Amplificador',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Extiendes los bonificadores de un aliado por 3 turnos adicionales.',
        concentration: false,
        effects: [
            {
                type: 'extend_duration',
                extensionType: 'buffs',
                extensionAmount: 3,
                target: 'ally'
            }
        ],
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
        category: 'buff',
        description: 'Tu siguiente hechizo de curación se lanzará una vez más bajo las mismas condiciones (Si es individual, al mismo objetivo; si es en área en la misma área) sin consumir SP adicionales al inicio de tus dos siguientes turnos. Acción adicional.',
        concentration: true,
        modifiers: [
            {
                value: 2,
                type: 'spell_echo',
                description: 'Siguiente hechizo de curación se repite 2 veces',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 2,
                    medition: 'turns'
                },
                etiquette: 'zonal_restoration_heal'
            }
        ],
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
        description: 'Previenes el siguiente daño físico a ti o a un aliado. Consume 2 SP adicionales si se desea lanzar con acción adicional.',
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
        alternativeCost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        alternativeAction: 'bonus_action',
        category: 'shield',
        description: 'Previenes el siguiente daño mágico a ti o a un aliado. Consume 2 SP adicionales si se desea lanzar con acción adicional.',
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
    {
        name: 'Curación Grupal II',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'heal',
        description: 'Restauras 2d4 más lanzamiento de hechizos en PV a todos los aliados a 6 casillas de ti.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '2d4',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'circle'
                },
                target: 'all_allies',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
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
        action: 'action',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '4d6',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                target: 'enemies_at_range',
                bonus: 0
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Vigorizar I',
        cost: [],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'passive',
        description: 'Al final de cada turno, lanzas 1d8. Si es 8, recuperas 1 SP. Si fallas dos *Vigorizar* consecutivos, la siguiente tirada será un éxito automático. No acumulable con otros efectos de Vigorizar.',
        concentration: false,
        trigger: 'at_turn_end',
        internalCounter: true,
        counterCondition: 'rolls not equals 8',
        effects: [
            {
                type: 'resource_recovery',
                resourceType: 'AP',
                amount: 1,
                trigger: 'at_turn_end',
                condition: '1d8 equals 8'
            }
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
        action: 'action',
        category: 'debuff',
        description: 'Causas un estado alterado de tu afinidad a los enemigos con dificultad igual a 10 + salvación de carisma.',
        concentration: false,
        requireSalvation: true,
        cd: '10 + {charisma_bonifier}',
        effects: [
            {
                type: 'status_effect',
                statusType: 'affinity',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                target: 'enemies_at_range',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                }
            }
        ],
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
        action: 'action',
        category: 'buff',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta en +5 a todo daño infligido',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_damage_complex'
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
        action: 'action',
        category: 'buff',
        description: 'Aumenta en +3 el ataque por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta en +3 el ataque',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_attack_complex'
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
        action: 'action',
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
                etiquette: 'empowerment_defense_complex'
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
                etiquette: 'empowerment_defense_complex'
            }
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
        action: 'action',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '5d8',
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
        name: 'Marea Curativa',
        cost: [{ amount: 1, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'buff',
        description: 'Causas que tu siguiente "Curación Común" se lance con un dado menos a un segundo objetivo y con dos dados menos a un tercer objetivo. Acción adicional.',
        concentration: false,
        modifiers: [
            {
                value: 1,
                type: 'spell_cascade',
                description: 'Siguiente Curación Común afecta 3 objetivos con cascada',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'actions'
                },
                etiquette: 'healing_tide'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Liberación',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Tú y todos los aliados podrán utilizar por tres turnos su acción adicional para correr, esquivar o destrabarse.',
        concentration: false,
        modifiers: [
            {
                value: 1,
                type: 'action_flexibility',
                description: 'Acción adicional puede usarse para correr, esquivar o destrabarse',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                },
                etiquette: 'liberation'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Purificación',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'utility',
        description: 'Cura todos los estados alterados a ti y a todos los aliados.',
        concentration: false,
        effects: [
            {
                type: 'cleanse',
                cleanseType: 'all_status_effects',
                target: 'all_allies'
            }
        ],
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
        action: 'action',
        category: 'buff',
        description: 'Marcas a un aliado a distancia cuerpo a cuerpo. Cuando este aliado caiga a 0 PV, se establecerá en 1 PV y el hechizo terminará.',
        concentration: true,
        effects: [
            {
                type: 'death_ward',
                target: 'ally',
                heal: 1,
                trigger: 'at_hp_zero'
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
        action: 'action',
        category: 'utility',
        description: 'Rompes la concentración de un enemigo y remueves sus potenciaciones.',
        concentration: false,
        effects: [
            {
                type: 'break_concentration',
                target: 'enemy'
            },
            {
                type: 'cleanse',
                cleanseType: 'all_buffs',
                target: 'enemy'
            }
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
        action: 'action',
        category: 'heal',
        description: 'Restauras 4d8 más lanzamiento de hechizos en PV a un aliado.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '4d8',
                target: 'ally',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
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
        description: 'Restauras 3d6 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '3d6',
                target: 'ally',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Amplificación Total',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Extiendes los bonificadores de todos los aliados por 3 turnos adicionales (incluido tú mismo).',
        concentration: false,
        effects: [
            {
                type: 'extend_duration',
                extensionType: 'buffs',
                extensionAmount: 3,
                target: 'all_allies'
            }
        ],
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
        description: 'Previenes el siguiente daño a ti o a un aliado. Consume 2 SP adicionales si se desea lanzar con acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'barrier',
                barrierType: 'all',
                target: 'ally',
                uses: 1,
                description: 'Previene el siguiente daño'
            }
        ],
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
        action: 'action',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '5d8',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'cone'
                },
                target: 'enemies_at_range',
                bonus: 0
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Completa',
        cost: [{ amount: 8, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta en +3 el ataque',
                target: 'ally',
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
                description: 'Aumenta en +5 el daño',
                target: 'ally',
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
                description: 'Aumenta en +3 la defensa',
                target: 'ally',
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
                description: 'Aumenta en +2 la resistencia mágica',
                target: 'ally',
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
        name: 'Curación Grupal III',
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'heal',
        description: 'Restauras 3d6 más lanzamiento de hechizos en PV a todos los aliados a 6 casillas de ti.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '3d6',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'circle'
                },
                target: 'all_allies',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
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
        action: 'action',
        category: 'utility',
        description: 'Cura todos los estados alterados y debilitaciones a ti y a todos los aliados.',
        concentration: false,
        effects: [
            {
                type: 'cleanse',
                cleanseType: 'all_status_effects',
                target: 'all_allies'
            },
            {
                type: 'cleanse',
                cleanseType: 'all_debuffs',
                target: 'all_allies'
            }
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
        action: 'action',
        category: 'buff',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a ti y a todos los aliados.',
        concentration: false,
        modifiers: [
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta en +5 a todo daño infligido',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_damage_complex_area'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (PA)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Aumenta en +3 el ataque por 3 turnos a ti y a todos los aliados.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta en +3 el ataque',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_attack_complex_area'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (DA)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Aumenta en +3 la defensa y +2 a la resistencia mágica a ti y a todos los aliados.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'defense',
                description: 'Aumenta en +3 la defensa',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_defense_complex_area'
            },
            {
                value: 2,
                type: 'magic_defense',
                description: 'Aumenta en +2 la resistencia mágica',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_defense_complex_area'
            }
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
        action: 'action',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
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
    {
        name: 'Concentración',
        cost: [{ amount: 8, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'El siguiente ataque mágico de ti o un aliado impactará. Si la tirada de ataque impacta, será un crítico.',
        concentration: false,
        modifiers: [
            {
                value: 1,
                type: 'guaranteed_hit',
                description: 'Siguiente ataque mágico impacta automáticamente',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'actions'
                },
                etiquette: 'concentration'
            },
            {
                value: 1,
                type: 'guaranteed_critical',
                description: 'Si impacta, es crítico',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'actions'
                },
                etiquette: 'concentration'
            }
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
        action: 'action',
        category: 'heal',
        description: 'Restauras 6d10 más lanzamiento de hechizos en PV a un aliado.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '6d10',
                target: 'ally',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
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
        description: 'Restauras 4d8 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '4d8',
                target: 'ally',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Restauración Zonal (E)',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'Tu siguiente hechizo de daño causará su tirada mínima en curación a todos los aliados a seis casillas de ti por 3 turnos. Tu siguiente hechizo de curación causará su tirada mínima en daño a todos los enemigos a seis casillas de ti por 3 turnos.',
        concentration: true,
        modifiers: [
            {
                value: 1,
                type: 'spell_echo_damage_to_heal',
                description: 'Siguiente hechizo de daño causa curación mínima en área',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                },
                etiquette: 'zonal_restoration_echo'
            },
            {
                value: 1,
                type: 'spell_echo_heal_to_damage',
                description: 'Siguiente hechizo de curación causa daño mínimo en área',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'turns'
                },
                etiquette: 'zonal_restoration_echo'
            }
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
        description: 'Previenes las dos siguientes instancias de daño a ti o a un aliado. Consume 2 SP adicionales si se desea lanzar con acción adicional.',
        concentration: false,
        effects: [
            {
                type: 'barrier',
                barrierType: 'all',
                target: 'ally',
                uses: 2,
                description: 'Previene las 2 siguientes instancias de daño'
            }
        ],
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
        action: 'action',
        category: 'debuff',
        description: 'Causas un estado alterado de tu afinidad a una zona de 4 casillas de radio con dificultad igual a 10 + salvación de carisma. El efecto se aplicará a cada enemigo que entre o inicie su turno dentro de la zona. La zona durará hasta un máximo de 5 rondas.',
        concentration: true,
        requireSalvation: true,
        cd: '10 + {charisma_bonifier}',
        effects: [
            {
                type: 'status_effect_zone',
                statusType: 'affinity',
                range: {
                    type: 'area',
                    range: 4,
                    shape: 'circle'
                },
                target: 'enemies_at_range',
                trigger: 'on_enter_or_turn_start',
                duration: {
                    type: 'temporal',
                    duration: 5,
                    medition: 'rounds'
                }
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Ataque Mágico IV (A)',
        cost: [{ amount: 11, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'attack',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
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
                bonus: 0
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Grupal IV',
        cost: [{ amount: 9, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'heal',
        description: 'Restauras 4d8 más lanzamiento de hechizos en PV a todos los aliados a 6 casillas de ti.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '4d8',
                range: {
                    type: 'area',
                    range: 6,
                    shape: 'circle'
                },
                target: 'all_allies',
                bonus: '{wisdom_bonifier}|{charisma_bonifier}'
            }
        ],
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
        action: 'action',
        category: 'buff',
        description: 'Causas a ti o a uno de tus aliados, con su consentimiento, las siguientes propiedades por 5 turnos: Puedes lanzar un segundo hechizo que no sea de daño o curación como parte de tu hechizo. Aumentas la resistencia mágica en +2. Puedes mantener la concentración en un segundo hechizo. Aceleración Mágica no podrá lanzarse si algún aliado ya se encuentra con los efectos activos de este hechizo. Al acabar este efecto, el objetivo no podrá moverse ni realizar acciones hasta el final de su siguiente turno.',
        concentration: true,
        modifiers: [
            {
                value: 1,
                type: 'extra_spell',
                description: 'Puede lanzar segundo hechizo no-daño/curación',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 5,
                    medition: 'turns'
                },
                etiquette: 'magical_acceleration'
            },
            {
                value: 2,
                type: 'magic_defense',
                description: 'Aumenta resistencia mágica en +2',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 5,
                    medition: 'turns'
                },
                etiquette: 'magical_acceleration'
            },
            {
                value: 1,
                type: 'extra_concentration',
                description: 'Puede mantener concentración en segundo hechizo',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 5,
                    medition: 'turns'
                },
                etiquette: 'magical_acceleration'
            }
        ],
        effects: [
            {
                type: 'status_effect',
                statusType: 'stunned',
                target: 'ally',
                trigger: 'at_effect_end',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'turns'
                }
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
        action: 'action',
        category: 'utility',
        description: 'Rompes la concentración de todos los enemigos y remueves sus potenciaciones, además de remover debilitadores aliados.',
        concentration: false,
        effects: [
            {
                type: 'break_concentration',
                target: 'all_enemies'
            },
            {
                type: 'cleanse',
                cleanseType: 'all_buffs',
                target: 'all_enemies'
            },
            {
                type: 'cleanse',
                cleanseType: 'all_debuffs',
                target: 'all_allies'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Vigorizar II',
        cost: [],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'passive',
        description: 'Al final de cada turno, lanzas 1d6. Si es 6, recuperas 2 SP. Si no, recuperas 1 SP. No acumulable con otros efectos de Vigorizar.',
        concentration: false,
        trigger: 'at_turn_end',
        effects: [
            {
                type: 'resource_recovery',
                resourceType: 'AP',
                amount: 2,
                trigger: 'at_turn_end',
                condition: '1d6 equals 6'
            },
            {
                type: 'resource_recovery',
                resourceType: 'AP',
                amount: 1,
                trigger: 'at_turn_end',
                condition: '1d6 not equals 6'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    // Nivel 20
    {
        name: 'Maestro en Hechizos',
        cost: [],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'passive',
        description: 'Disminuyes el coste de tus hechizos a la mitad al momento de lanzarlos.',
        concentration: false,
        modifiers: [
            {
                value: 0.5,
                type: 'cost_reduction',
                description: 'Reduce coste de hechizos a la mitad',
                target: 'self',
                duration: {
                    type: 'permanent',
                    duration: 0,
                    medition: 'none'
                },
                etiquette: 'master_spellcaster'
            }
        ],
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
        description: 'Utilizando tu reacción tras ver a un aliado recibir daño, puedes causar que sea inmune a todo daño hasta el inicio de tu turno. Este efecto no puede ser aplicado en más de un objetivo al mismo tiempo.',
        concentration: false,
        trigger: 'before_receive_attack',
        effects: [
            {
                type: 'immunity',
                immunityType: 'all_damage',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'turns'
                }
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Carga Concentrada',
        cost: [{ amount: 18, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'action',
        category: 'buff',
        description: 'El siguiente ataque físico o mágico de ti y cada aliado impactará. Si la tirada de ataque impacta, será un crítico.',
        concentration: false,
        modifiers: [
            {
                value: 1,
                type: 'guaranteed_hit',
                description: 'Siguiente ataque impacta automáticamente',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'actions'
                },
                etiquette: 'concentrated_charge'
            },
            {
                value: 1,
                type: 'guaranteed_critical',
                description: 'Si impacta, es crítico',
                target: 'all_allies',
                duration: {
                    type: 'temporal',
                    duration: 1,
                    medition: 'actions'
                },
                etiquette: 'concentrated_charge'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
])

const spells = listSpells.insertedIds;

// Ahora creamos las features de la clase
// Feature: Mezcla Anímica con todas las Concentraciones
const mezclaAnimicaFeature = {
    featureId: new ObjectId(),
    name: 'Mezcla Anímica',
    description: 'Con tu acción, utilizas tu cuerpo para canalizar y mezclar distintas concentraciones de ánimas a fin de generar hechizos adecuados para cada situación. Del listado proporcionado abajo, puedes construir un hechizo personalizado mezclando una cantidad de elementos igual a tu competencia. Puedes repetir el mismo elemento más de una vez, pero contarán como elementos distintos para la cantidad máxima indicada. Puedes utilizar este efecto una cantidad de veces por incursión igual a la cantidad de mezclas anímicas indicadas en la tabla de niveles. Al finalizar un combate, recuperas un uso de mezcla anímica.',
    useType: 'active',
    action: 'action',
    uses: 3,
    triggerForRecover: 'at_combat_end',
    state: 'ACTIVE',
    subFeatures: [
        // Nivel 2 - Concentraciones
        {
            featureId: new ObjectId(),
            name: 'Éter Curativo - Nivel 2',
            description: 'Restauras 2d4 de PV a un aliado.',
            levelRequired: 2,
            concentrationCost: 1,
            useType: 'active',
            category: 'heal',
            effects: [
                {
                    type: 'heal',
                    healType: 'HP',
                    heal: '2d4',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter Curativo - Nivel 7',
            description: 'Restauras 3d6 de PV a un aliado.',
            levelRequired: 7,
            concentrationCost: 1,
            useType: 'active',
            category: 'heal',
            effects: [
                {
                    type: 'heal',
                    healType: 'HP',
                    heal: '3d6',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter Curativo - Nivel 13',
            description: 'Restauras 4d8 de PV a un aliado.',
            levelRequired: 13,
            concentrationCost: 1,
            useType: 'active',
            category: 'heal',
            effects: [
                {
                    type: 'heal',
                    healType: 'HP',
                    heal: '4d8',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter Curativo - Nivel 17',
            description: 'Restauras 5d10 de PV a un aliado.',
            levelRequired: 17,
            concentrationCost: 1,
            useType: 'active',
            category: 'heal',
            effects: [
                {
                    type: 'heal',
                    healType: 'HP',
                    heal: '5d10',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Espíritu Limpiador - Nivel 2',
            description: 'Remueves un estado o efecto negativo a un aliado.',
            levelRequired: 2,
            concentrationCost: 1,
            useType: 'active',
            category: 'utility',
            effects: [
                {
                    type: 'cleanse',
                    cleanseType: 'one_status_or_debuff',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Espíritu Limpiador - Nivel 7',
            description: 'Remueves un estado y un efecto negativo a un aliado.',
            levelRequired: 7,
            concentrationCost: 1,
            useType: 'active',
            category: 'utility',
            effects: [
                {
                    type: 'cleanse',
                    cleanseType: 'one_status_and_one_debuff',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Espíritu Limpiador - Nivel 14',
            description: 'Remueves todos los estados y efectos negativos a un aliado.',
            levelRequired: 14,
            concentrationCost: 1,
            useType: 'active',
            category: 'utility',
            effects: [
                {
                    type: 'cleanse',
                    cleanseType: 'all_status_and_debuffs',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Concentración Elemental - Nivel 2',
            description: 'Causas 2d6 de daño de tu afinidad a un enemigo.',
            levelRequired: 2,
            concentrationCost: 1,
            useType: 'active',
            category: 'attack',
            effects: [
                {
                    type: 'damage',
                    damageType: 'affinity',
                    dice: '2d6',
                    target: 'enemy'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Concentración Elemental - Nivel 7',
            description: 'Causas 3d8 de daño de tu afinidad a un enemigo.',
            levelRequired: 7,
            concentrationCost: 1,
            useType: 'active',
            category: 'attack',
            effects: [
                {
                    type: 'damage',
                    damageType: 'affinity',
                    dice: '3d8',
                    target: 'enemy'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Concentración Elemental - Nivel 13',
            description: 'Causas 4d10 de daño de tu afinidad a un enemigo.',
            levelRequired: 13,
            concentrationCost: 1,
            useType: 'active',
            category: 'attack',
            effects: [
                {
                    type: 'damage',
                    damageType: 'affinity',
                    dice: '4d10',
                    target: 'enemy'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Concentración Elemental - Nivel 17',
            description: 'Causas 5d12 de daño de tu afinidad a un enemigo.',
            levelRequired: 17,
            concentrationCost: 1,
            useType: 'active',
            category: 'attack',
            effects: [
                {
                    type: 'damage',
                    damageType: 'affinity',
                    dice: '5d12',
                    target: 'enemy'
                }
            ],
            state: 'ACTIVE'
        },
        // Nivel 5 - Concentraciones
        {
            featureId: new ObjectId(),
            name: 'Ánima de Corrupción - Nivel 5',
            description: 'Remueves un estado positivo a un enemigo.',
            levelRequired: 5,
            concentrationCost: 1,
            useType: 'active',
            category: 'debuff',
            effects: [
                {
                    type: 'cleanse',
                    cleanseType: 'one_buff',
                    target: 'enemy'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ánima de Corrupción - Nivel 13',
            description: 'Remueves todos los estados positivos a un enemigo.',
            levelRequired: 13,
            concentrationCost: 1,
            useType: 'active',
            category: 'debuff',
            effects: [
                {
                    type: 'cleanse',
                    cleanseType: 'all_buffs',
                    target: 'enemy'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter de Protección - Nivel 5',
            description: 'Le otorgas 3d4 de PV temporales a un aliado.',
            levelRequired: 5,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            effects: [
                {
                    type: 'heal',
                    healType: 'temp_hp',
                    heal: '3d4',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter de Protección - Nivel 9',
            description: 'Le otorgas 4d6 de PV temporales a un aliado.',
            levelRequired: 9,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            effects: [
                {
                    type: 'heal',
                    healType: 'temp_hp',
                    heal: '4d6',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter de Protección - Nivel 15',
            description: 'Le otorgas 5d8 de PV temporales a un aliado.',
            levelRequired: 15,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            effects: [
                {
                    type: 'heal',
                    healType: 'temp_hp',
                    heal: '5d8',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter de Protección - Nivel 19',
            description: 'Le otorgas 6d10 de PV temporales a un aliado.',
            levelRequired: 19,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            effects: [
                {
                    type: 'heal',
                    healType: 'temp_hp',
                    heal: '6d10',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Espíritu Potenciador - Nivel 5',
            description: 'Otorgas el efecto de una potenciación básica a un aliado.',
            levelRequired: 5,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 2,
                    type: 'damage|attack|defense',
                    description: 'Potenciación básica',
                    target: 'ally',
                    duration: {
                        type: 'temporal',
                        duration: 3,
                        medition: 'rounds'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Espíritu Potenciador - Nivel 13',
            description: 'Otorgas el efecto de una potenciación compleja a un aliado.',
            levelRequired: 13,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 5,
                    type: 'damage|attack|defense',
                    description: 'Potenciación compleja',
                    target: 'ally',
                    duration: {
                        type: 'temporal',
                        duration: 3,
                        medition: 'rounds'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        // Nivel 9 - Concentraciones
        {
            featureId: new ObjectId(),
            name: 'Ánima de Expansión',
            description: 'Las concentraciones se aplicarán a todos los aliados o a todos los enemigos. Cuenta como dos concentraciones.',
            levelRequired: 9,
            concentrationCost: 2,
            useType: 'active',
            category: 'modifier',
            modifiers: [
                {
                    value: 1,
                    type: 'area_expansion',
                    description: 'Aplica concentraciones a todos los objetivos del mismo tipo',
                    target: 'self'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Concentración Superior',
            description: 'Las concentraciones se aplicarán dos veces. Cuenta como dos concentraciones.',
            levelRequired: 9,
            concentrationCost: 2,
            useType: 'active',
            category: 'modifier',
            modifiers: [
                {
                    value: 2,
                    type: 'concentration_repeat',
                    description: 'Aplica concentraciones dos veces',
                    target: 'self'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Espíritu Resistente - Nivel 9',
            description: 'Le otorgas resistencia a un aliado a un elemento al que no es resistente por hasta el inicio de tu siguiente turno.',
            levelRequired: 9,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 1,
                    type: 'element_resistance',
                    description: 'Resistencia elemental',
                    target: 'ally',
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
            name: 'Espíritu Resistente - Nivel 17',
            description: 'Le otorgas resistencia a un aliado a un elemento. Aplicará acumulación de resistencias.',
            levelRequired: 17,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 1,
                    type: 'element_resistance_stacking',
                    description: 'Resistencia elemental con acumulación',
                    target: 'ally',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'turns'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        // Nivel 14 - Concentraciones
        {
            featureId: new ObjectId(),
            name: 'Éter Crítico - Nivel 14',
            description: 'Otorgas un 5% de crítico aumentado a un aliado por tres turnos.',
            levelRequired: 14,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 0.05,
                    type: 'critical',
                    description: '+5% de crítico',
                    target: 'ally',
                    duration: {
                        type: 'temporal',
                        duration: 3,
                        medition: 'turns'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter Crítico - Nivel 19',
            description: 'Otorgas un 10% de crítico aumentado a un aliado por tres turnos.',
            levelRequired: 19,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 0.10,
                    type: 'critical',
                    description: '+10% de crítico',
                    target: 'ally',
                    duration: {
                        type: 'temporal',
                        duration: 3,
                        medition: 'turns'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ánima Destructora - Nivel 14',
            description: 'Un aliado romperá un escudo adicional cada vez que rompa un escudo por tres turnos.',
            levelRequired: 14,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 1,
                    type: 'extra_shield_break',
                    description: 'Rompe escudo adicional',
                    target: 'ally',
                    duration: {
                        type: 'temporal',
                        duration: 3,
                        medition: 'turns'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ánima Destructora - Nivel 19',
            description: 'Un aliado romperá un escudo adicional cada vez que rompa un escudo por seis turnos.',
            levelRequired: 19,
            concentrationCost: 1,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 1,
                    type: 'extra_shield_break',
                    description: 'Rompe escudo adicional',
                    target: 'ally',
                    duration: {
                        type: 'temporal',
                        duration: 6,
                        medition: 'turns'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Concentración Debilitadora',
            description: 'Otorgas el efecto de una debilitación compleja a un enemigo.',
            levelRequired: 14,
            concentrationCost: 1,
            useType: 'active',
            category: 'debuff',
            modifiers: [
                {
                    value: -5,
                    type: 'damage|attack|defense',
                    description: 'Debilitación compleja',
                    target: 'enemy',
                    duration: {
                        type: 'temporal',
                        duration: 3,
                        medition: 'rounds'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        // Nivel 20 - Concentraciones
        {
            featureId: new ObjectId(),
            name: 'Espíritu de Extensión',
            description: 'Incrementas en tres turnos la duración de todos los potenciadores y efectos positivos a los aliados y los debilitadores y efectos negativos a los enemigos. Cuenta como dos concentraciones.',
            levelRequired: 20,
            concentrationCost: 2,
            useType: 'active',
            category: 'utility',
            effects: [
                {
                    type: 'extend_duration',
                    extensionType: 'buffs',
                    extensionAmount: 3,
                    target: 'all_allies'
                },
                {
                    type: 'extend_duration',
                    extensionType: 'debuffs',
                    extensionAmount: 3,
                    target: 'all_enemies'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Éter de Atenuación',
            description: 'Eliminas las resistencias, inmunidades y absorciones a un enemigo por tres turnos. Cuenta como dos concentraciones.',
            levelRequired: 20,
            concentrationCost: 2,
            useType: 'active',
            category: 'debuff',
            effects: [
                {
                    type: 'remove_resistances',
                    target: 'enemy',
                    duration: {
                        type: 'temporal',
                        duration: 3,
                        medition: 'turns'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Ánima de Aceleración',
            description: 'Un aliado gana una acción extra en su siguiente turno. Cuenta como tres concentraciones.',
            levelRequired: 20,
            concentrationCost: 3,
            useType: 'active',
            category: 'buff',
            modifiers: [
                {
                    value: 1,
                    type: 'extra_action',
                    description: 'Acción extra',
                    target: 'ally',
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
            name: 'Concentración Espiritual',
            description: 'Restauras 2d4 + 2 de SP y 6d6 de PV a un aliado. Cuenta como dos concentraciones.',
            levelRequired: 20,
            concentrationCost: 2,
            useType: 'active',
            category: 'heal',
            effects: [
                {
                    type: 'resource_recovery',
                    resourceType: 'AP',
                    amount: '2d4 + 2',
                    target: 'ally'
                },
                {
                    type: 'heal',
                    healType: 'HP',
                    heal: '6d6',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        }
    ]
};

// Feature: Protección Estelar
const proteccionEstelarFeature = {
    featureId: new ObjectId(),
    name: 'Protección Estelar',
    description: 'Cuando un aliado recibirá un ataque cuando tiene menos de la mitad de sus puntos de vida totales puedes utilizar tu reacción para otorgarle tu nivel en PV temporales hasta el inicio de tu siguiente turno.',
    useType: 'passive',
    action: 'reaction',
    trigger: 'before_receive_attack',
    condition: 'ally_hp_below_50_percent',
    effects: [
        {
            type: 'heal',
            healType: 'temp_hp',
            heal: '{level}',
            target: 'ally',
            duration: {
                type: 'temporal',
                duration: 1,
                medition: 'turns'
            }
        }
    ],
    state: 'ACTIVE'
};

// Feature: Restablecimiento Fugaz
const restablecimientoFugazFeature = {
    featureId: new ObjectId(),
    name: 'Restablecimiento Fugaz',
    description: 'Puedes utilizar tu reacción para restaurar a un aliado caído en combate, curarle el doble de tu nivel en PV y darle la resistencia a todo daño hasta el inicio de tu siguiente turno. Solo puedes activar este efecto una vez por incursión.',
    useType: 'active',
    action: 'reaction',
    trigger: 'at_ally_hp_zero',
    uses: 1,
    triggerForRecover: 'at_incursion_end',
    effects: [
        {
            type: 'revive',
            target: 'ally'
        },
        {
            type: 'heal',
            healType: 'HP',
            heal: '{level * 2}',
            target: 'ally'
        },
        {
            type: 'resistance',
            resistanceType: 'all_damage',
            target: 'ally',
            duration: {
                type: 'temporal',
                duration: 1,
                medition: 'turns'
            }
        }
    ],
    state: 'ACTIVE'
};

// Feature: Reflejo Curativo
const reflejoCurativoFeature = {
    featureId: new ObjectId(),
    name: 'Reflejo Curativo',
    description: 'Cada vez que un aliado es sanado por un hechizo o efecto tuyo, restauras la mitad de los puntos de vida sanados a otro aliado adicional.',
    useType: 'passive',
    trigger: 'after_heal',
    effects: [
        {
            type: 'heal',
            healType: 'HP',
            heal: '{heal_amount / 2}',
            target: 'another_ally',
            trigger: 'after_heal'
        }
    ],
    state: 'ACTIVE'
};

// Feature: Amplificación de Aura
const amplificacionDeAuraFeature = {
    featureId: new ObjectId(),
    name: 'Amplificación de Aura',
    description: 'Agregas 3 casillas adicionales al rango de todos tus hechizos que no causen daño. Además, una vez por combate puedes decidir que la siguiente tirada de salvación que requieran uno o más aliados sea exitosa de forma automática.',
    useType: 'passive',
    modifiers: [
        {
            value: 3,
            type: 'range_increase',
            description: 'Aumenta rango de hechizos no-daño en 3',
            target: 'self',
            condition: 'non_damage_spells',
            duration: {
                type: 'permanent',
                duration: 0,
                medition: 'none'
            }
        }
    ],
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Salvación Automática',
            description: 'Una vez por combate puedes decidir que la siguiente tirada de salvación que requieran uno o más aliados sea exitosa de forma automática.',
            useType: 'active',
            action: 'free_action',
            uses: 1,
            triggerForRecover: 'at_combat_end',
            effects: [
                {
                    type: 'guaranteed_salvation_success',
                    target: 'allies'
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};

// Ahora construimos el array de levels
await db.class.updateOne(
    { _id: characterClassId },
    { $set: {
        levels: [
            // Nivel 1
            {
                level: 1,
                proficency: 2,
                spells: [spells[0], spells[1]], // Ataque Mágico I (I), Curación Común I
                features: [],
                APGained: 6, // 6 base
                knownSpells: 6
            },
            // Nivel 2
            {
                level: 2,
                proficency: 2,
                spells: [spells[2], spells[3], spells[4], spells[5]], // Curación Rápida I, Potenciaciones Básicas (F/P/D)
                features: [mezclaAnimicaFeature],
                APGained: 7, // 6 + 1 por nivel + 1 adicional (cada 2 niveles desde 2)
                knownSpells: 6
            },
            // Nivel 3
            {
                level: 3,
                proficency: 2,
                spells: [spells[6], spells[7], spells[8]], // Armadura Mágica, Curación Grupal I, Bendecir
                features: [proteccionEstelarFeature],
                APGained: 8, // 6 + 2 (nivel) + 1 (cada 2)
                knownSpells: 6
            },
            // Nivel 4
            {
                level: 4,
                proficency: 2,
                spells: [spells[9], spells[10]], // Ataque Mágico I (A), Escudo de Espíritu
                features: [],
                APGained: 10, // 6 + 3 (nivel) + 2 (cada 2)
                knownSpells: 7,
                selectSubclass: true
            },
            // Nivel 5
            {
                level: 5,
                proficency: 3,
                spells: [spells[11], spells[12], spells[13]], // Estado Alterado (I), Limpieza, Escape de Emergencia
                features: [],
                APGained: 11, // 6 + 4 (nivel) + 2 (cada 2)
                knownSpells: 7,
                gainStatIncrease: true
            },
            // Nivel 6
            {
                level: 6,
                proficency: 3,
                spells: [spells[14], spells[15], spells[16]], // Ataque Mágico II (I), Estimulación Espiritual, Curación Común II
                features: [restablecimientoFugazFeature],
                APGained: 13, // 6 + 5 (nivel) + 3 (cada 2)
                knownSpells: 7
            },
            // Nivel 7
            {
                level: 7,
                proficency: 3,
                spells: [spells[17], spells[18], spells[19]], // Curación Rápida II, Amplificador, Restauración Zonal (C)
                features: [reflejoCurativoFeature],
                APGained: 14, // 6 + 6 (nivel) + 3 (cada 2)
                knownSpells: 7
            },
            // Nivel 8
            {
                level: 8,
                proficency: 3,
                spells: [spells[20], spells[21], spells[22]], // Barrera Física, Barrera Mágica, Curación Grupal II
                features: [],
                APGained: 16, // 6 + 7 (nivel) + 4 (cada 2)
                knownSpells: 10,
                gainSubclassFeature: true
            },
            // Nivel 9
            {
                level: 9,
                proficency: 4,
                spells: [spells[23], spells[24], spells[25]], // Ataque Mágico II (A), Vigorizar I, Estado Alterado (A)
                features: [],
                APGained: 17, // 6 + 8 (nivel) + 4 (cada 2)
                knownSpells: 10,
                gainStatIncrease: true
            },
            // Nivel 10
            {
                level: 10,
                proficency: 4,
                spells: [spells[26], spells[27], spells[28]], // Potenciaciones Complejas (F/P/D)
                features: [amplificacionDeAuraFeature],
                APGained: 19, // 6 + 9 (nivel) + 5 (cada 2)
                knownSpells: 10
            },
            // Nivel 11
            {
                level: 11,
                proficency: 4,
                spells: [spells[29], spells[30], spells[31], spells[32]], // Ataque Mágico III (I), Marea Curativa, Liberación, Purificación
                features: [equilibrioEspiritualFeature],
                APGained: 20, // 6 + 10 (nivel) + 5 (cada 2)
                knownSpells: 10
            },
            // Nivel 12
            {
                level: 12,
                proficency: 4,
                spells: [spells[33], spells[34], spells[35]], // Protección contra Muerte, Deshacer Magia, Curación Común III
                features: [restablecimientoSuperiorFeature],
                APGained: 22, // 6 + 11 (nivel) + 6 (cada 2)
                knownSpells: 11
            },
            // Nivel 13
            {
                level: 13,
                proficency: 5,
                spells: [spells[36], spells[37], spells[38]], // Curación Rápida III, Amplificación Total, Barrera Total
                features: [],
                APGained: 23, // 6 + 12 (nivel) + 6 (cada 2)
                knownSpells: 11,
                gainSubclassFeature: true
            },
            // Nivel 14
            {
                level: 14,
                proficency: 5,
                spells: [spells[39], spells[40], spells[41]], // Ataque Mágico III (A), Potenciación Completa, Curación Grupal III
                features: [],
                APGained: 25, // 6 + 13 (nivel) + 7 (cada 2)
                knownSpells: 11,
                gainStatIncrease: true
            },
            // Nivel 15
            {
                level: 15,
                proficency: 5,
                spells: [spells[42], spells[43], spells[44], spells[45]], // Purificación Completa, Potenciaciones Complejas (FA/PA/DA)
                features: [potenciacionAnimicaFeature],
                APGained: 26, // 6 + 14 (nivel) + 7 (cada 2)
                knownSpells: 14
            },
            // Nivel 16
            {
                level: 16,
                proficency: 5,
                spells: [spells[46], spells[47], spells[48]], // Ataque Mágico IV (I), Concentración, Curación Común IV
                features: [alteracionEspiritualFeature],
                APGained: 28, // 6 + 15 (nivel) + 8 (cada 2)
                knownSpells: 14
            },
            // Nivel 17
            {
                level: 17,
                proficency: 6,
                spells: [spells[49], spells[50], spells[51]], // Curación Rápida IV, Restauración Zonal (E), Barrera Infranqueable
                features: [soporteMoralFeature],
                APGained: 29, // 6 + 16 (nivel) + 8 (cada 2)
                knownSpells: 14
            },
            // Nivel 18
            {
                level: 18,
                proficency: 6,
                spells: [spells[52], spells[53], spells[54]], // Estado Alterado (Z), Ataque Mágico IV (A), Curación Grupal IV
                features: [],
                APGained: 31, // 6 + 17 (nivel) + 9 (cada 2)
                knownSpells: 14,
                gainSubclassFeature: true
            },
            // Nivel 19
            {
                level: 19,
                proficency: 6,
                spells: [spells[55], spells[56], spells[57]], // Aceleración Mágica, Destrucción Mágica, Vigorizar II
                features: [],
                APGained: 32, // 6 + 18 (nivel) + 9 (cada 2)
                knownSpells: 14,
                gainStatIncrease: true
            },
            // Nivel 20
            {
                level: 20,
                proficency: 6,
                spells: [spells[58], spells[59], spells[60]], // Maestro en Hechizos, Barrera Definitiva, Carga Concentrada
                features: [sobreestimulacionFeature],
                APGained: 34, // 6 + 19 (nivel) + 10 (cada 2)
                knownSpells: 18
            }
        ]
    }}
)

// Ahora creamos las subclases
const subclasses = await db.subclass.insertMany([
    // Subclase: Vigilant
    {
        name: 'Vigilant',
        description: 'Especialista en protección que utiliza dados de curación reutilizables y marca aliados para absorber daño.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Protección Superior',
                        description: 'Como acción adicional, puedes gastar dados para sanar a un aliado en tu rango de hechizos. Al iniciar una incursión, obtienes una cantidad de dados d6 igual a tu nivel. Cuando utilizas este efecto, por cada dado utilizado, el objetivo también gana 1 PV temporal, escala a 2 a nivel 8, 3 a nivel 13 y 4 a nivel 18.',
                        useType: 'active',
                        action: 'bonus_action',
                        uses: '{level}',
                        triggerForRecover: 'at_incursion_start',
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '{dice_spent}d6',
                                target: 'ally',
                                range: {
                                    type: 'ranged',
                                    range: 'spell_range'
                                }
                            },
                            {
                                type: 'heal',
                                healType: 'temp_hp',
                                heal: '{dice_spent * temp_hp_per_die}',
                                target: 'ally',
                                condition: 'temp_hp_per_die: level < 8 ? 1 : level < 13 ? 2 : level < 18 ? 3 : 4'
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
                        name: 'Redirección de Riesgos',
                        description: 'Con tu acción adicional, puedes marcar a un aliado con su consentimiento para marcarlo como un "Chivo Expiatorio". Cuando inicias un combate, puedes lanzar 1d100. Si tu tirada es menor a tu nivel más tu salvación de sabiduría, el enemigo será obligado a tomar como objetivo prioritario al "Chivo Expiatorio" para todos sus efectos, a menos que otra situación se lo impida.',
                        useType: 'active',
                        action: 'bonus_action',
                        effects: [
                            {
                                type: 'mark_ally',
                                markType: 'scapegoat',
                                target: 'ally',
                                condition: 'ally_consent'
                            },
                            {
                                type: 'force_target',
                                trigger: 'at_combat_start',
                                condition: '1d100 < {level + wisdom_bonifier}',
                                target: 'enemy',
                                forcedTarget: 'marked_ally',
                                duration: {
                                    type: 'temporal',
                                    duration: 99,
                                    medition: 'rounds'
                                }
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
                        name: 'Seguro de Vida',
                        description: 'Con tu acción adicional puedes marcar a un aliado. Si dicho aliado recibirá daño este turno, recibirá el doble de tu nivel en PV temporales y resistencia a un elemento a tu elección. Además, duplicas la cantidad de dados obtenida al inicio de la incursión por "Protección Superior".',
                        useType: 'active',
                        action: 'bonus_action',
                        effects: [
                            {
                                type: 'mark_ally',
                                markType: 'life_insurance',
                                target: 'ally'
                            },
                            {
                                type: 'heal',
                                healType: 'temp_hp',
                                heal: '{level * 2}',
                                target: 'marked_ally',
                                trigger: 'before_receive_damage',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                }
                            },
                            {
                                type: 'resistance',
                                resistanceType: 'chosen_element',
                                target: 'marked_ally',
                                trigger: 'before_receive_damage',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                }
                            }
                        ],
                        modifiers: [
                            {
                                value: 2,
                                type: 'uses_multiplier',
                                description: 'Duplica dados de Protección Superior',
                                target: 'self',
                                applyTo: 'Protección Superior',
                                duration: {
                                    type: 'permanent',
                                    duration: 0,
                                    medition: 'none'
                                }
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
                        name: 'Supresión de Presencia',
                        description: 'Utilizando tu acción y una vez por combate, puedes suprimir la presencia de un aliado, causando que no pueda ser notado ni tomado como objetivo por los enemigos por tres turnos.',
                        useType: 'active',
                        action: 'action',
                        uses: 1,
                        triggerForRecover: 'at_combat_end',
                        effects: [
                            {
                                type: 'status_effect',
                                statusType: 'invisible',
                                target: 'ally',
                                duration: {
                                    type: 'temporal',
                                    duration: 3,
                                    medition: 'turns'
                                }
                            },
                            {
                                type: 'untargetable',
                                target: 'ally',
                                duration: {
                                    type: 'temporal',
                                    duration: 3,
                                    medition: 'turns'
                                }
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    // Subclase: Entertainer
    {
        name: 'Entertainer',
        description: 'Soporte enfocado en comedia y efectos acumulativos que se potencian con cada acción.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Punchline',
                        description: 'Cada vez que realizas una curación individual, otorgas una potenciación básica al objetivo. Además, cada vez que lanzas un hechizo, restauras 2 más la cantidad de SP gastados en PV.',
                        useType: 'passive',
                        trigger: ['after_individual_heal', 'after_spell_cast'],
                        modifiers: [
                            {
                                value: 2,
                                type: 'buff_on_heal',
                                description: 'Curación individual otorga potenciación básica',
                                target: 'healed_ally',
                                trigger: 'after_individual_heal',
                                duration: {
                                    type: 'temporal',
                                    duration: 3,
                                    medition: 'rounds'
                                },
                                etiquette: 'empowerment_basic'
                            }
                        ],
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '{2 + sp_spent}',
                                target: 'self',
                                trigger: 'after_spell_cast'
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
                        name: 'Stand Up',
                        description: 'Como acción y una vez por combate, restauras una cantidad de puntos igual a 10 veces tu nivel distribuido entre todos los aliados. Además, podrás lanzar un hechizo de efecto que consuma acción como parte de esta acción.',
                        useType: 'active',
                        action: 'action',
                        uses: 1,
                        triggerForRecover: 'at_combat_end',
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '{level * 10}',
                                target: 'all_allies',
                                distribution: 'player_choice'
                            },
                            {
                                type: 'cast_spell',
                                spellType: 'effect',
                                condition: 'action_spell',
                                target: 'any',
                                asPart: true
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
                        name: 'Call Back',
                        description: 'Una vez por combate, puedes decidir caer al suelo como reacción luego de recibir un ataque dirigido en tu contra. Esto causará que el enemigo te ignore por el resto de su turno. Te reincorporarás al final de dicho turno. Además, Punchline otorgará una potenciación compleja en vez de una básica cada vez que realice una curación individual.',
                        useType: 'active',
                        action: 'reaction',
                        uses: 1,
                        triggerForRecover: 'at_combat_end',
                        trigger: 'after_receive_attack',
                        effects: [
                            {
                                type: 'feign_death',
                                target: 'self',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                }
                            },
                            {
                                type: 'force_ignore',
                                target: 'self',
                                ignoredBy: 'attacker',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turns'
                                }
                            }
                        ],
                        modifiers: [
                            {
                                value: 5,
                                type: 'upgrade_buff',
                                description: 'Punchline otorga potenciación compleja',
                                target: 'self',
                                applyTo: 'Punchline',
                                duration: {
                                    type: 'permanent',
                                    duration: 0,
                                    medition: 'none'
                                },
                                etiquette: 'empowerment_complex'
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
                        name: 'Catch Phrase',
                        description: 'Luego de lanzar dos hechizos, el tercero se lanzará dos veces. En caso de ser un hechizo de efecto, duplicará su duración. Además, una vez por incursión, puedes utilizar tu acción para recuperar todos tus SP y PV. No podrás tomar reacciones hasta el inicio de tu siguiente turno luego de realizar esta acción.',
                        useType: 'passive',
                        trigger: 'after_spell_cast',
                        internalCounter: true,
                        counterCondition: 'spell_count modulo 3 equals 0',
                        modifiers: [
                            {
                                value: 2,
                                type: 'spell_repeat',
                                description: 'Cada tercer hechizo se lanza dos veces',
                                target: 'self',
                                trigger: 'third_spell',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'actions'
                                }
                            },
                            {
                                value: 2,
                                type: 'duration_multiplier',
                                description: 'Hechizos de efecto duplican duración',
                                target: 'self',
                                condition: 'effect_spell',
                                trigger: 'third_spell'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Restauración Total',
                                description: 'Recuperas todos tus SP y PV.',
                                useType: 'active',
                                action: 'action',
                                uses: 1,
                                triggerForRecover: 'at_incursion_end',
                                effects: [
                                    {
                                        type: 'full_restore',
                                        restoreType: 'HP_and_AP',
                                        target: 'self'
                                    },
                                    {
                                        type: 'status_effect',
                                        statusType: 'no_reactions',
                                        target: 'self',
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
    },
    // Subclase: Discourager
    {
        name: 'Discourager',
        description: 'Especialista en debuffs y aprovechamiento de enemigos debilitados para sanar aliados.',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Robar Espíritu',
                        description: 'Cada vez que causas daño a un enemigo, este recibirá una debilitación básica con duración de dos rondas. Si un enemigo tiene todas las debilitaciones activas al momento de activar este efecto, le romperás un escudo.',
                        useType: 'passive',
                        trigger: 'after_damage_dealt',
                        modifiers: [
                            {
                                value: 2,
                                type: 'debuff_on_damage',
                                description: 'Daño infligido aplica debilitación básica',
                                target: 'damaged_enemy',
                                duration: {
                                    type: 'temporal',
                                    duration: 2,
                                    medition: 'rounds'
                                },
                                etiquette: 'debilitation_basic'
                            }
                        ],
                        effects: [
                            {
                                type: 'shield_break',
                                target: 'damaged_enemy',
                                condition: 'all_debuffs_active',
                                shieldsToBreak: 1
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
                        name: 'Repartición de Ánima',
                        description: 'Cada vez que infliges daño a un enemigo con una debilitación básica o efecto negativo, restauras la mitad del daño infligido a un aliado. Además, una vez por ronda y utilizando tu reacción, puedes causar que un hechizo que vaya a causar daño neutral a un enemigo sea considerado como daño a debilidad.',
                        useType: 'passive',
                        trigger: 'after_damage_to_debuffed_enemy',
                        effects: [
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '{damage_dealt / 2}',
                                target: 'any_ally',
                                condition: 'enemy_has_debuff_or_negative_effect'
                            }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId(),
                                name: 'Conversión de Daño',
                                description: 'Convierte daño neutral en daño a debilidad.',
                                useType: 'active',
                                action: 'reaction',
                                uses: 1,
                                triggerForRecover: 'at_round_end',
                                trigger: 'before_neutral_damage',
                                modifiers: [
                                    {
                                        value: 1,
                                        type: 'damage_conversion',
                                        description: 'Neutral → Debilidad',
                                        target: 'enemy',
                                        damageTypeChange: {
                                            from: 'neutral',
                                            to: 'weakness'
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
                level: 13,
                features: [
                    {
                        featureId: new ObjectId(),
                        name: 'Ecos Esotéricos',
                        description: 'Cada vez que causas daño con un hechizo individual, aplicas el daño mínimo de esa tirada al mismo objetivo al inicio de tus siguientes dos turnos. Además, "Robar Espíritu" aplicará una debilitación compleja en vez de una debilitación básica al causar daño a un enemigo.',
                        useType: 'passive',
                        trigger: 'after_individual_spell_damage',
                        effects: [
                            {
                                type: 'damage_echo',
                                damageValue: '{min_damage_rolled}',
                                target: 'damaged_enemy',
                                occurrences: 2,
                                timing: 'start_of_turn'
                            }
                        ],
                        modifiers: [
                            {
                                value: 5,
                                type: 'upgrade_debuff',
                                description: 'Robar Espíritu aplica debilitación compleja',
                                target: 'self',
                                applyTo: 'Robar Espíritu',
                                duration: {
                                    type: 'permanent',
                                    duration: 0,
                                    medition: 'none'
                                },
                                etiquette: 'debilitation_complex'
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
                        name: 'Absorción de Éter',
                        description: 'Cada vez rompas un escudo, romperás un escudo adicional. Además, cada vez que participes en un "All-Out Attack", obtendrás beneficios adicionales: reducir escudos máximos del enemigo en 1, convertir inmunidad→resistencia / absorción→inmunidad / eliminar resistencia, y restaurar PV y SP del equipo.',
                        useType: 'passive',
                        trigger: ['after_shield_break', 'during_all_out_attack'],
                        effects: [
                            {
                                type: 'shield_break',
                                target: 'same_enemy',
                                trigger: 'after_shield_break',
                                shieldsToBreak: 1,
                                additional: true
                            },
                            {
                                type: 'reduce_max_shields',
                                target: 'knocked_enemy',
                                trigger: 'during_all_out_attack',
                                reduction: 1,
                                specialCondition: 'zero_shields_equals_death'
                            },
                            {
                                type: 'alter_element_affinity',
                                target: 'knocked_enemy',
                                trigger: 'during_all_out_attack',
                                changes: [
                                    { from: 'immunity', to: 'resistance' },
                                    { from: 'absorption', to: 'immunity' },
                                    { from: 'resistance', to: 'none' }
                                ]
                            },
                            {
                                type: 'heal',
                                healType: 'HP',
                                heal: '{level}',
                                target: 'self_and_all_allies',
                                trigger: 'during_all_out_attack'
                            },
                            {
                                type: 'recover',
                                recoverType: 'AP',
                                recover: '{proficiency}',
                                target: 'self_and_all_allies',
                                trigger: 'during_all_out_attack'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    }
])
// Feature: Equilibrio Espiritual
const equilibrioEspiritualFeature = {
    featureId: new ObjectId(),
    name: 'Equilibrio Espiritual',
    description: 'Tus acciones dirigidas en contra de enemigos generan "Black Marks", 2 en caso de ser individuales y 1 en caso de ser en área. Tus acciones dirigidas a favor de aliados generan "White Marks", 2 en caso de ser individuales y 1 en caso de ser en área. Dichas marcas pueden ser utilizadas para realizar ciertas acciones.',
    useType: 'passive',
    subFeatures: [
        // Sistema de Black Marks
        {
            featureId: new ObjectId(),
            name: 'Black Marks System',
            description: 'Genera Black Marks (BM) con acciones ofensivas: 2 BM por acción individual contra enemigos, 1 BM por acción en área.',
            useType: 'passive',
            internalCounter: true,
            trigger: ['at_enemy_action_individual', 'at_enemy_action_area'],
            subFeatures: [
                {
                    featureId: new ObjectId(),
                    name: 'Curación Repetida (1 BM)',
                    description: 'Consumes 1 BM para que tu siguiente hechizo de curación individual se aplique nuevamente al inicio del turno del afectado por los siguientes dos turnos.',
                    useType: 'active',
                    action: 'free_action',
                    cost: [{ amount: 1, resource: 'Black Marks' }],
                    modifiers: [
                        {
                            value: 2,
                            type: 'spell_repeat',
                            description: 'Curación individual se repite por 2 turnos',
                            target: 'self',
                            condition: 'next_individual_heal_spell',
                            duration: {
                                type: 'temporal',
                                duration: 2,
                                medition: 'turns'
                            }
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId(),
                    name: 'Hechizo de Aliado como Bono (2 BM)',
                    description: 'Consumes 2 BM para realizar un hechizo que tenga como objetivo a un aliado como acción adicional.',
                    useType: 'active',
                    action: 'free_action',
                    cost: [{ amount: 2, resource: 'Black Marks' }],
                    modifiers: [
                        {
                            value: 1,
                            type: 'action_conversion',
                            description: 'Siguiente hechizo de aliado se convierte en acción adicional',
                            target: 'self',
                            duration: {
                                type: 'temporal',
                                duration: 1,
                                medition: 'actions'
                            }
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId(),
                    name: 'Hechizo Individual a Grupo (3 BM)',
                    description: 'Consumes 3 BM para que tu siguiente hechizo que tenga como objetivo a un aliado se aplique a todo el grupo.',
                    useType: 'active',
                    action: 'free_action',
                    cost: [{ amount: 3, resource: 'Black Marks' }],
                    modifiers: [
                        {
                            value: 1,
                            type: 'target_expansion',
                            description: 'Siguiente hechizo individual de aliado afecta a todo el grupo',
                            target: 'self',
                            duration: {
                                type: 'temporal',
                                duration: 1,
                                medition: 'actions'
                            }
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId(),
                    name: 'Escudo de Protección Grupal (4 BM)',
                    description: 'Consumes 4 BM para generar un escudo de protección del siguiente daño físico o mágico como reacción a todos los aliados.',
                    useType: 'active',
                    action: 'reaction',
                    cost: [{ amount: 4, resource: 'Black Marks' }],
                    effects: [
                        {
                            type: 'barrier',
                            barrierType: 'physical_or_magical',
                            target: 'all_allies',
                            uses: 1,
                            description: 'Escudo contra siguiente daño físico o mágico'
                        }
                    ],
                    state: 'ACTIVE'
                }
            ],
            state: 'ACTIVE'
        },
        // Sistema de White Marks
        {
            featureId: new ObjectId(),
            name: 'White Marks System',
            description: 'Genera White Marks (WM) con acciones de soporte: 2 WM por acción individual a favor de aliados, 1 WM por acción en área.',
            useType: 'passive',
            internalCounter: true,
            trigger: ['at_ally_action_individual', 'at_ally_action_area'],
            subFeatures: [
                {
                    featureId: new ObjectId(),
                    name: 'Daño Mínimo Repetido (1 WM)',
                    description: 'Consumes 1 WM para potenciar tu siguiente hechizo de daño individual para que, en caso de impactar, repita el daño mínimo del hechizo contra el objetivo al inicio de tu siguiente turno.',
                    useType: 'active',
                    action: 'free_action',
                    cost: [{ amount: 1, resource: 'White Marks' }],
                    modifiers: [
                        {
                            value: 1,
                            type: 'damage_echo_minimum',
                            description: 'Daño mínimo se repite en siguiente turno',
                            target: 'self',
                            condition: 'next_individual_damage_spell',
                            duration: {
                                type: 'temporal',
                                duration: 1,
                                medition: 'actions'
                            }
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId(),
                    name: 'Hechizo de Estado como Bono (2 WM)',
                    description: 'Consumes 2 WM para realizar un hechizo de estado a los enemigos como acción adicional.',
                    useType: 'active',
                    action: 'free_action',
                    cost: [{ amount: 2, resource: 'White Marks' }],
                    modifiers: [
                        {
                            value: 1,
                            type: 'action_conversion',
                            description: 'Siguiente hechizo de estado se convierte en acción adicional',
                            target: 'self',
                            duration: {
                                type: 'temporal',
                                duration: 1,
                                medition: 'actions'
                            }
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId(),
                    name: 'Hechizo de Daño como Bono (3 WM)',
                    description: 'Consumes 3 WM para realizar un hechizo de daño individual como acción adicional.',
                    useType: 'active',
                    action: 'free_action',
                    cost: [{ amount: 3, resource: 'White Marks' }],
                    modifiers: [
                        {
                            value: 1,
                            type: 'action_conversion',
                            description: 'Siguiente hechizo de daño individual se convierte en acción adicional',
                            target: 'self',
                            duration: {
                                type: 'temporal',
                                duration: 1,
                                medition: 'actions'
                            }
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId(),
                    name: 'Interrupción de Acción (4 WM)',
                    description: 'Consumes 4 WM para generar una interrupción en la acción realizada por el enemigo como reacción, realizando un enfrentamiento de salvación de inteligencia.',
                    useType: 'active',
                    action: 'reaction',
                    cost: [{ amount: 4, resource: 'White Marks' }],
                    requireSalvation: true,
                    cd: '8 + {proficency} + {intelligence_bonifier}',
                    effects: [
                        {
                            type: 'interrupt_action',
                            target: 'enemy',
                            salvationType: 'intelligence'
                        }
                    ],
                    state: 'ACTIVE'
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};
// Feature: Restablecimiento Superior
const restablecimientoSuperiorFeature = {
    featureId: new ObjectId(),
    name: 'Restablecimiento Superior',
    description: '"Restablecimiento Fugaz" dará inmunidad en vez de resistencia; además de otorgarle resistencia a un tipo de daño a tu elección por tres turnos al finalizar la inmunidad.',
    useType: 'passive',
    parent: restablecimientoFugazFeature.featureId,
    modifiesParent: true,
    modifiers: [
        {
            value: 1,
            type: 'upgrade_resistance_to_immunity',
            description: 'Mejora Restablecimiento Fugaz a inmunidad',
            target: 'self'
        }
    ],
    effects: [
        {
            type: 'resistance',
            resistanceType: 'chosen_element',
            target: 'ally',
            trigger: 'after_immunity_ends',
            duration: {
                type: 'temporal',
                duration: 3,
                medition: 'turns'
            }
        }
    ],
    state: 'ACTIVE'
};

// Feature: Potenciación Anímica
const potenciacionAnimicaFeature = {
    featureId: new ObjectId(),
    name: 'Potenciación Anímica',
    description: 'Puedes lanzar una potenciación compleja a todos los aliados al inicio del combate sin gastar SP. Además, puedes potenciar un hechizo de daño o curación añadiéndole tu salvación de carisma un número de veces igual a tu competencia a sabiduría.',
    useType: 'passive',
    trigger: 'at_combat_start',
    effects: [
        {
            type: 'auto_cast_spell',
            spellType: 'complex_empowerment',
            target: 'all_allies',
            trigger: 'at_combat_start',
            cost: 0
        }
    ],
    modifiers: [
        {
            value: '{charisma_bonifier * wisdom_bonifier}',
            type: 'spell_power_boost',
            description: 'Potencia hechizos con bonificador de carisma multiplicado por bonificador de sabiduría',
            target: 'self',
            condition: 'damage_or_heal_spells',
            uses: '{wisdom_bonifier}',
            triggerForRecover: 'at_combat_end'
        }
    ],
    state: 'ACTIVE'
};

// Feature: Soporte Moral
const soporteMoralFeature = {
    featureId: new ObjectId(),
    name: 'Soporte Moral',
    description: 'Al inicio de cada ronda, lanzas un dado de ocho caras. Si la tirada es seis o superior, cada aliado obtiene Carga y Concentración hasta el final de la ronda. En caso contrario, obtienes una reacción adicional hasta el final de la ronda.',
    useType: 'passive',
    trigger: 'at_round_start',
    effects: [
        {
            type: 'dice_roll',
            dice: '1d8',
            trigger: 'at_round_start',
            condition: 'result >= 6',
            effects: [
                {
                    type: 'status_effect',
                    statusType: 'charge',
                    target: 'all_allies',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'rounds'
                    }
                },
                {
                    type: 'status_effect',
                    statusType: 'concentration_buff',
                    target: 'all_allies',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'rounds'
                    }
                }
            ]
        },
        {
            type: 'dice_roll',
            dice: '1d8',
            trigger: 'at_round_start',
            condition: 'result < 6',
            modifiers: [
                {
                    value: 1,
                    type: 'extra_reaction',
                    description: 'Reacción adicional',
                    target: 'self',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'rounds'
                    }
                }
            ]
        }
    ],
    state: 'ACTIVE'
};

// Feature: Sobreestimulación
const sobreestimulacionFeature = {
    featureId: new ObjectId(),
    name: 'Sobreestimulación',
    description: 'Una vez por ronda, como acción, puedes otorgar un turno adicional a un aliado. Puedes causar este efecto tres veces por combate, pero no puedes tener como objetivo a ningún aliado que ya se haya beneficiado por este efecto. Además, una vez por incursión, puedes restaurar el estado de un aliado a su estado antes de iniciar la incursión (PV, SP, habilidades con usos por combate o incursión). Esto no activará nuevamente habilidades de inicio de combate.',
    useType: 'active',
    action: 'action',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Otorgar Turno Adicional',
            description: 'Otorgas un turno adicional a un aliado.',
            useType: 'active',
            action: 'action',
            uses: 3,
            triggerForRecover: 'at_combat_end',
            condition: 'once_per_round_and_unique_ally',
            effects: [
                {
                    type: 'extra_turn',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Restauración Completa',
            description: 'Restauras el estado de un aliado a su estado antes de iniciar la incursión.',
            useType: 'active',
            action: 'action',
            uses: 1,
            triggerForRecover: 'at_incursion_end',
            effects: [
                {
                    type: 'full_restore',
                    restoreType: 'pre_incursion_state',
                    target: 'ally'
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};
// Feature: Alteración Espiritual
const alteracionEspiritualFeature = {
    featureId: new ObjectId(),
    name: 'Alteración Espiritual',
    description: 'Adquieres las siguientes habilidades, solo puedes utilizar una vez cada una de ellas por combate.',
    useType: 'active',
    subFeatures: [
        {
            featureId: new ObjectId(),
            name: 'Hechizo Individual a Todos los Objetivos',
            description: 'Puedes lanzar un hechizo de un solo objetivo a todos los objetivos disponibles.',
            useType: 'active',
            action: 'free_action',
            uses: 1,
            triggerForRecover: 'at_combat_end',
            modifiers: [
                {
                    value: 1,
                    type: 'target_multiply',
                    description: 'Siguiente hechizo individual afecta a todos los objetivos disponibles',
                    target: 'self',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'actions'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Hechizo No-Daño como Acción Adicional',
            description: 'Puedes lanzar un hechizo que no cause daño como acción adicional.',
            useType: 'active',
            action: 'free_action',
            uses: 1,
            triggerForRecover: 'at_combat_end',
            modifiers: [
                {
                    value: 1,
                    type: 'action_conversion',
                    description: 'Siguiente hechizo no-daño se convierte en acción adicional',
                    target: 'self',
                    condition: 'non_damage_spell',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'actions'
                    }
                }
            ],
            state: 'ACTIVE'
        },
        {
            featureId: new ObjectId(),
            name: 'Curación Tirada Máxima',
            description: 'Puedes decidir que tu siguiente hechizo de curación restaure la tirada máxima en vez de lanzar.',
            useType: 'active',
            action: 'free_action',
            uses: 1,
            triggerForRecover: 'at_combat_end',
            modifiers: [
                {
                    value: 1,
                    type: 'maximize_heal',
                    description: 'Siguiente hechizo de curación usa tirada máxima',
                    target: 'self',
                    condition: 'heal_spell',
                    duration: {
                        type: 'temporal',
                        duration: 1,
                        medition: 'actions'
                    }
                }
            ],
            state: 'ACTIVE'
        }
    ],
    state: 'ACTIVE'
};
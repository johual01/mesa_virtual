const { ObjectId } = require('mongodb');

const characterClass = await db.personaclasses.insertOne({
    name: 'Dramaturgic',
    description: 'Lanzador escenico que manipula el combate con utileria, narrativa y fantasia',
    HPDice: '1d8',
    salvations: ['courage', 'charisma'],
    resourceType: 'AP',
    levels: [],
    levelTable: {
        columns: ['Nivel', 'Competencia', 'Beneficios', 'Usos de Utilería'],
        rows: [
            { Nivel: '1', Competencia: '+2', Beneficios: 'Afinidad Elemental, Arma predilecta', 'Usos de Utilería': '-' },
            { Nivel: '2', Competencia: '+2', Beneficios: 'Arma de Chéjov', 'Usos de Utilería': '1' },
            { Nivel: '3', Competencia: '+2', Beneficios: 'Puesta en Escena', 'Usos de Utilería': '1' },
            { Nivel: '4', Competencia: '+2', Beneficios: 'Elección de subclase 1', 'Usos de Utilería': '1' },
            { Nivel: '5', Competencia: '+3', Beneficios: 'Mejora de característica o beneficio', 'Usos de Utilería': '1' },
            { Nivel: '6', Competencia: '+3', Beneficios: 'Cliché', 'Usos de Utilería': '1' },
            { Nivel: '7', Competencia: '+3', Beneficios: 'Multiataque 1', 'Usos de Utilería': '2' },
            { Nivel: '8', Competencia: '+3', Beneficios: 'Mecánica de subclase 2', 'Usos de Utilería': '2' },
            { Nivel: '9', Competencia: '+4', Beneficios: 'Mejora de característica o beneficio', 'Usos de Utilería': '2' },
            { Nivel: '10', Competencia: '+4', Beneficios: 'Bis', 'Usos de Utilería': '2' },
            { Nivel: '11', Competencia: '+4', Beneficios: 'Fantasía Materializada', 'Usos de Utilería': '2' },
            { Nivel: '12', Competencia: '+4', Beneficios: 'Cambio de Panorama', 'Usos de Utilería': '2' },
            { Nivel: '13', Competencia: '+5', Beneficios: 'Mecánica de subclase 3', 'Usos de Utilería': '3' },
            { Nivel: '14', Competencia: '+5', Beneficios: 'Mejora de característica o beneficio', 'Usos de Utilería': '3' },
            { Nivel: '15', Competencia: '+5', Beneficios: 'Multiataque 2', 'Usos de Utilería': '3' },
            { Nivel: '16', Competencia: '+5', Beneficios: 'Flashback', 'Usos de Utilería': '3' },
            { Nivel: '17', Competencia: '+6', Beneficios: 'Giro Argumental', 'Usos de Utilería': '3' },
            { Nivel: '18', Competencia: '+6', Beneficios: 'Mecánica de subclase 4', 'Usos de Utilería': '3' },
            { Nivel: '19', Competencia: '+6', Beneficios: 'Mejora de característica o beneficio', 'Usos de Utilería': '4' },
            { Nivel: '20', Competencia: '+6', Beneficios: 'Deus Ex Machina', 'Usos de Utilería': '5' }
        ]
    }
})

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

    // Nivel 2
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
        name: 'Anticipación',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Mueves a un aliado, con su consentimiento, a una posición cualquiera dentro del listado de iniciativa.',
        concentration: false,
        effects: [{ type: 'change_initiative', target: 'ally', value: 'selection', condition: 'ally consent' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Replica',
        cost: [{ amount: 1, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Repites un hechizo que un aliado haya lanzado esta ronda.',
        concentration: false,
        effects: [{ type: 'cast_spell', target: 'ally', trigger: 'at_spell', condition: 'ally spell cast this round', reduction: 1 }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 4
    {
        name: 'Salida de Escena',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Ataque todopoderoso y fuerza al enemigo a alejarse todo su movimiento de ti con salvación de sabiduría.',
        concentration: false,
        requireSalvation: true,
        cd: '{magic_save}',
        effects: [
            { type: 'damage', damageType: 'almighty', dice: '3d6', target: 'enemy', range: { type: 'ranged', range: 6 } },
            { type: 'movement', target: 'enemy', movementType: 'forced_move_away', movement: '{enemy_movement}', salvation: 'knowledge' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
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

    // Nivel 5
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
        name: 'Barrera Mágica',
        cost: [{ amount: 2, resource: 'AP' }],
        alternativeCost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        action: 'action',
        alternativeAction: 'bonus_action',
        useType: 'active',
        category: 'shield',
        description: 'Previenes el siguiente daño mágico a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'magical', target: 'ally', uses: 1 }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 6
    {
        name: 'Establecer el Escenario',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Creas un área de 4 casillas de radio donde cambian los valores de daño y ataque físico/mágico.',
        concentration: true,
        effects: [
            {
                type: 'create_zone',
                zoneType: 'scenario_shift',
                target: 'all',
                range: { type: 'area', range: 4, shape: 'circle' },
                modifiers: [
                    { value: -3, type: 'damage', addTo: 'fisicalDamageModifiers', target: 'all' },
                    { value: -3, type: 'attack', addTo: 'fisicalAttackModifiers', target: 'all' },
                    { value: 3, type: 'damage', addTo: 'magicDamageModifiers', target: 'all' },
                    { value: 3, type: 'attack', addTo: 'magicAttackModifiers', target: 'all' }
                ]
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
        category: 'buff',
        description: 'Extiendes los bonificadores de un aliado por 3 turnos adicionales.',
        concentration: false,
        effects: [{ type: 'extend_buffs', target: 'ally', value: 3 }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 7
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
        description: 'Previenes el siguiente daño físico a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'physical', target: 'ally', uses: 1 }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Dramatismo',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Creas un área donde no se pueden restaurar PV o AP.',
        concentration: true,
        effects: [{ type: 'create_zone', zoneType: 'anti_recovery', target: 'all', range: { type: 'area', range: 3, shape: 'circle' }, duration: { type: 'concentration', duration: 10, medition: 'rounds' } }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 8
    {
        name: 'Distorsionar Imagen',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Por 10 rondas, los ataques individuales contra ti tienen desventaja.',
        concentration: true,
        modifiers: [{ type: 'attack', value: 'disadvantage', description: 'Desventaja para ataques contra ti', target: 'enemy', condition: 'target is self and attack is single', duration: { type: 'temporal', duration: 10, medition: 'rounds' }, etiquette: 'distorted_image' }],
        toList: 'list',
        state: 'ACTIVE'
    },
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

    // Nivel 9
    {
        name: 'Uso de utilería',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'utility',
        description: 'Disminuyes el coste de lanzamiento del siguiente hechizo a un aliado en 3 AP.',
        concentration: false,
        effects: [{ type: 'spell_cost_reduction', target: 'ally', reduction: 3, trigger: 'next_spell', condition: 'selection' }],
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

    // Nivel 10
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
        name: 'Pausa Intermedia',
        cost: [{ amount: 4, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Reduces 1 turno los debilitadores y extiendes 1 turno los potenciadores de aliados.',
        concentration: false,
        effects: [
            { type: 'remove_debuff_duration', target: 'all_allies', value: 1 },
            { type: 'extend_buffs', target: 'all_allies', value: 1 }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 11
    {
        name: 'Potenciación Compleja (F)',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [{ value: 5, type: 'damage', description: 'Aumenta en +5 el daño', target: 'ally', addTo: 'damageModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'complex_empowerment_damage' }],
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
        modifiers: [{ value: 3, type: 'attack', description: 'Aumenta en +3 el ataque', target: 'ally', addTo: 'attackModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'complex_empowerment_attack' }],
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
            { value: 3, type: 'defense', description: 'Aumenta en +3 la defensa', target: 'ally', addTo: 'defenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'complex_empowerment_defense' },
            { value: 2, type: 'magic_defense', description: 'Aumenta en +2 la resistencia mágica', target: 'ally', addTo: 'magicDefenseModifiers', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'complex_empowerment_defense' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 12
    {
        name: 'Cono de la Vergüenza',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'debuff',
        description: 'Aplica un efecto de verguenza espiritual en enemigo cuerpo a cuerpo hasta 10 rondas.',
        concentration: true,
        requireSalvation: true,
        cd: '{magic_save}',
        effects: [
            {
                type: 'debuff',
                target: 'enemy',
                range: { type: 'melee', range: 1 },
                salvation: 'knowledge',
                duration: { type: 'temporal', duration: 10, medition: 'rounds' },
                condition: 'selection',
                options: [
                    'disadvantage on selected stat saves and checks',
                    'disadvantage on attacks against you',
                    'must pass wisdom save at turn start or lose action',
                    'receives +1d8 damage from your attacks/spells'
                ]
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
        action: 'action',
        alternativeAction: 'bonus_action',
        useType: 'active',
        category: 'shield',
        description: 'Previenes la siguiente instancia de daño a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'almighty', target: 'ally', uses: 1 }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 13
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

    // Nivel 14
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
        name: 'Explosión Mágica',
        cost: [{ amount: 9, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'attack',
        description: 'Realizas ataque mágico de afinidad en radio 4 y potencias daño de arma por 3 turnos.',
        concentration: false,
        effects: [{ type: 'damage', damageType: 'affinity', dice: '5d8', target: 'enemies_at_range', range: { type: 'area', range: 4, shape: 'circle' } }],
        modifiers: [{ value: '1d6', type: 'weapon_damage', target: 'self', description: 'Aumenta daño de arma en 1d6', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'magic_explosion' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 15
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
            { value: 3, type: 'attack', target: 'ally', addTo: 'attackModifiers', description: 'Aumenta el ataque', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'full_empowerment' },
            { value: 5, type: 'damage', target: 'ally', addTo: 'damageModifiers', description: 'Aumenta el daño', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'full_empowerment' },
            { value: 3, type: 'defense', target: 'ally', addTo: 'defenseModifiers', description: 'Aumenta la defensa', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'full_empowerment' },
            { value: 2, type: 'magic_defense', target: 'ally', addTo: 'magicDefenseModifiers', description: 'Aumenta la resistencia mágica', duration: { type: 'temporal', duration: 3, medition: 'rounds' }, etiquette: 'full_empowerment' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
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

    // Nivel 16
    {
        name: 'Devolución',
        cost: [{ amount: 0, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'passive',
        category: 'counter',
        description: 'Si la tirada de ataque físico enemigo es 1-5, realizas ataque con arma gratuito interrumpiendo el ataque.',
        concentration: false,
        effects: [{ type: 'attack_with_weapon', target: 'enemy', trigger: 'before_receive_attack', condition: 'physical attack roll is between 1 and 5' }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Desplazamiento Acelerado',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Te teletransportas hasta 6 casillas a un lugar sin ocupar que puedas ver.',
        concentration: false,
        effects: [{ type: 'teleport', target: 'self', movement: 6, condition: 'visible and unoccupied tile' }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 17
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
        name: 'Barrera Infranqueable',
        cost: [{ amount: 4, resource: 'AP' }],
        alternativeCost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        action: 'action',
        alternativeAction: 'bonus_action',
        useType: 'active',
        category: 'shield',
        description: 'Previenes las dos siguientes instancias de daño a ti o a un aliado.',
        concentration: false,
        effects: [{ type: 'barrier', barrierType: 'almighty', target: 'ally', uses: 2 }],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 18
    {
        name: 'Hechizo Impactante',
        cost: [{ amount: 6, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'debuff',
        description: 'Tu siguiente hechizo de daño puede aturdir con salvación de coraje vs tu lanzamiento.',
        concentration: false,
        effects: [{ type: 'status_effect', statusType: 'stunned', target: 'enemy', trigger: 'next_spell_attack', salvation: 'courage', cd: '{magic_launch}' }],
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
        description: 'Rompes concentración y potenciaciones enemigas y eliminas debilitadores aliados.',
        concentration: false,
        effects: [
            { type: 'break_concentration', target: 'all_enemies' },
            { type: 'remove_buffs', target: 'all_enemies' },
            { type: 'remove_debuffs', target: 'all_allies' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },

    // Nivel 19
    {
        name: 'Luces, Cámara, Acción',
        cost: [{ amount: 10, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'utility',
        description: 'Provocas taunt por voluntad y acumulas daño recibido para liberarlo en cono de 6 casillas.',
        concentration: false,
        requireSalvation: true,
        cd: '{magic_save}',
        effects: [
            { type: 'taunt', target: 'all_enemies', salvation: 'charisma', duration: { type: 'temporal', duration: 3, medition: 'rounds' } },
            { type: 'accumulate_damage', target: 'self', duration: { type: 'temporal', duration: 3, medition: 'rounds' } },
            { type: 'release_accumulated_damage', target: 'enemies_at_range', range: { type: 'area', range: 6, shape: 'cone' }, action: 'bonus_action', damageType: 'affinity' }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Corte de Escena',
        cost: [{ amount: 12, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        useType: 'active',
        category: 'counter',
        description: 'Evitas el lanzamiento de hechizos de todos los enemigos hasta el inicio de tu siguiente turno.',
        concentration: true,
        effects: [{ type: 'create_zone', zoneType: 'silence_enemy_spells', target: 'all_enemies', duration: { type: 'temporal', duration: 1, medition: 'turns' } }],
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
        description: 'Disminuyes el coste de tus hechizos a la mitad.',
        concentration: false,
        effects: [{ type: 'spell_cost_reduction', spellCategory: 'all', reduction: 0.5, target: 'self', permanent: true, etiquette: 'spell_master' }],
        toList: 'list',
        state: 'ACTIVE'
    },
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
            { type: 'cast_spell', target: 'ally', spellCategory: 'utility', trigger: 'at_spell', uses: 1, duration: { type: 'temporal', duration: 5, medition: 'turns' } },
            { type: 'allow_second_concentration', target: 'ally', duration: { type: 'temporal', duration: 5, medition: 'turns' } }
        ],
        modifiers: [{ value: 2, type: 'magic_defense', description: 'Aumenta en +2 la resistencia mágica', target: 'ally', addTo: 'magicDefenseModifiers', duration: { type: 'temporal', duration: 5, medition: 'turns' }, etiquette: 'magic_haste' }],
        toList: 'list',
        state: 'ACTIVE'
    }
])

const spells = listSpells.insertedIds;

const subclass = await db.personasubclasses.insertMany([
    {
        name: 'Theatre',
        description: 'Manipula marionetas y vinculos tacticos en el campo de batalla',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e01'),
                        name: 'Levantar el Telón',
                        description: 'Tu utileria se reemplaza por marionetas con turno independiente y estadisticas escalables.',
                        useType: 'active',
                        action: 'action',
                        effects: [
                            { type: 'replace_effect', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e13'), value: 'puppets' },
                            { type: 'summon', target: 'self', value: 'puppet', uses: 2, description: 'Invocas marionetas con estadisticas del rasgo' },
                            { type: 'grant_independent_turn', target: 'self', value: 'puppet_after_user' }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e02'),
                                name: 'Conexión Sensorial',
                                description: 'Con acción adicional puedes ver, oír y hablar a través de la marioneta durante su turno.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [{ type: 'transfer_senses', target: 'self', value: 'puppet' }],
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
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e03'),
                        name: 'Hilar y Coser',
                        description: 'Puedes lanzar hechizos desde tus marionetas, moverlas en tu turno y redirigir ataques a ellas como reacción.',
                        useType: 'passive',
                        effects: [
                            { type: 'cast_spell', target: 'self', condition: 'spell origin can be puppet location' },
                            { type: 'move_summon', target: 'self', value: 'puppet movement on your turn' },
                            { type: 'redirect_attack', target: 'enemy', action: 'reaction', condition: 'ranged attack or spell', value: 'puppet becomes target' }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e04'),
                        name: 'Atar el Destino',
                        description: 'Atas dos objetivos con hilos y habilitas acciones de fluctuacion, compartir vitalidad, anclar y dividir dolor.',
                        useType: 'active',
                        action: 'action',
                        effects: [
                            { type: 'link_targets', target: 'all', value: 2, range: { type: 'ranged', range: 24 }, duration: { type: 'temporal', duration: 1, medition: 'minutes' } },
                            { type: 'movement_lock', target: 'all', condition: 'try to exceed link distance', salvation: 'courage', cd: '{magic_save}' }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e05'),
                                name: 'Fluctuación de Espíritu',
                                description: 'Acción adicional: robas 1d6 AP de un objetivo y se lo restauras al otro.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [
                                    { type: 'recover_resource', resource: 'AP', value: '-1d6', target: 'enemy' },
                                    { type: 'recover_resource', resource: 'AP', value: '1d6', target: 'ally' }
                                ],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e06'),
                                name: 'Compartir Vitalidad',
                                description: 'Reacción: divides la curación entre ambos objetivos atados.',
                                useType: 'active',
                                action: 'reaction',
                                trigger: 'at_heal',
                                effects: [{ type: 'split_heal', target: 'all', value: 0.5 }],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e07'),
                                name: 'Anclar',
                                description: 'Acción adicional: reduces en 2 casillas la distancia entre objetivos atados.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [{ type: 'pull', target: 'all', movement: 2 }],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e08'),
                                name: 'Dividir Dolor',
                                description: 'Reacción: divides a la mitad el daño que recibiría uno de los objetivos y lo envías al otro.',
                                useType: 'active',
                                action: 'reaction',
                                trigger: 'before_receive_attack',
                                effects: [{ type: 'split_damage', target: 'all', value: 0.5 }],
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
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e09'),
                        name: 'Maestro Titiritero',
                        description: 'Duplicas marionetas activas, aumentas su alcance de movimiento y marcas objetivos desde ellas.',
                        useType: 'passive',
                        effects: [
                            { type: 'modify_feature_uses', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e01'), multiplier: 2 },
                            { type: 'modify_summon_movement_range', target: 'self', value: 6 },
                            { type: 'buff', target: 'all_allies', trigger: 'at_bonus_action', condition: 'target within 2 from puppet', modifiers: [{ type: 'attack', value: 'advantage', addTo: 'attackModifiers', duration: { type: 'temporal', duration: 1, medition: 'turns' } }] },
                            { type: 'status_effect', target: 'enemy', statusType: 'surprised', trigger: 'first time affected in combat', salvation: 'knowledge', cd: '{magic_save}', duration: { type: 'temporal', duration: 1, medition: 'turns' } }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    {
        name: 'Monologue',
        description: 'Escalado personal de criticos y conversion de hechizos en ofensiva individual',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0a'),
                        name: 'Acaparador',
                        description: 'Al lanzar hechizos de daño acumulas dados en tu arma para aplicarlos en tus siguientes 3 ataques.',
                        useType: 'passive',
                        effects: [
                            { type: 'store_spell_dice_on_weapon', target: 'self', trigger: 'at_spell_attack', value: 1, maxStacks: 3 },
                            { type: 'release_stored_dice', target: 'enemy', trigger: 'at_attack', uses: 3 }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0b'),
                        name: 'Narcisista',
                        description: 'Igualas critico aumentado entre hechizos y ataques, y acumulas +5% al lanzar hechizos no ofensivos.',
                        useType: 'passive',
                        effects: [
                            { type: 'equalize_critical_bonus', target: 'self', value: 'highest between spells and weapon' },
                            { type: 'buff', target: 'self', trigger: 'at_spell', condition: 'spell is not damage', modifiers: [{ type: 'critical', value: 5, addTo: ['criticalAttackModifiers', 'criticalModifiers'], duration: { type: 'temporal', duration: 2, medition: 'turns' }, maxStacks: 2 }] }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0c'),
                        name: 'Egoísta',
                        description: 'La acción adicional de Cambio de Panorama también sirve para efectos ofensivos, y recuperas AP al lanzar hechizos.',
                        useType: 'passive',
                        effects: [
                            { type: 'replace_effect', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e16'), value: 'bonus action can include offensive effects' },
                            { type: 'recover_resource', resource: 'AP', value: 1, target: 'self', trigger: 'at_spell' },
                            { type: 'advantage_on_roll', target: 'self', condition: 'Fantasia Materializada contested will roll' }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            },
            {
                level: 18,
                features: [
                    {
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0d'),
                        name: 'Solista',
                        description: 'Aumentas el maximo de dados de Acaparador a 5, y puedes lanzar hechizo no ofensivo gratis durante hechizo de daño.',
                        useType: 'passive',
                        effects: [
                            { type: 'modify_feature_uses', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0a'), maxStacks: 5 },
                            { type: 'cast_spell', target: 'self', trigger: 'at_spell_attack', spellCategory: 'utility', reduction: 1 },
                            { type: 'recover_resource', resource: 'AP', value: 'full', target: 'self', uses: 1, triggerForRecover: 'at_combat_end' },
                            { type: 'create_zone', zoneType: 'cannot_recover_self_resources', target: 'self', trigger: 'after_use', duration: { type: 'temporal', duration: 1, medition: 'combat' } }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    {
        name: 'Musical',
        description: 'Soporte ritmico de area con sintonias, movimiento y defensa sonora',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0e'),
                        name: 'Flashmob',
                        description: 'Ganas movilidad vertical y sintonias en area como acción adicional.',
                        useType: 'active',
                        effects: [
                            { type: 'movement', target: 'self', movementType: 'vertical_surface_walk', condition: 'hands free' }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0f'),
                                name: 'Sintonía de Curación',
                                description: 'Aliados en 6 casillas restauran PV igual a tu nivel.',
                                useType: 'active',
                                action: 'bonus_action',
                                effects: [{ type: 'heal', healType: 'HP', heal: '{level}', target: 'allies_at_range', range: { type: 'area', range: 6, shape: 'circle' } }],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e10'),
                                name: 'Sintonía de Velocidad',
                                description: 'Aliados en 6 casillas duplican velocidad hasta el inicio de tu siguiente turno.',
                                useType: 'active',
                                action: 'bonus_action',
                                modifiers: [{ type: 'speed', value: 'double', target: 'allies_at_range', addTo: 'speedModifiers', range: { type: 'area', range: 6, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' } }],
                                state: 'ACTIVE'
                            },
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e11'),
                                name: 'Sintonía de Potencia',
                                description: 'Hechizos aliados ganan daño adicional y una segunda instancia de daño.',
                                useType: 'active',
                                action: 'bonus_action',
                                modifiers: [{ type: 'damage', value: 2, target: 'allies_at_range', addTo: 'magicDamageModifiers', range: { type: 'area', range: 6, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' } }],
                                effects: [{ type: 'duplicate_spell_damage_instance', target: 'allies_at_range', range: { type: 'area', range: 6, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' } }],
                                state: 'ACTIVE'
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ],
                additionalSpells: []
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e12'),
                        name: 'Synthwave',
                        description: 'Reacción para empujar enemigo atacante y causar desventaja en sus ataques del turno.',
                        useType: 'active',
                        action: 'reaction',
                        trigger: 'at_enemy_attack',
                        effects: [
                            { type: 'push', target: 'enemy', movement: 2, salvation: 'charisma', cd: '{magic_save}' },
                            { type: 'debuff', target: 'enemy', modifiers: [{ type: 'attack', value: 'disadvantage', addTo: 'attackModifiers', duration: { type: 'temporal', duration: 1, medition: 'turns' } }] }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e18'),
                                name: 'Sintonía Amplificada',
                                description: 'Un número de veces igual a tu carisma, duplicas curación de sintonía y recuperas AP.',
                                useType: 'active',
                                uses: '{charisma_save}',
                                triggerForRecover: 'at_combat_end',
                                effects: [
                                    { type: 'duplicate_feature_effect', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0f') },
                                    { type: 'recover_resource', resource: 'AP', value: '{half_level}', target: 'self' }
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
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e50'),
                        name: 'Blue Soul',
                        description: 'Mejora todas las sintonías de Flashmob y habilita doble sintonía tras impactar Fantasía Materializada.',
                        useType: 'passive',
                        effects: [
                            { type: 'add_followup_effect', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e10'), value: 'next action spell as bonus action for one ally' },
                            { type: 'add_followup_effect', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0f'), value: 'remove all debuffs and status from one ally' },
                            { type: 'add_followup_effect', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e11'), value: 'break extra shield and all out attack on full break' },
                            { type: 'activate_feature', target: 'self', trigger: 'at_spell', condition: 'fancy materialized fantasy impacted', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e19') }
                        ],
                        subFeatures: [
                            {
                                featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e19'),
                                name: 'Doble Sintonía',
                                description: 'El próximo uso de sintonía activa dos sintonías a la vez.',
                                useType: 'active',
                                uses: 1,
                                triggerForRecover: 'at_turn_end',
                                effects: [{ type: 'duplicate_feature_effect', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e0e') }],
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
                        featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e51'),
                        name: 'Low Fidelity',
                        description: 'Acción de defensa musical con 200 PV temporales para aliados y duplicación de hechizos lanzados.',
                        useType: 'active',
                        action: 'action',
                        uses: 1,
                        triggerForRecover: 'at_combat_end',
                        effects: [
                            { type: 'heal', healType: 'temp_hp', heal: '200', target: 'allies_at_range', range: { type: 'area', range: 6, shape: 'circle' } },
                            { type: 'create_zone', zoneType: 'temp_hp_decay', target: 'allies_at_range', value: 100, trigger: 'at_turn_start' },
                            { type: 'duplicate_spell_cast', target: 'self', duration: { type: 'temporal', duration: 1, medition: 'combat' } }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ],
        additionalSpells: 2
    }
])

const musicalSubclassId = subclass.insertedIds[2];

const musicalAdditionalSpells = await db.spells.insertMany([
    {
        name: 'Curación Común I',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: musicalSubclassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 2d4 en PV a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '2d4', target: 'ally' }],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Rápida I',
        cost: [{ amount: 1, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: musicalSubclassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Restauras 1d4 en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '1d4', target: 'ally' }],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Común II',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: musicalSubclassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 3d6 en PV a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '3d6', target: 'ally' }],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Rápida II',
        cost: [{ amount: 2, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: musicalSubclassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Restauras 2d4 en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '2d4', target: 'ally' }],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Común III',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: musicalSubclassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 4d8 en PV a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '4d8', target: 'ally' }],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Rápida III',
        cost: [{ amount: 3, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: musicalSubclassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Restauras 3d6 en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '3d6', target: 'ally' }],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Común IV',
        cost: [{ amount: 7, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: musicalSubclassId,
        useType: 'active',
        category: 'heal',
        description: 'Restauras 6d10 en PV a un aliado.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '6d10', target: 'ally' }],
        toList: 'additional',
        state: 'ACTIVE'
    },
    {
        name: 'Curación Rápida IV',
        cost: [{ amount: 5, resource: 'AP' }],
        system: 'PERSONAD20',
        class: characterClassId,
        subclass: musicalSubclassId,
        useType: 'active',
        action: 'bonus_action',
        category: 'heal',
        description: 'Restauras 4d8 en PV a un aliado. Acción adicional.',
        concentration: false,
        effects: [{ type: 'heal', healType: 'HP', heal: '4d8', target: 'ally' }],
        toList: 'additional',
        state: 'ACTIVE'
    }
])

const musicalSpells = musicalAdditionalSpells.insertedIds;

await db.personasubclasses.updateOne(
    { _id: musicalSubclassId, 'levels.level': 4 },
    { $set: { 'levels.$.additionalSpells': [musicalSpells[0], musicalSpells[1]] } }
)

await db.personasubclasses.updateOne(
    { _id: musicalSubclassId, 'levels.level': 8 },
    { $set: { 'levels.$.additionalSpells': [musicalSpells[2], musicalSpells[3]] } }
)

await db.personasubclasses.updateOne(
    { _id: musicalSubclassId, 'levels.level': 13 },
    { $set: { 'levels.$.additionalSpells': [musicalSpells[4], musicalSpells[5]] } }
)

await db.personasubclasses.updateOne(
    { _id: musicalSubclassId, 'levels.level': 18 },
    { $set: { 'levels.$.additionalSpells': [musicalSpells[6], musicalSpells[7]] } }
)

const subclasses = subclass.insertedIds;

await db.personaclasses.updateOne(
    { _id: characterClassId },
    {
        $set: {
            levels: [
                {
                    level: 1,
                    proficency: 2,
                    spells: [spells[0]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e20'),
                            name: 'Afinidad Elemental',
                            description: 'Defines una afinidad elemental principal para tus hechizos de daño.',
                            useType: 'passive',
                            effects: [{ type: 'set_elemental_affinity', target: 'self', condition: 'selection' }],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e21'),
                            name: 'Arma Predilecta',
                            description: 'Seleccionas un arma predilecta y mejoras su vínculo para efectos de clase.',
                            useType: 'passive',
                            effects: [{ type: 'set_favored_weapon', target: 'self', condition: 'selection' }],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 5,
                    maxPreparedSpells: 4
                },
                {
                    level: 2,
                    proficency: 2,
                    spells: [spells[1], spells[2], spells[3]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e13'),
                            name: 'Arma de Chéjov',
                            description: 'Materializas elementos de utilería con acción adicional. Solo un elemento activo a la vez.',
                            useType: 'active',
                            action: 'bonus_action',
                            usesPerLevel: [
                                { minLevel: 2, maxLevel: 6, uses: 1 },
                                { minLevel: 7, maxLevel: 12, uses: 2 },
                                { minLevel: 13, maxLevel: 18, uses: 3 },
                                { minLevel: 19, maxLevel: 19, uses: 4 },
                                { minLevel: 20, maxLevel: 20, uses: 5 }
                            ],
                            triggerForRecover: 'at_combat_end',
                            effects: [
                                { type: 'summon_prop', target: 'self', range: { type: 'ranged', range: 6 }, condition: 'only one prop active' }
                            ],
                            subFeatures: [
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e22'),
                                    name: 'Pantano',
                                    description: 'Terreno difícil en área alrededor del elemento.',
                                    useType: 'active',
                                    action: 'bonus_action',
                                    effects: [
                                        { type: 'create_zone', zoneType: 'difficult_terrain', target: 'all', range: { type: 'area', range: 2, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 2 },
                                        { type: 'create_zone', zoneType: 'difficult_terrain', target: 'all', range: { type: 'area', range: 3, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 7 },
                                        { type: 'create_zone', zoneType: 'difficult_terrain', target: 'all', range: { type: 'area', range: 4, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 15 },
                                        { type: 'create_zone', zoneType: 'difficult_terrain', target: 'all', range: { type: 'area', range: 6, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 20 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e23'),
                                    name: 'Escudo',
                                    description: 'Otorga resistencia reactiva en rango del elemento.',
                                    useType: 'active',
                                    action: 'reaction',
                                    effects: [{ type: 'resistance_from_prop', target: 'ally', range: { type: 'area', range: 3, shape: 'circle' }, trigger: 'before_receive_attack' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e24'),
                                    name: 'Pistola',
                                    description: 'Disparo de afinidad desde el elemento a larga distancia.',
                                    useType: 'active',
                                    action: 'bonus_action',
                                    effects: [
                                        { type: 'damage', damageType: 'affinity', dice: '1d6', target: 'enemy', range: { type: 'ranged', range: 12 }, levelCondition: 2 },
                                        { type: 'damage', damageType: 'affinity', dice: '2d6', target: 'enemy', range: { type: 'ranged', range: 12 }, levelCondition: 5 },
                                        { type: 'damage', damageType: 'affinity', dice: '3d6', target: 'enemy', range: { type: 'ranged', range: 12 }, levelCondition: 11 },
                                        { type: 'damage', damageType: 'affinity', dice: '4d6', target: 'enemy', range: { type: 'ranged', range: 12 }, levelCondition: 17 },
                                        { type: 'damage', damageType: 'affinity', dice: '6d6', target: 'enemy', range: { type: 'ranged', range: 12 }, levelCondition: 20 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e25'),
                                    name: 'Corriente',
                                    description: 'Aumenta movilidad aliada alrededor del elemento.',
                                    useType: 'active',
                                    action: 'bonus_action',
                                    modifiers: [
                                        { type: 'speed', value: 3, target: 'allies_at_range', addTo: 'speedModifiers', range: { type: 'area', range: 3, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' } }
                                    ],
                                    effects: [
                                        { type: 'ignore_difficult_terrain', target: 'allies_at_range', range: { type: 'area', range: 3, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 7 },
                                        { type: 'double_base_speed', target: 'allies_at_range', range: { type: 'area', range: 3, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 15 },
                                        { type: 'expand_prop_radius', target: 'self', value: 2, levelCondition: 20 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e26'),
                                    name: 'Bomba',
                                    description: 'Explosión mágica de afinidad alrededor del elemento.',
                                    useType: 'active',
                                    action: 'bonus_action',
                                    effects: [
                                        { type: 'damage', damageType: 'affinity', dice: '2d8', target: 'enemies_at_range', range: { type: 'area', range: 2, shape: 'circle' }, levelCondition: 2 },
                                        { type: 'damage', damageType: 'affinity', dice: '4d8', target: 'enemies_at_range', range: { type: 'area', range: 4, shape: 'circle' }, levelCondition: 10 },
                                        { type: 'damage', damageType: 'affinity', dice: '6d8', target: 'enemies_at_range', range: { type: 'area', range: 8, shape: 'circle' }, levelCondition: 20 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e27'),
                                    name: 'Auriculares',
                                    description: 'Aliados cercanos ganan mejoras de concentración.',
                                    useType: 'active',
                                    action: 'bonus_action',
                                    effects: [
                                        { type: 'buff', target: 'allies_at_range', range: { type: 'area', range: 2, shape: 'circle' }, modifiers: [{ type: 'concentration', value: 'advantage', addTo: 'concentrationModifiers' }], duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 2 },
                                        { type: 'buff', target: 'allies_at_range', range: { type: 'area', range: 4, shape: 'circle' }, modifiers: [{ type: 'concentration', value: 'advantage', addTo: 'concentrationModifiers' }], duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 7 },
                                        { type: 'buff', target: 'allies_at_range', range: { type: 'area', range: 8, shape: 'circle' }, modifiers: [{ type: 'concentration', value: 'advantage', addTo: 'concentrationModifiers' }], duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 15 },
                                        { type: 'buff', target: 'allies_at_range', range: { type: 'area', range: 8, shape: 'circle' }, modifiers: [{ type: 'concentration', value: 'cannot_break', addTo: 'concentrationModifiers' }], duration: { type: 'temporal', duration: 1, medition: 'combat' }, levelCondition: 20 }
                                    ],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e28'),
                                    name: 'Vendas',
                                    description: 'Otorga PV temporales a un aliado en rango del elemento.',
                                    useType: 'active',
                                    action: 'bonus_action',
                                    effects: [
                                        { type: 'heal', healType: 'temp_hp', heal: '{level}', target: 'ally', range: { type: 'area', range: 3, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 2 },
                                        { type: 'heal', healType: 'temp_hp', heal: '{level * 2}', target: 'ally', range: { type: 'area', range: 3, shape: 'circle' }, duration: { type: 'temporal', duration: 1, medition: 'turns' }, levelCondition: 10 }
                                    ],
                                    state: 'ACTIVE'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 4
                },
                {
                    level: 3,
                    proficency: 2,
                    spells: [spells[4], spells[5]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e14'),
                            name: 'Puesta en Escena',
                            description: 'Aumenta el crítico de hechizos en 5% y permite críticos en hechizos no ofensivos.',
                            useType: 'passive',
                            modifiers: [
                                { type: 'critical', value: 5, target: 'self', addTo: 'magicCriticalModifiers', permanent: true },
                                { type: 'critical', value: 'ceil({all_sources_critical_bonus / 2})', target: 'self', condition: 'spell is non-offensive', addTo: 'magicCriticalModifiers', permanent: true }
                            ],
                            effects: [{ type: 'allow_non_offensive_spell_critical', target: 'self', trigger: 'at_spell' }],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 4
                },
                {
                    level: 4,
                    proficency: 2,
                    spells: [spells[6], spells[7]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 6,
                    selectSubclass: true,
                    gainSubclassFeature: true
                },
                {
                    level: 5,
                    proficency: 3,
                    spells: [spells[8], spells[9]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 6,
                    gainStatIncrease: true
                },
                {
                    level: 6,
                    proficency: 3,
                    spells: [spells[10], spells[11]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e15'),
                            name: 'Cliché',
                            description: 'Una vez por incursión recuperas AP igual a tu nivel y una vez por combate repites una tirada.',
                            useType: 'passive',
                            subFeatures: [
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e29'),
                                    name: 'Recuperación Cliché',
                                    description: 'Una vez por incursión, recuperas AP igual a tu nivel.',
                                    useType: 'active',
                                    action: 'free_action',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [{ type: 'recover_resource', resource: 'AP', value: '{level}', target: 'self' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e30'),
                                    name: 'Repetición Dramática',
                                    description: 'Una vez por combate repites una tirada; desde nivel 15 puede ser éxito automático.',
                                    useType: 'active',
                                    action: 'reaction',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [
                                        { type: 'reroll', target: 'self', levelCondition: 6 },
                                        { type: 'automatic_success', target: 'self', levelCondition: 15 }
                                    ],
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
                    level: 7,
                    proficency: 3,
                    spells: [spells[12], spells[13]],
                    features: [
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4a'),
                            name: 'Multi Ataque I',
                            description: 'Puedes realizar un ataque adicional con arma como parte de un ataque con arma o hechizo.',
                            useType: 'passive',
                            action: 'free_action',
                            effects: [{ type: 'attack_with_weapon', target: 'enemy', trigger: 'at_attack', description: 'Realiza un ataque adicional' }],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 6
                },
                {
                    level: 8,
                    proficency: 3,
                    spells: [spells[14], spells[15]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 7,
                    gainSubclassFeature: true
                },
                {
                    level: 9,
                    proficency: 4,
                    spells: [spells[16], spells[17]],
                    features: [],
                    APGained: 2,
                    maxPreparedSpells: 7,
                    gainStatIncrease: true
                },
                {
                    level: 10,
                    proficency: 4,
                    spells: [spells[18], spells[19]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e31'),
                            name: 'Bis',
                            description: 'Si fallas un hechizo, puedes repetirlo contra otro objetivo usando acción adicional. 3 usos por combate, escala a 4 y 5.',
                            useType: 'active',
                            action: 'bonus_action',
                            usesPerLevel: [
                                { minLevel: 10, maxLevel: 14, uses: 3 },
                                { minLevel: 15, maxLevel: 19, uses: 4 },
                                { minLevel: 20, maxLevel: 20, uses: 5 }
                            ],
                            triggerForRecover: 'at_combat_end',
                            trigger: 'at_failed_spell',
                            effects: [{ type: 'cast_spell', target: 'enemy', condition: 'same spell different target within 6 from original target', reduction: 1 }],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 7
                },
                {
                    level: 11,
                    proficency: 4,
                    spells: [spells[20], spells[21], spells[22]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e32'),
                            name: 'Fantasía Materializada',
                            description: 'Al lanzar hechizos puedes disputar interpretación para agregar un efecto adicional narrativo.',
                            useType: 'active',
                            trigger: 'at_spell',
                            effects: [
                                { type: 'contest_roll', target: 'enemy', condition: 'offensive spell', value: 'interpretation vs will' },
                                { type: 'contest_roll', target: 'enemy', condition: 'support spell, target chosen by GM', value: 'interpretation vs will' }
                            ],
                            subFeatures: [
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e33'),
                                    name: 'Destello Gemelo',
                                    description: 'Adelantas un hechizo de aliado y ambos ganan un dado de daño adicional.',
                                    useType: 'active',
                                    effects: [{ type: 'cast_spell', target: 'ally', condition: 'ally consent', reduction: 1 }, { type: 'damage', target: 'self', condition: 'both spells', dice: 1 }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e34'),
                                    name: 'Eco',
                                    description: 'Causas daño mínimo ahora y repites la tirada al final del turno del oponente.',
                                    useType: 'active',
                                    effects: [{ type: 'set_damage_to_minimum', target: 'enemy' }, { type: 'repeat_damage_roll', target: 'enemy', trigger: 'at_turn_end' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e35'),
                                    name: 'Rebote',
                                    description: 'El hechizo impacta un objetivo adicional aumentando su coste.',
                                    useType: 'active',
                                    effects: [{ type: 'additional_target', target: 'enemy', value: 1 }, { type: 'spell_cost_increase', target: 'self', value: 1 }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e36'),
                                    name: 'Cambio Elemental',
                                    description: 'Cambias el elemento del hechizo a costa de reducir su daño total a la mitad.',
                                    useType: 'active',
                                    effects: [{ type: 'change_spell_element', target: 'self', condition: 'selection' }, { type: 'damage', target: 'self', value: 0.5, condition: 'half total damage' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e37'),
                                    name: 'Destello',
                                    description: 'Duplicas efectos de hechizo no ofensivo reduciendo su duración a 1 turno.',
                                    useType: 'active',
                                    effects: [{ type: 'duplicate_spell_effect', target: 'self', condition: 'non-offensive spell' }, { type: 'set_spell_duration', target: 'self', value: 1, condition: 'turns' }],
                                    state: 'ACTIVE'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 7
                },
                {
                    level: 12,
                    proficency: 4,
                    spells: [spells[23], spells[24]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e16'),
                            name: 'Cambio de Panorama',
                            description: 'Obtienes una acción adicional extra para elementos no ofensivos y puedes tener 2 elementos activos.',
                            useType: 'passive',
                            modifiers: [{ type: 'bonus_action', value: 1, target: 'self', addTo: 'bonusActionModifiers', permanent: true, condition: 'non-offensive only' }],
                            effects: [
                                { type: 'modify_feature_uses', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e13'), value: 'active_props_max=2' }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 9
                },
                {
                    level: 13,
                    proficency: 5,
                    spells: [spells[25], spells[26]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 9,
                    gainSubclassFeature: true
                },
                {
                    level: 14,
                    proficency: 5,
                    spells: [spells[27], spells[28]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 9,
                    gainStatIncrease: true
                },
                {
                    level: 15,
                    proficency: 5,
                    spells: [spells[29], spells[30]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e38'),
                            name: 'Multiataque II',
                            description: 'Puedes realizar un ataque adicional más con arma como parte de un ataque con arma o hechizo.',
                            useType: 'passive',
                            action: 'free_action',
                            effects: [{ type: 'attack_with_weapon', target: 'enemy', trigger: 'at_attack' }],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 2,
                    maxPreparedSpells: 9
                },
                {
                    level: 16,
                    proficency: 5,
                    spells: [spells[31], spells[32]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e17'),
                            name: 'Flashback',
                            description: 'Cada impacto sucesivo de hechizos acumulas 1d4 para potenciar tiradas; fallar un hechizo reinicia acumulación.',
                            useType: 'passive',
                            trigger: 'at_spell_attack',
                            effects: [
                                { type: 'store_dice_pool', target: 'self', value: '1d4', trigger: 'at_spell_attack' },
                                { type: 'apply_stored_dice', target: 'self', trigger: 'before_roll_result', condition: 'selection' },
                                { type: 'duplicate_applied_value', target: 'self', condition: 'applied to damage roll' },
                                { type: 'reset_pool', target: 'self', trigger: 'at_failed_spell' }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 10
                },
                {
                    level: 17,
                    proficency: 6,
                    spells: [spells[33], spells[34]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e39'),
                            name: 'Giro Argumental',
                            description: 'Una vez por sesión activas una fantasía sin tirada; también recuperas beneficios de inicio de combate de ti o un aliado.',
                            useType: 'active',
                            subFeatures: [
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e3a'),
                                    name: 'Fantasía Inevitable',
                                    description: 'Activas una fantasía sin tirada de interpretación.',
                                    useType: 'active',
                                    action: 'free_action',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [{ type: 'automatic_success', target: 'self', condition: 'Fantasia Materializada contest' }],
                                    state: 'ACTIVE'
                                },
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e3b'),
                                    name: 'Reestreno',
                                    description: 'Recuperas beneficios de inicio de combate y su duración para ti o un aliado.',
                                    useType: 'active',
                                    action: 'action',
                                    uses: 1,
                                    triggerForRecover: 'at_combat_end',
                                    effects: [{ type: 'retrigger_combat_start_benefits', target: 'ally' }],
                                    state: 'ACTIVE'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 10
                },
                {
                    level: 18,
                    proficency: 6,
                    spells: [spells[35], spells[36]],
                    features: [],
                    APGained: 2,
                    maxPreparedSpells: 10,
                    gainSubclassFeature: true
                },
                {
                    level: 19,
                    proficency: 6,
                    spells: [spells[37], spells[38]],
                    features: [],
                    APGained: 1,
                    maxPreparedSpells: 10,
                    gainStatIncrease: true
                },
                {
                    level: 20,
                    proficency: 6,
                    spells: [spells[39], spells[40]],
                    features: [
                        {
                            featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e40'),
                            name: 'Deus Ex Machina',
                            description: 'Como reacción interrumpes acción enemiga con enfrentamiento de interpretación. Usos = carisma + 1.',
                            useType: 'active',
                            action: 'reaction',
                            uses: '{charisma_save + 1}',
                            trigger: 'at_enemy_action',
                            effects: [{ type: 'counter_action', target: 'enemy', condition: 'contested interpretation' }],
                            subFeatures: [
                                {
                                    featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e41'),
                                    name: 'Ensayo Extra',
                                    description: 'Si empiezas combate sin usos, obtienes uno adicional para este combate.',
                                    useType: 'passive',
                                    trigger: 'at_combat_start',
                                    effects: [{ type: 'recover_feature_use', target: 'self', featureId: new ObjectId('8f8f4b3b3f1d9a001f2b3e40'), condition: 'if no uses left' }],
                                    state: 'ACTIVE'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ],
                    APGained: 1,
                    maxPreparedSpells: 14
                }
            ]
        }
    }
)

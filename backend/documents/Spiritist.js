const { ObjectId } = require('mongodb');

// Crear la clase base Spiritist
const characterClassId = new ObjectId();
db.characterClass.insertOne({
    _id: characterClassId,
    name: 'Spiritist',
    description: 'Canalizador espiritual con auras de combate y golpes de espíritu que potencian aliados.',
    HPDice: '1d6',
    salvations: ['courage', 'knowledge'],
});

// Insertar los hechizos de Spiritist
db.spell.insertMany([
    // Nivel 1
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico I (I)',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        cost: 3,
        damage: '3d4',
        levelRequirement: 1,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'magical_affinity',
        castingAttribute: 'courage_or_intelligence',
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
        targetType: 'self_or_ally',
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Básica (P)',
        description: 'Aumenta en +2 el ataque por 3 turnos a ti o a un aliado.',
        cost: 2,
        damage: null,
        levelRequirement: 2,
        targetType: 'self_or_ally',
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Básica (D)',
        description: 'Aumenta en +2 a la defensa y +1 a la resistencia mágica por 3 turnos a ti o a un aliado.',
        cost: 2,
        damage: null,
        levelRequirement: 2,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: false,
        duration: 3,
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 3
    {
        spellId: new ObjectId(),
        name: 'Bendecir',
        description: 'Aumentas 1d4 en las tiradas de daño, ataque y salvaciones a ti o a un aliado. Dura 10 rondas.',
        cost: 3,
        damage: null,
        levelRequirement: 3,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: true,
        duration: 10,
        effects: [
            {
                type: 'damage_buff',
                value: '1d4',
                target: 'self_or_ally',
                duration: 10
            },
            {
                type: 'attack_buff',
                value: '1d4',
                target: 'self_or_ally',
                duration: 10
            },
            {
                type: 'save_buff',
                value: '1d4',
                target: 'self_or_ally',
                duration: 10
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Curación Común I',
        description: 'Restauras 2d4 más lanzamiento de hechizos en PV a un aliado.',
        cost: 2,
        damage: null,
        levelRequirement: 3,
        targetType: 'ally',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'healing',
                value: '2d4 + {spellcasting_modifier}',
                target: 'ally'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 4
    {
        spellId: new ObjectId(),
        name: 'Curación Rápida I',
        description: 'Restauras 1d4 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        cost: 1,
        damage: null,
        levelRequirement: 4,
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico I (A)',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        cost: 5,
        damage: '3d4',
        levelRequirement: 4,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'magical_affinity',
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 5
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico II (I)',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        cost: 5,
        damage: '4d6',
        levelRequirement: 5,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'magical_affinity',
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        name: 'Escudo de Espíritu',
        cost: [{ amount: 5, resource: 'AP' }],
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
    // Nivel 6
    {
        spellId: new ObjectId(),
        name: 'Arrepentimiento',
        description: 'Luego de que un ataque te impacte, usando tu reacción, puedes realizar una tirada enfrentada de salvación de coraje. Si superas al enemigo, el mismo no podrá realizar ataques contra ti durante el resto del turno.',
        cost: 3,
        damage: null,
        levelRequirement: 6,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'reaction',
        trigger: 'after_being_hit',
        effects: [
            {
                type: 'contested_save',
                save: 'courage',
                success: 'enemy_cannot_attack_you',
                duration: 'rest_of_turn'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Limpieza',
        description: 'Cura todos los estados alterados a ti o a un aliado.',
        cost: 3,
        damage: null,
        levelRequirement: 6,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'remove_all_status',
                target: 'self_or_ally'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 7
    {
        spellId: new ObjectId(),
        name: 'Aceleración',
        description: 'Obtienes +1 a defensa y +1 a tu resistencia mágica, +1 iniciativa y una reacción adicional. Se puede utilizar 1 vez por combate.',
        cost: 5,
        damage: null,
        levelRequirement: 7,
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Curación Común II',
        description: 'Restauras 3d6 más lanzamiento de hechizos en PV a un aliado.',
        cost: 3,
        damage: null,
        levelRequirement: 7,
        targetType: 'ally',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'healing',
                value: '3d6 + {spellcasting_modifier}',
                target: 'ally'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico II (A)',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        cost: 7,
        damage: '4d6',
        levelRequirement: 8,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'magical_affinity',
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 9
    {
        spellId: new ObjectId(),
        name: 'Deshacer Magia',
        description: 'Rompes la concentración de un enemigo y remueves sus potenciaciones.',
        cost: 5,
        damage: null,
        levelRequirement: 9,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'break_concentration',
                target: 'enemy'
            },
            {
                type: 'remove_buffs',
                target: 'enemy'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Marca del Castigo',
        description: 'Aumentas el daño de tu arma para el siguiente ataque en 1d6. Además, marcas al enemigo golpeado. Por cada golpe sucesivo que impactes luego de marcar a dicho enemigo causará un 1d6 adicional, puedes acumular este efecto hasta 5 veces. Si fallas un ataque, el efecto se termina. Acción adicional. Requiere concentración.',
        cost: 5,
        damage: null,
        levelRequirement: 9,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        action: 'bonus',
        effects: [
            {
                type: 'weapon_damage_buff',
                value: '1d6',
                target: 'next_attack'
            },
            {
                type: 'mark_target',
                stacking: { value: '1d6', max: 5 },
                endsOn: 'miss'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 10
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico III (I)',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        cost: 7,
        damage: '5d8',
        levelRequirement: 10,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'magical_affinity',
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Manto del Cruzado',
        description: 'Agregas la siguiente propiedad a tu aura activa: Cada vez que un aliado dentro del aura recibe daño, el causante recibe 1d6 de daño.',
        cost: 4,
        damage: null,
        levelRequirement: 10,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'aura_enhancement',
                effect: 'damage_reflection',
                value: '1d6',
                trigger: 'ally_receives_damage'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
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
        targetType: 'self_or_ally',
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (P)',
        description: 'Aumenta en +3 el ataque por 3 turnos a ti o a un aliado.',
        cost: 3,
        damage: null,
        levelRequirement: 11,
        targetType: 'self_or_ally',
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (D)',
        description: 'Aumenta en +3 la defensa y +2 a la resistencia mágica a ti o a un aliado.',
        cost: 3,
        damage: null,
        levelRequirement: 11,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: false,
        duration: 3,
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 12
    {
        spellId: new ObjectId(),
        name: 'Purificación',
        description: 'Cura todos los estados alterados a ti y a todos los aliados.',
        cost: 6,
        damage: null,
        levelRequirement: 12,
        targetType: 'self_and_all_allies',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'remove_all_status',
                target: 'self_and_all_allies'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Barrera Total',
        description: 'Previenes el siguiente daño a ti o a un aliado. Consume 2 SP adicionales si se desea lanzar con acción adicional.',
        cost: 3,
        damage: null,
        levelRequirement: 12,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'prevent_next_damage',
                target: 'self_or_ally'
            }
        ],
        bonusActionCost: 5,
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 13
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico III (A)',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        cost: 9,
        damage: '5d8',
        levelRequirement: 13,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'magical_affinity',
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Curación Común III',
        description: 'Restauras 4d8 más lanzamiento de hechizos en PV a un aliado.',
        cost: 5,
        damage: null,
        levelRequirement: 13,
        targetType: 'ally',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'healing',
                value: '4d8 + {spellcasting_modifier}',
                target: 'ally'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 14
    {
        spellId: new ObjectId(),
        name: 'Curación Rápida III',
        description: 'Restauras 3d6 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        cost: 3,
        damage: null,
        levelRequirement: 14,
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Explosión Mágica',
        description: 'En un radio de 4 casillas contigo como centro, realizas un ataque mágico de tu afinidad elemental. Aumenta el daño de tu arma en 1d6 de daño de tu afinidad durante 3 turnos.',
        cost: 9,
        damage: '5d8',
        levelRequirement: 14,
        targetType: 'self_centered_area',
        class: characterClassId,
        concentration: false,
        radius: 4,
        element: 'magical_affinity',
        effects: [
            {
                type: 'weapon_damage_buff',
                value: '1d6',
                target: 'self',
                duration: 3,
                element: 'magical_affinity'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
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
        targetType: 'self_or_ally',
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico IV (I)',
        description: 'Inflige daño de objetivo individual de la afinidad mágica del usuario.',
        cost: 9,
        damage: '6d10',
        levelRequirement: 15,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        element: 'magical_affinity',
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 16
    {
        spellId: new ObjectId(),
        name: 'Purificación Completa',
        description: 'Cura todos los estados alterados y debilitaciones a ti y a todos los aliados.',
        cost: 7,
        damage: null,
        levelRequirement: 16,
        targetType: 'self_and_all_allies',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'remove_all_status',
                target: 'self_and_all_allies'
            },
            {
                type: 'remove_all_debuffs',
                target: 'self_and_all_allies'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Protección contra Muerte',
        description: 'Marcas a un aliado a distancia cuerpo a cuerpo. Cuando este aliado caiga a 0 PV, se establecerá en 1 PV y el hechizo terminará.',
        cost: 6,
        damage: null,
        levelRequirement: 16,
        targetType: 'ally',
        class: characterClassId,
        concentration: true,
        range: 'melee',
        effects: [
            {
                type: 'death_protection',
                trigger: 'ally_reaches_0_hp',
                effect: 'set_to_1_hp_end_spell',
                target: 'marked_ally'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 17
    {
        spellId: new ObjectId(),
        name: 'Ataque Mágico IV (A)',
        description: 'Inflige daño de objetivo en área de la afinidad mágica del usuario.',
        cost: 11,
        damage: '6d10',
        levelRequirement: 17,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        element: 'magical_affinity',
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Curación Común IV',
        description: 'Restauras 6d10 más lanzamiento de hechizos en PV a un aliado.',
        cost: 7,
        damage: null,
        levelRequirement: 17,
        targetType: 'ally',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'healing',
                value: '6d10 + {spellcasting_modifier}',
                target: 'ally'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 18
    {
        spellId: new ObjectId(),
        name: 'Curación Rápida IV',
        description: 'Restauras 4d8 más lanzamiento de hechizos en PV a un aliado. Acción adicional.',
        cost: 5,
        damage: null,
        levelRequirement: 18,
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Destrucción Mágica',
        description: 'Rompes la concentración de todos los enemigos y remueves sus potenciaciones, además de remover debilitadores aliados.',
        cost: 8,
        damage: null,
        levelRequirement: 18,
        targetType: 'all_enemies_and_allies',
        class: characterClassId,
        concentration: false,
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    // Nivel 19
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Expansión de Dominio',
        description: 'Duplicas el rango de tu aura y causas que tú y todos tus aliados que se encuentren en dicha área ganen 50 PV temporales. El aumento de aura dura 3 turnos y requiere concentración.',
        cost: 10,
        damage: null,
        levelRequirement: 19,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        duration: 3,
        effects: [
            {
                type: 'double_aura_range',
                target: 'self',
                duration: 3
            },
            {
                type: 'temp_hp',
                value: 50,
                target: 'self_and_all_allies_in_aura'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Faro de la Esperanza',
        description: 'Agregas la siguiente propiedad a tu aura activa: todos los aliados en el área tendrán ventaja en salvaciones (incluida muerte), y la mitad de los dados de curación que causes serán sus máximos valores.',
        cost: 8,
        damage: null,
        levelRequirement: 19,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'aura_enhancement',
                effect: 'advantage_all_saves',
                target: 'allies_in_aura',
                includesDeath: true
            },
            {
                type: 'aura_enhancement',
                effect: 'half_healing_dice_max',
                target: 'self'
            }
        ],
        castingAttribute: 'courage_or_intelligence',
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
        castingAttribute: 'courage_or_intelligence',
        state: 'ACTIVE'
    },
]);

// Insertar las características de la clase

// Afinidad Elemental (Nivel 1)
const afinidadElementalFeature = {
    featureId: new ObjectId(),
    name: 'Afinidad Elemental',
    description: 'Selecciona un elemento que se ajuste a tu personaje. Cada vez que lances un hechizo de Ataque Mágico, aplicará el elemento elegido.',
    levelRequirement: 1,
    class: characterClassId,
    choices: ['fire', 'ice', 'lightning', 'necrotic', 'radiant', 'poison', 'psychic'],
    state: 'ACTIVE'
};

// Arma Predilecta (Nivel 1)
const armaPredilectaFeature = {
    featureId: new ObjectId(),
    name: 'Arma Predilecta',
    description: 'Tienes afinidad con un tipo de arma en la que siempre tienes proficiencia, y obtendrás +1 de ataque y +1d4 de daño de tus Golpes de Espíritu con esta. Además, puedes utilizar como lanzador de hechizos tu valor de Coraje o el de Inteligencia (que haya sido elegido en la creación de personaje). Siempre estarás concentrado en un arma elegida, aún si esta no se encuentra en tu inventario (tu arma predilecta no ocupará ningún espacio en tu equipo). Además, como acción adicional, puedes materializar y desmaterializar tu arma predilecta de manera instantánea.',
    levelRequirement: 1,
    class: characterClassId,
    effects: [
        {
            type: 'weapon_proficiency',
            target: 'chosen_weapon'
        },
        {
            type: 'attack_buff',
            value: 1,
            condition: 'using_predilect_weapon'
        },
        {
            type: 'spirit_strike_damage_buff',
            value: '1d4',
            condition: 'using_predilect_weapon'
        },
        {
            type: 'casting_attribute',
            value: 'courage_or_intelligence'
        },
        {
            type: 'summon_weapon',
            action: 'bonus',
            target: 'predilect_weapon'
        }
    ],
    state: 'ACTIVE'
};

// Golpes de Espíritu (Nivel 2)
const golpesDeEspirituFeature = {
    featureId: new ObjectId(),
    name: 'Golpes de Espíritu',
    description: 'Cuando realizas un ataque con tu arma, puedes consumir 3 PA para potenciarla con ánima, causando 2d8 de daño espiritual. Cada 4 niveles, se puede consumir 2 PA adicionales para sumar 1d8 de daño. El coste máximo de esta característica es de 15 PA, con un daño máximo de 7d8.',
    levelRequirement: 2,
    class: characterClassId,
    baseStats: {
        baseCost: 3,
        baseDamage: '2d8',
        additionalCost: 2,
        additionalDamage: '1d8',
        levelInterval: 4,
        maxCost: 15,
        maxDamage: '7d8'
    },
    scaling: [
        { level: 2, cost: 3, damage: '2d8' },
        { level: 6, cost: 5, damage: '3d8' },
        { level: 10, cost: 7, damage: '4d8' },
        { level: 14, cost: 9, damage: '5d8' },
        { level: 18, cost: 11, damage: '6d8' },
        { level: 20, cost: 13, damage: '7d8' }
    ],
    state: 'ACTIVE'
};

// Canalizador Nato (Nivel 3)
const canalizadorNatoFeature = {
    featureId: new ObjectId(),
    name: 'Canalizador Nato',
    description: 'Tienes ventaja en todas las tiradas de salvación de concentración.',
    levelRequirement: 3,
    class: characterClassId,
    effects: [
        {
            type: 'advantage_concentration_saves',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Aura de Combate (Nivel 6)
const auraDeCombateFeature = {
    featureId: new ObjectId(),
    name: 'Aura de Combate',
    description: 'Puedes activar una aura de combate como acción adicional que tiene un radio de 2 casillas. Solo puedes tener activada una aura a la vez. Puedes activar auras tantas veces por incursión como se especifica en la tabla de niveles.',
    levelRequirement: 6,
    class: characterClassId,
    baseRadius: 2,
    action: 'bonus',
    subFeatures: [
        // Tier 1: Base (Nivel 6)
        {
            tier: 1,
            level: 6,
            auras: [
                {
                    name: 'Aura de Valentía',
                    description: 'Los aliados dentro del aura tienen ventaja en tiradas mentales.',
                    effects: [
                        {
                            type: 'advantage_mental_saves',
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Resguardo',
                    description: 'Los aliados dentro del aura ganan +1 en tiradas de salvación.',
                    effects: [
                        {
                            type: 'save_buff',
                            value: 1,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Protección',
                    description: 'Los aliados dentro del aura reducen el daño que reciben en 2.',
                    effects: [
                        {
                            type: 'damage_reduction',
                            value: 2,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Resistencia',
                    description: 'Los aliados dentro del aura ganan +3 en resistencia mágica.',
                    effects: [
                        {
                            type: 'magic_resistance_buff',
                            value: 3,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura del Cruzado',
                    description: 'Los aliados dentro del aura aumentan su daño en 2.',
                    effects: [
                        {
                            type: 'damage_buff',
                            value: 2,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Concentración',
                    description: 'Los aliados dentro del aura tienen ventaja en tiradas de concentración.',
                    effects: [
                        {
                            type: 'advantage_concentration',
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Atención',
                    description: 'Los aliados dentro del aura pueden realizar un ataque de oportunidad con su reacción cuando un enemigo a cuerpo a cuerpo falla un ataque.',
                    effects: [
                        {
                            type: 'opportunity_attack_on_miss',
                            target: 'allies_in_aura',
                            trigger: 'enemy_melee_miss'
                        }
                    ]
                }
            ]
        },
        // Tier 2: Mejoradas (Nivel 12)
        {
            tier: 2,
            level: 12,
            radius: 4,
            auras: [
                {
                    name: 'Aura de Valentía II',
                    description: 'Los aliados dentro del aura tienen ventaja en tiradas mentales y +2 en dichas tiradas.',
                    effects: [
                        {
                            type: 'advantage_mental_saves',
                            target: 'allies_in_aura'
                        },
                        {
                            type: 'mental_save_buff',
                            value: 2,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Resguardo II',
                    description: 'Los aliados dentro del aura ganan +2 en tiradas de salvación y +1 en defensa.',
                    effects: [
                        {
                            type: 'save_buff',
                            value: 2,
                            target: 'allies_in_aura'
                        },
                        {
                            type: 'defense_buff',
                            value: 1,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Protección II',
                    description: 'Los aliados dentro del aura reducen el daño que reciben en 4 y ganan +1 en defensa.',
                    effects: [
                        {
                            type: 'damage_reduction',
                            value: 4,
                            target: 'allies_in_aura'
                        },
                        {
                            type: 'defense_buff',
                            value: 1,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Resistencia II',
                    description: 'Los aliados dentro del aura ganan +5 en resistencia mágica y ventaja en tiradas de salvación de inteligencia.',
                    effects: [
                        {
                            type: 'magic_resistance_buff',
                            value: 5,
                            target: 'allies_in_aura'
                        },
                        {
                            type: 'advantage_intelligence_saves',
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura del Cruzado II',
                    description: 'Los aliados dentro del aura aumentan su daño en 4 y su ataque en 2.',
                    effects: [
                        {
                            type: 'damage_buff',
                            value: 4,
                            target: 'allies_in_aura'
                        },
                        {
                            type: 'attack_buff',
                            value: 2,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Concentración II',
                    description: 'Los aliados dentro del aura tienen ventaja en tiradas de concentración y +1 a dichas tiradas.',
                    effects: [
                        {
                            type: 'advantage_concentration',
                            target: 'allies_in_aura'
                        },
                        {
                            type: 'concentration_buff',
                            value: 1,
                            target: 'allies_in_aura'
                        }
                    ]
                },
                {
                    name: 'Aura de Atención II',
                    description: 'Los aliados dentro del aura pueden realizar un ataque de oportunidad con su reacción cuando un enemigo a cuerpo a cuerpo falla un ataque. Además, ganan +1 en su defensa.',
                    effects: [
                        {
                            type: 'opportunity_attack_on_miss',
                            target: 'allies_in_aura',
                            trigger: 'enemy_melee_miss'
                        },
                        {
                            type: 'defense_buff',
                            value: 1,
                            target: 'allies_in_aura'
                        }
                    ]
                }
            ]
        },
        // Tier 3: Aislamiento/Egoísmo (Nivel 16)
        {
            tier: 3,
            level: 16,
            description: 'Versiones egoístas de las auras. Solo afectan al Spiritist pero con efectos mucho más poderosos.',
            auras: [
                {
                    name: 'Aura de Valentía (Aislamiento)',
                    description: 'Eres inmune a estados alterados mentales (miedo, encantamiento).',
                    effects: [
                        {
                            type: 'immunity_mental_status',
                            target: 'self'
                        }
                    ]
                },
                {
                    name: 'Aura de Resguardo (Aislamiento)',
                    description: 'Ganas proficiencia en salvaciones de fuerza y destreza. Si ya tienes proficiencia en alguna, obtienes pericia en su lugar.',
                    effects: [
                        {
                            type: 'save_proficiency_or_expertise',
                            saves: ['strength', 'dexterity'],
                            target: 'self'
                        }
                    ]
                },
                {
                    name: 'Aura de Protección (Aislamiento)',
                    description: 'Reduces todo daño recibido en 8 puntos.',
                    effects: [
                        {
                            type: 'damage_reduction',
                            value: 8,
                            target: 'self'
                        }
                    ]
                },
                {
                    name: 'Aura de Resistencia (Aislamiento)',
                    description: 'Obtienes resistencia a dos tipos de daño elemental de tu elección (fuego, hielo, rayo, veneno, psíquico, necrótico, radiante).',
                    effects: [
                        {
                            type: 'elemental_resistance',
                            choices: 2,
                            elements: ['fire', 'ice', 'lightning', 'poison', 'psychic', 'necrotic', 'radiant'],
                            target: 'self'
                        }
                    ]
                },
                {
                    name: 'Aura del Cruzado (Aislamiento)',
                    description: 'Aumentas tu daño en 8 puntos y tu ataque en 4.',
                    effects: [
                        {
                            type: 'damage_buff',
                            value: 8,
                            target: 'self'
                        },
                        {
                            type: 'attack_buff',
                            value: 4,
                            target: 'self'
                        }
                    ]
                },
                {
                    name: 'Aura de Concentración (Aislamiento)',
                    description: 'No puedes perder la concentración a menos que decidas hacerlo.',
                    effects: [
                        {
                            type: 'unbreakable_concentration',
                            target: 'self'
                        }
                    ]
                },
                {
                    name: 'Aura de Atención (Aislamiento)',
                    description: 'Ganas una reacción adicional y +2 a tu defensa.',
                    effects: [
                        {
                            type: 'extra_reaction',
                            value: 1,
                            target: 'self'
                        },
                        {
                            type: 'defense_buff',
                            value: 2,
                            target: 'self'
                        }
                    ]
                }
            ]
        }
    ],
    state: 'ACTIVE'
};

// Protección de Ánima (Nivel 9)
const proteccionDeAnimaFeature = {
    featureId: new ObjectId(),
    name: 'Protección de Ánima',
    description: 'Reduces el daño que recibes en 2. Además, ganas resistencia a daño espiritual.',
    levelRequirement: 9,
    class: characterClassId,
    effects: [
        {
            type: 'damage_reduction',
            value: 2,
            target: 'self'
        },
        {
            type: 'resistance',
            damageType: 'spiritual',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Marca de Alma (Nivel 10)
const marcaDeAlmaFeature = {
    featureId: new ObjectId(),
    name: 'Marca de Alma',
    description: 'Como acción adicional, puedes marcar a un enemigo a distancia de hechizos. Esta marca dura todo el combate y solo se puede tener una marca activa a la vez. Cuando marques a un enemigo, debes elegir entre 4 opciones diferentes para el comportamiento de la marca.',
    levelRequirement: 10,
    class: characterClassId,
    action: 'bonus',
    range: 'spell_range',
    marksOptions: [
        {
            name: 'Robo Vital',
            description: 'Cuando realizas un ataque con tu arma, recuperas 1d4 PA si el ataque impacta. Si fallas el ataque, no recuperas PA.',
            level: 10,
            effects: [
                {
                    type: 'ap_recovery_on_weapon_hit',
                    value: '1d4',
                    condition: 'hit',
                    target: 'marked_enemy'
                }
            ]
        },
        {
            name: 'Robo de Sangre',
            description: 'Cuando realizas un ataque con tu arma, recuperas 2d8 PV si el ataque impacta. Si fallas el ataque, no recuperas PV.',
            level: 10,
            effects: [
                {
                    type: 'hp_recovery_on_weapon_hit',
                    value: '2d8',
                    condition: 'hit',
                    target: 'marked_enemy'
                }
            ]
        },
        {
            name: 'Ralentización',
            description: 'El enemigo marcado tiene su velocidad reducida en 1 casilla.',
            level: 10,
            effects: [
                {
                    type: 'speed_reduction',
                    value: 1,
                    target: 'marked_enemy'
                }
            ]
        },
        {
            name: 'Golpe Crítico Fortalecido',
            description: 'Tus ataques contra el enemigo marcado tienen un 5% adicional de probabilidad de crítico.',
            level: 10,
            effects: [
                {
                    type: 'crit_chance_buff',
                    value: 5,
                    unit: 'percent',
                    target: 'marked_enemy'
                }
            ]
        }
    ],
    scaling: [
        {
            level: 15,
            upgrades: [
                {
                    name: 'Robo Vital',
                    newValue: '2d4',
                    description: 'Aumenta la recuperación de PA a 2d4.'
                },
                {
                    name: 'Robo de Sangre',
                    newValue: '4d8',
                    description: 'Aumenta la recuperación de PV a 4d8.'
                },
                {
                    name: 'Ralentización',
                    newValue: 2,
                    description: 'Aumenta la reducción de velocidad a 2 casillas.'
                },
                {
                    name: 'Golpe Crítico Fortalecido',
                    newEffect: 'stacking_crit',
                    description: 'Los críticos sucesivos suman +5% de probabilidad cada uno (se reinicia si fallas un ataque).'
                }
            ]
        }
    ],
    state: 'ACTIVE'
};

// Destello Oscuro (Nivel 13)
const destelloOscuroFeature = {
    featureId: new ObjectId(),
    name: 'Destello Oscuro',
    description: 'Tus ataques tienen un 5% adicional de probabilidad de crítico. Además, cuando realizas un crítico, recuperas 1d4 PA, 1d8 PV y causas 1d8 de daño adicional. Si realizas críticos sucesivos, el daño adicional aumenta en 1d8 cada vez. El efecto de críticos sucesivos se pierde si fallas un ataque.',
    levelRequirement: 13,
    class: characterClassId,
    effects: [
        {
            type: 'crit_chance_buff',
            value: 5,
            unit: 'percent',
            target: 'self'
        },
        {
            type: 'on_crit',
            effects: [
                {
                    type: 'ap_recovery',
                    value: '1d4'
                },
                {
                    type: 'hp_recovery',
                    value: '1d8'
                },
                {
                    type: 'extra_damage',
                    value: '1d8',
                    stacking: true,
                    stackIncrement: '1d8',
                    resetOn: 'miss'
                }
            ]
        }
    ],
    state: 'ACTIVE'
};

// Espíritu Incontenible (Nivel 14)
const espirituIncontenibleFeature = {
    featureId: new ObjectId(),
    name: 'Espíritu Incontenible',
    description: 'Si caes a 0 PV, puedes realizar una tirada de salvación de coraje contra una dificultad de 15. Si tienes éxito, permaneces en 1 PV en lugar de caer inconsciente. Solo puedes usar esta habilidad una vez por descanso largo.',
    levelRequirement: 14,
    class: characterClassId,
    usesPerRest: 1,
    restType: 'long',
    effects: [
        {
            type: 'death_save',
            trigger: 'reach_0_hp',
            save: 'courage',
            dc: 15,
            success: 'remain_at_1_hp',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Egoísmo (Nivel 16)
const egoismoFeature = {
    featureId: new ObjectId(),
    name: 'Egoísmo',
    description: 'Puedes entrar en aislamiento, que consume 10 PA y dura 5 turnos (no requiere concentración). Durante este tiempo, tus auras se vuelven egoístas y solo te afectan a ti, pero con efectos mucho más poderosos (las auras normales ya no afectan a tus aliados). Puedes usar esta habilidad una vez por combate.',
    levelRequirement: 16,
    class: characterClassId,
    cost: 10,
    duration: 5,
    usesPerCombat: 1,
    effects: [
        {
            type: 'isolation_mode',
            duration: 5,
            cost: 10,
            effect: 'auras_become_selfish',
            description: 'Activa las versiones egoístas de las auras (Tier 3)',
            target: 'self'
        }
    ],
    state: 'ACTIVE'
};

// Forma Espiritual (Nivel 20)
const formaEspiritualFeature = {
    featureId: new ObjectId(),
    name: 'Forma Espiritual',
    description: 'Puedes activar tu forma espiritual, que dura 10 turnos. Durante este tiempo, tus auras activas duplican sus efectos (esto no aplica a las auras egoístas), los Golpes de Espíritu hacen 2d8 de daño adicional, y obtienes un 5% adicional de probabilidad de crítico. Además, obtendrás efectos adicionales dependiendo de tu especialización. Puedes usar esta habilidad una vez por descanso largo.',
    levelRequirement: 20,
    class: characterClassId,
    duration: 10,
    usesPerRest: 1,
    restType: 'long',
    baseEffects: [
        {
            type: 'double_aura_effects',
            target: 'self',
            excludes: 'selfish_auras'
        },
        {
            type: 'spirit_strike_damage_buff',
            value: '2d8',
            target: 'self'
        },
        {
            type: 'crit_chance_buff',
            value: 5,
            unit: 'percent',
            target: 'self'
        }
    ],
    subclassEffects: {
        description: 'Efectos adicionales que dependen de la subclase elegida',
        placeholder: 'Los efectos específicos se definen en cada subclase'
    },
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
                    knownSpells: 0,
                    multiattack: false,
                    auraUses: 0
                },
                // Nivel 2
                {
                    level: 2,
                    features: [golpesDeEspirituFeature],
                    AP: 6,
                    proficiencyBonus: 2,
                    knownSpells: 0,
                    multiattack: false,
                    auraUses: 0
                },
                // Nivel 3
                {
                    level: 3,
                    features: [canalizadorNatoFeature],
                    AP: 8,
                    proficiencyBonus: 2,
                    knownSpells: 4,
                    multiattack: false,
                    auraUses: 0
                },
                // Nivel 4
                {
                    level: 4,
                    features: [],
                    subclassFeature: true,
                    AP: 10,
                    proficiencyBonus: 2,
                    knownSpells: 4,
                    multiattack: false,
                    auraUses: 0
                },
                // Nivel 5
                {
                    level: 5,
                    features: [],
                    AP: 11,
                    proficiencyBonus: 3,
                    knownSpells: 4,
                    multiattack: false,
                    auraUses: 0
                },
                // Nivel 6
                {
                    level: 6,
                    features: [auraDeCombateFeature],
                    AP: 13,
                    proficiencyBonus: 3,
                    knownSpells: 5,
                    multiattack: false,
                    auraUses: 2
                },
                // Nivel 7
                {
                    level: 7,
                    features: [],
                    AP: 15,
                    proficiencyBonus: 3,
                    knownSpells: 5,
                    multiattack: true,
                    auraUses: 3
                },
                // Nivel 8
                {
                    level: 8,
                    features: [],
                    subclassFeature: true,
                    AP: 17,
                    proficiencyBonus: 3,
                    knownSpells: 5,
                    multiattack: true,
                    auraUses: 3
                },
                // Nivel 9
                {
                    level: 9,
                    features: [proteccionDeAnimaFeature],
                    AP: 19,
                    proficiencyBonus: 4,
                    knownSpells: 6,
                    multiattack: true,
                    auraUses: 3
                },
                // Nivel 10
                {
                    level: 10,
                    features: [marcaDeAlmaFeature],
                    AP: 21,
                    proficiencyBonus: 4,
                    knownSpells: 6,
                    multiattack: true,
                    auraUses: 3
                },
                // Nivel 11
                {
                    level: 11,
                    features: [],
                    AP: 23,
                    proficiencyBonus: 4,
                    knownSpells: 6,
                    multiattack: true,
                    auraUses: 4
                },
                // Nivel 12
                {
                    level: 12,
                    features: [],
                    AP: 25,
                    proficiencyBonus: 4,
                    knownSpells: 8,
                    multiattack: true,
                    auraUses: 4,
                    auraRadius: 4
                },
                // Nivel 13
                {
                    level: 13,
                    features: [destelloOscuroFeature],
                    subclassFeature: true,
                    AP: 27,
                    proficiencyBonus: 5,
                    knownSpells: 8,
                    multiattack: true,
                    auraUses: 4,
                    auraRadius: 4
                },
                // Nivel 14
                {
                    level: 14,
                    features: [espirituIncontenibleFeature],
                    AP: 29,
                    proficiencyBonus: 5,
                    knownSpells: 8,
                    multiattack: true,
                    auraUses: 4,
                    auraRadius: 4
                },
                // Nivel 15
                {
                    level: 15,
                    features: [],
                    AP: 31,
                    proficiencyBonus: 5,
                    knownSpells: 9,
                    multiattack: true,
                    auraUses: 5,
                    auraRadius: 4
                },
                // Nivel 16
                {
                    level: 16,
                    features: [egoismoFeature],
                    AP: 33,
                    proficiencyBonus: 5,
                    knownSpells: 9,
                    multiattack: true,
                    auraUses: 5,
                    auraRadius: 4
                },
                // Nivel 17
                {
                    level: 17,
                    features: [],
                    AP: 35,
                    proficiencyBonus: 6,
                    knownSpells: 9,
                    multiattack: true,
                    auraUses: 5,
                    auraRadius: 4
                },
                // Nivel 18
                {
                    level: 18,
                    features: [],
                    subclassFeature: true,
                    AP: 37,
                    proficiencyBonus: 6,
                    knownSpells: 12,
                    multiattack: true,
                    auraUses: 5,
                    auraRadius: 6
                },
                // Nivel 19
                {
                    level: 19,
                    features: [],
                    AP: 39,
                    proficiencyBonus: 6,
                    knownSpells: 12,
                    multiattack: true,
                    auraUses: 6,
                    auraRadius: 6
                },
                // Nivel 20
                {
                    level: 20,
                    features: [formaEspiritualFeature],
                    AP: 41,
                    proficiencyBonus: 6,
                    knownSpells: 12,
                    multiattack: true,
                    auraUses: 6,
                    auraRadius: 6
                }
            ]
        }
    }
);

// Insertar las subclases

// ============================================
// ENERGIZER - Subclase de Soporte y Curación
// ============================================
db.personasubclasses.insertMany([
    {
        _id: new ObjectId(),
        name: 'Energizer',
        description: 'Especialista en curación y soporte que potencia a los aliados con auras restauradoras y bendiciones.',
        class: characterClassId,
        features: [
            // Nivel 4: Absolución
            {
                featureId: new ObjectId(),
                name: 'Absolución',
                description: 'Los Golpes de Espíritu restauran la mitad del daño causado en PV a un aliado que elijas. Además, otorgas a dicho aliado un bono de +1 en ataque, +2 de daño, +1 de defensa y +1 de resistencia mágica durante 2 turnos.',
                levelRequirement: 4,
                effects: [
                    {
                        type: 'spirit_strike_healing',
                        value: 'half_damage',
                        target: 'chosen_ally'
                    },
                    {
                        type: 'buff_ally',
                        duration: 2,
                        buffs: [
                            {
                                type: 'attack_buff',
                                value: 1
                            },
                            {
                                type: 'damage_buff',
                                value: 2
                            },
                            {
                                type: 'defense_buff',
                                value: 1
                            },
                            {
                                type: 'magic_resistance_buff',
                                value: 1
                            }
                        ]
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 8: Aura Clemente
            {
                featureId: new ObjectId(),
                name: 'Aura Clemente',
                description: 'Los aliados dentro de tu aura recuperan 2d6 PV y 1d2 PA al inicio de su turno. A nivel 20, esta curación aumenta a 6d6 PV y 1d4+2 PA.',
                levelRequirement: 8,
                effects: [
                    {
                        type: 'aura_healing',
                        trigger: 'ally_turn_start',
                        value: {
                            hp: '2d6',
                            ap: '1d2'
                        },
                        scaling: [
                            {
                                level: 20,
                                hp: '6d6',
                                ap: '1d4+2'
                            }
                        ],
                        target: 'allies_in_aura'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 13: Redención
            {
                featureId: new ObjectId(),
                name: 'Redención',
                description: 'Los efectos de Marca de Alma se duplican (2d4 → 4d4 PA, 4d8 → 8d8 PV, etc.). Además, cuando realizas un Golpe de Espíritu contra un enemigo marcado, remueves un estado alterado o debilitador del aliado que reciba la curación de Absolución. Una vez por combate, puedes maximizar la curación de un aliado (todos los dados de curación valen su máximo).',
                levelRequirement: 13,
                effects: [
                    {
                        type: 'double_marca_effects',
                        target: 'self'
                    },
                    {
                        type: 'remove_status_on_spirit_strike',
                        trigger: 'spirit_strike_on_marked_enemy',
                        target: 'absolution_ally'
                    },
                    {
                        type: 'maximize_healing',
                        usesPerCombat: 1,
                        target: 'chosen_ally'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 18: Carga Rápida
            {
                featureId: new ObjectId(),
                name: 'Carga Rápida',
                description: 'Cuando realizas un golpe crítico o curas al máximo a un aliado, puedes realizar una tirada de 1d10. Si el resultado es 5 o mayor, todos los aliados en tu aura reciben el estado "Concentrado" o "Cargado" (a elección del jugador o el DM).',
                levelRequirement: 18,
                effects: [
                    {
                        type: 'crit_or_max_heal_trigger',
                        check: '1d10',
                        dc: 5,
                        success: {
                            type: 'grant_status',
                            options: ['concentrated', 'charged'],
                            target: 'all_allies_in_aura'
                        }
                    }
                ],
                state: 'ACTIVE'
            }
        ],
        // Efectos de Forma Espiritual para Energizer
        spiritualFormEffect: {
            name: 'Bendición Luminosa',
            description: 'Durante tu Forma Espiritual, tus auras curan el doble y todos los aliados en tu aura ganan +3 en todas las tiradas de ataque y salvación.',
            effects: [
                {
                    type: 'double_aura_healing',
                    target: 'self'
                },
                {
                    type: 'buff_allies_in_aura',
                    buffs: [
                        {
                            type: 'attack_buff',
                            value: 3
                        },
                        {
                            type: 'save_buff',
                            value: 3
                        }
                    ]
                }
            ]
        },
        state: 'ACTIVE'
    },
    // ============================================
    // KEEPER - Subclase de Tanque y Protección
    // ============================================
    {
        _id: new ObjectId(),
        name: 'Keeper',
        description: 'Guardián espiritual que protege a los aliados y se interpone ante el peligro.',
        class: characterClassId,
        features: [
            // Nivel 4: Baluarte
            {
                featureId: new ObjectId(),
                name: 'Baluarte',
                description: 'Como acción adicional, puedes elegir a un aliado a distancia de cuerpo a cuerpo. Dicho aliado queda protegido por ti: todos los ataques que reciba utilizarán tu Defensa y Resistencia Mágica en lugar de las suyas. Puedes tener solo un aliado protegido a la vez.',
                levelRequirement: 4,
                action: 'bonus',
                range: 'melee',
                effects: [
                    {
                        type: 'protect_ally',
                        target: 'chosen_ally',
                        effect: 'use_your_defense_and_rm',
                        limit: 1
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 8: Respuesta Contundente
            {
                featureId: new ObjectId(),
                name: 'Respuesta Contundente',
                description: 'Obtienes una reacción adicional. Cuando un enemigo ataca a tu aliado protegido, puedes usar tu reacción para realizar un ataque de oportunidad. Si impactas, el ataque del enemigo contra tu aliado tiene desventaja.',
                levelRequirement: 8,
                effects: [
                    {
                        type: 'extra_reaction',
                        value: 1,
                        target: 'self'
                    },
                    {
                        type: 'opportunity_attack_on_protected_ally',
                        trigger: 'enemy_attacks_protected_ally',
                        success: {
                            type: 'impose_disadvantage',
                            target: 'enemy_attack'
                        }
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 13: Expurgación
            {
                featureId: new ObjectId(),
                name: 'Expurgación',
                description: 'Una vez por combate, como acción adicional, puedes remover todos los estados alterados y debilitadores de ti mismo. Además, obtienes resistencia a todos los tipos de daño por el resto de la ronda. Si ya tienes resistencia a un tipo de daño, obtienes inmunidad en su lugar.',
                levelRequirement: 13,
                action: 'bonus',
                usesPerCombat: 1,
                effects: [
                    {
                        type: 'remove_all_status',
                        target: 'self'
                    },
                    {
                        type: 'remove_all_debuffs',
                        target: 'self'
                    },
                    {
                        type: 'resistance_all_damage',
                        duration: 'rest_of_round',
                        upgrade: {
                            condition: 'already_resistant',
                            effect: 'grant_immunity'
                        },
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 18: Escudo Inexpugnable
            {
                featureId: new ObjectId(),
                name: 'Escudo Inexpugnable',
                description: 'Los golpes críticos contra ti se convierten en golpes normales. Además, todos los aliados dentro de tu aura reciben los efectos de Baluarte sin necesidad de usar tu acción adicional (puedes proteger a múltiples aliados).',
                levelRequirement: 18,
                effects: [
                    {
                        type: 'negate_crits',
                        target: 'self',
                        effect: 'crits_become_normal_hits'
                    },
                    {
                        type: 'aura_wide_baluarte',
                        target: 'all_allies_in_aura',
                        effect: 'all_allies_protected'
                    }
                ],
                state: 'ACTIVE'
            }
        ],
        // Efectos de Forma Espiritual para Keeper
        spiritualFormEffect: {
            name: 'Guardián Eterno',
            description: 'Durante tu Forma Espiritual, obtienes +5 en Defensa y Resistencia Mágica. Todos los aliados protegidos por Baluarte también reciben estos bonos.',
            effects: [
                {
                    type: 'defense_buff',
                    value: 5,
                    target: 'self'
                },
                {
                    type: 'magic_resistance_buff',
                    value: 5,
                    target: 'self'
                },
                {
                    type: 'share_defense_buffs',
                    target: 'protected_allies',
                    effect: 'allies_gain_same_buffs'
                }
            ]
        },
        state: 'ACTIVE'
    },
    // ============================================
    // PUNISHER - Subclase de Daño Elemental
    // ============================================
    {
        _id: new ObjectId(),
        name: 'Punisher',
        description: 'Justiciero elemental que castiga a los enemigos con poder mágico devastador.',
        class: characterClassId,
        features: [
            // Nivel 4: Bendición Elemental
            {
                featureId: new ObjectId(),
                name: 'Bendición Elemental',
                description: 'Cuando lanzas un hechizo de daño, tu arma gana 1d8 de daño elemental del tipo de tu afinidad durante 3 turnos. Este efecto se acumula hasta 4 veces.',
                levelRequirement: 4,
                duration: 3,
                maxStacks: 4,
                effects: [
                    {
                        type: 'weapon_damage_buff',
                        trigger: 'cast_damage_spell',
                        value: '1d8',
                        element: 'magical_affinity',
                        duration: 3,
                        stacking: true,
                        maxStacks: 4
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 8: Estela de Cenizas
            {
                featureId: new ObjectId(),
                name: 'Estela de Cenizas',
                description: 'Una vez por turno, puedes moverte en línea recta hasta 3 casillas. Si lanzas un hechizo de área durante o después de este movimiento, el área de efecto se convierte en una línea de 3 casillas de ancho y 6 de largo. Si hay un enemigo en rango después del movimiento, puedes realizar un ataque con tu arma como acción adicional.',
                levelRequirement: 8,
                usesPerTurn: 1,
                movement: {
                    type: 'straight_line',
                    distance: 3
                },
                effects: [
                    {
                        type: 'modify_spell_area',
                        trigger: 'cast_area_spell_during_or_after_movement',
                        newArea: {
                            shape: 'line',
                            width: 3,
                            length: 6
                        }
                    },
                    {
                        type: 'bonus_weapon_attack',
                        trigger: 'enemy_in_range_after_movement',
                        action: 'bonus'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 13: Ojo por Ojo
            {
                featureId: new ObjectId(),
                name: 'Ojo por Ojo',
                description: 'Obtienes una reacción adicional. Puedes lanzar hechizos como ataques de oportunidad. Además, cuando recibes daño de un enemigo a distancia de hechizos, puedes usar tu reacción para lanzar un hechizo contra él.',
                levelRequirement: 13,
                effects: [
                    {
                        type: 'extra_reaction',
                        value: 1,
                        target: 'self'
                    },
                    {
                        type: 'cast_spells_as_opportunity_attacks',
                        target: 'self'
                    },
                    {
                        type: 'counter_spell_on_damage',
                        trigger: 'receive_damage_from_enemy_in_spell_range',
                        action: 'reaction',
                        target: 'self'
                    }
                ],
                state: 'ACTIVE'
            },
            // Nivel 18: Enjuiciamiento
            {
                featureId: new ObjectId(),
                name: 'Enjuiciamiento',
                description: 'Una vez por combate, puedes aislar a un enemigo en un duelo espiritual. Tanto tú como el enemigo quedan separados en una arena de 6x6 casillas durante 5 turnos (o hasta que uno de los dos caiga). Durante el duelo: obtienes +4 en Defensa y Resistencia Mágica, recuperas 2d4 PA al inicio de tu turno, obtienes +5% de probabilidad de crítico, y los efectos de Destello Oscuro no requieren críticos sucesivos (cada crítico restaura y causa el daño completo sin necesidad de cadena).',
                levelRequirement: 18,
                usesPerCombat: 1,
                duration: 5,
                duelArena: {
                    size: '6x6',
                    endCondition: 'one_falls_or_5_turns'
                },
                effects: [
                    {
                        type: 'isolate_enemy',
                        target: 'chosen_enemy',
                        duration: 5
                    },
                    {
                        type: 'defense_buff',
                        value: 4,
                        target: 'self',
                        duration: 'duel'
                    },
                    {
                        type: 'magic_resistance_buff',
                        value: 4,
                        target: 'self',
                        duration: 'duel'
                    },
                    {
                        type: 'ap_recovery',
                        value: '2d4',
                        trigger: 'turn_start',
                        target: 'self',
                        duration: 'duel'
                    },
                    {
                        type: 'crit_chance_buff',
                        value: 5,
                        unit: 'percent',
                        target: 'self',
                        duration: 'duel'
                    },
                    {
                        type: 'enhance_destello_oscuro',
                        effect: 'no_successive_requirement',
                        description: 'Cada crítico activa el efecto completo sin necesidad de cadena',
                        target: 'self',
                        duration: 'duel'
                    }
                ],
                state: 'ACTIVE'
            }
        ],
        // Efectos de Forma Espiritual para Punisher
        spiritualFormEffect: {
            name: 'Juicio Final',
            description: 'Durante tu Forma Espiritual, tus hechizos de daño ignoran resistencias (las resistencias se tratan como vulnerabilidad normal) y los enemigos en tu aura tienen desventaja en salvaciones contra tus hechizos.',
            effects: [
                {
                    type: 'ignore_resistances',
                    target: 'self',
                    effect: 'resistances_treated_as_normal'
                },
                {
                    type: 'impose_disadvantage_on_saves',
                    target: 'enemies_in_aura',
                    condition: 'against_your_spells'
                }
            ]
        },
        state: 'ACTIVE'
    }
]);

const { ObjectId } = require('mongodb');

// Crear la clase base Warlock
const characterClassId = new ObjectId();
db.characterClass.insertOne({
    _id: characterClassId,
    name: 'Warlock',
    description: 'Lanzador oscuro que manipula sombras y marca enemigos para sacrificios.',
    HPDice: '1d8',
    salvations: ['intelligence', 'charisma'],
});

// Insertar los hechizos de Warlock
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
        castingAttribute: 'intelligence_or_charisma',
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
        effects: [
            {
                type: 'damage_buff',
                value: 2,
                target: 'self_or_ally',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
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
        effects: [
            {
                type: 'attack_buff',
                value: 2,
                target: 'self_or_ally',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
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
        effects: [
            {
                type: 'defense_buff',
                value: 2,
                target: 'self_or_ally',
                duration: 3
            },
            {
                type: 'magic_resistance_buff',
                value: 1,
                target: 'self_or_ally',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 3
    {
        spellId: new ObjectId(),
        name: 'Armadura Mágica',
        description: 'Tu defensa se establece en diez más tu salvación de inteligencia y tu resistencia mágica se establece en diez más tu salvación de inteligencia. Ignoras las propiedades de la armadura que llevas equipada. Solo puede lanzarse en combate y consume acción adicional.',
        cost: 3,
        damage: null,
        levelRequirement: 3,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        combatOnly: true,
        effects: [
            {
                type: 'set_defense',
                value: '10 + {intelligence_save}',
                target: 'self'
            },
            {
                type: 'set_magic_resistance',
                value: '10 + {intelligence_save}',
                target: 'self'
            },
            {
                type: 'ignore_armor_properties',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Debilitación Básica (F)',
        description: 'Reduce en -2 a todo daño infligido por 3 turnos a un enemigo.',
        cost: 2,
        damage: null,
        levelRequirement: 3,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'damage_debuff',
                value: -2,
                target: 'enemy',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Debilitación Básica (P)',
        description: 'Reduce en -2 el ataque por 3 turnos a un enemigo.',
        cost: 2,
        damage: null,
        levelRequirement: 3,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_debuff',
                value: -2,
                target: 'enemy',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Debilitación Básica (D)',
        description: 'Reduce en -2 a la defensa y -1 a la resistencia mágica a un enemigo.',
        cost: 2,
        damage: null,
        levelRequirement: 3,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'defense_debuff',
                value: -2,
                target: 'enemy',
                duration: 3
            },
            {
                type: 'magic_resistance_debuff',
                value: -1,
                target: 'enemy',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 4
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Reflejo Arcano I',
        description: 'Cuando un enemigo falla un ataque contra ti con 1-2 de tirada, puedes lanzar un hechizo con su coste correspondiente. Reacción.',
        cost: 1,
        damage: null,
        levelRequirement: 4,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'reaction',
        trigger: 'enemy_misses_with_1_or_2',
        effects: [
            {
                type: 'cast_spell_on_reaction',
                condition: 'enemy_roll_1_or_2',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 5
    {
        spellId: new ObjectId(),
        name: 'Estado Alterado (I)',
        description: 'Causas un estado alterado de tu afinidad a un enemigo con dificultad igual a 10 + salvación de carisma.',
        cost: 2,
        damage: null,
        levelRequirement: 5,
        targetType: 'single',
        class: characterClassId,
        concentration: false,
        dc: '10 + {charisma_save}',
        effects: [
            {
                type: 'apply_status',
                status: 'element_based',
                element: 'magical_affinity',
                target: 'enemy'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Zona de Restricción',
        description: 'Estableces una zona de 2 casillas de radio en el mapa. Nadie podrá entrar de esta zona por 3 turnos. Los individuos que se encuentren en dicha área saldrán por el lado más próximo del punto de inicio.',
        cost: 4,
        damage: null,
        levelRequirement: 5,
        targetType: 'area',
        class: characterClassId,
        concentration: true,
        duration: 3,
        radius: 2,
        effects: [
            {
                type: 'no_entry_zone',
                duration: 3,
                ejectOccupants: true,
                target: 'area'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 6
    {
        spellId: new ObjectId(),
        name: 'Esparcir Ánima',
        description: 'Creas una cantidad de orbes alrededor tuyo igual a tu lanzamiento de hechizos. Como reacción cuando un enemigo inicia o entra dentro de un rango de 3 casillas alrededor tuyo, puedes lanzar un orbe. Cada orbe causa 4d4 de daño de tu afinidad.',
        cost: 6,
        damage: '4d4',
        levelRequirement: 6,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        range: 3,
        effects: [
            {
                type: 'create_orbs',
                count: '{spellcasting_modifier}',
                damage: '4d4',
                trigger: 'enemy_enters_or_starts_turn',
                action: 'reaction',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Contrahechizo',
        description: 'Intentas interrumpir el lanzamiento de hechizo de una criatura. Si el hechizo cuesta 5 SP o menos, el lanzamiento de hechizos falla. Si el coste es 6 SP o mayor, requerirá un lanzamiento de hechizos por tu parte. La dificultad a superar será 8 más la cantidad de SP gastado. Si tienes éxito, el lanzamiento falla y su hechizo no tiene efecto.',
        cost: 5,
        damage: null,
        levelRequirement: 6,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        action: 'reaction',
        effects: [
            {
                type: 'counterspell',
                autoCancelCost: 5,
                contestedCheck: {
                    dc: '8 + {enemy_sp_cost}',
                    condition: 'cost_6_or_more'
                },
                target: 'enemy_spell'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Acumulación de Hechizo',
        description: 'Puedes acumular espacios de magia con tu acción. Por cada vez que realizas esta acumulación, guardas 3d10 de daño de tu afinidad. Al finalizar este efecto con tu acción adicional o perdiendo la concentración, desatas este daño a un enemigo.',
        cost: 3,
        damage: '3d10',
        levelRequirement: 6,
        targetType: 'enemy',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'accumulate_damage',
                damagePerStack: '3d10',
                releaseAction: 'bonus_or_lose_concentration',
                target: 'enemy'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 7
    {
        spellId: new ObjectId(),
        name: 'Hechizo de Negación',
        description: 'Tu siguiente hechizo de daño causará al impactar que el enemigo no pueda restaurar SP o PV hasta el inicio de tu siguiente turno. Acción adicional.',
        cost: 3,
        damage: null,
        levelRequirement: 7,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        effects: [
            {
                type: 'next_spell_prevents_recovery',
                duration: 'until_your_next_turn',
                target: 'enemy_hit_by_spell'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Consumición de Espíritu',
        description: 'Reduciendo tus espacios de magia de forma permanente por el resto de la incursión, recuperas d8 en puntos de vida por espacio de magia gastado. Puedes gastar una cantidad máxima igual a la mitad de tu nivel de espacios de magia.',
        cost: 0,
        damage: null,
        levelRequirement: 7,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'burn_spell_slots_for_hp',
                hpPerSlot: '1d8',
                maxSlots: '{level / 2}',
                permanent: true,
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Hechizo Enlentecido',
        description: 'Declaras el lanzamiento de un hechizo en una zona del mapa bajo las condiciones de tu lanzamiento normal. Cuando un enemigo entra en dicha zona, puedes utilizar tu reacción para que el hechizo sea lanzado.',
        cost: 2,
        damage: null,
        levelRequirement: 7,
        targetType: 'area',
        class: characterClassId,
        concentration: true,
        additionalCost: 2,
        effects: [
            {
                type: 'delayed_spell',
                trigger: 'enemy_enters_zone',
                action: 'reaction',
                target: 'area'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 8
    {
        spellId: new ObjectId(),
        name: 'Robo de Espíritu',
        description: 'Un enemigo deberá superar una tirada de salvación de carisma con dificultad igual a 10 más tu salvación de carisma o recibirá 1d4 de reducción a su primera tirada por turno por tres rondas.',
        cost: 4,
        damage: null,
        levelRequirement: 8,
        targetType: 'enemy',
        class: characterClassId,
        concentration: true,
        duration: 3,
        dc: '10 + {charisma_save}',
        effects: [
            {
                type: 'reduce_first_roll',
                value: '1d4',
                duration: 3,
                save: 'charisma',
                target: 'enemy'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Reflejo Arcano II',
        description: 'Cuando un enemigo falla un ataque contra ti con 1-3 de tirada, puedes lanzar un hechizo con su coste correspondiente. Reacción.',
        cost: 1,
        damage: null,
        levelRequirement: 8,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'reaction',
        trigger: 'enemy_misses_with_1_to_3',
        effects: [
            {
                type: 'cast_spell_on_reaction',
                condition: 'enemy_roll_1_to_3',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 9
    {
        spellId: new ObjectId(),
        name: 'Arma Espiritual',
        description: 'Canalizas energía de tu espíritu en un arma a tu disposición. Dicha armas reemplazará sus bonificadores por bonificadores de inteligencia, y podrás usarla para atacar como parte de tu lanzamiento de hechizo sin necesidad de estar dentro del rango del arma.',
        cost: 7,
        damage: null,
        levelRequirement: 9,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'spiritual_weapon',
                weaponCount: 1,
                modifier: 'intelligence',
                attackAsPartOfSpell: true,
                ignoreRange: true,
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Vigorizar I',
        description: 'Al final de cada turno, lanzas 1d8. Si es 8, recuperas 1 SP. Si fallas dos Vigorizar consecutivos, la siguiente tirada será un éxito automático. No acumulable con otros efectos de Vigorizar.',
        cost: 0,
        damage: null,
        levelRequirement: 9,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'sp_recovery',
                roll: '1d8',
                successOn: 8,
                apRecovery: 1,
                failSafe: 'auto_success_after_2_fails',
                trigger: 'end_of_turn',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 10
    {
        spellId: new ObjectId(),
        name: 'Estado Alterado (A)',
        description: 'Causas un estado alterado de tu afinidad a los enemigos con dificultad igual a 10 + salvación de carisma.',
        cost: 5,
        damage: null,
        levelRequirement: 10,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        dc: '10 + {charisma_save}',
        effects: [
            {
                type: 'apply_status',
                status: 'element_based',
                element: 'magical_affinity',
                target: 'enemies'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Debilitación Compleja (F)',
        description: 'Reduce en -5 a todo daño infligido por 3 turnos a un enemigo.',
        cost: 2,
        damage: null,
        levelRequirement: 10,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'damage_debuff',
                value: -5,
                target: 'enemy',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Debilitación Compleja (P)',
        description: 'Reduce en -3 el ataque por 3 turnos a un enemigo.',
        cost: 2,
        damage: null,
        levelRequirement: 10,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_debuff',
                value: -3,
                target: 'enemy',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Debilitación Compleja (D)',
        description: 'Reduce en -3 a la defensa y -2 a la resistencia mágica a un enemigo.',
        cost: 2,
        damage: null,
        levelRequirement: 10,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'defense_debuff',
                value: -3,
                target: 'enemy',
                duration: 3
            },
            {
                type: 'magic_resistance_debuff',
                value: -2,
                target: 'enemy',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 11
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (F)',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a ti o a un aliado.',
        cost: 2,
        damage: null,
        levelRequirement: 11,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'damage_buff',
                value: 5,
                target: 'self_or_ally',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (P)',
        description: 'Aumenta en +3 el ataque por 3 turnos a ti o a un aliado.',
        cost: 2,
        damage: null,
        levelRequirement: 11,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_buff',
                value: 3,
                target: 'self_or_ally',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Compleja (D)',
        description: 'Aumenta en +3 la defensa y +2 a la resistencia mágica a ti o a un aliado.',
        cost: 2,
        damage: null,
        levelRequirement: 11,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'defense_buff',
                value: 3,
                target: 'self_or_ally',
                duration: 3
            },
            {
                type: 'magic_resistance_buff',
                value: 2,
                target: 'self_or_ally',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 12
    {
        spellId: new ObjectId(),
        name: 'Robo de Hechizo',
        description: 'Con una tirada enfrentada de tu lanzamiento de hechizo contra la tirada de voluntad de un enemigo, obtienes los beneficios de hechizos que estén activos en dicho enemigo. Si uno o más hechizos son de concentración, este hechizo requerirá una concentración independiente por cada hechizo robado.',
        cost: 8,
        damage: null,
        levelRequirement: 12,
        targetType: 'enemy',
        class: characterClassId,
        concentration: 'depends_on_stolen_spells',
        effects: [
            {
                type: 'steal_buffs',
                check: 'contested_spellcasting_vs_will',
                requiresConcentration: 'per_concentration_spell_stolen',
                target: 'enemy'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Reflejo Arcano III',
        description: 'Cuando un enemigo falla un ataque contra ti con 1-4 de tirada, puedes lanzar un hechizo con su coste correspondiente. Reacción.',
        cost: 2,
        damage: null,
        levelRequirement: 12,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'reaction',
        trigger: 'enemy_misses_with_1_to_4',
        effects: [
            {
                type: 'cast_spell_on_reaction',
                condition: 'enemy_roll_1_to_4',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Encadenar Espíritu',
        description: 'Causas que un enemigo no pueda alejarse de ti a más de 4 casillas de distancia. Cada vez que recibas daño, el afectado recibirá la misma cantidad de daño.',
        cost: 7,
        damage: null,
        levelRequirement: 12,
        targetType: 'enemy',
        class: characterClassId,
        concentration: true,
        maxDistance: 4,
        effects: [
            {
                type: 'tether_enemy',
                maxDistance: 4,
                target: 'enemy'
            },
            {
                type: 'reflect_damage',
                trigger: 'when_you_take_damage',
                amount: 'same_damage',
                target: 'enemy'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Dispersión',
        description: 'Empujas a todos los enemigos en un radio de 3 casillas a 6 casillas de distancia de su posición original. Si salva una tirada de salvación de coraje con dificultad igual a 10 + salvación de carisma, evitará la mitad del movimiento.',
        cost: 4,
        damage: null,
        levelRequirement: 13,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        radius: 3,
        distance: 6,
        dc: '10 + {charisma_save}',
        effects: [
            {
                type: 'push_enemies',
                radius: 3,
                distance: 6,
                save: 'courage',
                halfOnSuccess: true,
                target: 'enemies'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Conjunción',
        description: 'Atraes a todos los enemigos en un radio de 6 casillas a su punto más cercano al centro del radio. Si salva una tirada de salvación de coraje con dificultad igual a 10 + salvación de carisma, evitará la mitad del movimiento.',
        cost: 4,
        damage: null,
        levelRequirement: 13,
        targetType: 'area',
        class: characterClassId,
        concentration: false,
        radius: 6,
        dc: '10 + {charisma_save}',
        effects: [
            {
                type: 'pull_enemies',
                radius: 6,
                toCenter: true,
                save: 'courage',
                halfOnSuccess: true,
                target: 'enemies'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 14
    {
        spellId: new ObjectId(),
        name: 'Debilitación Completa',
        description: 'Disminuyes -3 al ataque, -5 al daño infligido, -3 a la Defensa y -2 a la Resistencia Mágica por 3 turnos a un enemigo.',
        cost: 8,
        damage: null,
        levelRequirement: 14,
        targetType: 'enemy',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_debuff',
                value: -3,
                target: 'enemy',
                duration: 3
            },
            {
                type: 'damage_debuff',
                value: -5,
                target: 'enemy',
                duration: 3
            },
            {
                type: 'defense_debuff',
                value: -3,
                target: 'enemy',
                duration: 3
            },
            {
                type: 'magic_resistance_debuff',
                value: -2,
                target: 'enemy',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Explosión Mágica',
        description: 'Tu siguiente hechizo de daño causará dos dados del daño a lo largo de 3 turnos de forma adicional. Acción adicional.',
        cost: 2,
        damage: null,
        levelRequirement: 14,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        effects: [
            {
                type: 'next_spell_dot',
                extraDice: 2,
                duration: 3,
                target: 'enemy_hit_by_spell'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Destrucción Mágica',
        description: 'Rompes la concentración de todos los enemigos y remueves sus potenciaciones, además de remover debilitadores aliados.',
        cost: 8,
        damage: null,
        levelRequirement: 14,
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 15
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Hechizo Impactante',
        description: 'Tu siguiente hechizo de daño, al impactar, requerirá una tirada de salvación de coraje al enemigo con DC igual a tu ataque para no quedar aturdido. Acción adicional.',
        cost: 6,
        damage: null,
        levelRequirement: 15,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'bonus',
        effects: [
            {
                type: 'next_spell_stuns',
                save: 'courage',
                dc: '{attack_roll}',
                target: 'enemy_hit_by_spell'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Potenciación Completa',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos a ti o a un aliado.',
        cost: 8,
        damage: null,
        levelRequirement: 15,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_buff',
                value: 3,
                target: 'self_or_ally',
                duration: 3
            },
            {
                type: 'damage_buff',
                value: 5,
                target: 'self_or_ally',
                duration: 3
            },
            {
                type: 'defense_buff',
                value: 3,
                target: 'self_or_ally',
                duration: 3
            },
            {
                type: 'magic_resistance_buff',
                value: 2,
                target: 'self_or_ally',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 16
    {
        spellId: new ObjectId(),
        name: 'Debilitación Total (F)',
        description: 'Reduce en -5 a todo daño infligido por 3 turnos a todos los enemigos.',
        cost: 4,
        damage: null,
        levelRequirement: 16,
        targetType: 'all_enemies',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'damage_debuff',
                value: -5,
                target: 'all_enemies',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Debilitación Total (P)',
        description: 'Reduce en -4 el ataque por 3 turnos a todos los enemigos.',
        cost: 4,
        damage: null,
        levelRequirement: 16,
        targetType: 'all_enemies',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'attack_debuff',
                value: -4,
                target: 'all_enemies',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Debilitación Total (D)',
        description: 'Reduce en -3 a la defensa y -2 a la resistencia mágica a todos los enemigos.',
        cost: 4,
        damage: null,
        levelRequirement: 16,
        targetType: 'all_enemies',
        class: characterClassId,
        concentration: false,
        duration: 3,
        effects: [
            {
                type: 'defense_debuff',
                value: -3,
                target: 'all_enemies',
                duration: 3
            },
            {
                type: 'magic_resistance_debuff',
                value: -2,
                target: 'all_enemies',
                duration: 3
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Reflejo Arcano IV',
        description: 'Cuando un enemigo falla un ataque contra ti con 1-5 de tirada, puedes lanzar un hechizo con su coste correspondiente. Reacción.',
        cost: 4,
        damage: null,
        levelRequirement: 16,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        action: 'reaction',
        trigger: 'enemy_misses_with_1_to_5',
        effects: [
            {
                type: 'cast_spell_on_reaction',
                condition: 'enemy_roll_1_to_5',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Desplazamiento Acelerado',
        description: 'En un destello, te teletransportas hasta 6 casillas a un lugar sin ocupar que puedas ver.',
        cost: 5,
        damage: null,
        levelRequirement: 17,
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 18
    {
        spellId: new ObjectId(),
        name: 'Robo de Ánima',
        description: 'Todos los enemigos deberán superar una tirada de salvación de carisma con dificultad igual a 10 más tu salvación de carisma o recibirán 1d6 de reducción a todas sus tiradas por tres rondas.',
        cost: 6,
        damage: null,
        levelRequirement: 18,
        targetType: 'all_enemies',
        class: characterClassId,
        concentration: true,
        duration: 3,
        dc: '10 + {charisma_save}',
        effects: [
            {
                type: 'reduce_all_rolls',
                value: '1d6',
                duration: 3,
                save: 'charisma',
                target: 'all_enemies'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Concentración',
        description: 'El siguiente ataque mágico impactará. Si la tirada de ataque impacta, será un crítico.',
        cost: 8,
        damage: null,
        levelRequirement: 18,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'guaranteed_hit',
                upgrade: 'becomes_crit_on_success',
                target: 'next_magical_attack'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Estado Alterado (Z)',
        description: 'Causas un estado alterado de tu afinidad a una zona de 4 casillas de radio con dificultad igual a 10 + salvación de carisma. El efecto se aplicará a cada enemigo que entre o inicie su turno dentro de la zona. La zona durará hasta un máximo de 5 rondas.',
        cost: 5,
        damage: null,
        levelRequirement: 18,
        targetType: 'area',
        class: characterClassId,
        concentration: true,
        duration: 5,
        radius: 4,
        dc: '10 + {charisma_save}',
        effects: [
            {
                type: 'apply_status_zone',
                status: 'element_based',
                element: 'magical_affinity',
                trigger: 'enter_or_start_turn',
                target: 'area'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 19
    {
        spellId: new ObjectId(),
        name: 'Aceleración Mágica',
        description: 'Causas a ti o a uno de tus aliados las siguientes propiedades por 5 turnos: Puedes lanzar un segundo hechizo que no sea de daño o curación como parte de tu hechizo. Aumentas la resistencia mágica en +2. Puedes mantener la concentración en un segundo hechizo. Al acabar, el objetivo no podrá moverse ni realizar acciones hasta el final de su siguiente turno.',
        cost: 12,
        damage: null,
        levelRequirement: 19,
        targetType: 'self_or_ally',
        class: characterClassId,
        concentration: true,
        duration: 5,
        limitOne: true,
        effects: [
            {
                type: 'cast_second_spell',
                condition: 'not_damage_or_healing',
                target: 'self_or_ally'
            },
            {
                type: 'magic_resistance_buff',
                value: 2,
                target: 'self_or_ally',
                duration: 5
            },
            {
                type: 'second_concentration',
                target: 'self_or_ally'
            },
            {
                type: 'exhaustion_after_duration',
                effect: 'no_movement_or_actions',
                duration: 'next_turn',
                target: 'self_or_ally'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Vigorizar II',
        description: 'Al final de cada turno, lanzas 1d6. Si es 6, recuperas 2 SP. Si no, recuperas 1 SP. No acumulable con otros efectos de Vigorizar.',
        cost: 0,
        damage: null,
        levelRequirement: 19,
        targetType: 'self',
        class: characterClassId,
        concentration: false,
        effects: [
            {
                type: 'sp_recovery',
                roll: '1d6',
                successOn: 6,
                apRecoverySuccess: 2,
                apRecoveryFail: 1,
                trigger: 'end_of_turn',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Restringir Enemigo',
        description: 'Si el enemigo tiene la mitad de vida o menos, será aturdido, si no el hechizo fallará. El objetivo aturdido deberá realizar una salvación de coraje con dificultad igual a 10 + salvación de carisma al finalizar cada uno de sus turnos para acabar este efecto.',
        cost: 10,
        damage: null,
        levelRequirement: 19,
        targetType: 'enemy',
        class: characterClassId,
        concentration: true,
        dc: '10 + {charisma_save}',
        effects: [
            {
                type: 'stun_if_half_hp',
                condition: 'enemy_half_hp_or_less',
                save: 'courage',
                saveAtEndOfTurn: true,
                target: 'enemy'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    // Nivel 20
    {
        spellId: new ObjectId(),
        name: 'Maestro en Hechizos',
        description: 'Disminuyes el coste de tus hechizos a la mitad al momento de lanzarlos.',
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
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Inmolación',
        description: 'Puedes lanzar un hechizo adicional como parte de tu lanzamiento de hechizo. Al finalizar cada turno, recibes 12d6 de daño que no se puede restaurar hasta el final de la incursión. Si caes en combate por este efecto, podrás ser estabilizado pero no podrás reincorporarte a combate por el resto de la incursión.',
        cost: 10,
        damage: null,
        levelRequirement: 20,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'cast_extra_spell',
                target: 'self'
            },
            {
                type: 'take_damage_each_turn',
                damage: '12d6',
                unrecoverable: true,
                trigger: 'end_of_turn',
                deathConsequence: 'stabilizable_but_no_return',
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
    {
        spellId: new ObjectId(),
        name: 'Armas Espirituales',
        description: 'Canalizas energía de tu espíritu en dos armas a tu disposición. Dichas armas reemplazarán sus bonificadores por bonificadores de inteligencia, y podrás usarlas para atacar como parte de tu lanzamiento de hechizo sin necesidad de estar dentro del rango del arma.',
        cost: 11,
        damage: null,
        levelRequirement: 20,
        targetType: 'self',
        class: characterClassId,
        concentration: true,
        effects: [
            {
                type: 'spiritual_weapon',
                weaponCount: 2,
                modifier: 'intelligence',
                attackAsPartOfSpell: true,
                ignoreRange: true,
                target: 'self'
            }
        ],
        castingAttribute: 'intelligence_or_charisma',
        state: 'ACTIVE'
    },
]);

// Insertar las características de la clase

// Consumición Corporal
const consumicionCorporalFeatureId = new ObjectId();
const consumicionCorporalFeature = {
    _id: consumicionCorporalFeatureId,
    name: 'Consumición Corporal',
    description: 'Puedes realizar la Consumición Corporal como una acción adicional. Al realizar esta acción, puedes gastar puntos de vida para recuperar puntos de espacios de magia igual a tu bonificador de competencia. Además, perderás puntos de vida máximos (sin salvación) con cantidad igual a un d4 multiplicado por tu bonificador de competencia dividido por dos. El siguiente hechizo de daño que lances obtendrá un +2 a su ataque y su daño aumenta en un valor igual a tu bonificador de competencia. Si el siguiente hechizo que lanzas no es un hechizo que inflija daño, el hechizo será lanzado correctamente, pero los bonos se pierden sin poder recuperarse.',
    levelRequirement: 1,
    class: characterClassId,
    action: 'bonus',
    mechanics: {
        apRecovery: '{proficiency}',
        hpLoss: '{proficiency}',
        maxHpLoss: '1d4 * ({proficiency} / 2)',
        nextDamageSpellBuff: {
            attack: 2,
            damage: '{proficiency}'
        },
        buffLostIfNotDamageSpell: true
    },
    state: 'ACTIVE'
};

// Robo de Espíritu (nivel 1)
const roboDeEspirituFeatureId = new ObjectId();
const roboDeEspirituFeature = {
    _id: roboDeEspirituFeatureId,
    name: 'Robo de Espíritu',
    description: 'Cuando realizas la Consumición Corporal, el siguiente hechizo de daño que lances causará un efecto de ralentizado al enemigo, reduciendo su velocidad en dos casillas. Además, el rango del hechizo se incrementa en dos casillas.',
    levelRequirement: 1,
    class: characterClassId,
    trigger: 'after_consumicion_corporal',
    mechanics: {
        nextDamageSpell: {
            effect: 'slow',
            speedReduction: 2,
            rangeIncrease: 2
        }
    },
    state: 'ACTIVE'
};

// Marca de Sacrificio (nivel 2)
const marcaDeSacrificioFeatureId = new ObjectId();
const marcaDeSacrificioFeature = {
    _id: marcaDeSacrificioFeatureId,
    name: 'Marca de Sacrificio',
    description: 'Con una acción adicional, puedes marcar a un enemigo con un efecto de tu elección. El enemigo mantiene dicho efecto mientras esté marcado. Cuando el enemigo muere, recuperas puntos de vida temporales igual a tu bonificador de competencia multiplicado por dos. La marca requiere concentración.',
    levelRequirement: 2,
    class: characterClassId,
    action: 'bonus',
    concentration: true,
    mechanics: {
        markEffects: 5,
        maxMarks: 'varies_by_level',
        tempHpOnDeath: '{proficiency} * 2',
        upgradesAtLevel14: true
    },
    subFeatures: [
        {
            name: 'Cansancio',
            description: 'El enemigo no puede realizar ataques de oportunidad. Cuando llegas al nivel 14, el efecto se reemplaza a: El enemigo no puede realizar reacciones cuando recibe daño.',
            level: 2,
            baseEffect: 'no_opportunity_attacks',
            level14Effect: 'no_reactions_when_damaged'
        },
        {
            name: 'Reflejo',
            description: 'Cuando el enemigo marcado te impacta con un ataque, sufres un ataque de oportunidad. Cuando llegas al nivel 14, el efecto se reemplaza a: Cuando el enemigo marcado te impacta con un ataque, sufres un ataque de oportunidad. Si el ataque inicial era parte de un múltiple ataque, este efecto se aplica a todas las instancias del múltiple ataque.',
            level: 2,
            baseEffect: 'opportunity_attack_when_hits_you',
            level14Effect: 'applies_to_multiattack'
        },
        {
            name: 'Negligencia',
            description: 'El enemigo deberá hacer una tirada enfrentada de voluntad contra ti. Si pierde, deberá moverse hacia ti hasta que se quede sin movimiento o alcance la posición más cercana a ti. Cuando llegas al nivel 14, el efecto se reemplaza a: El enemigo deberá hacer una tirada enfrentada de voluntad. Si pierde, deberá moverse hasta alcanzar la posición que tú designes.',
            level: 2,
            baseEffect: 'contested_will_move_toward_you',
            level14Effect: 'move_to_designated_position'
        },
        {
            name: 'Dispersión',
            description: 'Cuando el enemigo marcado recibe un efecto negativo, cualquier enemigo a su alrededor en un radio de 2 casillas recibe el mismo efecto. Cuando llegas al nivel 14, el efecto se reemplaza a: Cuando el enemigo marcado recibe un efecto positivo, puedes lanzar un debilitador en dicho objetivo como reacción como si lo lanzaras normalmente.',
            level: 2,
            baseEffect: 'spread_negative_effects_2_squares',
            level14Effect: 'cast_debuff_reaction_on_buff'
        },
        {
            name: 'Destrucción',
            description: 'Cuando el escudo del enemigo es roto, su defensa y resistencia mágica se reducen en -1 mientras esté marcado. Cuando llegas al nivel 14, el efecto se reemplaza a: Cuando el escudo del enemigo es roto, su defensa y resistencia mágica se reducen en -2 mientras esté marcado.',
            level: 2,
            baseEffect: 'def_rm_minus_1_on_shield_break',
            level14Effect: 'def_rm_minus_2_on_shield_break'
        }
    ],
    state: 'ACTIVE'
};

// Sobreposición Sombría (nivel 3)
const sobreposicionSombriaFeatureId = new ObjectId();
const sobreposicionSombriaFeature = {
    _id: sobreposicionSombriaFeatureId,
    name: 'Sobreposición Sombría',
    description: 'Con tu reacción, puedes causar que un enemigo tenga desventaja en su tirada de ataque. Si dicho ataque falla, obtienes ventaja en un contra ataque con tu arma como parte de esta reacción. Puedes utilizar esta característica una cantidad igual a tu bonificador de competencia por incursión.',
    levelRequirement: 3,
    class: characterClassId,
    action: 'reaction',
    usesPerIncursion: '{proficiency}',
    mechanics: {
        effect: 'impose_disadvantage_on_attack',
        counterIfMiss: {
            advantage: true,
            type: 'weapon_attack'
        }
    },
    state: 'ACTIVE'
};

// Subyugación del Marcado (nivel 5)
const subyugacionDelMarcadoFeatureId = new ObjectId();
const subyugacionDelMarcadoFeature = {
    _id: subyugacionDelMarcadoFeatureId,
    name: 'Subyugación del Marcado',
    description: 'Obtienes múltiples bonificadores mientras el enemigo esté marcado.',
    levelRequirement: 5,
    class: characterClassId,
    mechanics: {
        effects: [
            {
                name: 'Daño Continuo',
                description: 'Al final del turno del enemigo, este recibe 1d6 de daño de tu afinidad. Este daño se incrementa a 2d4 cuando alcanzas el nivel 11, y a 2d6 cuando alcanzas el nivel 17.',
                damage: {
                    level5: '1d6',
                    level11: '2d4',
                    level17: '2d6'
                },
                trigger: 'end_of_enemy_turn'
            },
            {
                name: 'Reducción de Salvaciones',
                description: 'El enemigo recibe -1 a sus salvaciones. Cuando alcanzas el nivel 11 se incrementa a -2, y a -3 cuando alcanzas el nivel 17.',
                saveReduction: {
                    level5: -1,
                    level11: -2,
                    level17: -3
                }
            },
            {
                name: 'Manipulación de Iniciativa',
                description: 'Puedes disminuir la iniciativa del objetivo en 1 punto. Cuando alcanzas el nivel 11 se incrementa a 2, y a 3 cuando alcanzas el nivel 17.',
                initiativeReduction: {
                    level5: 1,
                    level11: 2,
                    level17: 3
                }
            },
            {
                name: 'Reducción de Probabilidad Crítica',
                description: 'El enemigo tiene un -5% de probabilidad crítica.',
                critReduction: -5
            }
        ]
    },
    state: 'ACTIVE'
};

// Forma Sombría (nivel 6)
const formaSombriaFeatureId = new ObjectId();
const formaSombriaFeature = {
    _id: formaSombriaFeatureId,
    name: 'Forma Sombría',
    description: 'Con tu acción adicional, manifiestas la forma sombría. Dicha forma otorga las siguientes propiedades por un minuto: Obtienes resistencia a todo tipo de daño; Puedes mantener concentración en dos hechizos; La cantidad de vida máxima perdida al lanzar Consumición Corporal se ignora. Cuando acabas esta forma, debes tirar una salvación de coraje con dificultad igual a 10 más tu bonificador de competencia. Si tienes éxito, no pasa nada. Si fallas, recibes una cantidad de puntos de vida de daño todopoderoso igual a la mitad de tu vida máxima. Solo puedes entrar en la forma sombría dos veces por incursión. Al tomar esta característica, solo puedes tener una marca de sacrificio activa. Cuando alcanzas el nivel 9, puedes tener dos marcas activas. Cuando alcanzas el nivel 14, puedes tener tres marcas activas. Cuando alcanzas el nivel 19, puedes tener cuatro marcas activas.',
    levelRequirement: 6,
    class: characterClassId,
    action: 'bonus',
    duration: '1 minute',
    usesPerIncursion: 2,
    mechanics: {
        effects: {
            resistance: 'all_damage',
            concentration: 2,
            ignoreMaxHpLoss: true
        },
        endRisk: {
            save: 'courage',
            dc: '10 + {proficiency}',
            onFail: 'half_max_hp_almighty_damage'
        },
        marksAllowed: {
            level6: 1,
            level9: 2,
            level14: 3,
            level19: 4
        }
    },
    state: 'ACTIVE'
};

// Afección del Alma (nivel 7)
const afeccionDelAlmaFeatureId = new ObjectId();
const afeccionDelAlmaFeature = {
    _id: afeccionDelAlmaFeatureId,
    name: 'Afección del Alma',
    description: 'Obtienes los siguientes efectos sobre la Marca de Sacrificio: Cuando un enemigo marcado es golpeado con un hechizo de daño, este recibe 1d6 de daño adicional de tu afinidad. Obtienes +5% de probabilidad crítica contra enemigos marcados. Cuando un enemigo marcado es asesinado, recuperas espacios de magia igual a tu bonificador de competencia. Cuando se encuentra en Forma Sombría, estos efectos son doblados.',
    levelRequirement: 7,
    class: characterClassId,
    mechanics: {
        baseEffects: {
            extraDamage: '1d6',
            critChanceIncrease: 5,
            apRecoveryOnKill: '{proficiency}'
        },
        formaSombriaMultiplier: 2
    },
    state: 'ACTIVE'
};

// Reflejo de Sombra (nivel 11)
const reflejoDeSombraFeatureId = new ObjectId();
const reflejoDeSombraFeature = {
    _id: reflejoDeSombraFeatureId,
    name: 'Reflejo de Sombra',
    description: 'Cuando estás en Forma Sombría, cada vez que recibas daño, el objetivo deberá realizar una salvación de inteligencia contra tu lanzamiento de hechizo. Si fallas, recibirás la misma cantidad de daño que tú recibiste. Mientras estés en Forma Sombría, obtienes una acción adicional extra.',
    levelRequirement: 11,
    class: characterClassId,
    trigger: 'in_forma_sombria',
    mechanics: {
        reflectDamage: {
            save: 'intelligence',
            dc: '{spellcasting_attack}',
            damageAmount: 'same_as_taken'
        },
        extraBonusAction: true
    },
    state: 'ACTIVE'
};

// Robar Esencia (nivel 14)
const robarEsenciaFeatureId = new ObjectId();
const robarEsenciaFeature = {
    _id: robarEsenciaFeatureId,
    name: 'Robar Esencia',
    description: 'Cuando un enemigo marcado muere, puedes obtener una habilidad o potenciador que el enemigo haya utilizado con tu reacción. El potenciador dura máximo dos rondas. Además, con tu reacción, cada vez que un enemigo que tengas a tu vista obtenga un potenciador o habilidad de turno, puedes copiarlo durante dos turnos.',
    levelRequirement: 14,
    class: characterClassId,
    action: 'reaction',
    mechanics: {
        stealOnDeath: {
            target: 'marked_enemy',
            duration: 2
        },
        copyBuff: {
            trigger: 'enemy_gains_buff',
            duration: 2,
            action: 'reaction'
        }
    },
    state: 'ACTIVE'
};

// Influencia Espiritual (nivel 17)
const influenciaEspiritualFeatureId = new ObjectId();
const influenciaEspiritualFeature = {
    _id: influenciaEspiritualFeatureId,
    name: 'Influencia Espiritual',
    description: 'Cuando lanzas Consumición Corporal, puedes lanzar un hechizo de forma gratuita con su coste de espacios de magia que esté en tu lista de hechizos preparados como una acción gratuita. Dicho hechizo lanzado de esta forma obtiene +10% de probabilidad crítica. Además, cuando un enemigo marcado es asesinado, puedes transferir la marca de sacrificio a un enemigo dentro de un radio de 4 casillas del enemigo asesinado. La nueva marca se aplicará con el mismo efecto que tenía la marca transferida.',
    levelRequirement: 17,
    class: characterClassId,
    trigger: 'consumicion_corporal',
    mechanics: {
        freeSpell: {
            costFree: true,
            critBonus: 10,
            action: 'free'
        },
        transferMark: {
            trigger: 'marked_enemy_dies',
            range: 4,
            sameEffect: true
        }
    },
    state: 'ACTIVE'
};

// Aura de Corrupción (nivel 20)
const auraDeCorrupcionFeatureId = new ObjectId();
const auraDeCorrupcionFeature = {
    _id: auraDeCorrupcionFeatureId,
    name: 'Aura de Corrupción',
    description: 'Cuando estás en Forma Sombría, puedes activar esta característica con tu acción adicional. Mientras esté activa, todos los enemigos dentro del rango de lanzamiento de hechizos reciben 4d8 de daño de tu afinidad al inicio de su turno. Además, los enemigos no pueden curarse mientras estén dentro del rango. Obtienes +5% de probabilidad crítica en hechizos dentro del rango. Los enemigos deben hacer una salvación de coraje con dificultad igual a tu bonificador de competencia más 10 para poder salir del rango.',
    levelRequirement: 20,
    class: characterClassId,
    trigger: 'in_forma_sombria',
    action: 'bonus',
    mechanics: {
        damage: '4d8',
        trigger: 'start_of_enemy_turn',
        noHealing: true,
        critBonus: 5,
        saveToEscape: {
            save: 'courage',
            dc: '10 + {proficiency}'
        }
    },
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
                    proficiencyBonus: 2,
                    features: [
                        consumicionCorporalFeatureId,
                        roboDeEspirituFeatureId
                    ],
                    spellsKnown: 6,
                    maxAP: 6, // 5 base + 1 por nivel
                    marcaUses: 0
                },
                {
                    level: 2,
                    proficiencyBonus: 2,
                    features: [marcaDeSacrificioFeatureId],
                    spellsKnown: 6,
                    maxAP: 8, // 5 + 1*2 + 1 (bonus cada 2 niveles)
                    marcaUses: 0
                },
                {
                    level: 3,
                    proficiencyBonus: 2,
                    features: [sobreposicionSombriaFeatureId],
                    spellsKnown: 6,
                    maxAP: 9, // 5 + 1*3 + 1
                    marcaUses: 0
                },
                {
                    level: 4,
                    proficiencyBonus: 2,
                    features: [],
                    spellsKnown: 7,
                    maxAP: 11, // 5 + 1*4 + 1 (nivel 2) + 1 (nivel 4)
                    marcaUses: 0,
                    subclassFeature: true
                },
                {
                    level: 5,
                    proficiencyBonus: 3,
                    features: [subyugacionDelMarcadoFeatureId],
                    spellsKnown: 7,
                    maxAP: 12, // 5 + 1*5 + 2
                    marcaUses: 0
                },
                {
                    level: 6,
                    proficiencyBonus: 3,
                    features: [formaSombriaFeatureId],
                    spellsKnown: 7,
                    maxAP: 14, // 5 + 1*6 + 3 (niveles 2,4,6)
                    marcaUses: 2
                },
                {
                    level: 7,
                    proficiencyBonus: 3,
                    features: [afeccionDelAlmaFeatureId],
                    spellsKnown: 7,
                    maxAP: 15, // 5 + 1*7 + 3
                    marcaUses: 2
                },
                {
                    level: 8,
                    proficiencyBonus: 3,
                    features: [],
                    spellsKnown: 10,
                    maxAP: 17, // 5 + 1*8 + 4 (niveles 2,4,6,8)
                    marcaUses: 2,
                    subclassFeature: true
                },
                {
                    level: 9,
                    proficiencyBonus: 4,
                    features: [],
                    spellsKnown: 10,
                    maxAP: 18, // 5 + 1*9 + 4
                    marcaUses: 3
                },
                {
                    level: 10,
                    proficiencyBonus: 4,
                    features: [],
                    spellsKnown: 10,
                    maxAP: 20, // 5 + 1*10 + 5 (niveles 2,4,6,8,10)
                    marcaUses: 3
                },
                {
                    level: 11,
                    proficiencyBonus: 4,
                    features: [reflejoDeSombraFeatureId],
                    spellsKnown: 10,
                    maxAP: 21, // 5 + 1*11 + 5
                    marcaUses: 3
                },
                {
                    level: 12,
                    proficiencyBonus: 4,
                    features: [],
                    spellsKnown: 11,
                    maxAP: 23, // 5 + 1*12 + 6 (niveles 2,4,6,8,10,12)
                    marcaUses: 3
                },
                {
                    level: 13,
                    proficiencyBonus: 5,
                    features: [],
                    spellsKnown: 11,
                    maxAP: 24, // 5 + 1*13 + 6
                    marcaUses: 3,
                    subclassFeature: true
                },
                {
                    level: 14,
                    proficiencyBonus: 5,
                    features: [robarEsenciaFeatureId],
                    spellsKnown: 11,
                    maxAP: 26, // 5 + 1*14 + 7 (niveles 2,4,6,8,10,12,14)
                    marcaUses: 4
                },
                {
                    level: 15,
                    proficiencyBonus: 5,
                    features: [],
                    spellsKnown: 11,
                    maxAP: 27, // 5 + 1*15 + 7
                    marcaUses: 4
                },
                {
                    level: 16,
                    proficiencyBonus: 5,
                    features: [],
                    spellsKnown: 14,
                    maxAP: 29, // 5 + 1*16 + 8 (niveles 2,4,6,8,10,12,14,16)
                    marcaUses: 4
                },
                {
                    level: 17,
                    proficiencyBonus: 6,
                    features: [influenciaEspiritualFeatureId],
                    spellsKnown: 14,
                    maxAP: 30, // 5 + 1*17 + 8
                    marcaUses: 4
                },
                {
                    level: 18,
                    proficiencyBonus: 6,
                    features: [],
                    spellsKnown: 14,
                    maxAP: 32, // 5 + 1*18 + 9 (niveles 2,4,6,8,10,12,14,16,18)
                    marcaUses: 4,
                    subclassFeature: true
                },
                {
                    level: 19,
                    proficiencyBonus: 6,
                    features: [],
                    spellsKnown: 18,
                    maxAP: 33, // 5 + 1*19 + 9
                    marcaUses: 5
                },
                {
                    level: 20,
                    proficiencyBonus: 6,
                    features: [auraDeCorrupcionFeatureId],
                    spellsKnown: 18,
                    maxAP: 35, // 5 + 1*20 + 10 (niveles 2,4,6,8,10,12,14,16,18,20)
                    marcaUses: 5
                }
            ]
        }
    }
);

// Subclases de Warlock

// DOMINION
db.subclass.insertMany([
    {
        _id: new ObjectId(),
        name: 'Dominion',
        description: 'Brujo que se especializa en controlar la voluntad de sus enemigos, sometiéndolos a través de presión mental y manipulación psíquica.',
        class: characterClassId,
        features: [
            {
                _id: new ObjectId(),
                name: 'Presión Abrumadora',
                description: 'Cuando lanzas un hechizo que inflija daño a un enemigo, puedes someter a ese enemigo a un efecto de presión. El enemigo deberá realizar una salvación de voluntad con dificultad igual a 10 más tu bonificador de competencia. Si falla, sufre uno de los siguientes efectos de tu elección por 3 turnos: Debilidad (Daño reducido a la mitad); Desconcentración (Desventaja en tiradas de ataque); Cansancio (Velocidad reducida a la mitad). Puedes utilizar esta característica una cantidad de veces igual a tu bonificador de competencia por incursión.',
                levelRequirement: 4,
                action: 'trigger_with_damage_spell',
                usesPerIncursion: '{proficiency}',
                mechanics: {
                    save: 'will',
                    dc: '10 + {proficiency}',
                    duration: 3,
                    effects: [
                        {
                            name: 'Debilidad',
                            effect: 'half_damage'
                        },
                        {
                            name: 'Desconcentración',
                            effect: 'disadvantage_on_attacks'
                        },
                        {
                            name: 'Cansancio',
                            effect: 'half_speed'
                        }
                    ]
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Forzar la Voluntad',
                description: 'Puedes realizar una tirada enfrentada de voluntad contra un enemigo dentro del rango de tu lanzamiento de hechizos. Si ganas, el enemigo debe moverse a la posición que tú designes utilizando su movimiento. Además, cuando realizas un ataque crítico con un hechizo, recuperas puntos de vida igual a tu nivel, un uso de Presión Abrumadora y espacios de magia igual a tu bonificador de competencia.',
                levelRequirement: 8,
                action: 'action',
                mechanics: {
                    forceMovement: {
                        check: 'contested_will',
                        range: '{spell_range}'
                    },
                    critRecovery: {
                        hp: '{level}',
                        presionUse: 1,
                        ap: '{proficiency}'
                    }
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Dominio Absoluto',
                description: 'La dificultad de Presión Abrumadora se incrementa en una cantidad igual a tu salvación de carisma. Además, los efectos de Presión Abrumadora son reemplazados por los siguientes: Debilidad (Todos los ataques causan la mitad de daño); Desconcentración (No puede lanzar hechizos o usar habilidades con coste); Cansancio (Velocidad reducida a 0).',
                levelRequirement: 13,
                mechanics: {
                    dcIncrease: '{charisma_save}',
                    enhancedEffects: [
                        {
                            name: 'Debilidad',
                            effect: 'all_attacks_half_damage'
                        },
                        {
                            name: 'Desconcentración',
                            effect: 'no_spells_or_abilities'
                        },
                        {
                            name: 'Cansancio',
                            effect: 'speed_0'
                        }
                    ]
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Destruir Voluntad',
                description: 'Cuando un enemigo tiene un cuarto o menos de sus puntos de vida, puedes lanzar un d20. Si el resultado es 10 o más, el enemigo huye del combate. Además, tienes el doble de probabilidad de realizar un crítico contra enemigos que tengan la mitad o menos de sus puntos de vida.',
                levelRequirement: 18,
                mechanics: {
                    fleeCheck: {
                        condition: 'quarter_hp_or_less',
                        roll: '1d20',
                        successOn: 10
                    },
                    doubleCritChance: {
                        condition: 'half_hp_or_less'
                    }
                },
                state: 'ACTIVE'
            }
        ],
        state: 'ACTIVE'
    },

    // INVOKER
    {
        _id: new ObjectId(),
        name: 'Invoker',
        description: 'Brujo que invoca sombras de enemigos caídos para combatir a su lado, dominando el arte de la nigromancia sombría.',
        class: characterClassId,
        features: [
            {
                _id: new ObjectId(),
                name: 'Invocación de Sombras',
                description: 'Con tu reacción, puedes capturar la sombra de un enemigo caído. Si el enemigo caído está marcado, no requiere reacción. Puedes invocar la sombra con tu acción. Las sombras tienen nivel máximo igual a la mitad de tu nivel. Si el enemigo tiene mayor nivel, deberás realizar una tirada enfrentada de voluntad para poder capturarlo. Las sombras obedecen tus órdenes. Puedes tener una cantidad de sombras igual a tu bonificador de competencia.',
                levelRequirement: 4,
                action: 'reaction_to_capture_action_to_summon',
                usesPerIncursion: '{proficiency}',
                mechanics: {
                    capture: {
                        action: 'reaction',
                        markedFree: true
                    },
                    summon: {
                        action: 'action',
                        maxLevel: '{level / 2}',
                        contestedIfHigher: true,
                        check: 'contested_will',
                        maxSummons: '{proficiency}'
                    }
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Consumición de Sombra',
                description: 'Puedes sacrificar una de tus sombras invocadas para recuperar puntos de vida igual a la mitad de los puntos de vida máximos de la sombra. Cuando estás inconsciente, puedes realizar esta acción una vez de forma automática antes de realizar tus salvaciones de muerte.',
                levelRequirement: 8,
                action: 'action',
                mechanics: {
                    healAmount: 'half_summon_max_hp',
                    unconsciousAuto: {
                        uses: 1,
                        trigger: 'before_death_saves'
                    }
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Manipulación Crítica',
                description: 'Cuando realizas un ataque crítico con un hechizo, invocas automáticamente una sombra pequeña con nivel igual a un cuarto de tu nivel redondeado hacia abajo. La sombra permanece durante 3 turnos. Además, tus sombras invocadas pueden ser el punto de origen de tus hechizos.',
                levelRequirement: 13,
                mechanics: {
                    autoSummon: {
                        trigger: 'spell_crit',
                        level: '{level / 4}',
                        duration: 3
                    },
                    spellOrigin: true
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Maestro Invocador',
                description: 'Cuando estás en Forma Sombría, puedes invocar una segunda sombra. El límite de nivel de ambas sombras se duplica pero se divide entre ambas (por ejemplo, si tu límite es 10, puedes tener una sombra de nivel 8 y otra de nivel 12, siempre que la suma no exceda 20). Cuando Forma Sombría termina, las sombras permanecen durante 3 turnos antes de desaparecer. Además, con tu reacción, cuando una de tus sombras es destruida, puedes invocar inmediatamente otra sombra capturada. Esta sombra te obedecerá automáticamente durante 3 turnos sin importar su nivel.',
                levelRequirement: 18,
                mechanics: {
                    secondSummon: {
                        trigger: 'in_forma_sombria',
                        levelCapDouble: true,
                        splitBetween: 2,
                        persistAfterForma: 3
                    },
                    reactionSummon: {
                        trigger: 'summon_destroyed',
                        action: 'reaction',
                        autoObey: true,
                        duration: 3
                    }
                },
                state: 'ACTIVE'
            }
        ],
        state: 'ACTIVE'
    },

    // SHATTERED
    {
        _id: new ObjectId(),
        name: 'Shattered',
        description: 'Brujo que fragmenta almas enemigas, utilizando estos fragmentos para atacar, curar o potenciar sus hechizos.',
        class: characterClassId,
        features: [
            {
                _id: new ObjectId(),
                name: 'Fragmentos de Alma',
                description: 'Con tu reacción, puedes capturar un fragmento del alma de un enemigo caído. Si el enemigo estaba marcado, no requiere reacción. Puedes tener una cantidad máxima de fragmentos igual a tu nivel. Puedes realizar dos acciones con los fragmentos: Fragmentar ánima (Acción adicional): Gastas fragmentos para atacar. Lanzas 1d6 por fragmento gastado contra un enemigo. Si impacta, recuperas la mitad del daño como puntos de vida temporales. Concentración fragmentada (Acción adicional): Gastas fragmentos para garantizar el éxito de un hechizo. El coste en fragmentos es igual a la mitad del coste del hechizo. El hechizo tiene éxito automático y obtiene ventaja en su tirada.',
                levelRequirement: 4,
                mechanics: {
                    capture: {
                        action: 'reaction',
                        markedFree: true,
                        max: '{level}'
                    },
                    fragmentarAnima: {
                        action: 'bonus',
                        damage: '1d6_per_fragment',
                        heal: 'half_damage_as_temp_hp'
                    },
                    concentracionFragmentada: {
                        action: 'bonus',
                        cost: '{spell_cost / 2}',
                        effect: 'auto_success_with_advantage'
                    }
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Disolución de Fragmentos',
                description: 'Puedes consumir fragmentos para curar a todos tus aliados. Cada aliado recupera 1d4 de puntos de vida por fragmento consumido. Además, puedes aplicar un debilitador básico a un enemigo dentro de tu rango de lanzamiento de hechizos.',
                levelRequirement: 8,
                action: 'action',
                mechanics: {
                    heal: '1d4_per_fragment_all_allies',
                    debuff: 'basic_debuff_to_one_enemy'
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Cristalización Corporal',
                description: 'Puedes perder puntos de vida para generar fragmentos. Cada dos puntos de vida perdidos generan un fragmento. Además, cuando un enemigo muere, obtienes el doble de fragmentos. Si entras en combate sin fragmentos, comienzas con 4 fragmentos.',
                levelRequirement: 13,
                mechanics: {
                    hpToFragments: {
                        ratio: '2 hp = 1 fragment'
                    },
                    doubleOnDeath: true,
                    startCombat: 4
                },
                state: 'ACTIVE'
            },
            {
                _id: new ObjectId(),
                name: 'Robo de Espíritu Fragmentado',
                description: 'Cuando aplicas un debilitador a un enemigo o realizas un ataque crítico, obtienes 2 fragmentos. El límite máximo de fragmentos se elimina. Puedes usar Fragmentar Ánima como parte del lanzamiento de un hechizo sin consumir acción adicional. Cuando estás en Forma Sombría, Fragmentar Ánima lanza el doble de dados.',
                levelRequirement: 18,
                mechanics: {
                    fragmentGeneration: {
                        debuff: 2,
                        crit: 2
                    },
                    noMaxLimit: true,
                    fragmentarAsPartOfSpell: true,
                    formaSombriaDouble: true
                },
                state: 'ACTIVE'
            }
        ],
        state: 'ACTIVE'
    }
]);



const listSpells = await db.spells.insertMany([
    {
        name: 'Ataque Físico I (I)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 2,
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
    {
        name: 'Potenciación Básica (F)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 2,
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
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 2,
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
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 2,
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
    {
        name: 'Curación Básica',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 3,
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
    {
        name: 'Ataque Físico I (A)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 4,
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
        name: 'Ataque Físico II (I)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 4,
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
        name: 'Ataque Físico I (E)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 3,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario con 10% (18-20) de porcentaje de crítico aumentado, pero con un porcentaje de pifia aumentado en 10% (1-3).',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '4d2',
                range: {
                    type: 'ranged',
                    range: 6
                },
                target: 'enemy',
                bonus: 0
            }
        ],
        modifiers: [
            {
                type: 'critical',
                value: 0.1,
                description: '10% de porcentaje de crítico aumentado',
                target: 'self',
                duration: {
                    type: 'thisSpell',
                    duration: 0,
                    medition: 'none',
                }
            },
            {
                type: 'criticalFail',
                value: 0.1,
                description: '10% de porcentaje de pifia aumentado',
                target: 'self',
                duration: {
                    type: 'thisSpell',
                    duration: 0,
                    medition: 'none',
                }
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Ataque Físico I (M)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 4,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual con una afinidad mágica previamente establecida.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'secondaryAffinity',
                dice: '2d6',
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
        name: 'Barrera Física',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 3,
        useType: 'active',
        category: 'shield',
        description: 'Como acción adicional, puedes otorgar una barrera física a ti o a un aliado. Dicha barrera detendrá el primer ataque de un enemigo sin tirar.',
        concentration: false,
        effects: [
            {
                type: 'shield',
                shieldType: 'physical',
                uses: 1,
                target: 'ally',
                range: {
                    type: 'ranged',
                    range: 6
                },
                trigger: 'before_receive_attack'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Regenerar I',
        system: 'PERSONAD20',
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
                levelCondition: 0,
                etiquette: 'regeneration'
            },
            {
                type: 'heal',
                healType: 'HP',
                heal: '2d4',
                target: 'self',
                trigger: 'at_turn_end',
                levelCondition: 13,
                etiquette: 'regeneration'
            },
            {
                type: 'heal',
                healType: 'HP',
                heal: '2d6',
                target: 'self',
                trigger: 'at_turn_end',
                levelCondition: 17,
                etiquette: 'regeneration'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Ataque Físico II (A)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 6,
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
        name: 'Ataque Físico II (E)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 5,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario con 10% (18-20) de porcentaje de crítico aumentado, pero con un porcentaje de pifia aumentado en 10% (1-3).',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '8d2',
                range: {
                    type: 'ranged',
                    range: 6
                },
                target: 'enemy',
                bonus: 0
            }
        ],
        modifiers: [
            {
                type: 'critical',
                value: 0.1,
                description: '10% de porcentaje de crítico aumentado',
                target: 'self',
                duration: {
                    type: 'thisSpell',
                    duration: 0,
                    medition: 'none',
                }
            },
            {
                type: 'criticalFail',
                value: 0.1,
                description: '10% de porcentaje de pifia aumentado',
                target: 'self',
                duration: {
                    type: 'thisSpell',
                    duration: 0,
                    medition: 'none',
                }
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Ataque Físico II (M)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 6,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual con una afinidad mágica previamente establecida.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'secondaryAffinity',
                dice: '3d8',
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
        name: 'Ataque Físico III (I)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 6,
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
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 6,
        useType: 'active',
        category: 'buff',
        description: 'Incrementa ratio de crítico en 5% (19-20) en ataques a ti y a todos los aliados durante 3 turnos.',
        concentration: false,
        modifiers: [{
            type: 'critical',
            value: 0.05,
            description: 'Incrementa ratio de crítico en 5%',
            target: 'all_allies',
            duration: {
                type: 'temporal',
                duration: 3,
                medition: 'rounds'
            }
        }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (F)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 3,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +5 a todo daño infligido por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [{
            value: 4,
            type: 'damage',
            description: 'Aumenta en +5 a todo daño infligido',
            target: 'ally',
            duration: {
                type: 'temporal',
                duration: 3,
                medition: 'rounds'
            },
            etiquette: 'empowerment_damage'
        }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (P)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 3,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 el ataque por 3 turnos a ti o a un aliado.',
        concentration: false,
        modifiers: [{
            value: 4,
            type: 'attack',
            description: 'Aumenta en +3 el ataque',
            target: 'ally',
            duration: {
                type: 'temporal',
                duration: 3,
                medition: 'rounds'
            },
            etiquette: 'empowerment_attack'
        }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Potenciación Compleja (D)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 3,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta en +3 la defensa y +2 la resistencia mágica por 3 turnos a ti o a un aliado.',
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
    {
        name: 'Bebedor de Sombras',
        system: 'PERSONAD20',
        useType: 'passive',
        category: 'heal',
        description: 'Al infligir daño a un enemigo, recuperas la mitad de tu nivel en PV.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '{half_level}',
                target: 'self',
                trigger: 'at_damage',
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
    {
        name: 'Ataque Físico III (A)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 8,
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
        name: 'Ataque Físico III (E)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 7,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario con 10% (18-20) de porcentaje de crítico aumentado, pero con un porcentaje de pifia aumentado en 10% (1-3).',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '8d4',
                range: {
                    type: 'ranged',
                    range: 6
                },
                target: 'enemy',
                bonus: 0
            }
        ],
        modifiers: [
            {
                type: 'critical',
                value: 0.1,
                description: '10% de porcentaje de crítico aumentado',
                target: 'self',
                duration: {
                    type: 'thisSpell',
                    duration: 0,
                    medition: 'none',
                }
            },
            {
                type: 'criticalFail',
                value: 0.1,
                description: '10% de porcentaje de pifia aumentado',
                target: 'self',
                duration: {
                    type: 'thisSpell',
                    duration: 0,
                    medition: 'none',
                }
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Regenerar II',
        system: 'PERSONAD20',
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
                levelCondition: 0,
                etiquette: 'regeneration'
            },
            {
                type: 'heal',
                healType: 'HP',
                heal: '4d6',
                target: 'self',
                trigger: 'at_turn_end',
                levelCondition: 17,
                etiquette: 'regeneration'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Ataque Físico III (M)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 8,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual con una afinidad mágica previamente establecida.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'secondaryAffinity',
                dice: '4d10',
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
        name: 'Potenciación Completa',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 7,
        useType: 'active',
        category: 'buff',
        description: 'Aumenta +3 a tu ataque, +5 al daño infligido, +3 a la Defensa y +2 a la Resistencia Mágica por 3 turnos al usuario.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumenta +3 a tu ataque',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_attack'
            },
            {
                value: 5,
                type: 'damage',
                description: 'Aumenta +5 al daño infligido',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_damage'
            },
            {
                value: 3,
                type: 'defense',
                description: 'Aumenta +3 a la Defensa',
                target: 'self',
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
                description: 'Aumenta +2 a la Resistencia Mágica',
                target: 'self',
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
    {
        name: 'Ataque Físico IV (I)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 8,
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
    {
        name: 'Avance Valiente',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 10,
        useType: 'active',
        category: 'buff',
        description: 'Incrementa ratio de crítico en 10% (18-20) en ataques a ti y a todos los aliados durante 3 turnos.',
        concentration: false,
        modifiers: [{
            type: 'critical',
            value: 0.1,
            description: 'Incrementa ratio de crítico en 10%',
            target: 'all_allies',
            duration: {
                type: 'temporal',
                duration: 3,
                medition: 'rounds'
            },
            etiquette: 'empowerment_critical'
        }],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Grito de Guerra',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 7,
        useType: 'active',
        category: 'buff',
        description: 'Otorgas a tus aliados +5 al daño infligido y aumentas en 5% su porcentaje de crítico en ataques y reduces en -3 la Defensa y -2 a la Resistencia Mágica a los enemigos por tres turnos.',
        concentration: false,
        modifiers: [
            {
                value: 5,
                type: 'damage',
                description: 'Otorgas a tus aliados +5 al daño infligido',
                target: 'all_allies',
                etiquette: 'empowerment_damage'
            },
            {
                type: 'critical',
                value: 0.05,
                description: 'Aumentas en 5% su porcentaje de crítico en ataques',
                target: 'all_allies',
                etiquette: 'empowerment_critical'
            },
            {
                value: -3,
                type: 'defense',
                description: 'Reduces en -3 la Defensa',
                target: 'all_enemies',
                etiquette: 'debilitation_defense'
            },
            {
                value: -2,
                type: 'magic_defense',
                description: 'Reduces en -2 a la Resistencia Mágica',
                target: 'all_enemies',
                etiquette: 'debilitation_defense'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Carga',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 6,
        useType: 'active',
        category: 'attack',
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
        name: 'Ataque Físico IV (A)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 10,
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
        name: 'Ataque Físico IV (E)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 9,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual de la afinidad física del usuario con 10% (18-20) de porcentaje de crítico aumentado, pero con un porcentaje de pifia aumentado en 10% (1-3).',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'affinity',
                dice: '12d4',
                range: {
                    type: 'ranged',
                    range: 6
                },
                target: 'enemy',
                bonus: 0
            }
        ],
        modifiers: [
            {
                type: 'critical',
                value: 0.1,
                description: '10% de porcentaje de crítico aumentado',
                target: 'self',
                duration: {
                    type: 'thisSpell',
                    duration: 0,
                    medition: 'none',
                }
            },
            {
                type: 'criticalFail',
                value: 0.1,
                description: '10% de porcentaje de pifia aumentado',
                target: 'self',
                duration: {
                    type: 'thisSpell',
                    duration: 0,
                    medition: 'none',
                }
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Ataque Físico IV (M)',
        cost: 'AP',
        system: 'PERSONAD20',
        AP: 10,
        useType: 'active',
        category: 'attack',
        description: 'Inflige daño de objetivo individual con una afinidad mágica previamente establecida.',
        concentration: false,
        effects: [
            {
                type: 'damage',
                damageType: 'secondaryAffinity',
                dice: '6d12',
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
        name: 'Regenerar III',
        system: 'PERSONAD20',
        useType: 'passive',
        category: 'heal',
        description: 'Al final de cada turno, restauras 6d6 PV. No se acumula con otros Regenerar.',
        concentration: false,
        effects: [
            {
                type: 'heal',
                healType: 'HP',
                heal: '6d6',
                target: 'self',
                trigger: 'at_turn_end',
                etiquette: 'regeneration'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Desenfreno Violento',
        cost: 'AP and HP',
        system: 'PERSONAD20',
        AP: 8,
        costHP: 'level',
        useType: 'active',
        category: 'attack',
        description: 'Aumentas +3 a tu ataque, +6 al daño infligido, 10% de porcentaje de crítico en ataques aumentado al usuario por 3 turnos.',
        concentration: false,
        modifiers: [
            {
                value: 3,
                type: 'attack',
                description: 'Aumentas +3 a tu ataque',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_attack'
            },
            {
                value: 6,
                type: 'damage',
                description: 'Aumentas +6 al daño infligido',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_damage'
            },
            {
                type: 'critical',
                value: 0.1,
                description: '10% de porcentaje de crítico en ataques aumentado',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                },
                etiquette: 'empowerment_critical'
            }
        ],
        toList: 'list',
        state: 'ACTIVE'
    },
    {
        name: 'Maestro en Armas',
        system: 'PERSONAD20',
        useType: 'passive',
        category: 'buff',
        description: 'Disminuyes el coste de tus hechizos de daño a la mitad. Puedes decidir no reducirlos a cambio de aumentar dos dados adicionales la tirada de daño.',
        concentration: false,
        effects: [
            {
                type: 'spellCost',
                spellType: 'damage',
                reduction: 0.5,
                target: 'self',
                etiquette: 'weapon_master',
                condition: 'selection'
            },
            {
                type: 'spellDamage',
                spellType: 'damage',
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

const characterClass = await db.class.insertOne({
    name: 'Revenant',
    description: 'Pum te pego',
    HPDice: '2d4',
    salvations: ['courage', 'dexterity'],
    levels: [
        {
            level: 1,
            proficency: 2,
            spells: [spells[0]],
            features: [],
            APGained: 5,
            knownSpells: 2,
        },
        {
            level: 2,
            proficency: 2,
            spells: [spells[1], spells[2], spells[3]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b3b'),
                    name: 'Rabia Interior',
                    description: `Puedes otorgarle a tus habilidades de combate la ferocidad primitiva más brutal. En tu turno, puedes entrar en rabia como acción adicional una cantidad de veces igual a tu competencia.
    
                    Cuando entras en rabia, ganas un numero de puntos de ira (PI) igual a tus Reservas de Ira. Por cada ataque que logres impactar que no hayas usado ningún rasgo violento, ganaras 1 PI. Nunca puedes tener más PI que tu nivel.
                    
                    Puedes gastar estos puntos para activar rasgos violentos de tu ser. Al llegar al nivel 2, aprendes dos rasgos violentos, y al nivel 3, 7, 11, 15 y 20 aprenderás un rasgo adicional en cada nivel. Cada vez que subes de nivel, puedes reemplazar un rasgo que conozcas por otro distinto de la lista.
                    
                    Algunos de los rasgos violentos pueden requerir una tirada de salvación. En dicho caso, la dificultad establecida será igual a la siguiente formula: 8 + tu competencia + tu bonificador de coraje.`,
                    useType: 'passive',
                    action: 'bonus_action',
                    triggerForRecover: 'at_attack',
                    resource: 'Rage Points',
                    uses: 'proficency',
                    cd: '8 + {proficency} + {courage_bonifier}',
                    state: 'ACTIVE',
                    effects: [
                        {
                            type: 'resource',
                            target: 'self',
                            resource: 'Rage Points',
                            value: '{ceil(level / 3) - 1 + 1}',
                        }
                    ],
                    subFeatures: [
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b3c'),
                            name: 'Ira Berseker',
                            description: 'Puedes gastar 3 PI y tu acción para acabar con todos los efectos negativos y debilitadores aplicados en ti. Duplicando su coste en PI, puedes hacerlo con acción adicional.',
                            action: 'action',
                            alternativeAction: 'bonus_action',
                            costType: 'temporal',
                            cost: 3,
                            alternativeCostType: 'temporal',
                            alternativeCost: 6,
                            target: 'self',
                            resource: 'Rage Points',
                            effects: [
                                {
                                    type: 'healing',
                                    target: 'self',
                                    healType: 'status_effect',
                                    heal: 'all',
                                },
                                {
                                    type: 'healing',
                                    target: 'self',
                                    healType: 'debilitation',
                                    heal: 'all',
                                }
                            ],
                            state: 'ACTIVE',
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b3d'),
                            name: 'Carga',
                            description: 'Puedes gastar 2 PI y tu acción en Correr, si te mueves al menos 4 casillas hacia un objetivo, puedes realizar un ataque con arma contra él con ventaja. Si posees multiataque, el resto de los ataques no se realizarán con ventaja.',
                            action: 'action',
                            costType: 'temporal',
                            cost: 2,
                            target: 'self',
                            resource: 'Rage Points',
                            effects: [
                                {
                                    type: 'attack',
                                    target: 'enemy',
                                    trigger: 'next_physical_attack',
                                    condition: 'move at least 4 squares',
                                    modification: 'advantage',
                                },
                            ],
                            state: 'ACTIVE',
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b3e'),
                            name: 'Heridas Graves',
                            description: 'Cuando impactas un ataque, puedes gastar 3 PI para infligir heridas graves. El objetivo deberá realizar una tirada de salvación de coraje, y en caso de fallar, toda su curación recibida será reducida a la mitad por 10 rondas, además de recibir 1d6 de daño al final de cada uno de sus turnos. El objetivo deberá repetir la tirada de salvación al final de cada una de sus rondas.',
                            trigger: 'at_attack',
                            costType: 'temporal',
                            cost: 3,
                            target: 'enemy',
                            resource: 'Rage Points',
                            requireSalvation: true,
                            effects: [
                                {
                                    type: 'debuff',
                                    target: 'enemy',
                                    condition: 'failed courage save',
                                    shouldSaveEachTurn: true,
                                    duration: {
                                        type: 'temporal',
                                        duration: 10,
                                        medition: 'rounds'
                                    },
                                    modifiers: [
                                        {
                                            type: 'healing_received',
                                            value: -0.5,
                                            description: 'Reduces healing received by half',
                                            target: 'enemy',
                                        },
                                        {
                                            type: 'damage',
                                            damageType: 'physical',
                                            dice: '1d6',
                                            trigger: 'at_turn_end',
                                            target: 'enemy',
                                        }
                                    ]
                                }
                            ],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b3f'),
                            name: 'Aturdir',
                            description: 'Puedes gastar 2 PI antes de realizar un ataque con la intención de aturdir al objetivo. Si impactas, el objetivo tendrá que realizar una salvación de coraje, en caso de fallarla tendrá desventaja en su siguiente acción.',
                            trigger: 'before_attack',
                            costType: 'temporal',
                            cost: 2,
                            target: 'enemy',
                            resource: 'Rage Points',
                            requireSalvation: true,
                            effects: [
                                {
                                    type: 'debuff',
                                    target: 'enemy',
                                    condition: 'failed courage save',
                                    modifiers: [
                                        {
                                            type: 'action',
                                            value: 'disadvantage',
                                            description: 'Desventaja en su siguiente acción',
                                            target: 'enemy',
                                            duration: {
                                                type: 'temporal',
                                                duration: 1,
                                                medition: 'actions'
                                            },
                                        }
                                    ]
                                }
                            ],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b40'),
                            name: 'Ejecutar',
                            description: 'Cuando impactas un ataque y el objetivo tiene el estado ensangrentado, puedes gastar 4 PI para infligir daño adicional igual al doble de tu nivel.',
                            trigger: 'at_attack',
                            costType: 'temporal',
                            cost: 4,
                            target: 'enemy',
                            resource: 'Rage Points',
                            effects: [
                                {
                                    type: 'damage',
                                    damageType: 'physical',
                                    dice: '{level} * 2',
                                    condition: 'target has state bleeding',
                                }
                            ],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b41'),
                            name: 'Golpe al Tendón',
                            description: 'Puedes gastar 3 PI antes de realizar un ataque con la intención de mellar su movimiento. Si impactas, el objetivo tendrá que realizar una salvación de coraje, en caso de fallarla su velocidad será reducida a 0, o la mitad en caso de superarla, hasta el inicio de tu siguiente turno.',
                            trigger: 'before_attack',
                            costType: 'temporal',
                            cost: 3,
                            target: 'enemy',
                            resource: 'Rage Points',
                            requireSalvation: true,
                            effects: [
                                {
                                    type: 'debuff',
                                    target: 'enemy',
                                    condition: 'courage save',
                                    modifiers: [
                                        {
                                            type: 'speed',
                                            value: 0,
                                            description: 'Reduce speed to 0',
                                            target: 'enemy',
                                            condition: 'failed courage save',
                                            duration: {
                                                type: 'temporal',
                                                duration: 1,
                                                medition: 'turns'
                                            }
                                        },
                                        {
                                            type: 'speed',
                                            value: 0.5,
                                            description: 'Reduce speed to half',
                                            target: 'enemy',
                                            condition: 'successful courage save',
                                            duration: {
                                                type: 'temporal',
                                                duration: 1,
                                                medition: 'turns'
                                            }
                                        }
                                    ]
                                }
                            ],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b42'),
                            name: 'Ignorar el dolor',
                            description: 'Puedes gastar 5 PI como reacción al momento de ser impactado por un ataque, otorgándote resistencia al daño físico o mágico, a tu elección, hasta el inicio de tu siguiente turno.',
                            trigger: 'at_receive_attack',
                            action: 'reaction',
                            costType: 'temporal',
                            cost: 5,
                            target: 'self',
                            resource: 'Rage Points',
                            effects: [
                                {
                                    type: 'resistance',
                                    damageType: 'election',
                                    duration: {
                                        type: 'temporal',
                                        duration: 1,
                                        medition: 'round'
                                    }
                                }
                            ],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b43'),
                            name: 'Arremetida',
                            description: 'Gastando 1 PI, puedes repetir tu tirada de daño luego de verla. Debes utilizar la nueva tirada de daño.',
                            trigger: 'after_damage_roll',
                            costType: 'temporal',
                            cost: 1,
                            target: 'self',
                            resource: 'Rage Points',
                            effects: [
                                {
                                    type: 'reroll_damage',
                                    target: 'self',
                                    condition: 'after_damage_roll',
                                    description: 'Repite tu tirada de daño'
                                }
                            ],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b44'),
                            name: 'Abanicar',
                            description: 'Cuando impactas un ataque contra un enemigo con un arma cuerpo a cuerpo, gastando 1 PI, puedes realizar un ataque adicional a un enemigo distinto a una casilla de distancia del objetivo inicial que esté dentro de tu rango de ataque.',
                            trigger: 'at_attack',
                            costType: 'temporal',
                            cost: 1,
                            target: 'enemy',
                            resource: 'Rage Points',
                            effects: [
                                {
                                    type: 'attack_with_weapon',
                                    target: 'enemy',
                                    condition: 'different enemy within range',
                                    range: {
                                        type: 'melee',
                                        range: 1,
                                    },
                                    description: 'Realiza un ataque adicional a un enemigo distinto a una casilla de distancia del objetivo inicial que esté dentro de tu rango de ataque.'
                                }
                            ],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b45'),
                            name: 'Derribar',
                            description: 'Gastando 1 PI al momento de impactar un ataque, puedes forzar al objetivo a realizar una salvación de coraje, en caso de fallarla, el enemigo caerá al suelo.',
                            trigger: 'at_attack',
                            costType: 'temporal',
                            cost: 1,
                            target: 'enemy',
                            resource: 'Rage Points',
                            requireSalvation: true,
                            effects: [
                                {
                                    type: 'debuff',
                                    target: 'enemy',
                                    condition: 'failed courage save',
                                    modifiers: [
                                        {
                                            type: 'prone',
                                            description: 'El enemigo caerá al suelo',
                                            target: 'enemy',
                                            duration: {
                                                type: 'temporal',
                                                duration: 1,
                                                medition: 'turns'
                                            }
                                        }
                                    ]
                                }
                            ],
                            state: 'ACTIVE'
                        },
                        {
                            featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b46'),
                            name: 'Empuje',
                            description: 'Cuando impactas un ataque, puedes escoger lanzar al enemigo impactado en un rango de 1 a 3 casillas hacia atrás por 1 PI sin realizar tirada de salvación.',
                            trigger: 'at_attack',
                            costType: 'temporal',
                            cost: 1,
                            target: 'enemy',
                            resource: 'Rage Points',
                            effects: [
                                {
                                    type: 'move',
                                    target: 'enemy',
                                    range: {
                                        type: 'ranged',
                                        range: 3
                                    },
                                    direction: 'backward',
                                    description: 'Lanza al enemigo impactado en un rango de 1 a 3 casillas hacia atrás'
                                }
                            ],
                            state: 'ACTIVE'
                        }
                    ]
                }
            ],
            APGained: 1,
            maxPreparedSpells: 2,
            knownSecondaryFeatures: 2
        },
        {
            level: 3,
            proficency: 2,
            spells: [spells[4]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b47'),
                    name: 'Inercia',
                    description: 'Tu rango de crítico en ataques es aumentado un 5%. Además, cuando realizas un crítico, reinicias la duración de un potenciador aplicado a ti.',
                    useType: 'passive',
                    modifiers: [
                        {
                            type: 'critical',
                            value: 0.05,
                            description: 'Aumenta el rango de crítico en 5%',
                            addTo: 'criticalOnAttackModifiers',
                            target: 'self',
                            permanent: true
                        }
                    ],
                    effects: [
                        {
                            type: 'reset_bonifier',
                            target: 'self',
                            value: 'one',
                            condition: 'critical',
                            trigger: 'at_attack',
                            description: 'Reinicia la duración de un potenciador aplicado a ti.'
                        }
                    ],
                    state: 'ACTIVE'
                }
            ],
            APGained: 1,
            maxPreparedSpells: 2,
            knownSecondaryFeatures: 3
        },
        {
            level: 4,
            proficency: 2,
            spells: [spells[5]],
            features: [],
            APGained: 1,
            maxPreparedSpells: 3,
            knownSecondaryFeatures: 3,
            selectSubclass: true,
            gainSubclassFeature: true
        },
        {
            level: 5,
            proficency: 3,
            spells: [spells[6], spells[7]],
            features: [],
            APGained: 1,
            maxPreparedSpells: 3,
            knownSecondaryFeatures: 3,
            gainStatIncrease: true
        },
        {
            level: 6,
            proficency: 3,
            spells: [spells[8], spells[9]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b48'),
                    name: 'Bocanada',
                    description: 'Una vez por combate, puedes consumir 3 PI y tu acción adicional para restaurarte tres veces tu nivel en puntos de vida y el doble de tu competencia en PI.',
                    useType: 'active',
                    action: 'bonus_action',
                    resource: 'Rage Points',
                    cost: 3,
                    effects: [
                        {
                            type: 'healing',
                            target: 'self',
                            healType: 'HP',
                            heal: '{level * 3}',
                        },
                        {
                            type: 'resource',
                            target: 'self',
                            resource: 'Rage Points',
                            value: '{proficency * 2}',
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b49'),
                    name: 'Recuperación Crítica',
                    description: 'Cada vez que recibes o infliges un crítico, obtienes 1 PI.',
                    trigger: 'critical',
                    effects: [
                        {
                            type: 'recover resource',
                            target: 'self',
                            resource: 'Rage Points',
                            value: 1,
                        }
                    ],
                    state: 'ACTIVE'
                }
            ],
            APGained: 1,
            maxPreparedSpells: 3,
            knownSecondaryFeatures: 3,
            gainSecondaryAffinity: true
        },
        {
            level: 7,
            proficency: 3,
            spells: [spells[10]],
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
            maxPreparedSpells: 3,
            knownSecondaryFeatures: 4
        },
        {
            level: 8,
            proficency: 3,
            spells: [spells[11]],
            features: [],
            APGained: 1,
            maxPreparedSpells: 5,
            knownSecondaryFeatures: 4,
            gainSubclassFeature: true
        },
        {
            level: 9,
            proficency: 4,
            spells: [spells[12], spells[13]],
            features: [],
            APGained: 1,
            maxPreparedSpells: 5,
            knownSecondaryFeatures: 4,
            gainStatIncrease: true
        },
        {
            level: 10,
            proficency: 4,
            spells: [spells[14], spells[15]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4b'),
                    name: 'Ansia de Batalla',
                    description: 'Obtienes ventaja en la tirada de iniciativa.',
                    useType: 'passive',
                    modifiers: [
                        {
                            type: 'initiative',
                            target: 'self',
                            value: 'advantage',
                            addTo: 'initiativeModifiers',
                            permanent: true
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4b'),
                    name: 'Ansia de Batalla',
                    description: 'Al inicio de cada combate obtienes una cantidad de PV temporales iguales a tu nivel.',
                    useType: 'passive',
                    effects: [
                        {
                            type: 'temporary_HP',
                            target: 'self',
                            heal: 'level',
                        }
                    ],
                    trigger: 'at_combat_start',
                    state: 'ACTIVE'
                }
            ],
            APGained: 1,
            maxPreparedSpells: 5,
            knownSecondaryFeatures: 4
        },
        {
            level: 11,
            proficency: 4,
            spells: [spells[16], spells[17], spells[18]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4c'),
                    name: 'En el Fragor de la Batalla',
                    description: 'Obtienes una reacción adicional.',
                    useType: 'passive',
                    modifiers: [
                        {
                            type: 'reaction',
                            target: 'self',
                            value: 1,
                            addTo: 'reactionModifiers',
                            permanent: true
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4c'),
                    name: 'En el Fragor de la Batalla',
                    description: 'Obtienes un ataque de oportunidad cuando un enemigo entra en tu rango de ataque.',
                    useType: 'passive',
                    effects: [
                        {
                            type: 'opportunity_attack',
                            target: 'enemy',
                            description: 'Realiza un ataque de oportunidad cuando un enemigo entra en tu rango de ataque.',
                            trigger: 'enemy_enters_range'
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4c'),
                    name: 'En el Fragor de la Batalla',
                    description: 'Cada vez que impactas un ataque de oportunidad, obtienes 1 PI.',
                    trigger: 'opportunity_attack',
                    effects: [
                        {
                            type: 'recover resource',
                            target: 'self',
                            resource: 'Rage Points',
                            value: 1,
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4c'),
                    name: 'En el Fragor de la Batalla',
                    description: 'Puedes gastar 3 PI cuando consumes tu reacción para recuperarla.',
                    trigger: 'at_use_reaction',
                    effects: [
                        {
                            type: 'recover resource',
                            target: 'self',
                            resource: 'reaction',
                            value: 1,
                        }
                    ],
                    cost: 3,
                    resource: 'Rage Points',
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4c'),
                    name: 'En el Fragor de la Batalla',
                    description: 'Cuando impactas un ataque de oportunidad de forma crítica, recuperas una reacción y puedes realizar un ataque adicional como parte del ataque contra dicho objetivo.',
                    trigger: 'at_opportunity_critical_attack',
                    effects: [
                        {
                            type: 'recover resource',
                            target: 'self',
                            resource: 'reaction',
                            value: 1,
                        },
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
            maxPreparedSpells: 5,
            knownSecondaryFeatures: 5
        },
        {
            level: 12,
            proficency: 4,
            spells: [spells[19], spells[20]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4d'),
                    name: 'Inquebrantable',
                    description: 'Cada vez que fallas una tirada de salvación, ganas 1 PI.',
                    trigger: 'at_failed_save',
                    effects: [
                        {
                            type: 'recover resource',
                            target: 'self',
                            resource: 'Rage Points',
                            value: 1,
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4d'),
                    name: 'Inquebrantable',
                    description: 'cada vez que fallas un ataque, causas daño igual al bonificador de la tirada de ataque al enemigo de todos modos.',
                    trigger: 'at_failed_attack',
                    effects: [
                        {
                            type: 'damage',
                            damageType: 'physical',
                            dice: '{attack_bonifier}',
                            target: 'enemy',
                        }
                    ],
                    state: 'ACTIVE'
                }
            ],
            APGained: 1,
            maxPreparedSpells: 6,
            knownSecondaryFeatures: 5,
        },
        {
            level: 13,
            proficency: 5,
            spells: [spells[21], spells[22]],
            features: [],
            APGained: 1,
            maxPreparedSpells: 6,
            knownSecondaryFeatures: 5,
            gainSubclassFeature: true
        },
        {
            level: 14,
            proficency: 5,
            spells: [spells[23], spells[24]],
            features: [],
            APGained: 1,
            maxPreparedSpells: 6,
            knownSecondaryFeatures: 5,
            gainStatIncrease: true
        },
        {
            level: 15,
            proficency: 5,
            spells: [spells[25], spells[26]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4e'),
                    name: 'Multi Ataque II',
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
            maxPreparedSpells: 6,
            knownSecondaryFeatures: 6
        },
        {
            level: 16,
            proficency: 5,
            spells: [spells[27], spells[28]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b4f'),
                    name: 'Segundo Round',
                    description: 'Puedes esforzarte más allá de tus límites habituales durante breves instantes. Dos veces por combate puedes obtener un turno adicional al final de la ronda. Dicho turno no contará para la cantidad de turnos que dura un bonificador. Si utilizas este efecto, debes aguardar dos rondas para utilizar este rasgo nuevamente.',
                    useType: 'active',
                    action: 'bonus_action',
                    uses: 2,
                    cooldown: {
                        type: 'temporal',
                        duration: 2,
                        medition: 'rounds'
                    },
                    effects: [
                        {
                            type: 'extra_turn_at_end_of_round',
                            target: 'self',
                            description: 'Obtienes un turno adicional al final de la ronda.'
                        }
                    ],
                    state: 'ACTIVE'
                }
            ],
            APGained: 1,
            maxPreparedSpells: 8,
            knownSecondaryFeatures: 6
        },
        {
            level: 17,
            proficency: 6,
            spells: [spells[29], spells[30]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b50'),
                    name: 'Control de Ira',
                    description: 'Cuando recibes daño que reducirá tus PV a 0 y no te matará inmediatamente, puedes utilizar tu reacción para consumir todos tus PI restantes, como mínimo 1, y al finalizar el turno actual, restaurar dicha cantidad de puntos en d8. Una vez por incursión.',
                    useType: 'active',
                    action: 'reaction',
                    uses: 1,
                    effects: [
                        {
                            type: 'healing',
                            target: 'self',
                            healType: 'HP',
                            heal: '{all_resource}d8',
                            trigger: 'at_turn_end',
                            resource: 'Rage Points',
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b50'),
                    name: 'Golpe de Gracia',
                    description: '“Bocanada” obtiene un uso adicional.',
                    useType: 'passive',
                    uses: 1,
                    addUsesToParent: true,
                    parent: new ObjectId('5f7f4b3b3f1d9a001f2b3b48'),
                    state: 'ACTIVE'
                }
            ],
            APGained: 1,
            maxPreparedSpells: 8,
            knownSecondaryFeatures: 6,
        },
        {
            level: 18,
            proficency: 6,
            spells: [spells[31], spells[32]],
            features: [],
            APGained: 1,
            maxPreparedSpells: 8,
            knownSecondaryFeatures: 6,
            gainSubclassFeature: true,
        },
        {
            level: 19,
            proficency: 6,
            spells: [spells[33], spells[34]],
            features: [],
            APGained: 1,
            maxPreparedSpells: 8,
            knownSecondaryFeatures: 6,
            gainStatIncrease: true
        },
        {
            level: 20,
            proficency: 6,
            spells: [spells[35]],
            features: [
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b51'),
                    name: 'Maestro de Batalla',
                    description: 'En combate, y en cada uno de los turnos, obtienes una reacción adicional que solo puede ser consumida en dicho turno y de único uso para un ataque de oportunidad.',
                    useType: 'passive',
                    action: 'reaction',
                    effects: [
                        {
                            type: 'extra_reaction',
                            target: 'self',
                            description: 'Obtienes una reacción adicional que solo puede ser consumida en dicho turno y de único uso para un ataque de oportunidad.',
                            trigger: 'at_any_turn_start',
                            duration: {
                                type: 'temporal',
                                duration: 1,
                                medition: 'turn'
                            },
                            uses: 1,
                            condition: 'opportunity_attack'
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b51'),
                    name: 'Maestro de Batalla',
                    description: 'Tu rango de crítico en ataques aumenta un 5%.',
                    useType: 'passive',
                    modifiers: [
                        {
                            type: 'critical',
                            value: 0.05,
                            description: 'Aumenta el rango de crítico en 5%',
                            addTo: 'criticalOnAttackModifiers',
                            target: 'self',
                            permanent: true
                        }
                    ],
                    state: 'ACTIVE'
                },
                {
                    featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b51'),
                    name: 'Maestro de Batalla',
                    description: 'Obtienes +20 al daño a cualquier golpe crítico impactado.',
                    useType: 'passive',
                    modifiers: [
                        {
                            type: 'dices',
                            value: 20,
                            description: 'Obtienes +20 al daño a cualquier golpe crítico impactado.',
                            addTo: 'criticalOnDamageModifiers',
                            target: 'self',
                            permanent: true
                        }
                    ],
                    state: 'ACTIVE'
                }
            ],
            APGained: 1,
            maxPreparedSpells: 10,
            knownSecondaryFeatures: 7
        }
    ],
    resourceType: 'Rage Points',
    featureIdThatGrantsSecondaryFeatures: new ObjectId('5f7f4b3b3f1d9a001f2b3b3b'),
})


const characterClassId = characterClass.insertedId;

const subclass = await db.subclass.Many([
    {
        name: 'Berseker',
        description: 'Pum te pego más fuerte',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b52'),
                        name: 'Sobrecarga',
                        description: 'A partir de nivel 4, tus golpes realizan ataques mucho más demoledores que el resto de las personas. Obtienes dados adicionales en tus tiradas de daño según tu nivel. A nivel 4 obtienes 1d4; a nivel 8 obtienes 1d6; a nivel 13 obtienes 2d4; y a nivel 18 obtienes 2d6. Estos dados se duplican al estar en estado {ensangrentado}.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'dices',
                                value: '1d4',
                                description: 'Obtienes 1d4 en tus tiradas de daño',
                                addTo: 'damageRollModifiers',
                                target: 'self',
                                permanent: true,
                                levelCondition: 4,
                                etiquette: 'Sobrecarga'
                            },
                            {
                                type: 'dices',
                                value: '1d6',
                                description: 'Obtienes 1d6 en tus tiradas de daño',
                                addTo: 'damageRollModifiers',
                                target: 'self',
                                permanent: true,
                                levelCondition: 8,
                                etiquette: 'Sobrecarga'
                            },
                            {
                                type: 'dices',
                                value: '2d4',
                                description: 'Obtienes 2d4 en tus tiradas de daño',
                                addTo: 'damageRollModifiers',
                                target: 'self',
                                permanent: true,
                                levelCondition: 13,
                                etiquette: 'Sobrecarga'
                            },
                            {
                                type: 'dices',
                                value: '2d6',
                                description: 'Obtienes 2d6 en tus tiradas de daño',
                                addTo: 'damageRollModifiers',
                                target: 'self',
                                permanent: true,
                                levelCondition: 18,
                                etiquette: 'Sobrecarga'
                            },
                            {
                                type: 'dices',
                                value: '2d4',
                                description: 'Duplica los dados de daño al estar ensangrentado',
                                addTo: 'damageRollModifiers',
                                target: 'self',
                                condition: 'character is bleeding',
                                levelCondition: 4,
                                etiquette: 'Sobrecarga'
                            },
                            {
                                type: 'dices',
                                value: '2d6',
                                description: 'Duplica los dados de daño al estar ensangrentado',
                                addTo: 'damageRollModifiers',
                                target: 'self',
                                condition: 'character is bleeding',
                                levelCondition: 8,
                                etiquette: 'Sobrecarga'
                            },
                            {
                                type: 'dices',
                                value: '4d4',
                                description: 'Duplica los dados de daño al estar ensangrentado',
                                addTo: 'damageRollModifiers',
                                target: 'self',
                                condition: 'character is bleeding',
                                levelCondition: 13,
                                etiquette: 'Sobrecarga'
                            },
                            {
                                type: 'dices',
                                value: '4d6',
                                description: 'Duplica los dados de daño al estar ensangrentado',
                                addTo: 'damageRollModifiers',
                                target: 'self',
                                condition: 'character is bleeding',
                                levelCondition: 18,
                                etiquette: 'Sobrecarga'
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
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b53'),
                        name: 'Frenesí Imbatible',
                        description: 'A partir de nivel 8, cada vez que impactas un ataque, obtienes 5 PV temporales. Estos PV temporales se sumarán a tus PV temporales si los posees hasta un máximo igual al doble de tu nivel.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'accumulative_temp_hp',
                                target: 'self',
                                heal: 5,
                                max: '{level * 2}',
                                trigger: 'at_attack',
                            }
                        ],
                        state: 'ACTIVE'
                    },
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b54'),
                        name: 'Golpe Colosal',
                        description: 'A partir de nivel 13, todos tus golpes causan mella en la armadura del rival. Gastas 3 PI para que si uno de tus ataques impacta durante este turno, todos los ataques físicos que realicen los aliados tendrán ventaja hasta el inicio de tu siguiente turno.',
                        useType: 'active',
                        action: 'free_action',
                        cost: 3,
                        target: 'self',
                        resource: 'Rage Points',
                        duration: {
                            type: 'temporal',
                            duration: 1,
                            medition: 'turn'
                        },
                        condition: 'at_attack',
                        modifiers: [
                            {
                                type: 'attack against this target',
                                value: 'advantage',
                                description: 'Otorga ventaja a los ataques físicos de los aliados contra el objetivo.',
                                target: 'enemy',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'round'
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
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b55'),
                        name: 'Ira Incontenible',
                        description: 'A partir de nivel 18, puedes gastar 1 PI antes de realizar tu tirada de ataque para duplicar el bonificador del daño de dicho ataque.',
                        useType: 'active',
                        cost: 1,
                        target: 'self',
                        resource: 'Rage Points',
                        trigger: 'before_attack',
                        effects: [
                            {
                                type: 'double_damage_bonus',
                                target: 'self',
                                description: 'Duplica el bonificador de daño del ataque',
                                trigger: 'before_attack',
                            }
                        ],
                        state: 'ACTIVE'
                    },
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b55'),
                        name: 'Ira Incontenible',
                        description: 'Aumentas tu porcentaje de crítico en un 5% en ataques.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'critical',
                                value: 0.05,
                                description: 'Aumenta el rango de crítico en 5%',
                                addTo: 'criticalOnAttackModifiers',
                                target: 'self',
                                permanent: true
                            }
                        ],
                        state: 'ACTIVE'
                    },
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b55'),
                        name: 'Ira Incontenible',
                        description: 'Cada vez que impactas un crítico, restauras tu nivel en puntos de vida.',
                        trigger: 'at_critical_attack',
                        effects: [
                            {
                                type: 'healing',
                                target: 'self',
                                healType: 'HP',
                                heal: '{level}',
                            }
                        ],
                        state: 'ACTIVE'
                    }
                ]
            }
        ]
    },
    {
        name: 'Squire',
        description: 'Ponte detrás de Braum',
        class: characterClassId,
        levels: [
            {
                level: 4,
                features: [
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b56'),
                        name: 'Provocar',
                        description: 'A partir de nivel 4, obtienes la capacidad de atraer la atención de los enemigos contra ti de forma casi hipnótica. Seleccionas a cualquier cantidad de enemigos a seis casillas de ti. Los enemigos seleccionados deben superar una tirada de salvación de sabiduría con dificultad igual a 8 más tu bonificador de coraje y tu competencia, en caso de fallar tendrán desventaja en realizar cualquier acción ofensiva que no este dirigida contra ti. Cada enemigo tendrá la oportunidad de realizar dicha salvación nuevamente al finalizar su turno, con una duración máxima de 3 turnos. Puedes utilizar este rasgo una vez por combate. Aumenta a dos usos a partir de nivel 8, a tres usos a nivel 13, y finalmente a 4 usos a nivel 18.',
                        useType: 'active',
                        action: 'action',
                        modifiers: [
                            {
                                type: 'offensive_action',
                                value: 'disadvantage',
                                description: 'Desventaja en realizar cualquier acción ofensiva que no este dirigida contra ti',
                                target: 'enemies_at_range',
                                condition: 'is attacking other than {character}',
                                duration: {
                                    type: 'temporal',
                                    duration: 3,
                                    medition: 'turns'
                                },
                                shouldSaveEachTurn: true,
                            }
                        ],
                        uses: 1,
                        requireSalvation: true,
                        cd: '8 + {proficency} + {courage_bonifier}',
                        state: 'ACTIVE'                       
                    }
                ]
            },
            {
                level: 8,
                features: [
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b57'),
                        name: 'Uso adicional de Provocar',
                        description: 'Ganas un uso adicional de Provocar.',
                        useType: 'passive',
                        addUsesToParent: true,
                        parent: new ObjectId('5f7f4b3b3f1d9a001f2b3b56'),
                        uses: 1,
                        state: 'ACTIVE'
                    },
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b58'),
                        name: 'Intercepción',
                        description: 'A partir de nivel 8, cuando un aliado a una casilla de ti vaya a recibir un ataque, utilizando tu reacción, puedes lanzar 1d8 para aumentar en esa cantidad la defensa de tu aliado. Si el ataque impacta, se considerará al objetivo del ataque como resistente al daño de dicho ataque. Puedes utilizar este rasgo una cantidad de veces igual a tu bonificador de coraje por combate.',
                        useType: 'active',
                        action: 'reaction',
                        modifiers: [
                            {
                                type: 'defend',
                                value: '1d8',
                                description: 'Aumenta en 1d8 la defensa de tu aliado',
                                target: 'ally_at_range',
                                addTo: 'defenseModifiers',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'attack'
                                }
                            },
                            {
                                type: 'resistant',
                                description: 'Se considerará al objetivo del ataque como resistente al daño de dicho ataque',
                                target: 'ally_at_range',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'attack'
                                }
                            }
                        ],
                        uses: '{courage_bonifier}',
                    }
                ]
            },
            {
                level: 13,
                features: [
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b59'),
                        name: 'Uso adicional de Provocar',
                        description: 'Ganas un uso adicional de Provocar.',
                        useType: 'passive',
                        addUsesToParent: true,
                        parent: new ObjectId('5f7f4b3b3f1d9a001f2b3b56'),
                        uses: 1,
                        state: 'ACTIVE'
                    },
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b5a'),
                        name: 'Vigilancia',
                        description: 'A partir de nivel 13, obtienes una reacción adicional en cada una de las rondas. Cuando impactas un ataque de oportunidad contra un enemigo, su velocidad se reducirá a 0 durante el resto del turno y perderá sus reacciones hasta el final de su siguiente turno.',
                        useType: 'passive',
                        modifiers: [
                            {
                                type: 'reaction',
                                value: 1,
                                description: 'Obtienes una reacción adicional en cada una de las rondas',
                                addTo: 'reactionModifiers',
                                target: 'self',
                                permanent: true
                            }
                        ],
                        effects: [
                            {
                                type: 'reduce_speed',
                                target: 'enemy',
                                value: 0,
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'turn'
                                },
                                trigger: 'at_opportunity_attack'
                            },
                            {
                                type: 'lose_reactions',
                                target: 'enemy',
                                duration: {
                                    type: 'temporal',
                                    duration: 1,
                                    medition: 'round'
                                }
                            }
                        ],
                    }
                ]
            },
            {
                level: 18,
                features: [
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b59'),
                        name: 'Uso adicional de Provocar',
                        description: 'Ganas un uso adicional de Provocar.',
                        useType: 'passive',
                        addUsesToParent: true,
                        parent: new ObjectId('5f7f4b3b3f1d9a001f2b3b56'),
                        uses: 1,
                        state: 'ACTIVE'
                    },
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b5b'),
                        name: 'Escudo inamovible',
                        description: 'Los golpes críticos realizados contra ti son considerados ataques normales.',
                        useType: 'passive',
                        effects: [
                            {
                                type: 'critical_as_normal',
                                target: 'self',
                                preventCritical: true,
                                description: 'Los golpes críticos realizados contra ti son considerados ataques normales.',
                                trigger: 'at_critical_attack',
                            }
                        ],
                    },
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b5c'),
                        name: 'Escudo inamovible',
                        description: 'Puedes decidir tener éxito en tus tiradas de salvación que hayas fallado una cantidad de veces igual a tu competencia.',
                        useType: 'passive',
                        trigger: 'at_failed_save',
                        uses: '{proficency}',
                        effects: [
                            {
                                type: 'success_save',
                                target: 'self',
                                description: 'Puedes decidir tener éxito en tus tiradas de salvación que hayas fallado una cantidad de veces igual a tu competencia.',
                            }
                        ],
                    },
                    {
                        featureId: new ObjectId('5f7f4b3b3f1d9a001f2b3b5d'),
                        name: 'Golpe de escudo',
                        description: 'Cuando impactas un ataque, puedes utilizar tu acción adicional y 3 PI para realizar daño con tu escudo. El objetivo recibirá tu nivel en daño contundente y tendrá que superar una salvación de coraje o perderá su acción en su siguiente turno. Debes utilizar un escudo para usar este rasgo.',
                        useType: 'active',
                        action: 'bonus_action',
                        cost: 3,
                        target: 'enemy',
                        resource: 'Rage Points',
                        trigger: 'at_attack',
                        condition: 'self using object-type shield',
                        effects: [
                            {
                                type: 'damage',
                                target: 'enemy',
                                damageType: 'strike',
                                dice: '{level}',
                            },
                            {
                                target: 'enemy',
                                type: 'loose_action',
                                condition: 'failed_save',
                            }
                        ],
                        parent: new ObjectId('5f7f4b3b3f1d9a001f2b3b3b'),
                        addAsSubfeatureToParent: true
                    }
                ]
            }
        ]
    }
]);


const characterClass = await db.class.insertOne({
    name: 'Revenant',
    description: 'Pum te pego',
    HPDice: '2d4',
    salvations: ['courage', 'dexterity'],
    launchSpell: ['courage', 'dexterity'], 
    levels: [],
    resourceType: 'Inner Rage',
})

const spells = await db.spells.insertMany([
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
        ]
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
        modifiers: [{
            value: 2,
            type: 'damage',
            description: 'Aumenta en +2 a todo daño infligido',
            target: 'ally',
            duration: {
                type: 'temporal',
                duration: 3,
                medition: 'rounds'
            }
        }]
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
        modifiers: [{
            value: 2,
            type: 'attack',
            description: 'Aumenta en +2 el ataque',
            target: 'ally',
            duration: {
                type: 'temporal',
                duration: 3,
                medition: 'rounds'
            }
        }]
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
                }
            },
            {
                value: 1,
                type: 'magic resistance',
                description: 'Aumenta en +1 la resistencia mágica',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                }
            }
        ]
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
                typeHeal: 'HP',
                heal: '(half_level)d6',
                target: 'self',
            }
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
                typeHeal: 'HP',
                heal: '1d8',
                target: 'self',
                trigger: 'end_of_turn',
                levelCondition: 0,
                etiquette: 'regeneration'
            },
            {
                type: 'heal',
                typeHeal: 'HP',
                heal: '2d4',
                target: 'self',
                trigger: 'end_of_turn',
                levelCondition: 13,
                etiquette: 'regeneration'
            },
            {
                type: 'heal',
                typeHeal: 'HP',
                heal: '2d6',
                target: 'self',
                trigger: 'end_of_turn',
                levelCondition: 17,
                etiquette: 'regeneration'
            }
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        }]
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
            }
        }]
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
            }
        }]
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
                }
            },
            {
                value: 2,
                type: 'magic resistance',
                description: 'Aumenta en +2 la resistencia mágica',
                target: 'ally',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                }
            }
        ]
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
                typeHeal: 'HP',
                heal: 'half_level',
                target: 'self',
                trigger: 'at_damage',
            }
        ]
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
        ]
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
        ]
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
        ]
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
                typeHeal: 'HP',
                heal: '4d4',
                target: 'self',
                trigger: 'end_of_turn',
                levelCondition: 0,
                etiquette: 'regeneration'
            },
            {
                type: 'heal',
                typeHeal: 'HP',
                heal: '4d6',
                target: 'self',
                trigger: 'end_of_turn',
                levelCondition: 17,
                etiquette: 'regeneration'
            }
        ]
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
        ]
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
                }
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
                }
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
                }
            },
            {
                value: 2,
                type: 'magic resistance',
                description: 'Aumenta +2 a la Resistencia Mágica',
                target: 'self',
                duration: {
                    type: 'temporal',
                    duration: 3,
                    medition: 'rounds'
                }
            }
        ]
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
        ]
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
            }
        }]
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
            },
            {
                type: 'critical',
                value: 0.05,
                description: 'Aumentas en 5% su porcentaje de crítico en ataques',
                target: 'all_allies',
            },
            {
                value: -3,
                type: 'defense',
                description: 'Reduces en -3 la Defensa',
                target: 'all_enemies',
            },
            {
                value: -2,
                type: 'magic resistance',
                description: 'Reduces en -2 a la Resistencia Mágica',
                target: 'all_enemies',
            }
        ]
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
                modification: 'critical'
            },
            {
                type: 'attack',
                target: 'enemy',
                trigger: 'next_physical_attack',
                condition: 'attack is failed',
                modification: 'hit'
            }
        ]
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
        ]
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
        ]
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
        ]
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
                typeHeal: 'HP',
                heal: '6d6',
                target: 'self',
                trigger: 'end_of_turn',
                etiquette: 'regeneration'
            }
        ]
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
                }
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
                }
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
                }
            }
        ]
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
        ]
    }
])

const levels = [
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
                name: 'Rabia Interior',
                description: `Puedes otorgarle a tus habilidades de combate la ferocidad primitiva más brutal. En tu turno, puedes entrar en rabia como acción adicional una cantidad de veces igual a tu competencia.

                Cuando entras en rabia, ganas un numero de puntos de ira (PI) igual a tus Reservas de Ira. Por cada ataque que logres impactar que no hayas usado ningún rasgo violento, ganaras 1 PI. Nunca puedes tener más PI que tu nivel.
                
                Puedes gastar estos puntos para activar rasgos violentos de tu ser. Al llegar al nivel 2, aprendes dos rasgos violentos, y al nivel 3, 7, 11, 15 y 20 aprenderás un rasgo adicional en cada nivel. Cada vez que subes de nivel, puedes reemplazar un rasgo que conozcas por otro distinto de la lista.
                
                Algunos de los rasgos violentos pueden requerir una tirada de salvación. En dicho caso, la dificultad establecida será igual a la siguiente formula: 8 + tu competencia + tu bonificador de coraje.`,
                useType: 'passive',
                action: 'none'
            }
        ],
    }
]

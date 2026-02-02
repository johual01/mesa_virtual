import {Schema, model, Document, Types } from 'mongoose';
import { IPersonaClass } from './Class';
import { IPersonaSubclass } from './Subclass';
import { IModifier, elements, personaStadistics } from '../types';

export enum personaSecondaryAbilities {
    Acrobatics = 'acrobatics',
    Art = 'art',
    Athletics = 'athletics',
    Consciousness = 'consciousness',
    Empathy = 'empathy',
    Expression = 'expression',
    Folklore = 'folklore',
    Handcraft = 'handcraft',
    Investigation = 'investigation',
    Meditation = 'meditation',
    Mysticism = 'mysticism',
    Orientation = 'orientation',
    Quibble = 'quibble',
    Reflexes = 'reflexes',
    Speed = 'speed',
    Stealth = 'stealth',
    Strength = 'strength',
    Technology = 'technology',
    Streetwise = 'streetwise',
    Willpower = 'willpower',
    // una habilidad para tener calle para carisma
}

interface StatisticDetail {
    statistic: personaStadistics;
    bonus: number;
    isProficient: boolean;
}



export interface ICharacterPersonaDetail {
    class: {
        type: Types.ObjectId | IPersonaClass,
        subclass?: Types.ObjectId | IPersonaSubclass
    },
    persona: string,
    experience: number,
    level: number,
    money: number,
    proficency: number,
    stadistics: {
        charisma: number,
        courage: number,
        dexterity: number,
        instincts: number,
        knowledge: number,
    },
    secondaryAbilities: {
        acrobatics: StatisticDetail;
        art: StatisticDetail;
        athletics: StatisticDetail;
        consciousness: StatisticDetail;
        empathy: StatisticDetail;
        expression: StatisticDetail;
        folklore: StatisticDetail;
        handcraft: StatisticDetail;
        investigation: StatisticDetail;
        meditation: StatisticDetail;
        mysticism: StatisticDetail;
        orientation: StatisticDetail;
        quibble: StatisticDetail;
        reflexes: StatisticDetail;
        speed: StatisticDetail;
        stealth: StatisticDetail;
        strength: StatisticDetail;
        technology: StatisticDetail;
        streetwise: StatisticDetail;
        willpower: StatisticDetail;
    },
    combatData: {
        HP: {
            modifiers: IModifier[] // Suma coraje
        },
        defense: {
            defenseModifiers: IModifier[], // Suma destreza
            magicDefenseModifiers: IModifier[] // Suma instintos
            shieldModifiers: IModifier[] // Suma coraje
        },
        speed: {
            initiativeModifiers: IModifier[], // Suma instintos
            speedModifiers: IModifier[] 
        },
        elements: {
            affinity: elements,
            secondaryAffinity?: elements,
            resistance: elements[],
            weakness: elements[],
            immunity: elements[],
            reflection: elements[]
        },
        magic: {
            APModifiers: IModifier[], // suma conocimiento
            saveModifiers: IModifier[], // suma carisma
            launchModifiers: IModifier[] // suma conocimiento
            healingModifiers: IModifier[] // suma carisma
            damageModifiers: IModifier[]
        },
        actions: {
            actionModifiers: IModifier[], 
            bonusActionModifiers: IModifier[],
            reactionModifiers: IModifier[],
        },
        critical: {
            criticalModifiers: IModifier[],
            criticalFailModifiers: IModifier[],
            criticalOnFisicalAttackModifiers: IModifier[],
            criticalOnMagicAttackModifiers: IModifier[],
            criticalOnAttackModifiers: IModifier[]
        },
        attack: {
            attackModifiers: IModifier[],
            fisicalAttackModifiers: IModifier[],
            rangeAttackModifiers: IModifier[],
            meleeAttackModifiers: IModifier[],
        },
        damage: {
            damageModifiers: IModifier[],
            fisicalDamageModifiers: IModifier[],
            rangeDamageModifiers: IModifier[],
            meleeDamageModifiers: IModifier[],
            criticalDamageModifiers: IModifier[],
        }
        range: {
            weaponRangedRangeModifiers: IModifier[],
            weaponMeleeRangeModifiers: IModifier[],
        }
    }
}

export interface ICharacterPersonaDetailDocument extends ICharacterPersonaDetail, Document {}

const characterPersonaDetailSchema = new Schema({
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    subclass: {
        type: Schema.Types.ObjectId,
        ref: 'Subclass'
    },
    persona: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    proficency: {
        type: Number,
        required: true
    },
    stadistics: {
        charisma: {
            type: Number,
            required: true
        },
        courage: {
            type: Number,
            required: true
        },
        dexterity: {
            type: Number,
            required: true
        },
        instincts: {
            type: Number,
            required: true
        },
        knowledge: {
            type: Number,
            required: true
        }
    },
    secondaryAbilities: {
        acrobatics: {
            type: Object,
            required: true
        },
        art: {
            type: Object,
            required: true
        },
        athletics: {
            type: Object,
            required: true
        },
        consciousness: {
            type: Object,
            required: true
        },
        empathy: {
            type: Object,
            required: true
        },
        expression: {
            type: Object,
            required: true
        },
        folklore: {
            type: Object,
            required: true
        },
        handcraft: {
            type: Object,
            required: true
        },
        investigation: {
            type: Object,
            required: true
        },
        meditation: {
            type: Object,
            required: true
        },
        mysticism: {
            type: Object,
            required: true
        },
        orientation: {
            type: Object,
            required: true
        },
        quibble: {
            type: Object,
            required: true
        },
        reflexes: {
            type: Object,
            required: true
        },
        speed: {
            type: Object,
            required: true
        },
        stealth: {
            type: Object,
            required: true
        },
        strength: {
            type: Object,
            required: true
        },
        technology: {
            type: Object,
            required: true
        },
        streetwise: {
            type: Object,
            required: true
        },
        willpower: {
            type: Object,
            required: true
        }
    },
    combatData: {
        HP: {
            modifiers: {
                type: [Object],
                required: true
            }
        },
        defense: {
            defenseModifiers: {
                type: [Object],
                required: true
            },
            magicDefenseModifiers: {
                type: [Object],
                required: true
            },
            shieldModifiers: {
                type: [Object],
                required: true
            }
        },
        speed: {
            initiativeModifiers: {
                type: [Object],
                required: true
            },
            speedModifiers: {
                type: [Object],
                required: true
            }
        },
        elements: {
            affinity: {
                type: String,
                required: true
            },
            secondaryAffinity: {
                type: String
            },
            resistance: {
                type: [String],
                required: true
            },
            weakness: {
                type: [String],
                required: true
            },
            immunity: {
                type: [String],
                required: true
            },
            reflection: {
                type: [String],
                required: true
            }
        },
        magic: {
            APModifiers: {
                type: [Object],
                required: true
            },
            saveModifiers: {
                type: [Object],
                required: true
            },
            launchModifiers: {
                type: [Object],
                required: true
            }
        },
        actions: {
            actionModifiers: {
                type: [Object],
                required: true
            },
            bonusActionModifiers: {
                type: [Object],
                required: true
            },
            reactionModifiers: {
                type: [Object],
                required: true
            }
        },
        critical: {
            criticalModifiers: {
                type: [Object],
                required: true
            },
            criticalFailModifiers: {
                type: [Object],
                required: true
            },
            criticalOnFisicalAttackModifiers: {
                type: [Object],
                required: true
            },
            criticalOnMagicAttackModifiers: {
                type: [Object],
                required: true
            },
            criticalOnAttackModifiers: {
                type: [Object],
                required: true
            }
        },
        attack: {
            attackModifiers: {
                type: [Object],
                required: true
            },
            fisicalAttackModifiers: {
                type: [Object],
                required: true
            },
            rangeAttackModifiers: {
                type: [Object],
                required: true
            },
            meleeAttackModifiers: {
                type: [Object],
                required: true
            }
        },
        damage: {
            damageModifiers: {
                type: [Object],
                required: true
            },
            fisicalDamageModifiers: {
                type: [Object],
                required: true
            },
            rangeDamageModifiers: {
                type: [Object],
                required: true
            },
            meleeDamageModifiers: {
                type: [Object],
                required: true
            },
            criticalDamageModifiers: {
                type: [Object],
                required: true
            }
        },
        range: {
            weaponRangedRangeModifiers: {
                type: [Object],
                required: true
            },
            weaponMeleeRangeModifiers: {
                type: [Object],
                required: true
            }
        }
    }
}, {
    timestamps: true
})


export default model<ICharacterPersonaDetailDocument>('CharacterPersonaDetail', characterPersonaDetailSchema);
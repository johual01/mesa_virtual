import {Schema, model, Document, Types } from 'mongoose';
import { ISpell } from '../Spell';
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
    Willpower = 'willpower'
}

interface StatisticDetail {
    statistic: personaStadistics;
    bonus: number;
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
        willpower: StatisticDetail;
    },
    combatData: {
        HP: {
            modifiers: IModifier[]
        },
        defense: {
            defenseModifiers: IModifier[],
            magicDefenseModifiers: IModifier[]
        },
        speed: {
            initiativeModifiers: IModifier[],
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
            APModifiers: IModifier[],
            saveModifiers: IModifier[],
            launchModifiers: IModifier[]
        },
        spells: {
            list: (ISpell | Types.ObjectId)[],
            freeList: (ISpell | Types.ObjectId)[],
            additionalList: (ISpell | Types.ObjectId)[]
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
        insight: {
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
        reflexes: {
            type: Object,
            required: true
        },
        resistance: {
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
        style: {
            type: Object,
            required: true
        },
        technology: {
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
        spells: {
            list: {
                type: [Schema.Types.ObjectId],
                required: true
            },
            freeList: {
                type: [Schema.Types.ObjectId],
                required: true
            },
            additionalList: {
                type: [Schema.Types.ObjectId],
                required: true
            }
        }
    }
}, {
    timestamps: true
})


export default model<ICharacterPersonaDetailDocument>('CharacterPersonaDetail', characterPersonaDetailSchema);
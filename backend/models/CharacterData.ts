import {Schema, model, Document} from 'mongoose';
import { ISpell } from './Spell';
import { IClass } from './Class';
import { ISubclass } from './Subclass';
import { modifier } from './Modifier';

export enum stadistics {
    KNOWLEDGE = 'knowledge',
    INSTINCTS = 'instincts',
    DEXTERITY = 'dexterity',
    COURAGE = 'courage',
    CHARISMA = 'charisma'
}

export enum elements {
    PSY = 'psy',
    NUKE = 'nuke',
    FIRE = 'fire',
    ICE = 'ice',
    ELEC = 'elec',
    WIND = 'wind',
    CURSE = 'curse',
    BLESS = 'bless',
    ALMIGHTY = 'almighty',
    SLASH = 'slash',
    STRIKE = 'strike',
    PIERCE = 'pierce',
}

export interface ICharacterDetail extends Document {
    class: {
        type: Schema.Types.ObjectId | IClass,
        subclass: Schema.Types.ObjectId | ISubclass
    },
    persona: string,
    experience: number,
    level: number,
    money: boolean,
    inspiration: {
        reroll: boolean,
        bonus: number,
        critic: boolean,
        automaticSuccess: boolean
    },
    stadistics: {
        charisma: number,
        courage: number,
        dexterity: number,
        instincts: number,
        knowledge: number,
    },
    secondaryAbilities: {
        acrobatics: {
            statistic: stadistics,
            bonus: number
        },
        art: {
            statistic: stadistics,
            bonus: number
        },
        consciousness: {
            statistic: stadistics,
            bonus: number
        },
        empathy: {
            statistic: stadistics,
            bonus: number
        },
        expression: {
            statistic: stadistics,
            bonus: number
        },
        folklore: {
            statistic: stadistics,
            bonus: number
        },
        handcraft: {
            statistic: stadistics,
            bonus: number
        },
        insight: {
            statistic: stadistics,
            bonus: number
        },
        investigation: {
            statistic: stadistics,
            bonus: number
        },
        meditation: {
            statistic: stadistics,
            bonus: number
        },
        mysticism: {
            statistic: stadistics,
            bonus: number
        },
        orientation: {
            statistic: stadistics,
            bonus: number
        },
        reflexes: {
            statistic: stadistics,
            bonus: number
        },
        resistance: {
            statistic: stadistics,
            bonus: number
        },
        speed: {
            statistic: stadistics,
            bonus: number
        },
        stealth: {
            statistic: stadistics,
            bonus: number
        },
        strength: {
            statistic: stadistics,
            bonus: number
        },
        style: {
            statistic: stadistics,
            bonus: number
        },
        technology: {
            statistic: stadistics,
            bonus: number
        },
        willpower: {
            statistic: stadistics,
            bonus: number
        }
    },
    combatData: {
        PV: {
            base: number,
            modifiers: modifier[]
        },
        defense: {
            baseDefense: number,
            defenseModifiers: modifier[],
            baseMagicResistance: number,
            magicResistanceModifiers: modifier[]
        },
        speed: {
            baseSpeed: number,
            baseInitiative: number,
            initiativeModifiers: modifier[],
            speedModifiers: modifier[]
        },
        elements: {
            affinity: elements,
            resistance: elements[],
            weakness: elements[],
            immunity: elements[],
            reflection: elements[]
        },
        magic: {
            baseAP: number,
            APModifiers: modifier[],
            baseSave: number,
            saveModifiers: modifier[],
            baseLaunch: number,
            launchModifiers: modifier[]
        },
        spells: {
            list: ISpell[],
            freeList: ISpell[],
            additionalList: ISpell[]
        }
    }
}

const characterDetailSchema = new Schema({
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
        type: Boolean,
        required: true
    },
    inspiration: {
        reroll: {
            type: Boolean,
            required: true
        },
        bonus: {
            type: Number,
            required: true
        },
        critic: {
            type: Boolean,
            required: true
        },
        automaticSuccess: {
            type: Boolean,
            required: true
        }
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
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        art: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        consciousness: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        empathy: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        expression: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        folklore: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        handcraft: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        insight: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        investigation: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        meditation: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        mysticism: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        orientation: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        reflexes: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        resistance: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        speed: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        stealth: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        strength: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        style: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        technology: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        },
        willpower: {
            statistic: {
                type: String,
                required: true
            },
            bonus: {
                type: Number,
                required: true
            }
        }
    },
    combatData: {
        PV: {
            base: {
                type: Number,
                required: true
            },
            modifiers: {
                type: [Object],
                required: true
            }
        },
        defense: {
            baseDefense: {
                type: Number,
                required: true
            },
            defenseModifiers: {
                type: [Object],
                required: true
            },
            baseMagicResistance: {
                type: Number,
                required: true
            },
            magicResistanceModifiers: {
                type: [Object],
                required: true
            }
        },
        speed: {
            baseSpeed: {
                type: Number,
                required: true
            },
            baseInitiative: {
                type: Number,
                required: true
            },
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
            baseAP: {
                type: Number,
                required: true
            },
            APModifiers: {
                type: [Object],
                required: true
            },
            baseSave: {
                type: Number,
                required: true
            },
            saveModifiers: {
                type: [Object],
                required: true
            },
            baseLaunch: {
                type: Number,
                required: true
            },
            launchModifiers: {
                type: [Object],
                required: true
            }
        },
        spells: {
            list: {
                type: [Object],
                required: true
            },
            freeList: {
                type: [Object],
                required: true
            },
            additionalList: {
                type: [Object],
                required: true
            }
        }
    }
}, {
    timestamps: true
})


export default model<ICharacterDetail>('CharacterDetail', characterDetailSchema);
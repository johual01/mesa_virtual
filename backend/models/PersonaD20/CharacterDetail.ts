import {Schema, model, Document} from 'mongoose';
import { ISpell } from '../Spell';
import { IPersonaClass } from './Class';
import { IPersonaSubclass } from './Subclass';
import { IModifier, elements, personaStadistics } from '../types';

export interface ICharacterPersonaDetail extends Document {
    class: {
        type: Schema.Types.ObjectId | IPersonaClass,
        subclass: Schema.Types.ObjectId | IPersonaSubclass
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
            statistic: personaStadistics,
            bonus: number
        },
        art: {
            statistic: personaStadistics,
            bonus: number
        },
        consciousness: {
            statistic: personaStadistics,
            bonus: number
        },
        empathy: {
            statistic: personaStadistics,
            bonus: number
        },
        expression: {
            statistic: personaStadistics,
            bonus: number
        },
        folklore: {
            statistic: personaStadistics,
            bonus: number
        },
        handcraft: {
            statistic: personaStadistics,
            bonus: number
        },
        insight: {
            statistic: personaStadistics,
            bonus: number
        },
        investigation: {
            statistic: personaStadistics,
            bonus: number
        },
        meditation: {
            statistic: personaStadistics,
            bonus: number
        },
        mysticism: {
            statistic: personaStadistics,
            bonus: number
        },
        orientation: {
            statistic: personaStadistics,
            bonus: number
        },
        reflexes: {
            statistic: personaStadistics,
            bonus: number
        },
        resistance: {
            statistic: personaStadistics,
            bonus: number
        },
        speed: {
            statistic: personaStadistics,
            bonus: number
        },
        stealth: {
            statistic: personaStadistics,
            bonus: number
        },
        strength: {
            statistic: personaStadistics,
            bonus: number
        },
        style: {
            statistic: personaStadistics,
            bonus: number
        },
        technology: {
            statistic: personaStadistics,
            bonus: number
        },
        willpower: {
            statistic: personaStadistics,
            bonus: number
        }
    },
    combatData: {
        HP: {
            base: number,
            modifiers: IModifier[]
        },
        defense: {
            baseDefense: number,
            defenseModifiers: IModifier[],
            baseMagicResistance: number,
            magicResistanceModifiers: IModifier[]
        },
        speed: {
            baseSpeed: number,
            baseInitiative: number,
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
            baseAP: number,
            APModifiers: IModifier[],
            baseSave: number,
            saveModifiers: IModifier[],
            baseLaunch: number,
            launchModifiers: IModifier[]
        },
        spells: {
            list: ISpell[],
            freeList: ISpell[],
            additionalList: ISpell[]
        }
    }
}

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
        HP: {
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


export default model<ICharacterPersonaDetail>('CharacterPersonaDetail', characterPersonaDetailSchema);
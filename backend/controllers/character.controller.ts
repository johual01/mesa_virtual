import {Request, Response} from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import Character, { ICharacter, state as characterState } from '../models/Character';
import CharacterDetail, { ICharacterPersonaDetail, personaSecondaryAbilities } from '../models/PersonaD20/CharacterDetail';
import CharacterStatus, { ICharacterStatus } from '../models/PersonaD20/CharacterStatus';
import Campaign, { ICampaign, campaignState } from '../models/Campaign';
import Class, { IPersonaClass } from '../models/PersonaD20/Class';
import Subclass, { IPersonaSubclass } from '../models/PersonaD20/Subclass';
import Spell, { ISpell } from '../models/PersonaD20/Spell';
import { elements, system as systems, personaStadistics, IFeature } from '../models/types';
import { enumToArray, saveImage, arraysEqual, reduceModifiers } from '../functions';
import { calculateBonification, rollMaxDiceString } from '../../diceLogic';
import CustomFeature from '../models/PersonaD20/CustomFeature';
import CharacterEquipment from '../models/PersonaD20/CharacterEquipment';

// getCreateCharacterInfo
export const getCreateCharacterInfo = async (req: Request, res: Response) => {
    const userId = new Types.ObjectId(req.body.userId);
    const arrayElements = enumToArray(elements);
    const arrayStates = enumToArray(characterState);
    const arraySecondaryAbilities = enumToArray(personaSecondaryAbilities);
    const classes = await Class.find();
    const campaigns = await Campaign.find({ 
        state: campaignState.ACTIVE,
        $or: [ 
            { owner: userId }, 
            { players: { $in: userId } } 
        ]
    }, { name: 1 });
    res.send({ 
        elements: arrayElements, 
        states: arrayStates,
        secondaryAbilities: arraySecondaryAbilities,
        campaigns,
        classes, 
    });
}

// createCharacter
export const createCharacter = async (req: Request, res: Response) => {
    const {
        userId,
        name,
        system,
        state,
        backstory,
        pictureRoute,
        characterClass,
        persona,
        money,
        stadistics,
        proficency,
        element,
        weakness,
    } = req.body;
    const validateFields = !name || !system || !state || !characterClass || !persona || !money || !element || !backstory || !stadistics || !proficency || !weakness;
    if (validateFields) return res.status(400).send({ message: 'Faltan campos obligatorios' });
    if (!Object.values(systems).includes(system)) return res.status(406).json({ message: 'No se encontró el sistema' });
    if (!Object.values(elements).includes(element)) return res.status(406).json({ message: 'No se encontró el elemento' });
    if (!Object.values(elements).includes(weakness)) return res.status(406).json({ message: 'No se encontró la debilidad' });
    if (!Object.values(characterState).includes(state)) return res.status(406).json({ message: 'No se encontró el estado' });
    if (!arraysEqual(Object.keys(stadistics), Object.keys(personaStadistics))) return res.status(406).json({ message: 'Faltan estadísticas' });
    if (typeof(money) != 'number') return res.status(406).json({ message: 'El dinero debe ser un número' });
    const dontIncludeProficency = proficency.some((p: any) => !Object.values(personaSecondaryAbilities).includes(p));
    if (proficency.length == 0 || dontIncludeProficency) return res.status(406).json({ message: 'Faltan habilidades de proficiencia' });
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(406).json({errMsg: 'No User found'});
    const userIdObj = new Types.ObjectId(userId);
    const characterClassObjectId = new Types.ObjectId(characterClass);
    const characterClassObj = await Class.findById(characterClassObjectId);
    if (!characterClassObj) return res.status(406).json({ message: 'No se encontró la clase' });
    const baseHPDices = characterClassObj.HPDice + '+' + calculateBonification(stadistics.courage);
    const { total: baseHP } = rollMaxDiceString(baseHPDices);
    const character: any = {
        name,
        player: userIdObj,
        system,
        backstory,
        state,
    }
    const characterDetail: ICharacterPersonaDetail = {
        class: {
            type: characterClassObjectId,
        },
        persona,
        experience: 0,
        level: 1,
        money,
        proficency: characterClassObj.levels[0].proficency,
        stadistics,
        secondaryAbilities: {
            acrobatics: {
                statistic: personaStadistics.DEXTERITY,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Acrobatics)
            },
            art: {
                statistic: personaStadistics.CHARISMA,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Art)
            },
            athletics: {
                statistic: personaStadistics.COURAGE,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Athletics)
            },
            consciousness: {
                statistic: personaStadistics.INSTINCTS,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Consciousness)
            },
            empathy: {
                statistic: personaStadistics.CHARISMA,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Empathy)
            },
            expression: {
                statistic: personaStadistics.CHARISMA,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Expression)
            },
            folklore: {
                statistic: personaStadistics.KNOWLEDGE,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Folklore)
            },
            handcraft: {
                statistic: personaStadistics.DEXTERITY,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Handcraft)
            },
            investigation: {
                statistic: personaStadistics.KNOWLEDGE,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Investigation)
            },
            meditation: {
                statistic: personaStadistics.COURAGE,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Meditation)
            },
            mysticism: {
                statistic: personaStadistics.KNOWLEDGE,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Mysticism)
            },
            orientation: {
                statistic: personaStadistics.INSTINCTS,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Orientation)
            },
            quibble: {
                statistic: personaStadistics.INSTINCTS,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Quibble)
            },
            reflexes: {
                statistic: personaStadistics.INSTINCTS,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Reflexes)
            },
            speed: {
                statistic: personaStadistics.DEXTERITY,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Speed)
            },
            stealth: {
                statistic: personaStadistics.DEXTERITY,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Stealth)
            },
            strength: {
                statistic: personaStadistics.COURAGE,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Strength)
            },
            technology: {
                statistic: personaStadistics.KNOWLEDGE,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Technology)
            },
            willpower: {
                statistic: personaStadistics.COURAGE,
                bonus: 0,
                isProficient: proficency.includes(personaSecondaryAbilities.Willpower)
            }
        },
        combatData: {
            HP: {
                modifiers: [
                    { value: baseHP, type: 'base', description: 'Vida base' }
                ]
            },
            defense: {
                defenseModifiers: [],
                magicDefenseModifiers: [],
            },
            speed: {
                initiativeModifiers: [],
                speedModifiers: [],
            },
            elements: {
                affinity: element,
                resistance: [ element ],
                weakness: [ weakness ],
                immunity: [],
                reflection: []
            },
            magic: {
                APModifiers: [],
                saveModifiers: [],
                launchModifiers: [],
                healingModifiers: [],
            }
        }
    }
    const characterDetailDoc = new CharacterDetail(characterDetail);
    await characterDetailDoc.save();
    if (pictureRoute != "" && pictureRoute.indexOf('http') == -1) {
        const result = await saveImage(pictureRoute, user._id as Types.ObjectId, 'PROFILES');
        if (typeof(result) == 'string') {
            character.pictureRoute = result;
        } else {
            return res.status(406).json({errMsg: 'No se pudo guardar la imagen'});
        }
    }
    character.characterData = characterDetailDoc._id;
    const newCharacter = new Character(character);
    await newCharacter.save();
    res.send({ success: true, ...newCharacter.toJSON(), characterDetail });
}

// getCharacters
export const getCharacters = async (req: Request, res: Response) => {
    const origin = req.body.origin;
    if (!origin) return res.status(400).send({ message: 'Falta el origen' });
    switch (origin) {
        case 'user':
            const userId = new Types.ObjectId(req.body.userId);
            const query: any = {
                player: userId
            }
            const state = req.body.state;
            if (state) {
                if (!Object.values(characterState).includes(state)) return res.status(406).json({ message: 'No se encontró el estado' });
                query.state = req.body.state;
            }
            const characters = await Character.find(query, { name: 1, system: 1, state: 1, pictureRoute: 1 }).populate({ path: 'characterData', select: { class: 1, level: 1 } });
            res.send(characters);
            break;
        case 'campaign':
            const campaignId = new Types.ObjectId(req.body.campaignId);
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) return res.status(406).json({ message: 'No se encontró la campaña' });
            const charactersCampaign = await Character.find({ _id: { $in: campaign.characters } }, { name: 1, system: 1, state: 1, pictureRoute: 1 }).populate({ path: 'characterData', select: { class: 1, level: 1 } });
            res.send(charactersCampaign);
        default:
            return res.status(400).send({ message: 'Origen no válido' });
    }
}

// getCharacter
export const getCharacter = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId).populate({ path: 'characterData', populate: ['class.type', 'class.subclass'] });
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    const characterData = character.characterData as ICharacterPersonaDetail;
    const characterClass = characterData?.class?.type as IPersonaClass;
    const subclass = characterData?.class?.subclass as IPersonaSubclass;
    const customFeatures = await CustomFeature.find({ character: characterId });
    const characterInventory = await CharacterEquipment.find({ character: characterId });
    const characterStatus = await CharacterStatus.findOne({ characterId });
    // TODO: Recuperar items equipados y verificar sus modificadores. Tal vez deberías llevar los elementos estaticos del totalizador a un modificador
    res.send({
        name: character.name,
        state: character.state,
        system: character.system,
        pictureRoute: character.pictureRoute,
        class: characterClass.name,
        subclass: subclass?.name,
        level: characterData.level,
        persona: characterData.persona,
        experience: characterData.experience,
        money: characterData.money,
        proficency: characterData.proficency,
        stats: {
            courage: {
                value: characterData.stadistics.courage,
                bonus: calculateBonification(characterData.stadistics.courage),
                isProficient: characterClass.salvations.includes(personaStadistics.COURAGE)
            },
            dexterity: {
                value: characterData.stadistics.dexterity,
                bonus: calculateBonification(characterData.stadistics.dexterity),
                isProficient: characterClass.salvations.includes(personaStadistics.DEXTERITY)
            },
            instincts: {
                value: characterData.stadistics.instincts,
                bonus: calculateBonification(characterData.stadistics.instincts),
                isProficient: characterClass.salvations.includes(personaStadistics.INSTINCTS)
            },
            knowledge: {
                value: characterData.stadistics.knowledge,
                bonus: calculateBonification(characterData.stadistics.knowledge),
                isProficient: characterClass.salvations.includes(personaStadistics.KNOWLEDGE)
            },
            charisma: {
                value: characterData.stadistics.charisma,
                bonus: calculateBonification(characterData.stadistics.charisma),
                isProficient: characterClass.salvations.includes(personaStadistics.CHARISMA)
            }
        },
        HP: {
            total: reduceModifiers(characterData.combatData.HP.modifiers, {}),
            modifiers: characterData.combatData.HP.modifiers
        },
        defense: {
            total: 10 + calculateBonification(characterData.stadistics.dexterity) + reduceModifiers(characterData.combatData.defense.defenseModifiers, {}),
            modifiers: characterData.combatData.defense.defenseModifiers
        },
        magicDefense: {
            total:10 + calculateBonification(characterData.stadistics.instincts) + reduceModifiers(characterData.combatData.defense.defenseModifiers, {}),
            modifiers: characterData.combatData.defense.magicDefenseModifiers
        },
        speed: {
            total: 6 + reduceModifiers(characterData.combatData.speed.speedModifiers, {}),
            modifiers: characterData.combatData.speed.speedModifiers
        },
        initiative: {
            total: calculateBonification(characterData.stadistics.instincts) + reduceModifiers(characterData.combatData.speed.initiativeModifiers, {}),
            modifiers: characterData.combatData.speed.initiativeModifiers
        },
        elements: characterData.combatData.elements,
        AP: {
            total: 5 +  calculateBonification(characterData.stadistics.knowledge) + reduceModifiers(characterData.combatData.magic.APModifiers, {}),
            modifiers: characterData.combatData.magic.APModifiers
        },
        magicSave: {
            total: 10 + calculateBonification(characterData.stadistics.charisma) + reduceModifiers(characterData.combatData.magic.saveModifiers, {}),
            modifiers: characterData.combatData.magic.saveModifiers
        },
        magicLaunch: {
            total: calculateBonification(characterData.stadistics.knowledge) + reduceModifiers(characterData.combatData.magic.launchModifiers, {}),
            modifiers: characterData.combatData.magic.launchModifiers
        },
        magicHealing: {
            total: calculateBonification(characterData.stadistics.charisma) + reduceModifiers(characterData.combatData.magic.healingModifiers, {}),
            modifiers: characterData.combatData.magic.healingModifiers
        },
        secondaryAbilities: characterData.secondaryAbilities,
        background: character.backstory,
        features: {
            classFeatures: characterClass.levels.filter((e) => e.level < characterData.level).reduce((features, level) => {
                features.push(...level.features);
                return features;
            }, [] as IFeature[]),
            subclassFeatures: subclass?.levels?.filter((e) => e.level < characterData.level).reduce((features, level) => {
                features.push(...level.features);
                return features;
            }, [] as IFeature[]) || [],
            customFeatures: customFeatures || []
        },
        characterInventory: characterInventory || [],
        inspiration: characterStatus?.inspiration || {
            reroll: false,
            bonus: 0,
            critic: false,
            automaticSuccess: false
        },
        spells: characterStatus?.spells || {
            list: [],
            freeList: [],
            additionalList: [],
            preparedList: []
        }
    });
}

// editCharacter
export const editCharacter = async (req: Request, res: Response) => {

}

// deleteCharacter
export const deleteCharacter = async (req: Request, res: Response) => {

}

// addCustomModifier
export const addCustomModifier = async (req: Request, res: Response) => {

}

// removeCustomModifier
export const removeCustomModifier = async (req: Request, res: Response) => {

}

// levelUp
export const levelUp = async (req: Request, res: Response) => {

}

// updateXP
export const updateXP = async (req: Request, res: Response) => {

}

// getCharacterPDF
export const getCharacterPDF = async (req: Request, res: Response) => {

}
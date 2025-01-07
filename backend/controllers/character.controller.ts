import {Request, Response} from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import Character, { ICharacter, state as characterState } from '../models/Character';
import CharacterDetail, { ICharacterPersonaDetail, personaSecondaryAbilities } from '../models/PersonaD20/CharacterDetail';
import CharacterStatus, { ICharacterStatus } from '../models/PersonaD20/CharacterStatus';
import Campaign, { ICampaign, campaignState } from '../models/Campaign';
import Class, { IPersonaClass } from '../models/PersonaD20/Class';
import { elements, system as systems, personaStadistics } from '../models/types';
import { enumToArray, saveImage, arraysEqual } from '../functions';
import { calculateBonification, rollMaxDiceString } from '../../diceLogic';

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
                launchModifiers: []
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

}

// getCharacter
export const getCharacter = async (req: Request, res: Response) => {

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
import {Request, Response} from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import Character, { ICharacter, state as characterState } from '../models/Character';
import CharacterDetail, { ICharacterPersonaDetail, personaSecondaryAbilities, ICharacterPersonaDetailDocument } from '../models/PersonaD20/CharacterDetail';
import CharacterStatus, { ICharacterStatus } from '../models/PersonaD20/CharacterStatus';
import Campaign, { ICampaign, campaignState } from '../models/Campaign';
import Class, { IPersonaClass } from '../models/PersonaD20/Class';
import Subclass, { IPersonaSubclass } from '../models/PersonaD20/Subclass';
import { elements, system as systems, personaStadistics, IFeature, IModifier } from '../models/types';
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
    const baseHPDices = characterClassObj.HPDice;
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
    res.send({ success: true, _id: newCharacter._id });
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
    const characterActualLevels = characterClass.levels.filter((e) => e.level < characterData.level);
    const baseModifiers: { [name: string]: IModifier[] } = {}
    baseModifiers.HPModifiers = [
        { 
            value: calculateBonification(characterData.stadistics.courage) * characterData.level, 
            type: 'stadistic', 
            stadistic: personaStadistics.COURAGE, 
            description: 'Bonificación de coraje' 
        }
    ]
    baseModifiers.defenseModifiers = [
        { value: 10, type: 'base', description: 'Defensa base' },
        { 
            value: calculateBonification(characterData.stadistics.dexterity), 
            type: 'stadistic', 
            stadistic: personaStadistics.DEXTERITY, 
            description: 'Bonificación de destreza'
        }
    ]
    baseModifiers.magicDefenseModifiers = [
        { value: 10, type: 'base', description: 'Defensa mágica base' },
        { 
            value: calculateBonification(characterData.stadistics.instincts), 
            type: 'stadistic', 
            stadistic: personaStadistics.INSTINCTS, 
            description: 'Bonificación de instintos' 
        }
    ]
    baseModifiers.speedModifiers = [
        { value: 6, type: 'base', description: 'Velocidad base' }
    ]
    baseModifiers.initiativeModifiers = [
        { 
            value: calculateBonification(characterData.stadistics.instincts), 
            type: 'stadistic', 
            stadistic: personaStadistics.INSTINCTS,
            description: 'Bonificación de instintos' 
        }
    ]
    baseModifiers.APModifiers = [
        { value: 5, type: 'base', description: 'Puntos de acción base' },
        { value: Math.floor(characterData.level / 4), type: 'level', description: 'Bonificación de nivel general' },
        { value: characterActualLevels.reduce((total, level) => total + level.APGained, 0), type: 'level', description: 'Bonificación de nivel de clase' },
        { 
            value: calculateBonification(characterData.stadistics.knowledge), 
            type: 'stadistic', 
            stadistic: personaStadistics.KNOWLEDGE,
            description: 'Bonificación de conocimiento' 
        }
    ]
    baseModifiers.magicSaveModifiers = [
        { value: 10, type: 'base', description: 'Salvación mágica base' },
        { 
            value: calculateBonification(characterData.stadistics.charisma), 
            type: 'stadistic', 
            stadistic: personaStadistics.CHARISMA,
            description: 'Bonificación de carisma' 
        }
    ]
    baseModifiers.magicLaunchModifiers = [
        { 
            value: calculateBonification(characterData.stadistics.knowledge), 
            type: 'stadistic', 
            stadistic: personaStadistics.KNOWLEDGE,
            description: 'Bonificación de conocimiento'
        }
    ]
    baseModifiers.magicHealingModifiers = [
        { 
            value: calculateBonification(characterData.stadistics.charisma), 
            type: 'stadistic',
            stadistic: personaStadistics.CHARISMA,
            description: 'Bonificación de carisma' 
        }
    ]
    characterInventory.forEach((e) => {
        if (e.equipped && e.modifiers) {
            e.modifiers.forEach((m) => {
                if (m.addTo && baseModifiers.hasOwnProperty(m.addTo)) {
                    baseModifiers[m.addTo].push(m);
                }
            });
        }
    })
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
            total: reduceModifiers([...baseModifiers.HPModifiers, ...characterData.combatData.HP.modifiers], {}),
            modifiers: [...baseModifiers.HPModifiers, ...characterData.combatData.HP.modifiers]
        },
        defense: {
            total: reduceModifiers([...baseModifiers.defenseModifiers, ...characterData.combatData.defense.defenseModifiers], {}),
            modifiers: [...baseModifiers.defenseModifiers, ...characterData.combatData.defense.defenseModifiers]
        },
        magicDefense: {
            total:reduceModifiers([...baseModifiers.magicDefenseModifiers, ...characterData.combatData.defense.magicDefenseModifiers], {}),
            modifiers: [...baseModifiers.magicDefenseModifiers, ...characterData.combatData.defense.magicDefenseModifiers]
        },
        speed: {
            total: reduceModifiers([...baseModifiers.speedModifiers, ...characterData.combatData.speed.speedModifiers], {}),
            modifiers: [...baseModifiers.speedModifiers, ...characterData.combatData.speed.speedModifiers]
        },
        initiative: {
            total: reduceModifiers([...baseModifiers.initiativeModifiers, ...characterData.combatData.speed.initiativeModifiers], {}),
            modifiers: [...baseModifiers.initiativeModifiers, ...characterData.combatData.speed.initiativeModifiers]
        },
        elements: characterData.combatData.elements,
        AP: {
            total: reduceModifiers([...baseModifiers.APModifiers, ...characterData.combatData.magic.APModifiers], {}),
            modifiers: [...baseModifiers.APModifiers, ...characterData.combatData.magic.APModifiers]
        },
        magicSave: {
            total: reduceModifiers([...baseModifiers.magicSaveModifiers, ...characterData.combatData.magic.saveModifiers], {}),
            modifiers: [...baseModifiers.magicSaveModifiers, ...characterData.combatData.magic.saveModifiers]
        },
        magicLaunch: {
            total: reduceModifiers([...baseModifiers.magicLaunchModifiers, ...characterData.combatData.magic.launchModifiers], {}),
            modifiers: [...baseModifiers.magicLaunchModifiers, ...characterData.combatData.magic.launchModifiers]
        },
        magicHealing: {
            total: reduceModifiers([...baseModifiers.magicHealingModifiers, ...characterData.combatData.magic.healingModifiers], {}),
            modifiers: [...baseModifiers.magicHealingModifiers, ...characterData.combatData.magic.healingModifiers]
        },
        secondaryAbilities: characterData.secondaryAbilities,
        background: character.backstory,
        features: {
            classFeatures: characterActualLevels.reduce((features, level) => {
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
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const {
        name,
        state,
        backstory,
        pictureRoute,        
        persona,
        money,
        stadistics,
        proficency,
        element,
        weakness,
    } = req.body;
    const validateFields = !name || !state || !persona || !money || !element || !backstory || !stadistics || !proficency || !weakness;
    if (validateFields) return res.status(400).send({ message: 'Faltan campos obligatorios' });
    if (!Object.values(elements).includes(element)) return res.status(406).json({ message: 'No se encontró el elemento' });
    if (!Object.values(elements).includes(weakness)) return res.status(406).json({ message: 'No se encontró la debilidad' });
    if (!Object.values(characterState).includes(state)) return res.status(406).json({ message: 'No se encontró el estado' });
    if (!arraysEqual(Object.keys(stadistics), Object.keys(personaStadistics))) return res.status(406).json({ message: 'Faltan estadísticas' });
    if (typeof(money) != 'number') return res.status(406).json({ message: 'El dinero debe ser un número' });
    const dontIncludeProficency = proficency.some((p: any) => !Object.values(personaSecondaryAbilities).includes(p));
    if (proficency.length == 0 || dontIncludeProficency) return res.status(406).json({ message: 'Faltan habilidades de proficiencia' });
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(406).json({errMsg: 'No User found'});
    const userIdObj = new Types.ObjectId(req.body.userId);
    const characterDetail = await CharacterDetail.findOne( { _id: character.characterData });
    if (!characterDetail) return res.status(406).json({ message: 'No se encontró el detalle del personaje' });
    character.name = name;
    character.backstory = backstory;
    character.state = state;
    if (pictureRoute != "" && pictureRoute.indexOf('http') == -1) {
        const result = await saveImage(pictureRoute, userIdObj, 'PROFILES');
        if (typeof(result) == 'string') {
            character.pictureRoute = result;
        } else {
            return res.status(406).json({errMsg: 'No se pudo guardar la imagen'});
        }
    }
    characterDetail.persona = persona;
    characterDetail.money = money;
    characterDetail.stadistics = stadistics;
    characterDetail.secondaryAbilities.acrobatics.isProficient = proficency.includes(personaSecondaryAbilities.Acrobatics);
    characterDetail.secondaryAbilities.art.isProficient = proficency.includes(personaSecondaryAbilities.Art);
    characterDetail.secondaryAbilities.athletics.isProficient = proficency.includes(personaSecondaryAbilities.Athletics);
    characterDetail.secondaryAbilities.consciousness.isProficient = proficency.includes(personaSecondaryAbilities.Consciousness);
    characterDetail.secondaryAbilities.empathy.isProficient = proficency.includes(personaSecondaryAbilities.Empathy);
    characterDetail.secondaryAbilities.expression.isProficient = proficency.includes(personaSecondaryAbilities.Expression);
    characterDetail.secondaryAbilities.folklore.isProficient = proficency.includes(personaSecondaryAbilities.Folklore);
    characterDetail.secondaryAbilities.handcraft.isProficient = proficency.includes(personaSecondaryAbilities.Handcraft);
    characterDetail.secondaryAbilities.investigation.isProficient = proficency.includes(personaSecondaryAbilities.Investigation);
    characterDetail.secondaryAbilities.meditation.isProficient = proficency.includes(personaSecondaryAbilities.Meditation);
    characterDetail.secondaryAbilities.mysticism.isProficient = proficency.includes(personaSecondaryAbilities.Mysticism);
    characterDetail.secondaryAbilities.orientation.isProficient = proficency.includes(personaSecondaryAbilities.Orientation);
    characterDetail.secondaryAbilities.quibble.isProficient = proficency.includes(personaSecondaryAbilities.Quibble);
    characterDetail.secondaryAbilities.reflexes.isProficient = proficency.includes(personaSecondaryAbilities.Reflexes);
    characterDetail.secondaryAbilities.speed.isProficient = proficency.includes(personaSecondaryAbilities.Speed);
    characterDetail.secondaryAbilities.stealth.isProficient = proficency.includes(personaSecondaryAbilities.Stealth);
    characterDetail.secondaryAbilities.strength.isProficient = proficency.includes(personaSecondaryAbilities.Strength);
    characterDetail.secondaryAbilities.technology.isProficient = proficency.includes(personaSecondaryAbilities.Technology);
    characterDetail.secondaryAbilities.willpower.isProficient = proficency.includes(personaSecondaryAbilities.Willpower);
    characterDetail.markModified('secondaryAbilities');
    characterDetail.combatData.elements.affinity = element;
    characterDetail.combatData.elements.weakness = [ weakness ];
    characterDetail.markModified('combatData.elements');
    await character.save();
}

// deleteCharacter
export const deleteCharacter = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para eliminar este personaje' });
    character.state = characterState.DELETED;
    await character.save();
    res.send({ success: true });
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

// updateMoney
export const updateMoney = async (req: Request, res: Response) => {

}

// getCharacterPDF
export const getCharacterPDF = async (req: Request, res: Response) => {

}
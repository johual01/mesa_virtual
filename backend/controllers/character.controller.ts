import {Request, Response} from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import Character, { state as characterState } from '../models/Character';
import CharacterDetail, { ICharacterPersonaDetail, personaSecondaryAbilities } from '../models/PersonaD20/CharacterDetail';
import CharacterStatus from '../models/PersonaD20/CharacterStatus';
import Campaign, { campaignState } from '../models/Campaign';
import Class, { IPersonaClass } from '../models/PersonaD20/Class';
import Subclass, { IPersonaSubclass } from '../models/PersonaD20/Subclass';
import { elements, system as systems, personaStadistics, IFeature, IModifier, useTypes } from '../models/types';
import { enumToArray, saveImage, arraysEqual, reduceModifiers } from '../functions';
import { calculateBonification, rollMaxDiceString } from '../../diceLogic';
import CustomFeature from '../models/PersonaD20/CustomFeature';
import CharacterEquipment from '../models/PersonaD20/CharacterEquipment';
import Spell from '../models/Spell';

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
                statistic: personaStadistics.CHARISMA,
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
            streetwise: {
                statistic: personaStadistics.INSTINCTS,
                bonus: 0,
                isProficient: false
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
                    { value: baseHP, type: 'base', description: 'Vida base', state: 'ACTIVE' },
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
                damageModifiers: [],
            },
            actions: {
                actionModifiers: [],
                bonusActionModifiers: [],
                reactionModifiers: []
            },
            critical: {
                criticalModifiers: [],
                criticalFailModifiers: [],
                criticalOnFisicalAttackModifiers: [],
                criticalOnMagicAttackModifiers: [],
                criticalOnAttackModifiers: []
            },
            attack: {
                attackModifiers: [],
                fisicalAttackModifiers: [],
                rangeAttackModifiers: [],
                meleeAttackModifiers: []
            },
            damage: {
                damageModifiers: [],
                fisicalDamageModifiers: [],
                rangeDamageModifiers: [],
                meleeDamageModifiers: []
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
    const characterStatus = new CharacterStatus({
        characterId: newCharacter._id,
        inspiration: {
            reroll: false,
            bonus: 0,
            critic: false,
            automaticSuccess: false
        },
        spells: {
            list: [
                ...characterClassObj.levels[0].spells
            ],
            freeList: [],
            additionalList: [],
            preparedList: [],
            maxPrepared: characterClassObj.levels[0].maxPreparedSpells
        },
    })
    await characterStatus.save();
    res.send({ success: true, _id: newCharacter._id });
}

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

export const getCharacter = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId).populate({ path: 'characterData', populate: ['class.type', 'class.subclass'] });
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    const characterData = character.characterData as ICharacterPersonaDetail;
    const characterClass = characterData?.class?.type as IPersonaClass;
    const subclass = characterData?.class?.subclass as IPersonaSubclass;
    const customFeatures = await CustomFeature.find({ character: characterId, state: { $ne: 'DELETED' } });
    const characterInventory = await CharacterEquipment.find({ character: characterId });
    const characterStatus = await CharacterStatus.findOne({ characterId }).populate(['spells.list', 'spells.freeList', 'spells.additionalList', 'spells.preparedList']);
    if (!characterData) return res.status(406).json({ message: 'No se encontró la información del personaje' });
    if (!characterStatus) return res.status(406).json({ message: 'No se encontró el estado del personaje' });
    const customSpells = await Spell.find({ character: characterId, state: 'ACTIVE' });
    if (customSpells && customSpells.length > 0) {
        const list = customSpells.filter((e) => e.toList == 'list');
        const freeList = customSpells.filter((e) => e.toList == 'free');
        const additionalList = customSpells.filter((e) => e.toList == 'additional');
        characterStatus.spells.list.push(...list);
        characterStatus.spells.freeList.push(...freeList);
        characterStatus.spells.additionalList.push(...additionalList);
    }
    const characterActualLevels = characterClass.levels.filter((e) => e.level < characterData.level);
    const characterActualLevel = characterClass.levels.find((e) => e.level == characterData.level);
    const stadisticBonifiers = {
        courage: calculateBonification(characterData.stadistics.courage),
        dexterity: calculateBonification(characterData.stadistics.dexterity),
        instincts: calculateBonification(characterData.stadistics.instincts),
        knowledge: calculateBonification(characterData.stadistics.knowledge),
        charisma: calculateBonification(characterData.stadistics.charisma),
    }
    characterData.combatData.HP.modifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.defense.defenseModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.defense.magicDefenseModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.speed.initiativeModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.speed.speedModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.magic.APModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.magic.saveModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.magic.launchModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.magic.healingModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.magic.damageModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.actions.actionModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.actions.bonusActionModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.actions.reactionModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.critical.criticalModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.critical.criticalFailModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.critical.criticalOnFisicalAttackModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.critical.criticalOnMagicAttackModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.critical.criticalOnAttackModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })    
    characterData.combatData.attack.attackModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.attack.fisicalAttackModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.attack.rangeAttackModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.attack.meleeAttackModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.damage.damageModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.damage.fisicalDamageModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.damage.rangeDamageModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })
    characterData.combatData.damage.meleeDamageModifiers.forEach((m) => {
        if (m.featureId && characterStatus?.inactiveFeatures?.includes(m.featureId)) {
            m.state = 'INACTIVE';
        }
    })

    const baseModifiers: { [name: string]: IModifier[] } = {}
    baseModifiers.HPModifiers = [
        { 
            value: stadisticBonifiers.courage * characterData.level, 
            type: 'stadistic', 
            stadistic: personaStadistics.COURAGE, 
            description: 'Bonificación de coraje',
            state: 'ACTIVE'
        }
    ]
    baseModifiers.defenseModifiers = [
        { value: 10, type: 'base', description: 'Defensa base', state: 'ACTIVE' },
        { 
            value: stadisticBonifiers.dexterity, 
            type: 'stadistic', 
            stadistic: personaStadistics.DEXTERITY, 
            description: 'Bonificación de destreza',
            state: 'ACTIVE'
        }
    ]
    baseModifiers.magicDefenseModifiers = [
        { value: 10, type: 'base', description: 'Defensa mágica base', state: 'ACTIVE' },
        { 
            value: stadisticBonifiers.instincts, 
            type: 'stadistic', 
            stadistic: personaStadistics.INSTINCTS, 
            description: 'Bonificación de instintos',
            state: 'ACTIVE' 
        }
    ]
    baseModifiers.speedModifiers = [
        { value: 6, type: 'base', description: 'Velocidad base', state: 'ACTIVE' }
    ]
    baseModifiers.initiativeModifiers = [
        { 
            value: stadisticBonifiers.instincts, 
            type: 'stadistic', 
            stadistic: personaStadistics.INSTINCTS,
            description: 'Bonificación de instintos',
            state: 'ACTIVE' 
        }
    ]
    baseModifiers.APModifiers = [
        { value: 5, type: 'base', description: 'Puntos de acción base', state: 'ACTIVE' },
        { value: Math.floor(characterData.level / 4), type: 'level', description: 'Bonificación de nivel general', state: 'ACTIVE' },
        { value: characterActualLevels.reduce((total, level) => total + level.APGained, 0), type: 'level', description: 'Bonificación de nivel de clase', state: 'ACTIVE' },
        { 
            value: stadisticBonifiers.knowledge, 
            type: 'stadistic', 
            stadistic: personaStadistics.KNOWLEDGE,
            description: 'Bonificación de conocimiento',
            state: 'ACTIVE'
        }
    ]
    baseModifiers.magicSaveModifiers = [
        { value: 10, type: 'base', description: 'Salvación mágica base', state: 'ACTIVE' },
        { 
            value: stadisticBonifiers.charisma, 
            type: 'stadistic', 
            stadistic: personaStadistics.CHARISMA,
            description: 'Bonificación de carisma',
            state: 'ACTIVE' 
        }
    ]
    baseModifiers.magicLaunchModifiers = [
        { 
            value: stadisticBonifiers.knowledge, 
            type: 'stadistic', 
            stadistic: personaStadistics.KNOWLEDGE,
            description: 'Bonificación de conocimiento',
            state: 'ACTIVE'
        },
        ...characterData.combatData.attack.attackModifiers
    ]
    baseModifiers.magicHealingModifiers = [
        { 
            value: stadisticBonifiers.charisma, 
            type: 'stadistic',
            stadistic: personaStadistics.CHARISMA,
            description: 'Bonificación de carisma',
            state: 'ACTIVE' 
        }
    ]
    baseModifiers.magicDamageModifiers = [
        ...characterData.combatData.damage.damageModifiers
    ]
    baseModifiers.actionModifiers = [
        {
            value: 1,
            type: 'base',
            description: 'Acciones base',
            state: 'ACTIVE'
        },
        ...characterData.combatData.actions.actionModifiers
    ]
    baseModifiers.bonusActionModifiers = [
        {
            value: 1,
            type: 'base',
            description: 'Acciones adicionales base',
            state: 'ACTIVE'
        },
        ...characterData.combatData.actions.bonusActionModifiers
    ]
    baseModifiers.reactionModifiers = [
        {
            value: 1,
            type: 'base',
            description: 'Reacciones base',
            state: 'ACTIVE'
        },
        ...characterData.combatData.actions.reactionModifiers
    ]
    baseModifiers.criticalModifiers = [
        {
            value: 0.05,
            type: 'base',
            description: 'Crítico base',
            state: 'ACTIVE'
        }
    ]
    baseModifiers.criticalFailModifiers = [
        {
            value: 0.05,
            type: 'base',
            description: 'Fallo crítico base',
            state: 'ACTIVE'
        }
    ]
    baseModifiers.criticalAttackModifiers = [
        ...baseModifiers.criticalModifiers,
        ...characterData.combatData.critical.criticalModifiers
    ]
    baseModifiers.criticalAttackModifiers = [
        ...baseModifiers.criticalModifiers,
        ...characterData.combatData.critical.criticalModifiers
    ]
    baseModifiers.fisicalAttackModifiers = [
        ...characterData.combatData.attack.attackModifiers,
        ...characterData.combatData.attack.fisicalAttackModifiers,
    ]
    baseModifiers.fisicalDamageModifiers = [
        ...characterData.combatData.damage.damageModifiers,
        ...characterData.combatData.damage.fisicalDamageModifiers,
    ]
    characterInventory?.forEach((e) => {
        if (e.equipped && e.modifiers) {
            e.modifiers.forEach((m) => {
                if (m.addTo && m.state == 'ACTIVE') {
                    if (typeof m.addTo == 'string') {
                        baseModifiers[m.addTo].push(m);
                    } else {
                        for (let i = 0; i < m.addTo.length; i++) {
                            if (baseModifiers.hasOwnProperty(m.addTo[i])) {
                                baseModifiers[m.addTo[i]].push(m);
                            }
                        }
                    }
                }
            });
        }
    })
    characterStatus.customModifiers?.forEach(m => {
        if (m.addTo && m.state == 'ACTIVE') {
            if (typeof m.addTo == 'string') {
                baseModifiers[m.addTo].push(m);
            } else {
                for (let i = 0; i < m.addTo.length; i++) {
                    if (baseModifiers.hasOwnProperty(m.addTo[i])) {
                        baseModifiers[m.addTo[i]].push(m);
                    }
                }
            }
        }
    });
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
                bonus: stadisticBonifiers.courage,
                isProficient: characterClass.salvations.includes(personaStadistics.COURAGE)
            },
            dexterity: {
                value: characterData.stadistics.dexterity,
                bonus: stadisticBonifiers.dexterity,
                isProficient: characterClass.salvations.includes(personaStadistics.DEXTERITY)
            },
            instincts: {
                value: characterData.stadistics.instincts,
                bonus: stadisticBonifiers.instincts,
                isProficient: characterClass.salvations.includes(personaStadistics.INSTINCTS)
            },
            knowledge: {
                value: characterData.stadistics.knowledge,
                bonus: stadisticBonifiers.knowledge,
                isProficient: characterClass.salvations.includes(personaStadistics.KNOWLEDGE)
            },
            charisma: {
                value: characterData.stadistics.charisma,
                bonus: stadisticBonifiers.charisma,
                isProficient: characterClass.salvations.includes(personaStadistics.CHARISMA)
            }
        },
        secondaryAbilities: characterData.secondaryAbilities,
        background: character.backstory,
        features: {
            classFeatures: characterActualLevels.reduce((features, level) => {
                features.push(...level.features);
                return features;
            }, [] as IFeature[]).map((e) => {
                e.origin = 'class';
                if (characterStatus?.inactiveFeatures?.includes(e.featureId)) e.state = 'INACTIVE';
                return e;
            }),
            subclassFeatures: subclass?.levels?.filter((e) => e.level < characterData.level)?.reduce((features, level) => {
                features.push(...level.features);
                return features;
            }, [] as IFeature[])?.map((e) => {
                e.origin = 'subclass';
                if (characterStatus?.inactiveFeatures?.includes(e.featureId)) e.state = 'INACTIVE';
                return e;
            }) || [],
            itemFeatures: characterInventory?.reduce((features, item) => {
                if (item.additionalProperties) features.push(...item.additionalProperties);
                return features;
            }, [] as IFeature[])?.map((e) => {
                e.origin = 'items';
                if (characterStatus?.inactiveFeatures?.includes(e.featureId)) e.state = 'INACTIVE';
                return e;
            }) || [],
            customFeatures: customFeatures || []
        },
        characterInventory: characterInventory || [],
        inspiration: characterStatus.inspiration,
        combatData: {
            defensiveStats: {
                HP: {
                    total: reduceModifiers([...baseModifiers.HPModifiers, ...characterData.combatData.HP.modifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.HPModifiers, ...characterData.combatData.HP.modifiers]
                },
                defense: {
                    total: reduceModifiers([...baseModifiers.defenseModifiers, ...characterData.combatData.defense.defenseModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.defenseModifiers, ...characterData.combatData.defense.defenseModifiers]
                },
                magicDefense: {
                    total:reduceModifiers([...baseModifiers.magicDefenseModifiers, ...characterData.combatData.defense.magicDefenseModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.magicDefenseModifiers, ...characterData.combatData.defense.magicDefenseModifiers]
                },
            },
            fisicalStats: {
                speed: {
                    total: reduceModifiers([...baseModifiers.speedModifiers, ...characterData.combatData.speed.speedModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.speedModifiers, ...characterData.combatData.speed.speedModifiers]
                },
                initiative: {
                    total: reduceModifiers([...baseModifiers.initiativeModifiers, ...characterData.combatData.speed.initiativeModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.initiativeModifiers, ...characterData.combatData.speed.initiativeModifiers]
                },
                rangeAttackModifiers: {
                    total: reduceModifiers([...baseModifiers.fisicalAttackModifiers, ...characterData.combatData.attack.rangeAttackModifiers], {}),
                    modifiers: [...baseModifiers.rangeAttackModifiers, ...characterData.combatData.attack.rangeAttackModifiers]
                },
                meleeAttackModifiers: {
                    total: reduceModifiers([...baseModifiers.fisicalAttackModifiers, ...characterData.combatData.attack.meleeAttackModifiers], {}),
                    modifiers: [...baseModifiers.meleeAttackModifiers, ...characterData.combatData.attack.meleeAttackModifiers]
                },
                rangeDamageModifiers: {
                    total: reduceModifiers([...baseModifiers.fisicalDamageModifiers, ...characterData.combatData.damage.rangeDamageModifiers], {}),
                    modifiers: [...baseModifiers.rangeDamageModifiers, ...characterData.combatData.damage.rangeDamageModifiers]
                },
                meleeDamageModifiers: {
                    total: reduceModifiers([...baseModifiers.fisicalDamageModifiers, ...characterData.combatData.damage.meleeDamageModifiers], {}),
                    modifiers: [...baseModifiers.meleeDamageModifiers, ...characterData.combatData.damage.meleeDamageModifiers]
                },
            },
            magicalStats: {
                elements: characterData.combatData.elements,
                AP: {
                    total: reduceModifiers([...baseModifiers.APModifiers, ...characterData.combatData.magic.APModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.APModifiers, ...characterData.combatData.magic.APModifiers]
                },
                magicSave: {
                    total: reduceModifiers([...baseModifiers.magicSaveModifiers, ...characterData.combatData.magic.saveModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.magicSaveModifiers, ...characterData.combatData.magic.saveModifiers]
                },
                magicLaunch: {
                    total: reduceModifiers([...baseModifiers.magicLaunchModifiers, ...characterData.combatData.magic.launchModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.magicLaunchModifiers, ...characterData.combatData.magic.launchModifiers]
                },
                magicHealing: {
                    total: reduceModifiers([...baseModifiers.magicHealingModifiers, ...characterData.combatData.magic.healingModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.magicHealingModifiers, ...characterData.combatData.magic.healingModifiers]
                },
                magicDamage: {
                    total: reduceModifiers([...baseModifiers.magicDamageModifiers, ...characterData.combatData.magic.damageModifiers], stadisticBonifiers),
                    modifiers: [...baseModifiers.magicDamageModifiers, ...characterData.combatData.magic.damageModifiers]
                },
                spells: characterStatus.spells,
            },
            actions: {
                actions: {
                    total: reduceModifiers([...baseModifiers.actionModifiers, ...characterData.combatData.actions.actionModifiers], {}),
                    modifiers: [...baseModifiers.actionModifiers, ...characterData.combatData.actions.actionModifiers]
                },
                bonusActions: {
                    total: reduceModifiers([...baseModifiers.bonusActionModifiers, ...characterData.combatData.actions.bonusActionModifiers], {}),
                    modifiers: [...baseModifiers.bonusActionModifiers, ...characterData.combatData.actions.bonusActionModifiers]
                },
                reactions: {
                    total: reduceModifiers([...baseModifiers.reactionModifiers, ...characterData.combatData.actions.reactionModifiers], {}),
                    modifiers: [...baseModifiers.reactionModifiers, ...characterData.combatData.actions.reactionModifiers]
                },
            },
            critical: {
                critical: {
                    total: reduceModifiers([...baseModifiers.criticalModifiers, ...characterData.combatData.critical.criticalModifiers], {}),
                    modifiers: [...baseModifiers.criticalModifiers, ...characterData.combatData.critical.criticalModifiers]
                },
                criticalFail: {
                    total: reduceModifiers([...baseModifiers.criticalFailModifiers, ...characterData.combatData.critical.criticalFailModifiers], {}),
                    modifiers: [...baseModifiers.criticalFailModifiers, ...characterData.combatData.critical.criticalFailModifiers]
                },
                criticalOnFisical: {
                    total: reduceModifiers([...baseModifiers.criticalAttackModifiers, ...characterData.combatData.critical.criticalOnFisicalAttackModifiers], {}),
                    modifiers: [...baseModifiers.criticalAttackModifiers, ...characterData.combatData.critical.criticalOnFisicalAttackModifiers]
                },
                criticalOnMagic: {
                    total: reduceModifiers([...baseModifiers.criticalAttackModifiers, ...characterData.combatData.critical.criticalOnMagicAttackModifiers], {}),
                    modifiers: [...baseModifiers.criticalAttackModifiers, ...characterData.combatData.critical.criticalOnMagicAttackModifiers]
                },
            },
            resource: {
                name: characterClass.resourceType,
                uses: characterActualLevel?.resourceUses || 0,
            }
        },
    });
}

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
    characterDetail.secondaryAbilities.streetwise.isProficient = proficency.includes(personaSecondaryAbilities.Streetwise);
    characterDetail.secondaryAbilities.willpower.isProficient = proficency.includes(personaSecondaryAbilities.Willpower);
    characterDetail.markModified('secondaryAbilities');
    characterDetail.combatData.elements.affinity = element;
    characterDetail.combatData.elements.weakness = [ weakness ];
    characterDetail.markModified('combatData');
    await character.save();
}

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

export const addCustomModifier = async (req: Request, res: Response) => {
    const {
        value,
        type,
        description,
        addTo,
        target,
        duration,
        stadistic,
        replaceStadistic,
    } = req.body;
    if (!value || !type || !description) return res.status(400).send({ message: 'Faltan campos obligatorios' });
    if (type == 'stadistic' && !stadistic) return res.status(400).send({ message: 'Falta la estadística' });
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    await CharacterStatus.updateOne(
        {
            characterId: characterId,
        },
        {
            $push: {
                customModifiers: {
                    value,
                    type,
                    description,
                    addTo,
                    target,
                    duration,
                    stadistic,
                    replaceStadistic,
                    modifierId: new Types.ObjectId().toString()
                }
            },
            $setOnInsert: {
                characterId: characterId
            }
        },
        {
            upsert: true
        }
    )
    res.send({ success: true });
}

export const removeCustomModifier = async (req: Request, res: Response) => {
    const modifierId = req.params.modifierId;
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const characterStatus = await CharacterStatus.findOne({ characterId });
    if (!characterStatus) return res.status(406).json({ message: 'No se encontró el estado del personaje' });
    const modifier = characterStatus.customModifiers?.filter((e) => e.modifierId == modifierId);
    if (modifier?.length == 0) return res.status(406).json({ message: 'No se encontró el modificador' });
    characterStatus.customModifiers = characterStatus.customModifiers?.filter((e) => e.modifierId != modifierId);
    await characterStatus.save();
    res.send({ success: true });
}

export const getLevelUpInfo = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const characterDetail = await CharacterDetail
        .findById(character.characterData)
        .populate([{ path: 'class.type', populate: 'levels.features' }, { path: 'class.subclass', populate: 'levels.features' }]);
    if (!characterDetail) return res.status(406).json({ message: 'No se encontró el detalle del personaje' });
    const characterClass = characterDetail.class.type as IPersonaClass;
    const actualLevel = characterDetail.level;
    const nextLevel = actualLevel + 1;
    const nextLevelData = characterClass.levels.find((e) => e.level == nextLevel);
    if (!nextLevelData) return res.status(406).json({ message: 'No se encontró el siguiente nivel' });
    const response: any = {
        level: characterDetail.level + 1,
        HPDice: characterClass.HPDice,
        features: nextLevelData.features,
        spells: nextLevelData.spells,
        shouldChooseSubclass: nextLevelData.selectSubclass,
        shouldChooseSecondaryFeatures: (nextLevelData.knownSecondaryFeatures && nextLevelData.knownSecondaryFeatures > 0),
    }
    if (nextLevelData.selectSubclass) {
        response.subclasses = await Subclass.find({ class: characterClass._id });
    }
    if (response.shouldChooseSecondaryFeatures) {
        if (!nextLevelData.featureIdThatGrantsSecondaryFeatures) return res.status(406).json({ message: 'No se encontró la habilidad que otorga las habilidades secundarias' });
        const secondaryFeatures = obtainSecondaryFeatures(characterDetail, characterClass, nextLevel, nextLevelData.featureIdThatGrantsSecondaryFeatures)
        if (!secondaryFeatures) return res.status(406).json({ message: 'No se encontraron las habilidades secundarias' });
        response.secondaryFeatures =secondaryFeatures.map((f) => {
                return {
                    featureId: f.featureId,
                    name: f.name,
                    description: f.description,
                }
            })
    }
    res.send(response)
}

export const levelUp = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const characterDetail = await CharacterDetail.findById(character.characterData);
    if (!characterDetail) return res.status(406).json({ message: 'No se encontró el detalle del personaje' });
    const characterClass = await Class.findById(characterDetail.class.type);
    if (!characterClass) return res.status(406).json({ message: 'No se encontró la clase' });
    const characterStatus = await CharacterStatus.findOne({ characterId });
    if (!characterStatus) return res.status(406).json({ message: 'No se encontró el estado del personaje' });
    const { newHP, selectedSecondaryFeatures, selectedSubclass } = req.body;
    if (!newHP) return res.status(400).send({ message: 'Falta la vida' });
    const actualLevel = characterDetail.level;
    const nextLevel = actualLevel + 1;
    const nextLevelData = characterClass.levels.find((e) => e.level == nextLevel);
    if (!nextLevelData) return res.status(406).json({ message: 'No se encontró el siguiente nivel' });
    if (newHP <= 0) return res.status(406).json({ message: 'La vida debe ser mayor a 0' });
    if (nextLevelData.selectSubclass && !selectedSubclass) return res.status(406).json({ message: 'Falta la subclase' });
    const validateSecondaryFeatures = (!selectedSecondaryFeatures || selectedSecondaryFeatures.length == 0);
    if (nextLevelData.knownSecondaryFeatures && nextLevelData.knownSecondaryFeatures > 0 && validateSecondaryFeatures) {
        return res.status(406).json({ message: 'Faltan habilidades secundarias' });
    }
    characterDetail.combatData.HP.modifiers.push({ value: newHP, type: 'level', description: 'Vida de nivel ' + nextLevel, state: 'ACTIVE' });
    const modifiers = [];
    if (nextLevelData.features) {
        const classFeatures = nextLevelData.features;
        const permanentModifiers = classFeatures.reduce((modifiers, feature) => {
            if (feature.modifiers && feature.useType == useTypes.PASSIVE) {
                const permanentModifiers = feature.modifiers.filter((m) => m.permanent);
                modifiers.push(...permanentModifiers);
            }
            return modifiers;
        }, [] as IModifier[]);
        if (modifiers.length > 0) modifiers.push(...permanentModifiers);
    }
    if (characterDetail.class.subclass) {
        const subclass = await Subclass.findById(characterDetail.class.subclass);
        if (!subclass) return res.status(406).json({ message: 'No se encontró la subclase' });
        const subclassLevel = subclass.levels.find((e) => e.level == nextLevel);
        if (subclassLevel) {
            const subclassFeatures = subclassLevel.features;
            const permanentModifiers = subclassFeatures.reduce((modifiers, feature) => {
                if (feature.modifiers && feature.useType == useTypes.PASSIVE) {
                    const permanentModifiers = feature.modifiers.filter((m) => m.permanent);
                    modifiers.push(...permanentModifiers);
                }
                return modifiers;
            }, [] as IModifier[]);
            if (modifiers.length > 0) modifiers.push(...permanentModifiers);
            if (subclassLevel.additionalMaxPreparedSpells) {
                nextLevelData.maxPreparedSpells += subclassLevel.additionalMaxPreparedSpells;
            }
            if (subclassLevel.spells) {
                nextLevelData.spells.push(...subclassLevel.spells);
            }
            if (subclassLevel.additionalSpells) {
                if (!nextLevelData.additionalSpells) nextLevelData.additionalSpells = [];
                nextLevelData.additionalSpells.push(...subclassLevel.additionalSpells);
            }
            if (subclassLevel.freeSpells) {
                if (!nextLevelData.freeSpells) nextLevelData.freeSpells = [];
                nextLevelData.freeSpells.push(...subclassLevel.freeSpells);
            }
        }
    }
    for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i];
        if (modifier.addTo) {
            switch (modifier.addTo) {
                case 'HPModifiers':
                    characterDetail.combatData.HP.modifiers.push(modifier);
                    break;
                case 'defenseModifiers':
                    characterDetail.combatData.defense.defenseModifiers.push(modifier);
                    break;
                case 'magicDefenseModifiers':
                    characterDetail.combatData.defense.magicDefenseModifiers.push(modifier);
                    break;
                case 'speedModifiers':
                    characterDetail.combatData.speed.speedModifiers.push(modifier);
                    break;
                case 'initiativeModifiers':
                    characterDetail.combatData.speed.initiativeModifiers.push(modifier);
                    break;
                case 'APModifiers':
                    characterDetail.combatData.magic.APModifiers.push(modifier);
                    break;
                case 'saveModifiers':
                    characterDetail.combatData.magic.saveModifiers.push(modifier);
                    break;
                case 'launchModifiers':
                    characterDetail.combatData.magic.launchModifiers.push(modifier);
                    break;
                case 'healingModifiers':
                    characterDetail.combatData.magic.healingModifiers.push(modifier);
                    break;
                case 'actionModifiers':
                    characterDetail.combatData.actions.actionModifiers.push(modifier);
                    break;
                case 'bonusActionModifiers':
                    characterDetail.combatData.actions.bonusActionModifiers.push(modifier);
                    break;
                case 'reactionModifiers':
                    characterDetail.combatData.actions.reactionModifiers.push(modifier);
                    break;
                case 'criticalModifiers':
                    characterDetail.combatData.critical.criticalModifiers.push(modifier);
                    break;
                case 'criticalFailModifiers':
                    characterDetail.combatData.critical.criticalFailModifiers.push(modifier);
                    break;
                case 'criticalOnFisicalAttackModifiers':
                    characterDetail.combatData.critical.criticalOnFisicalAttackModifiers.push(modifier);
                    break;
                case 'criticalOnMagicAttackModifiers':
                    characterDetail.combatData.critical.criticalOnMagicAttackModifiers.push(modifier);
                    break;
                case 'criticalOnAttackModifiers':
                    characterDetail.combatData.critical.criticalOnAttackModifiers.push(modifier);
                    break;
                case 'attackModifiers':
                    characterDetail.combatData.attack.attackModifiers.push(modifier);
                    break;
                case 'fisicalAttackModifiers':
                    characterDetail.combatData.attack.fisicalAttackModifiers.push(modifier);
                    break;
                case 'rangeAttackModifiers':
                    characterDetail.combatData.attack.rangeAttackModifiers.push(modifier);
                    break;
                case 'meleeAttackModifiers':
                    characterDetail.combatData.attack.meleeAttackModifiers.push(modifier);
                    break;
                case 'damageModifiers':
                    characterDetail.combatData.damage.damageModifiers.push(modifier);
                    break;
                case 'fisicalDamageModifiers':
                    characterDetail.combatData.damage.fisicalDamageModifiers.push(modifier);
                    break;
                case 'rangeDamageModifiers':
                    characterDetail.combatData.damage.rangeDamageModifiers.push(modifier);
                    break;
                case 'meleeDamageModifiers':
                    characterDetail.combatData.damage.meleeDamageModifiers.push(modifier);
                    break;
                default:
                    console.error('No se encontró el tipo de modificador');
                    break;
            }
            characterDetail.markModified('combatData')
        }
    }
    if (nextLevelData.selectSubclass) {
        const subclass = Subclass.findById(selectedSubclass);
        if (!subclass) return res.status(406).json({ message: 'No se encontró la subclase' });
        characterDetail.class.subclass = selectedSubclass;
    }
    characterDetail.level = nextLevel;
    characterDetail.proficency = nextLevelData.proficency;
    characterDetail.markModified('proficency');
    await characterDetail.save();
    if (nextLevelData.knownSecondaryFeatures) {
        const characterStatus = await CharacterStatus.findById(character.characterData);
        if (!characterStatus) return res.status(406).json({ message: 'No se encontró el estado del personaje' });
        if (!nextLevelData.featureIdThatGrantsSecondaryFeatures) return res.status(406).json({ message: 'No se encontró la habilidad que otorga las habilidades secundarias' });
        const secondaryFeatures = obtainSecondaryFeatures(characterDetail, characterClass, nextLevel, nextLevelData.featureIdThatGrantsSecondaryFeatures);
        if (!secondaryFeatures) return res.status(406).json({ message: 'No se encontraron las habilidades secundarias' });
        const selectedFeatures = secondaryFeatures.filter((f) => selectedSecondaryFeatures.includes(f.featureId));
        if (selectedFeatures.length != nextLevelData.knownSecondaryFeatures) return res.status(406).json({ message: 'Faltan habilidades secundarias' });
        characterStatus.selectedSecondaryFeatures = selectedFeatures;
        await characterStatus.save();
    }
    characterStatus.spells.list.push(...nextLevelData.spells);
    characterStatus.spells.freeList.push(...nextLevelData.freeSpells || []);
    characterStatus.spells.additionalList.push(...nextLevelData.additionalSpells || []);
    characterStatus.spells.maxPrepared = nextLevelData.maxPreparedSpells;
    await characterStatus.save();
    res.send({ success: true });
}

export const updateXP = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    const { xp } = req.body;
    if (!xp) return res.status(400).send({ message: 'Falta la experiencia' });
    if (typeof(xp) != 'number') return res.status(406).json({ message: 'La experiencia debe ser un número' });
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const characterDetail = await CharacterDetail.findOne( { _id: character.characterData });
    if (!characterDetail) return res.status(406).json({ message: 'No se encontró el detalle del personaje' });
    characterDetail.experience = xp;
    await characterDetail.save();
    res.send({ success: true });
}

export const updateMoney = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    const { money } = req.body;
    if (!money) return res.status(400).send({ message: 'Falta el dinero' });
    if (typeof(money) != 'number') return res.status(406).json({ message: 'El dinero debe ser un número' });
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const characterDetail = await CharacterDetail.findOne( { _id: character.characterData });
    if (!characterDetail) return res.status(406).json({ message: 'No se encontró el detalle del personaje' });
    characterDetail.money = money;
    await characterDetail.save();
    res.send({ success: true });
}

export const updateInspiration = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    const { inspiration } = req.body;
    if (!inspiration) return res.status(400).send({ message: 'Falta la inspiración' });
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const characterStatus = await CharacterStatus.findById(characterId);
    if (!characterStatus) return res.status(406).json({ message: 'No se encontró el estado del personaje' });
    characterStatus.inspiration = inspiration;
    await characterStatus.save();
    res.send({ success: true });
}

export const getSecondaryFeatures = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const characterDetail = await CharacterDetail.findById(character.characterData);
    if (!characterDetail) return res.status(406).json({ message: 'No se encontró el detalle del personaje' });
    const characterClass = await Class.findById(characterDetail.class.type);
    if (!characterClass) return res.status(406).json({ message: 'No se encontró la clase' });
    const actualLevel = characterDetail.level;
    const actualLevelData = characterClass.levels.find((e) => e.level == actualLevel);
    if (!actualLevelData) return res.status(406).json({ message: 'No se encontró el nivel actual' });
    if (!actualLevelData.featureIdThatGrantsSecondaryFeatures) return res.status(406).json({ message: 'No se encontró la característica que otorga las habilidades secundarias' });
    const secondaryFeatures = obtainSecondaryFeatures(characterDetail, characterClass, actualLevel, actualLevelData.featureIdThatGrantsSecondaryFeatures)
    if (!secondaryFeatures) return res.status(406).json({ message: 'No se encontraron las habilidades secundarias' });
    res.send({ 
        secondaryFeatures: secondaryFeatures.map((f: IFeature) => {
            return {
                featureId: f.featureId,
                name: f.name,
                description: f.description,
            }
        }), 
        success: true 
    });
}
export const updateSelectedSecondaryFeatures = async (req: Request, res: Response) => {
    const characterId = new Types.ObjectId(req.params.characterId);
    const character = await Character.findById(characterId);
    if (!character) return res.status(406).json({ message: 'No se encontró el personaje' });
    if (character.state == characterState.DELETED) return res.status(406).json({ message: 'El personaje ya está eliminado' });
    if (character.player != req.body.userId) return res.status(406).json({ message: 'No tienes permisos para editar este personaje' });
    const characterStatus = await CharacterStatus.findById(character.characterData);
    if (!characterStatus) return res.status(406).json({ message: 'No se encontró el estado del personaje' });
    const { selectedSecondaryFeatures } = req.body;
    if (!selectedSecondaryFeatures) return res.status(400).send({ message: 'Faltan las habilidades secundarias' });
    const characterDetail = await CharacterDetail.findById(character.characterData);
    if (!characterDetail) return res.status(406).json({ message: 'No se encontró el detalle del personaje' });
    const characterClass = await Class.findById(characterDetail.class.type);
    if (!characterClass) return res.status(406).json({ message: 'No se encontró la clase' });
    const actualLevel = characterDetail.level;
    const actualLevelData = characterClass.levels.find((e) => e.level == actualLevel);
    if (!actualLevelData) return res.status(406).json({ message: 'No se encontró el nivel actual' });
    if (!actualLevelData.featureIdThatGrantsSecondaryFeatures) return res.status(406).json({ message: 'No se encontró la característica que otorga las habilidades secundarias' });
    const secondaryFeatures = obtainSecondaryFeatures(characterDetail, characterClass, actualLevel, actualLevelData.featureIdThatGrantsSecondaryFeatures);
    if (!secondaryFeatures) return res.status(406).json({ message: 'No se encontraron las habilidades secundarias' });
    characterStatus.selectedSecondaryFeatures = secondaryFeatures?.filter((f) => selectedSecondaryFeatures.includes(f.featureId));
    await characterStatus.save();
    res.send({ success: true });
}

export const getCharacterPDF = async (req: Request, res: Response) => {
    // TODO: implementar
    res.send({ message: 'Esta función todavía no se encuentra implementada', success: false });
}


const obtainSecondaryFeatures = (characterDetail: ICharacterPersonaDetail, characterClass: IPersonaClass, level: number, featureId: string) => {
    const subclassFeatures = (characterDetail.class.subclass as IPersonaSubclass)?.levels?.find((e) => e.level < level)?.features;
    return characterClass.levels
        .flatMap((el) => el.features)
        .concat(subclassFeatures || [])
        .find((f) => f.featureId == featureId)
        ?.subfeatures
}
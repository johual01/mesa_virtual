import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Character, { state as characterState } from '../../models/Character';
import { ICharacterPersonaDetail } from '../../models/PersonaD20/CharacterDetail';
import CharacterStatus from '../../models/PersonaD20/CharacterStatus';
import Campaign from '../../models/Campaign';
import CharacterPersonaDetail from '../../models/PersonaD20/CharacterDetail';
import CharacterClass, { IPersonaClass } from '../../models/PersonaD20/Class';
import CharacterSubclass, { IPersonaSubclass } from '../../models/PersonaD20/Subclass';
import { personaStadistics, IFeature, IModifier } from '../../models/types';
import { reduceModifiers } from '../../functions';
import { calculateBonification } from 'diceLogic';
import CustomFeature from '../../models/PersonaD20/CustomFeature';
import CharacterEquipment from '../../models/PersonaD20/CharacterEquipment';
import Spell from '../../models/Spell';

// Función auxiliar para marcar modificadores inactivos
const markInactiveModifiers = (modifiers: IModifier[], inactiveFeatures?: Types.ObjectId[]) => {
    if (!modifiers) return;
    if (!inactiveFeatures) return;
    modifiers.forEach(m => {
        if (m.featureId && inactiveFeatures.some(f => f.toString() === m.featureId?.toString())) {
            m.state = 'INACTIVE';
        }
    });
};

// Función para calcular los usos de un feature basándose en el nivel del personaje
const calculateFeatureUses = (feature: IFeature, characterLevel: number): IFeature => {
    if (!feature.usesPerLevel || feature.usesPerLevel.length === 0) {
        return feature;
    }
    
    // Buscar el rango de nivel que corresponde al personaje
    const levelRange = feature.usesPerLevel.find(
        range => characterLevel >= range.minLevel && characterLevel <= range.maxLevel
    );
    
    if (levelRange) {
        feature.uses = levelRange.uses;
    }
    
    // Procesar recursivamente los subFeatures si existen
    if (feature.subFeatures && feature.subFeatures.length > 0) {
        feature.subFeatures = feature.subFeatures.map(sf => calculateFeatureUses(sf, characterLevel));
    }
    
    return feature;
};

// Función para normalizar combatData y asegurar que todos los arrays existen
const normalizeCombatData = (characterData: ICharacterPersonaDetail) => {
    const cd = characterData.combatData;
    
    // HP
    cd.HP = cd.HP || { modifiers: [] };
    cd.HP.modifiers = cd.HP.modifiers || [];
    
    // Defense
    cd.defense = cd.defense || { defenseModifiers: [], magicDefenseModifiers: [] };
    cd.defense.defenseModifiers = cd.defense.defenseModifiers || [];
    cd.defense.magicDefenseModifiers = cd.defense.magicDefenseModifiers || [];
    
    // Speed
    cd.speed = cd.speed || { initiativeModifiers: [], speedModifiers: [] };
    cd.speed.initiativeModifiers = cd.speed.initiativeModifiers || [];
    cd.speed.speedModifiers = cd.speed.speedModifiers || [];
    
    // Magic
    cd.magic = cd.magic || { APModifiers: [], saveModifiers: [], launchModifiers: [], healingModifiers: [], damageModifiers: [] };
    cd.magic.APModifiers = cd.magic.APModifiers || [];
    cd.magic.saveModifiers = cd.magic.saveModifiers || [];
    cd.magic.launchModifiers = cd.magic.launchModifiers || [];
    cd.magic.healingModifiers = cd.magic.healingModifiers || [];
    cd.magic.damageModifiers = cd.magic.damageModifiers || [];
    
    // Actions
    cd.actions = cd.actions || { actionModifiers: [], bonusActionModifiers: [], reactionModifiers: [] };
    cd.actions.actionModifiers = cd.actions.actionModifiers || [];
    cd.actions.bonusActionModifiers = cd.actions.bonusActionModifiers || [];
    cd.actions.reactionModifiers = cd.actions.reactionModifiers || [];
    
    // Critical
    cd.critical = cd.critical || { criticalModifiers: [], criticalFailModifiers: [], criticalOnFisicalAttackModifiers: [], criticalOnMagicAttackModifiers: [], criticalOnAttackModifiers: [] };
    cd.critical.criticalModifiers = cd.critical.criticalModifiers || [];
    cd.critical.criticalFailModifiers = cd.critical.criticalFailModifiers || [];
    cd.critical.criticalOnFisicalAttackModifiers = cd.critical.criticalOnFisicalAttackModifiers || [];
    cd.critical.criticalOnMagicAttackModifiers = cd.critical.criticalOnMagicAttackModifiers || [];
    cd.critical.criticalOnAttackModifiers = cd.critical.criticalOnAttackModifiers || [];
    
    // Attack
    cd.attack = cd.attack || { attackModifiers: [], fisicalAttackModifiers: [], rangeAttackModifiers: [], meleeAttackModifiers: [] };
    cd.attack.attackModifiers = cd.attack.attackModifiers || [];
    cd.attack.fisicalAttackModifiers = cd.attack.fisicalAttackModifiers || [];
    cd.attack.rangeAttackModifiers = cd.attack.rangeAttackModifiers || [];
    cd.attack.meleeAttackModifiers = cd.attack.meleeAttackModifiers || [];
    
    // Damage
    cd.damage = cd.damage || { damageModifiers: [], fisicalDamageModifiers: [], rangeDamageModifiers: [], meleeDamageModifiers: [], criticalDamageModifiers: [] };
    cd.damage.damageModifiers = cd.damage.damageModifiers || [];
    cd.damage.fisicalDamageModifiers = cd.damage.fisicalDamageModifiers || [];
    cd.damage.rangeDamageModifiers = cd.damage.rangeDamageModifiers || [];
    cd.damage.meleeDamageModifiers = cd.damage.meleeDamageModifiers || [];
    cd.damage.criticalDamageModifiers = cd.damage.criticalDamageModifiers || [];
};

export const getCharacters = async (req: Request, res: Response) => {
    try {
        const origin = req.body.origin;

        if (!origin) {
            return res.status(400).json({ errMsg: 'Falta el origen' });
        }

        switch (origin) {
            case 'user':
                const userId = new Types.ObjectId(req.body.userId);
                const query: any = { player: userId };
                const state = req.body.state;

                if (state) {
                    if (!Object.values(characterState).includes(state)) {
                        return res.status(400).json({ errMsg: 'Estado inválido' });
                    }
                    query.state = state;
                }

                const characters = await Character.find(query, { name: 1, system: 1, state: 1, pictureRoute: 1 })
                    .populate({ path: 'characterData', select: { class: 1, level: 1 } });
                return res.status(200).json(characters);

            case 'campaign':
                const campaignId = new Types.ObjectId(req.body.campaignId);
                const campaign = await Campaign.findById(campaignId);

                if (!campaign) {
                    return res.status(404).json({ errMsg: 'Campaña no encontrada' });
                }

                const charactersCampaign = await Character.find(
                    { _id: { $in: campaign.characters } }, 
                    { name: 1, system: 1, state: 1, pictureRoute: 1 }
                ).populate({ path: 'characterData', select: { class: 1, level: 1 } });

                return res.status(200).json(charactersCampaign);

            default:
                return res.status(400).json({ errMsg: 'Origen no válido' });
        }
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al obtener personajes', error: e });
    }
};

export const getCharacter = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const character = await Character.findById(characterId)

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        const characterData = await CharacterPersonaDetail.findById(character.characterData) as ICharacterPersonaDetail;
        if (!characterData) {
            return res.status(404).json({ errMsg: 'Información del personaje no encontrada' });
        }
        
        // Normalizar combatData para personajes antiguos que no tienen todos los arrays
        normalizeCombatData(characterData);
        
        const characterClass = await CharacterClass.findById(characterData?.class) as IPersonaClass;
        const subclass = await CharacterSubclass.findById(characterData?.subclass) as IPersonaSubclass;
        const customFeatures = await CustomFeature.find({ character: characterId, state: { $ne: 'DELETED' } });
        const characterInventory = await CharacterEquipment.find({ character: characterId, state: { $ne: 'DELETED'} });
        const characterStatus = await CharacterStatus.findOne({ characterId })
            .populate(['spells.list', 'spells.freeList', 'spells.additionalList', 'spells.preparedList']);

        if (!characterData) {
            return res.status(404).json({ errMsg: 'Información del personaje no encontrada' });
        }

        if (!characterStatus) {
            return res.status(404).json({ errMsg: 'Estado del personaje no encontrado' });
        }

        const customSpells = await Spell.find({ character: characterId, state: 'ACTIVE' });
        if (customSpells && customSpells.length > 0) {
            const list = customSpells.filter((e) => e.toList === 'list');
            const freeList = customSpells.filter((e) => e.toList === 'free');
            const additionalList = customSpells.filter((e) => e.toList === 'additional');
            characterStatus.spells.list.push(...list);
            characterStatus.spells.freeList.push(...freeList);
            characterStatus.spells.additionalList.push(...additionalList);
        }

        const characterActualLevels = characterClass.levels.filter((e) => e.level < characterData.level);
        const stadisticBonifiers = {
            courage: calculateBonification(characterData.stadistics.courage),
            dexterity: calculateBonification(characterData.stadistics.dexterity),
            instincts: calculateBonification(characterData.stadistics.instincts),
            knowledge: calculateBonification(characterData.stadistics.knowledge),
            charisma: calculateBonification(characterData.stadistics.charisma),
        };

        // Marcar modificadores inactivos
        markInactiveModifiers(characterData.combatData.HP.modifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.defense.defenseModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.defense.magicDefenseModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.speed.initiativeModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.speed.speedModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.magic.APModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.magic.saveModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.magic.launchModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.magic.healingModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.magic.damageModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.actions.actionModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.actions.bonusActionModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.actions.reactionModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.critical.criticalModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.critical.criticalFailModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.critical.criticalOnFisicalAttackModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.critical.criticalOnMagicAttackModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.critical.criticalOnAttackModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.attack.attackModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.attack.fisicalAttackModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.attack.rangeAttackModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.attack.meleeAttackModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.damage.damageModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.damage.fisicalDamageModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.damage.rangeDamageModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.damage.meleeDamageModifiers, characterStatus.inactiveFeatures);
        markInactiveModifiers(characterData.combatData.damage.criticalDamageModifiers, characterStatus.inactiveFeatures);

        const baseModifiers: { [name: string]: IModifier[] } = {};
        baseModifiers.HPModifiers = [
            { 
                value: stadisticBonifiers.courage * characterData.level, 
                type: 'stadistic', 
                stadistic: personaStadistics.COURAGE, 
                description: 'Bonificación de coraje',
                state: 'ACTIVE'
            }
        ];
        baseModifiers.defenseModifiers = [
            { value: 10, type: 'base', description: 'Defensa base', state: 'ACTIVE' },
            { 
                value: stadisticBonifiers.dexterity, 
                type: 'stadistic', 
                stadistic: personaStadistics.DEXTERITY, 
                description: 'Bonificación de destreza',
                state: 'ACTIVE'
            }
        ];
        baseModifiers.magicDefenseModifiers = [
            { value: 10, type: 'base', description: 'Defensa mágica base', state: 'ACTIVE' },
            { 
                value: stadisticBonifiers.instincts, 
                type: 'stadistic', 
                stadistic: personaStadistics.INSTINCTS, 
                description: 'Bonificación de instintos',
                state: 'ACTIVE' 
            }
        ];
        baseModifiers.shieldModifiers = [
            { value: 2, type: 'base', description: 'Modificador de escudo base', state: 'ACTIVE' },
            { 
                value: stadisticBonifiers.courage,
                type: 'stadistic',
                stadistic: personaStadistics.COURAGE,
                description: 'Bonificación de coraje',
                state: 'ACTIVE'
            }
        ];
        baseModifiers.speedModifiers = [
            { value: 6, type: 'base', description: 'Velocidad base', state: 'ACTIVE' }
        ];
        baseModifiers.initiativeModifiers = [
            { 
                value: stadisticBonifiers.instincts, 
                type: 'stadistic', 
                stadistic: personaStadistics.INSTINCTS,
                description: 'Bonificación de instintos',
                state: 'ACTIVE' 
            }
        ];
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
        ];
        baseModifiers.magicSaveModifiers = [
            { value: 10, type: 'base', description: 'Salvación mágica base', state: 'ACTIVE' },
            { 
                value: stadisticBonifiers.charisma, 
                type: 'stadistic', 
                stadistic: personaStadistics.CHARISMA,
                description: 'Bonificación de carisma',
                state: 'ACTIVE' 
            }
        ];
        baseModifiers.magicLaunchModifiers = [
            { 
                value: stadisticBonifiers.knowledge, 
                type: 'stadistic', 
                stadistic: personaStadistics.KNOWLEDGE,
                description: 'Bonificación de conocimiento',
                state: 'ACTIVE'
            },
            ...characterData.combatData.attack.attackModifiers
        ];
        baseModifiers.magicHealingModifiers = [
            { 
                value: stadisticBonifiers.charisma, 
                type: 'stadistic',
                stadistic: personaStadistics.CHARISMA,
                description: 'Bonificación de carisma',
                state: 'ACTIVE' 
            }
        ];
        baseModifiers.magicDamageModifiers = [
            ...characterData.combatData.damage.damageModifiers
        ];
        baseModifiers.actionModifiers = [
            { value: 1, type: 'base', description: 'Acciones base', state: 'ACTIVE' },
            ...characterData.combatData.actions.actionModifiers
        ];
        baseModifiers.bonusActionModifiers = [
            { value: 1, type: 'base', description: 'Acciones adicionales base', state: 'ACTIVE' },
            ...characterData.combatData.actions.bonusActionModifiers
        ];
        baseModifiers.reactionModifiers = [
            { value: 1, type: 'base', description: 'Reacciones base', state: 'ACTIVE' },
            ...characterData.combatData.actions.reactionModifiers
        ];
        baseModifiers.criticalModifiers = [
            { value: 0.05, type: 'base', description: 'Crítico base', state: 'ACTIVE' }
        ];
        baseModifiers.criticalFailModifiers = [
            { value: 0.05, type: 'base', description: 'Fallo crítico base', state: 'ACTIVE' }
        ];
        baseModifiers.criticalAttackModifiers = [
            ...baseModifiers.criticalModifiers,
            ...characterData.combatData.critical.criticalModifiers
        ];
        baseModifiers.criticalDamageModifiers = [
            ...characterData.combatData.damage.damageModifiers,
        ];
        baseModifiers.fisicalAttackModifiers = [
            ...characterData.combatData.attack.attackModifiers,
            ...characterData.combatData.attack.fisicalAttackModifiers,
        ];
        baseModifiers.fisicalDamageModifiers = [
            ...characterData.combatData.damage.damageModifiers,
            ...characterData.combatData.damage.fisicalDamageModifiers,
        ];

        characterInventory?.forEach((e) => {
            if (e.equipped && e.modifiers) {
                e.modifiers.forEach((m) => {
                    if (m.addTo && m.state === 'ACTIVE') {
                        if (typeof m.addTo === 'string') {
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
        });

        characterStatus.customModifiers?.forEach(m => {
            if (m.addTo && m.state === 'ACTIVE') {
                if (typeof m.addTo === 'string') {
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

        const characterActualLevel = characterClass.levels.find((e) => e.level === characterData.level);

        res.status(200).json({
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
            element: characterData.combatData.elements?.affinity,
            weakness: characterData.combatData.elements?.weakness?.[0],
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
                resource: characterClass.resourceType ? {
                    name: characterClass.resourceType,
                    current: characterStatus.resourcePool !== undefined ? characterStatus.resourcePool : characterClass.initialResourcePoolValue,
                    max: characterActualLevel?.resourcePool !== undefined ? characterActualLevel.resourcePool : characterClass.initialResourcePoolValue
                } : undefined,
                classFeatures: characterActualLevels.reduce((features, level) => {
                    features.push(...level.features);
                    return features;
                }, [] as IFeature[]).map((e) => {
                    e.origin = 'class';
                    if (characterStatus?.inactiveFeatures?.includes(e.featureId)) e.state = 'INACTIVE';
                    return calculateFeatureUses(e, characterData.level);
                }),
                subclassFeatures: subclass?.levels?.filter((e) => e.level < characterData.level)?.reduce((features, level) => {
                    features.push(...level.features);
                    return features;
                }, [] as IFeature[])?.map((e) => {
                    e.origin = 'subclass';
                    if (characterStatus?.inactiveFeatures?.includes(e.featureId)) e.state = 'INACTIVE';
                    return calculateFeatureUses(e, characterData.level);
                }) || [],
                itemFeatures: characterInventory?.reduce((features, item) => {
                    if (item.additionalProperties) features.push(...item.additionalProperties);
                    return features;
                }, [] as IFeature[])?.map((e) => {
                    e.origin = 'items';
                    if (characterStatus?.inactiveFeatures?.includes(e.featureId)) e.state = 'INACTIVE';
                    return calculateFeatureUses(e, characterData.level);
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
                        total: reduceModifiers([...baseModifiers.magicDefenseModifiers, ...characterData.combatData.defense.magicDefenseModifiers], stadisticBonifiers),
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
                        modifiers: [...baseModifiers.fisicalAttackModifiers, ...characterData.combatData.attack.rangeAttackModifiers]
                    },
                    meleeAttackModifiers: {
                        total: reduceModifiers([...baseModifiers.fisicalAttackModifiers, ...characterData.combatData.attack.meleeAttackModifiers], {}),
                        modifiers: [...baseModifiers.fisicalAttackModifiers, ...characterData.combatData.attack.meleeAttackModifiers]
                    },
                    rangeDamageModifiers: {
                        total: reduceModifiers([...baseModifiers.fisicalDamageModifiers, ...characterData.combatData.damage.rangeDamageModifiers], {}),
                        modifiers: [...baseModifiers.fisicalDamageModifiers, ...characterData.combatData.damage.rangeDamageModifiers]
                    },
                    meleeDamageModifiers: {
                        total: reduceModifiers([...baseModifiers.fisicalDamageModifiers, ...characterData.combatData.damage.meleeDamageModifiers], {}),
                        modifiers: [...baseModifiers.fisicalDamageModifiers, ...characterData.combatData.damage.meleeDamageModifiers]
                    },
                    criticalDamageModifiers: {
                        total: reduceModifiers([...baseModifiers.criticalDamageModifiers, ...characterData.combatData.damage.criticalDamageModifiers], {}),
                        modifiers: [...baseModifiers.criticalDamageModifiers, ...characterData.combatData.damage.criticalDamageModifiers]
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
                    name: characterClass.resourceType
                }
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ errMsg: 'Error al obtener personaje', error: e });
    }
};

export const getCharacterPDF = async (req: Request, res: Response) => {
    try {
        // TODO: implementar generación de PDF
        res.status(501).json({ errMsg: 'Esta función todavía no se encuentra implementada' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al generar PDF', error: e });
    }
};

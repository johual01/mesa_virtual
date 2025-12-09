import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Character, { state as characterState } from '../../models/Character';
import CharacterDetail, { ICharacterPersonaDetail } from '../../models/PersonaD20/CharacterDetail';
import CharacterStatus from '../../models/PersonaD20/CharacterStatus';
import Class, { IPersonaClass } from '../../models/PersonaD20/Class';
import Subclass, { IPersonaSubclass } from '../../models/PersonaD20/Subclass';
import { IModifier, useTypes, IFeature } from '../../models/types';

// Función auxiliar para obtener habilidades secundarias
export const obtainSecondaryFeatures = (
    characterDetail: ICharacterPersonaDetail, 
    characterClass: IPersonaClass, 
    level: number, 
    featureId: Types.ObjectId
) => {
    const subclassFeatures = (characterDetail.class.subclass as IPersonaSubclass)?.levels?.find(e => e.level < level)?.features;
    return characterClass.levels
        .flatMap(el => el.features)
        .concat(subclassFeatures || [])
        .find(f => f.featureId?.toString() === featureId.toString())
        ?.subFeatures;
};

export const getLevelUpInfo = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const character = await Character.findById(characterId);

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        if (character.state === characterState.DELETED) {
            return res.status(400).json({ errMsg: 'El personaje está eliminado' });
        }

        if (character.player.toString() !== req.body.userId) {
            return res.status(403).json({ errMsg: 'No tienes permisos para editar este personaje' });
        }

        const characterDetail = await CharacterDetail
            .findById(character.characterData)
            .populate([{ path: 'class.type', populate: 'levels.features' }, { path: 'class.subclass', populate: 'levels.features' }]);

        if (!characterDetail) {
            return res.status(404).json({ errMsg: 'Detalle del personaje no encontrado' });
        }

        const characterClass = characterDetail.class.type as IPersonaClass;
        const actualLevel = characterDetail.level;
        const nextLevel = actualLevel + 1;
        const nextLevelData = characterClass.levels.find(e => e.level === nextLevel);

        if (!nextLevelData) {
            return res.status(400).json({ errMsg: 'Nivel máximo alcanzado' });
        }

        const response: any = {
            level: nextLevel,
            HPDice: characterClass.HPDice,
            features: nextLevelData.features,
            spells: nextLevelData.spells,
            subclassFeatures: [],
            shouldChooseSubclass: nextLevelData.selectSubclass,
            shouldChooseSecondaryFeatures: (nextLevelData.knownSecondaryFeatures && nextLevelData.knownSecondaryFeatures > 0),
            shouldChooseSecondaryAffinities: nextLevelData.gainSecondaryAffinity,
            shouldChooseStatImprovement: nextLevelData.gainStatIncrease,
        };

        if (characterDetail.class.subclass) {
            const subclass = await Subclass.findById(characterDetail.class.subclass);
            if (!subclass) {
                return res.status(404).json({ errMsg: 'Subclase no encontrada' });
            }
            const subclassLevel = subclass.levels.find(e => e.level === nextLevel);
            if (subclassLevel) {
                response.subclassFeatures = subclassLevel.features;
            }
        }

        if (nextLevelData.selectSubclass) {
            response.subclasses = await Subclass.find({ class: characterClass._id });
        }

        if (response.shouldChooseSecondaryFeatures) {
            if (!characterClass.featureIdThatGrantsSecondaryFeatures) {
                return res.status(400).json({ errMsg: 'Configuración de clase inválida' });
            }
            const secondaryFeatures = obtainSecondaryFeatures(characterDetail, characterClass, nextLevel, characterClass.featureIdThatGrantsSecondaryFeatures);
            if (!secondaryFeatures) {
                return res.status(404).json({ errMsg: 'Habilidades secundarias no encontradas' });
            }
            response.secondaryFeatures = secondaryFeatures.map(f => ({
                featureId: f.featureId,
                name: f.name,
                description: f.description,
            }));
        }

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al obtener información de subida de nivel', error: e });
    }
};

export const levelUp = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const character = await Character.findById(characterId);

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        if (character.state === characterState.DELETED) {
            return res.status(400).json({ errMsg: 'El personaje está eliminado' });
        }

        if (character.player.toString() !== req.body.userId) {
            return res.status(403).json({ errMsg: 'No tienes permisos para editar este personaje' });
        }

        const characterDetail = await CharacterDetail.findById(character.characterData);
        if (!characterDetail) {
            return res.status(404).json({ errMsg: 'Detalle del personaje no encontrado' });
        }

        const characterClass = await Class.findById(characterDetail.class.type);
        if (!characterClass) {
            return res.status(404).json({ errMsg: 'Clase no encontrada' });
        }

        const characterStatus = await CharacterStatus.findOne({ characterId });
        if (!characterStatus) {
            return res.status(404).json({ errMsg: 'Estado del personaje no encontrado' });
        }

        const { newHP, selectedSecondaryFeatures, selectedSubclass, selectedSecondaryAffinity, selectedStats } = req.body;

        if (!newHP) {
            return res.status(400).json({ errMsg: 'Falta la vida' });
        }

        const actualLevel = characterDetail.level;
        const nextLevel = actualLevel + 1;
        const nextLevelData = characterClass.levels.find(e => e.level === nextLevel);

        if (!nextLevelData) {
            return res.status(400).json({ errMsg: 'Nivel máximo alcanzado' });
        }

        if (newHP <= 0) {
            return res.status(400).json({ errMsg: 'La vida debe ser mayor a 0' });
        }

        if (nextLevelData.selectSubclass && !selectedSubclass) {
            return res.status(400).json({ errMsg: 'Falta seleccionar la subclase' });
        }

        if (nextLevelData.knownSecondaryFeatures && nextLevelData.knownSecondaryFeatures > 0) {
            if (!selectedSecondaryFeatures || selectedSecondaryFeatures.length === 0) {
                return res.status(400).json({ errMsg: 'Faltan habilidades secundarias' });
            }
        }

        characterDetail.combatData.HP.modifiers.push({ value: newHP, type: 'level', description: 'Vida de nivel ' + nextLevel, state: 'ACTIVE' });
        const modifiers: IModifier[] = [];

        if (nextLevelData.features) {
            const classFeatures = nextLevelData.features;
            const permanentModifiers = classFeatures.reduce((modifiers, feature) => {
                if (feature.modifiers && feature.useType === useTypes.PASSIVE) {
                    const permanentModifiers = feature.modifiers.filter(m => m.permanent);
                    modifiers.push(...permanentModifiers);
                }
                return modifiers;
            }, [] as IModifier[]);
            if (modifiers.length > 0) modifiers.push(...permanentModifiers);
        }

        if (characterDetail.class.subclass) {
            const subclass = await Subclass.findById(characterDetail.class.subclass);
            if (!subclass) {
                return res.status(404).json({ errMsg: 'Subclase no encontrada' });
            }
            const subclassLevel = subclass.levels.find(e => e.level === nextLevel);
            if (subclassLevel) {
                const subclassFeatures = subclassLevel.features;
                const permanentModifiers = subclassFeatures.reduce((modifiers, feature) => {
                    if (feature.modifiers && feature.useType === useTypes.PASSIVE) {
                        const permanentModifiers = feature.modifiers.filter(m => m.permanent);
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
                    case 'criticalDamageModifiers':
                        characterDetail.combatData.damage.criticalDamageModifiers.push(modifier);
                        break;
                }
                characterDetail.markModified('combatData');
            }
        }

        if (nextLevelData.selectSubclass) {
            const subclass = await Subclass.findById(selectedSubclass);
            if (!subclass) {
                return res.status(404).json({ errMsg: 'Subclase no encontrada' });
            }
            characterDetail.class.subclass = selectedSubclass;
        }

        if (nextLevelData.gainSecondaryAffinity) {
            characterDetail.combatData.elements.secondaryAffinity = selectedSecondaryAffinity;
            characterDetail.markModified('combatData');
        }

        if (nextLevelData.gainStatIncrease) {
            const stats = characterDetail.stadistics;
            if (selectedStats.courage) {
                stats.courage += selectedStats.courage;
            }
            if (selectedStats.dexterity) {
                stats.dexterity += selectedStats.dexterity;
            }
            if (selectedStats.instincts) {
                stats.instincts += selectedStats.instincts;
            }
            if (selectedStats.knowledge) {
                stats.knowledge += selectedStats.knowledge;
            }
            if (selectedStats.charisma) {
                stats.charisma += selectedStats.charisma;
            }
            characterDetail.stadistics = stats;
            characterDetail.markModified('stadistics');
        }

        characterDetail.level = nextLevel;
        characterDetail.proficency = nextLevelData.proficency;
        characterDetail.markModified('proficency');
        await characterDetail.save();

        if (nextLevelData.knownSecondaryFeatures) {
            if (!characterClass.featureIdThatGrantsSecondaryFeatures) {
                return res.status(400).json({ errMsg: 'Configuración de clase inválida' });
            }
            const secondaryFeatures = obtainSecondaryFeatures(characterDetail, characterClass, nextLevel, characterClass.featureIdThatGrantsSecondaryFeatures);
            if (!secondaryFeatures) {
                return res.status(404).json({ errMsg: 'Habilidades secundarias no encontradas' });
            }
            const selectedFeatures = secondaryFeatures.filter(f => selectedSecondaryFeatures.includes(f.featureId));
            if (selectedFeatures.length !== nextLevelData.knownSecondaryFeatures) {
                return res.status(400).json({ errMsg: 'Número incorrecto de habilidades secundarias' });
            }
            characterStatus.selectedSecondaryFeatures = selectedFeatures;
            await characterStatus.save();
        }

        characterStatus.spells.list.push(...nextLevelData.spells);
        characterStatus.spells.freeList.push(...nextLevelData.freeSpells || []);
        characterStatus.spells.additionalList.push(...nextLevelData.additionalSpells || []);
        characterStatus.spells.maxPrepared = nextLevelData.maxPreparedSpells;
        await characterStatus.save();

        res.status(200).json({ message: 'Personaje subió de nivel' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al subir de nivel', error: e });
    }
};

export const getSecondaryFeatures = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const character = await Character.findById(characterId);

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        if (character.state === characterState.DELETED) {
            return res.status(400).json({ errMsg: 'El personaje está eliminado' });
        }

        if (character.player.toString() !== req.body.userId) {
            return res.status(403).json({ errMsg: 'No tienes permisos para ver este personaje' });
        }

        const characterDetail = await CharacterDetail.findById(character.characterData);
        if (!characterDetail) {
            return res.status(404).json({ errMsg: 'Detalle del personaje no encontrado' });
        }

        const characterClass = await Class.findById(characterDetail.class.type);
        if (!characterClass) {
            return res.status(404).json({ errMsg: 'Clase no encontrada' });
        }

        const actualLevel = characterDetail.level;
        const actualLevelData = characterClass.levels.find(e => e.level === actualLevel);

        if (!actualLevelData) {
            return res.status(404).json({ errMsg: 'Nivel actual no encontrado' });
        }

        if (!characterClass.featureIdThatGrantsSecondaryFeatures) {
            return res.status(400).json({ errMsg: 'Esta clase no tiene habilidades secundarias' });
        }

        const secondaryFeatures = obtainSecondaryFeatures(characterDetail, characterClass, actualLevel, characterClass.featureIdThatGrantsSecondaryFeatures);
        if (!secondaryFeatures) {
            return res.status(404).json({ errMsg: 'Habilidades secundarias no encontradas' });
        }

        res.status(200).json({ 
            secondaryFeatures: secondaryFeatures.map((f: IFeature) => ({
                featureId: f.featureId,
                name: f.name,
                description: f.description,
            }))
        });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al obtener habilidades secundarias', error: e });
    }
};

export const updateSelectedSecondaryFeatures = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const character = await Character.findById(characterId);

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        if (character.state === characterState.DELETED) {
            return res.status(400).json({ errMsg: 'El personaje está eliminado' });
        }

        if (character.player.toString() !== req.body.userId) {
            return res.status(403).json({ errMsg: 'No tienes permisos para editar este personaje' });
        }

        const characterStatus = await CharacterStatus.findOne({ characterId });
        if (!characterStatus) {
            return res.status(404).json({ errMsg: 'Estado del personaje no encontrado' });
        }

        const { selectedSecondaryFeatures } = req.body;
        if (!selectedSecondaryFeatures) {
            return res.status(400).json({ errMsg: 'Faltan las habilidades secundarias' });
        }

        const characterDetail = await CharacterDetail.findById(character.characterData);
        if (!characterDetail) {
            return res.status(404).json({ errMsg: 'Detalle del personaje no encontrado' });
        }

        const characterClass = await Class.findById(characterDetail.class.type);
        if (!characterClass) {
            return res.status(404).json({ errMsg: 'Clase no encontrada' });
        }

        const actualLevel = characterDetail.level;
        const actualLevelData = characterClass.levels.find(e => e.level === actualLevel);

        if (!actualLevelData) {
            return res.status(404).json({ errMsg: 'Nivel actual no encontrado' });
        }

        if (!characterClass.featureIdThatGrantsSecondaryFeatures) {
            return res.status(400).json({ errMsg: 'Esta clase no tiene habilidades secundarias' });
        }

        const secondaryFeatures = obtainSecondaryFeatures(characterDetail, characterClass, actualLevel, characterClass.featureIdThatGrantsSecondaryFeatures);
        if (!secondaryFeatures) {
            return res.status(404).json({ errMsg: 'Habilidades secundarias no encontradas' });
        }

        characterStatus.selectedSecondaryFeatures = secondaryFeatures.filter(f => selectedSecondaryFeatures.includes(f.featureId));
        await characterStatus.save();

        res.status(200).json({ message: 'Habilidades secundarias actualizadas' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al actualizar habilidades secundarias', error: e });
    }
};

import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from '../../models/User';
import Character, { state as characterState } from '../../models/Character';
import CharacterDetail, { personaSecondaryAbilities } from '../../models/PersonaD20/CharacterDetail';
import CharacterStatus from '../../models/PersonaD20/CharacterStatus';
import Campaign, { campaignState } from '../../models/Campaign';
import Class from '../../models/PersonaD20/Class';
import { elements, system as systems, personaStadistics } from '../../models/types';
import { enumToArray, saveImage, arraysEqual, UploadedFile } from '../../functions';
import { rollMaxDiceString } from 'diceLogic';

// Extender Request para incluir el archivo de multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const getCreateCharacterInfo = async (req: Request, res: Response) => {
    try {
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

        res.status(200).json({ 
            elements: arrayElements, 
            states: arrayStates,
            secondaryAbilities: arraySecondaryAbilities,
            campaigns,
            classes
        });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al obtener información de creación', error: e });
    }
};

export const createCharacter = async (req: MulterRequest, res: Response) => {
    try {
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

        // Validaciones
        if (!name || !system || !state || !characterClass || !persona || money === undefined || 
            !element || !backstory || !stadistics || !proficency || !weakness) {
            return res.status(400).json({ errMsg: 'Faltan campos obligatorios' });
        }

        if (!Object.values(systems).includes(system)) {
            return res.status(400).json({ errMsg: 'Sistema inválido' });
        }

        if (!Object.values(elements).includes(element)) {
            return res.status(400).json({ errMsg: 'Elemento inválido' });
        }

        if (!Object.values(elements).includes(weakness)) {
            return res.status(400).json({ errMsg: 'Debilidad inválida' });
        }

        if (!Object.values(characterState).includes(state)) {
            return res.status(400).json({ errMsg: 'Estado inválido' });
        }

        if (!arraysEqual(Object.keys(stadistics), Object.keys(personaStadistics))) {
            return res.status(400).json({ errMsg: 'Faltan estadísticas' });
        }

        if (typeof money !== 'number') {
            return res.status(400).json({ errMsg: 'El dinero debe ser un número' });
        }

        const invalidProficency = proficency.some((p: any) => !Object.values(personaSecondaryAbilities).includes(p));
        if (proficency.length === 0 || invalidProficency) {
            return res.status(400).json({ errMsg: 'Habilidades de proficiencia inválidas' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ errMsg: 'Usuario no encontrado' });
        }

        const userIdObj = new Types.ObjectId(userId);
        const characterClassObjectId = new Types.ObjectId(characterClass);
        const characterClassObj = await Class.findById(characterClassObjectId);

        if (!characterClassObj) {
            return res.status(404).json({ errMsg: 'Clase no encontrada' });
        }

        const baseHPDices = characterClassObj.HPDice;
        const { total: baseHP } = rollMaxDiceString(baseHPDices);

        const character: any = {
            name,
            player: userIdObj,
            system,
            backstory,
            state,
        };

        const characterDetail: any = {
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
                    meleeDamageModifiers: [],
                    criticalDamageModifiers: []
                }
            }
        };

        const characterDetailDoc = new CharacterDetail(characterDetail);
        await characterDetailDoc.save();

        // Procesar imagen si se proporciona un archivo
        if (req.file) {
            const uploadedFile: UploadedFile = {
                buffer: req.file.buffer,
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
                size: req.file.size
            };
            const savedImage = await saveImage(uploadedFile, user._id as Types.ObjectId, 'characters');
            if (typeof savedImage === 'string') {
                character.pictureRoute = savedImage;
            } else {
                return res.status(500).json({ errMsg: 'No se pudo guardar la imagen' });
            }
        } else if (pictureRoute && pictureRoute.startsWith('http')) {
            // Permitir URLs externas directamente
            character.pictureRoute = pictureRoute;
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
                list: [...characterClassObj.levels[0].spells],
                freeList: [],
                additionalList: [],
                preparedList: [],
                maxPrepared: characterClassObj.levels[0].maxPreparedSpells
            },
        });
        await characterStatus.save();

        res.status(201).json({ 
            message: 'Personaje creado',
            characterId: newCharacter._id 
        });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al crear personaje', error: e });
    }
};

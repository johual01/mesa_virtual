import {Request, Response} from 'express';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import Character from '../models/Character';
import CharacterStatus from '../models/PersonaD20/CharacterStatus';
import CustomFeature from '../models/PersonaD20/CustomFeature';

// changeFeatureStatus
export const changeFeatureStatus = async (req: Request, res: Response) => {
    try {
        const { characterId, featureId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ errMsg: 'Estado es requerido' });
        }

        if (status !== 'active' && status !== 'inactive') {
            return res.status(400).json({ errMsg: 'Estado inválido' });
        }

        const characterObjectId = new Types.ObjectId(characterId);
        const featureObjectId = new ObjectId(featureId);

        const character = await Character.findById(characterObjectId);
        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        const characterStatus = await CharacterStatus.findOne({ characterId: characterObjectId });
        if (!characterStatus) {
            return res.status(404).json({ errMsg: 'Estado del personaje no encontrado' });
        }

        const featureIndex = characterStatus.inactiveFeatures?.findIndex(
            f => f.toString() === featureObjectId.toString()
        );

        if (status === 'active') {
            if (!characterStatus.inactiveFeatures || characterStatus.inactiveFeatures.length === 0) {
                return res.status(400).json({ errMsg: 'No hay rasgos inactivos' });
            }

            if (featureIndex === -1 || featureIndex === undefined) {
                return res.status(404).json({ errMsg: 'Rasgo no encontrado en inactivos' });
            }

            // Remover de inactivos
            characterStatus.inactiveFeatures = characterStatus.inactiveFeatures.filter(
                f => f.toString() !== featureObjectId.toString()
            );
            await characterStatus.save();
        } else {
            // status === 'inactive'
            if (featureIndex !== -1 && featureIndex !== undefined) {
                return res.status(400).json({ errMsg: 'El rasgo ya está inactivo' });
            }

            if (!characterStatus.inactiveFeatures) {
                characterStatus.inactiveFeatures = [];
            }

            characterStatus.inactiveFeatures.push(featureObjectId);
            await characterStatus.save();
        }

        return res.status(200).json({ message: 'Estado del rasgo actualizado' });
    } catch (e) {
        return res.status(500).json({ errMsg: 'Error al cambiar estado del rasgo', error: e });
    }
}

// addFeature
export const addFeature = async (req: Request, res: Response) => {
    try {
        const { characterId } = req.params;
        const { name, description, useType } = req.body;

        if (!name || !description || !useType) {
            return res.status(400).json({ errMsg: 'Nombre, descripción y tipo de uso son requeridos' });
        }

        const characterObjectId = new Types.ObjectId(characterId);
        const character = await Character.findById(characterObjectId);

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        const newFeature = new CustomFeature({
            character: characterObjectId,
            featureId: new Types.ObjectId().toString(),
            name,
            description,
            useType,
            state: 'ACTIVE'
        });

        const savedFeature = await newFeature.save();

        return res.status(201).json({ 
            message: 'Rasgo creado',
            feature: savedFeature 
        });
    } catch (e) {
        return res.status(500).json({ errMsg: 'Error al crear rasgo', error: e });
    }
}

// editFeature
export const editFeature = async (req: Request, res: Response) => {
    try {
        const { characterId, featureId } = req.params;
        const { name, description, useType } = req.body;

        if (!name || !description || !useType) {
            return res.status(400).json({ errMsg: 'Nombre, descripción y tipo de uso son requeridos' });
        }

        const characterObjectId = new Types.ObjectId(characterId);
        const featureObjectId = new Types.ObjectId(featureId);

        const character = await Character.findById(characterObjectId);
        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        const feature = await CustomFeature.findOne({ 
            character: characterObjectId, 
            featureId: featureObjectId 
        });

        if (!feature) {
            return res.status(404).json({ errMsg: 'Rasgo no encontrado' });
        }

        feature.name = name;
        feature.description = description;
        feature.useType = useType;

        const updatedFeature = await feature.save();

        return res.status(200).json({ 
            message: 'Rasgo actualizado',
            feature: updatedFeature 
        });
    } catch (e) {
        return res.status(500).json({ errMsg: 'Error al editar rasgo', error: e });
    }
}
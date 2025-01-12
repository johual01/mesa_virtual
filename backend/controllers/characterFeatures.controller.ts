import {Request, Response} from 'express';
import { Types } from 'mongoose';
import Character from '../models/Character';
import CharacterStatus from '../models/PersonaD20/CharacterStatus';
import CustomFeature from '../models/PersonaD20/CustomFeature';

// changeFeatureStatus
export const changeFeatureStatus = async (req: Request, res: Response) => {
    const { characterId, featureId } = req.params;
    const { status } = req.body;
    const characterObjectId = new Types.ObjectId(characterId);
    if (!status) return res.status(400).json({message: 'Estado es requerido'});
    if (status !== 'active' && status !== 'inactive') return res.status(400).json({message: 'Estado inválido'});
    const character = await Character.findById(characterObjectId);
    if (!character) return res.status(404).json({message: 'Personaje no encontrado'});
    const characterStatus = await CharacterStatus.findOne({characterId: characterObjectId});
    if (!characterStatus) return res.status(404).json({message: 'Estado del personaje no encontrado'});
    const feature = characterStatus.inactiveFeatures?.find(feature => feature == featureId);
    switch (status) {
        case 'active':
            if (!characterStatus.inactiveFeatures) return res.status(400).json({message: 'No hay rasgos inactivos'});
            if (!feature) return res.status(404).json({message: 'Rasgo no encontrado'});
            characterStatus.inactiveFeatures.filter((value) => value != featureId);
            await characterStatus.save();
            break;
        case 'inactive':
            if (feature) return res.status(404).json({message: 'El rasgo ya está inactivo'});
            if (!characterStatus.inactiveFeatures) characterStatus.inactiveFeatures = [];
            characterStatus.inactiveFeatures.push(featureId);
            await characterStatus.save();
            break;
    }
    return res.status(200).json({ success: true });
}

// addFeature
export const addFeature = async (req: Request, res: Response) => {
    const { characterId } = req.params;
    const { name, description, useType } = req.body;
    const characterObjectId = new Types.ObjectId(characterId);
    const character = await Character.findById(characterObjectId);
    if (!character) return res.status(404).json({message: 'Personaje no encontrado'});
    if (!name || !description || !useType) return res.status(400).json({message: 'Nombre, descripción y tipo de uso son requeridos'});
    const newFeature = new CustomFeature({
        character: characterObjectId,
        featureId: new Types.ObjectId().toString(),
        name,
        description,
        useType,
        state: 'ACTIVE'
    })
    await newFeature.save();
    return res.status(200).json({ success: true });
}

// editFeature
export const editFeature = async (req: Request, res: Response) => {
    const { characterId, featureId } = req.params;
    const { name, description, useType, state } = req.body;
    const characterObjectId = new Types.ObjectId(characterId);
    const featureObjectId = new Types.ObjectId(featureId);
    const character = await Character.findById(characterObjectId);
    if (!character) return res.status(404).json({message: 'Personaje no encontrado'});
    const feature = await CustomFeature.findOne({character: characterObjectId, featureId: featureObjectId});
    if (!feature) return res.status(404).json({message: 'Rasgo no encontrado'});
    if (!name || !description || !useType || !state) return res.status(400).json({message: 'Nombre, descripción, estado y tipo de uso son requeridos'});
    feature.name = name;
    feature.description = description;
    feature.useType = useType;
    feature.state = state;
    await feature.save();
    return res.status(200).json({ success: true });
}
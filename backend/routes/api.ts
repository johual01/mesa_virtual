import { Router } from "express";
import { validateToken } from "../jwt";
import * as Profile from "../controllers/profile.controller"
import * as Campaign from "../controllers/campaign.controller"
import * as Character from "../controllers/character.controller"
import * as CharacterFeatures from "../controllers/characterFeatures.controller"
import * as CharacterSpells from "../controllers/characterSpells.controller"
import * as CharacterInventory from "../controllers/characterInventory.controller"

const router = Router();

// rutas del perfil
router.get('/getProfile/:userId', validateToken, Profile.getProfile);
router.patch('/alterProfile/:userId', validateToken, Profile.alterProfile);

// rutas de las campañas
router.post('/getCampaigns', validateToken, Campaign.getCampaigns);
router.put('/createCampaign', validateToken, Campaign.createCampaign);
router.get('/getCampaign/:userId/:campaignId', validateToken, Campaign.openCampaign);
router.patch('/editCampaign/:campaignId', validateToken, Campaign.editCampaign);
router.post('/joinCampaign/:campaignId', validateToken, Campaign.joinCampaign);
router.put('/addRegister/:campaignId', validateToken, Campaign.addRegister);
router.patch('/updateRegister/:registerId', validateToken, Campaign.updateRegister);
router.delete('/deleteRegister/:registerId', validateToken, Campaign.deleteRegister);
router.post('/removeFromCampaign', validateToken, Campaign.removeFromCampaign);
router.post('/deleteCampana/:campaignId', validateToken, Campaign.deleteCampaign);

// rutas del personaje
router.get('/getCreateCharacterInfo', validateToken, Character.getCreateCharacterInfo);
router.post('/createCharacter', validateToken, Character.createCharacter);
router.post('/getCharacters', validateToken, Character.getCharacters);
router.get('/getCharacter/:characterId', validateToken, Character.getCharacter);
router.patch('/editCharacter/:characterId', validateToken, Character.editCharacter);
router.delete('/deleteCharacter/:characterId', validateToken, Character.deleteCharacter);
router.patch('/addCustomModifier/:characterId', validateToken, Character.addCustomModifier);
router.patch('/removeCustomModifier/:characterId/:modifierId', validateToken, Character.removeCustomModifier);
router.get('/getLevelUpInfo/:characterId', validateToken, Character.getLevelUpInfo);
router.patch('/levelUp/:characterId', validateToken, Character.levelUp);
router.patch('/updateXP/:characterId', validateToken, Character.updateXP);
router.patch('/updateMoney/:characterId', validateToken, Character.updateMoney);
router.patch('/updateInspiration/:characterId', validateToken, Character.updateInspiration);
router.get('/getSecondaryFeatures/:characterId', validateToken, Character.getSecondaryFeatures);
router.patch('/updateSelectedSecondaryFeatures/:characterId', validateToken, Character.updateSelectedSecondaryFeatures);
router.get('/getCharacterPDF/:characterId', validateToken, Character.getCharacterPDF);

// rutas de rasgos del personaje
router.post('/changeFeatureStatus/:characterId/:featureId', validateToken, CharacterFeatures.changeFeatureStatus);
router.post('/addCustomFeature/:characterId', validateToken, CharacterFeatures.addFeature);
router.patch('/editCustomFeature/:characterId/:featureId', validateToken, CharacterFeatures.editFeature);
router.delete('/deleteCustomFeature/:characterId/:featureId', validateToken, CharacterFeatures.deleteFeature);

// rutas de hechizos del personaje
router.get('/getCharacterSpells/:characterId', validateToken, CharacterSpells.getCharacterSpells);
router.post('/prepareSpell/:characterId/:spellId', validateToken, CharacterSpells.prepareSpell);
router.post('/clearPreparedSpells/:characterId', validateToken, CharacterSpells.clearPreparedSpells);
router.post('/addCustomSpell/:characterId', validateToken, CharacterSpells.addSpell);
router.patch('/editCustomSpell/:characterId/:spellId', validateToken, CharacterSpells.editSpell);
router.delete('/deleteCustomSpell/:characterId/:spellId', validateToken, CharacterSpells.deleteSpell);

// rutas de objetos del personaje
router.get('/getCharacterInventory/:characterId', validateToken, CharacterInventory.getCharacterInventory);
router.post('/addItem/:characterId', validateToken, CharacterInventory.addItem);
router.patch('/editItem/:characterId/:itemId', validateToken, CharacterInventory.editItem);
router.delete('/deleteItem/:characterId/:itemId', validateToken, CharacterInventory.deleteItem);

export default router;

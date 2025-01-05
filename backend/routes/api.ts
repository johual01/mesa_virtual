import { Router } from "express";
import { validateToken } from "../jwt";
import * as Profile from "../controllers/profile.controller"
import * as Campaign from "../controllers/campaign.controller"
import * as Character from "../controllers/character.controller"

const router = Router();

//rutas del perfil
router.get('/getProfile/:userId', validateToken, Profile.getProfile);
router.patch('/alterProfile/:userId', validateToken, Profile.alterProfile);

//rutas de las campañas
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

router.get('/getCharacters/:userId', validateToken, Character.getCharacters);
router.post('/createCharacter', validateToken, Character.createCharacter);
router.get('/getCharacter/:characterId', validateToken, Character.getCharacter);
router.patch('/editCharacter/:characterId', validateToken, Character.editCharacter);
router.delete('/deleteCharacter/:characterId', validateToken, Character.deleteCharacter);
router.patch('/addCustomModifier/:characterId', validateToken, Character.addCustomModifier);
router.patch('/removeCustomModifier/:characterId', validateToken, Character.removeCustomModifier);
router.patch('/levelUp/:characterId', validateToken, Character.levelUp);
router.patch('/updateXP/:characterId', validateToken, Character.updateXP);
router.get('/getCharacterPDF/:characterId', validateToken, Character.getCharacterPDF);
router.get('/getCharacterFeatures/:characterId', validateToken, Character.getCharacterFeatures);
router.post('/changeFeatureStatus/:characterId/:featureId', validateToken, Character.changeFeatureStatus);
router.post('/addCustomFeature/:characterId', validateToken, Character.addFeature);
router.patch('/editCustomFeature/:characterId/:featureId', validateToken, Character.editFeature);
router.delete('/deleteCustomFeature/:characterId/:featureId', validateToken, Character.deleteFeature);
router.get('/getCharacterSpells/:characterId', validateToken, Character.getCharacterSpells);
router.post('/prepareSpell/:characterId/:spellId', validateToken, Character.prepareSpell);
router.post('/clearPreparedSpells/:characterId', validateToken, Character.clearPreparedSpells);
router.post('/addCustomSpell/:characterId', validateToken, Character.addSpell);
router.patch('/editCustomSpell/:characterId/:spellId', validateToken, Character.editSpell);
router.delete('/deleteCustomSpell/:characterId/:spellId', validateToken, Character.deleteSpell);
router.get('/getCharacterInventory/:characterId', validateToken, Character.getCharacterInventory);
router.post('/addItem/:characterId', validateToken, Character.addItem);
router.patch('/editItem/:characterId/:itemId', validateToken, Character.editItem);
router.delete('/deleteItem/:characterId/:itemId', validateToken, Character.deleteItem);

export default router;

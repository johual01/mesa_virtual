import { Router } from "express";
import { validateToken } from "../jwt";
import * as Profile from "../controllers/profile.controller"
import * as Campanas from "../controllers/campaign.controller"

const router = Router();

//rutas del perfil
router.post('/profile', validateToken, Profile.profile);
router.post('/alterProfile', validateToken, Profile.alterProfile);

//rutas de las campañas
router.post('/campanas', validateToken, Campanas.getCampaign);
router.post('/createCampana', validateToken, Campanas.createCampaign);
router.post('/campana', validateToken, Campanas.openCampaign);
router.post('/editCampana', validateToken, Campanas.editCampaign);
router.post('/joinCampana', validateToken, Campanas.joinCampaign);
router.post('/addRegister', validateToken, Campanas.addRegister);
router.post('/updateRegister', validateToken, Campanas.updateRegister);
router.post('/deleteRegister', validateToken, Campanas.deleteRegister);
router.post('/removeFromCampana', validateToken, Campanas.removeFromCampaign);
router.post('/deleteCampana', validateToken, Campanas.deleteCampaign);

export default router;

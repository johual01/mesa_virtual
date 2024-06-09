import { Router } from "express";
import { validateToken } from "../jwt";
import * as Profile from "../controllers/profile.controller"
import * as Campanas from "../controllers/campanas.controller"

const router = Router();

//rutas del perfil
router.post('/profile', validateToken, Profile.profile);
router.post('/alterProfile', validateToken, Profile.alterProfile);

//rutas de las campañas
router.post('/campanas', validateToken, Campanas.getCampanas);
router.post('/createCampana', validateToken, Campanas.createCampana);
router.post('/campana', validateToken, Campanas.openCampana);
router.post('/checkNombreCampana', validateToken, Campanas.checkNombreCampana);
router.post('/editCampana', validateToken, Campanas.editCampana);
router.post('/joinCampana', validateToken, Campanas.joinCampana);
router.post('/addRegister', validateToken, Campanas.addRegister);
router.post('/updateRegister', validateToken, Campanas.updateRegister);
router.post('/deleteRegister', validateToken, Campanas.deleteRegister);
router.post('/removeFromCampana', validateToken, Campanas.removeFromCampana);
router.post('/deleteCampana', validateToken, Campanas.deleteCampana);

export default router;

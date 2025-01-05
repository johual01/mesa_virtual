import { Router } from "express";
import * as API from "../controllers/auth.controller"
import { refreshToken } from "../jwt";

const router = Router();

router.post('/login', API.login);
router.put('/signup', API.signup);
router.get('/refresh', refreshToken);
router.get('/logout', API.logout);

export default router;

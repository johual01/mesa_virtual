import { Router } from "express";
import * as API from "../controllers/auth.controller"
import { refreshToken } from "../jwt";

const router = Router();

router.post('/login', API.login);
router.post('/signup', API.signup);
router.get('/refresh', refreshToken);
router.get('/logout', API.logout);
router.post('/forgot-password', API.forgotPassword);
router.post('/reset-password', API.resetPassword);

export default router;

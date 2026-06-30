import { Router } from 'express';


import validate from '../../middleware/auth.validation.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import authController from './auth.controller.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);



export default router;
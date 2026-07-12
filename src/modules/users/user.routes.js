import { Router } from 'express';

import userController from './user.controller.js';
import authMiddleware from '../../middleware/authenticate.middleware.js';
import validate from '../../middleware/auth.validation.js';
import { updatedProfileSchema, changePasswordSchema } from './user.validation.js';

const router = Router();

router.get('/me', authMiddleware.authenticate, userController.getMe);

router.patch('/me', authMiddleware.authenticate ,validate(updatedProfileSchema), userController.updateProfile);
router.patch('/me/change-password', authMiddleware.authenticate, validate(changePasswordSchema), userController.changePassword);

router.delete('/me', authMiddleware.authenticate, userController.deleteProfile);

export default router;
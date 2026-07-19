import { Router } from "express";
import invitationController from "./invitation.controller.js";
import authenticateMiddleware from "../../middleware/authenticate.middleware.js";
import authorizeWorkspaceRole from "../../middleware/authorization.middleware.js";

const router = Router();

router.post('/:workspaceId', authenticateMiddleware.authenticate, authorizeWorkspaceRole("OWNER, ADMIN"), invitationController.createWorkspaceInvitations);

router.get('/', authenticateMiddleware.authenticate,);

router.post('/accept', authenticateMiddleware.authenticate, invitationController.acceptInvitation);

router.post('/decline', invitationController.declineInvitation);

export default router;
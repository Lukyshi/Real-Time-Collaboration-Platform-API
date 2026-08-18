import { Router } from "express";
import invitationController from "./invitation.controller.js";
import authenticateMiddleware from "../../middleware/authenticate.middleware.js";
import authorizeWorkspaceRole from "../../middleware/authorization.middleware.js";
import { updateValidate } from "../../middleware/auth.validation.js";
import { createWorkspaceInvitationSchema } from "./workspace.validation.js";

const router = Router();

router.get("/", invitationController.getInvitationByToken);

router.post("/decline", invitationController.declineInvitation);

router.post(
  "/accept",
  authenticateMiddleware.authenticate,
  invitationController.acceptInvitation,
);

router.post(
  "/:workspaceId",
  authenticateMiddleware.authenticate,
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  updateValidate(createWorkspaceInvitationSchema),
  invitationController.createWorkspaceInvitations,
);

export default router;

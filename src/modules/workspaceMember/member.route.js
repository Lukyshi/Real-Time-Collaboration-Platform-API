import { Router } from "express";
import memberController from "./member.controller.js";
import { addMemberSchema, updateMemberSchema } from "./member.validation.js";
import authMiddleware from "../../middleware/authenticate.middleware.js";
import authorizeWorkspaceRole from "../../middleware/authorization.middleware.js";
import { validate, updateValidate } from "../../middleware/auth.validation.js";

const router = Router();

router.use(authMiddleware.authenticate);

router.post('/:workspaceId/members', authorizeWorkspaceRole("OWNER", "ADMIN") ,validate(addMemberSchema), memberController.addMember);

router.get('/:workspaceId/members/:userId', memberController.getMember);

router.patch('/:workspaceId/members/:userId', authorizeWorkspaceRole("OWNER", "ADMIN"), updateValidate(updateMemberSchema), memberController.updateRole);

router.delete('/:workspaceId/members/:userId', authorizeWorkspaceRole("OWNER"), memberController.removeMember);

export default router;
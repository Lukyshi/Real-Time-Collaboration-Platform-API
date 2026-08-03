import workspaceController from "./workspace.controller.js";
import { Router } from "express";
import { createWorkspaceSchema, updateWorkspaceSchema } from "./workspace.validation.js";
import {validate, updateValidate} from "../../middleware/auth.validation.js";
import authMiddleware from "../../middleware/authenticate.middleware.js";
import authorizeWorkspaceRole from "../../middleware/authorization.middleware.js";

// task tom : log in account and creating workspace
const router = Router();

router.use(authMiddleware.authenticate);

router.post('/', validate(createWorkspaceSchema), workspaceController.createWorkspace);

router.get('/', workspaceController.getAllWorkspaces);

router.get('/:workspaceId', authorizeWorkspaceRole('OWNER', 'ADMIN', 'MEMBER'), workspaceController.getWorkspaceById);

router.patch('/:workspaceId', authorizeWorkspaceRole('OWNER', 'ADMIN'), updateValidate(updateWorkspaceSchema), workspaceController.updateWorkspace);

router.delete('/:workspaceId', authorizeWorkspaceRole('OWNER', 'ADMIN'), workspaceController.deleteWorkspace);

export default router;

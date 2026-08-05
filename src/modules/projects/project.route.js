import { Router } from 'express';
import projectController from './project.controller.js';
import { createProjectSchema, updateProjectSchema } from './project.validation.js';
import { validate, updateValidate } from '../../middleware/auth.validation.js';
import authenticateMiddleware from '../../middleware/authenticate.middleware.js';
import authorizeWorkspaceRole from '../../middleware/authorization.middleware.js';

const router = Router();

// untested
router.use(authenticateMiddleware.authenticate);

router.post('/workspace/:workspaceId/projects', updateValidate(createProjectSchema), authorizeWorkspaceRole("OWNER", "ADMIN"), projectController.createProject);
router.get('/workspace/:workspaceId/projects', projectController.getProjects);
router.get('/workspace/:workspaceId/projects/:projectId', projectController.getProjectById);
router.patch('/workspace/:workspaceId/projects/:projectId', updateValidate(updateProjectSchema), authorizeWorkspaceRole("OWNER", "ADMIN"), projectController.updateProject);
router.delete('/workspace/:workspaceId/projects/:projectId', authorizeWorkspaceRole("OWNER", "ADMIN"), projectController.deleteProject);

export default router;
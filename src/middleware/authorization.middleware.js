import { prisma } from '../config/prisma.js';

const authorizeWorkspaceRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {

      let workspaceId = req.params.workspaceId;
      const userId = req.user.id;

      // ill create this middleware logic for now but ill imrpove it later to be more efficient and less redundant
      

      // If workspaceId hindi available sa params, try to get it from projectId
      if(!workspaceId && req.params.projectId) {
        const project = await prisma.project.findUnique({
          where : { id : req.params.projectId },
          select : { workspaceId : true }
        });

        if(!project) {
          return res.status(404).json({
            success : false,
            message : 'Project not found'
          });
        }

        workspaceId = project.workspaceId;

      }

      // If workspaceId hindi available sa params, try to get it from taskId
      if(!workspaceId && req.params.taskId) {
        const task = await prisma.task.findUnique({
          where : { id : req.params.taskId },
          select : {
            project : {
              select : {
                workspaceId : true
              },
            },
          },
        });

        if(!task) {
          return res.status(404).json({
            success : false,
            message : 'Task not found'
          });
        }

        workspaceId = task.project.workspaceId;

      }
      
      if(!workspaceId) {
        return res.status(400).json({
          success : false,
          message : 'WorkspaceId could not be determined from request parameters'
        });
      }

      const membership = await prisma.workspaceMember.findUnique({
        where : { 
          workspaceId_userId : { 
          workspaceId, 
          userId
        } 
      }
      });

      // validate membership
      if(!membership) {
        return res.status(403).json({
          success : false,
          message : 'Not a member of this workspace'
        })
      }

      // validate role
      if(!allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          success : false,
          message : 'You do not have permission to perform this action'
        });
      }

      req.workspaceMember = membership;
      req.workspaceId = workspaceId;

      next();
    }catch(error) {
      next(error);
    }
  };
};



export default authorizeWorkspaceRole;


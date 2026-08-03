import { prisma } from '../config/prisma.js';

const authorizeWorkspaceRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = req.user.id;

      const membership = await prisma.workspaceMember.findUnique({
        where : { workspaceId_userId : { workspaceId, userId} }
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

      next();
    }catch(error) {
      next(error);
    }
  };
};



export default authorizeWorkspaceRole;


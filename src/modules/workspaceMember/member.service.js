import { prisma } from '../../config/prisma.js';

const addMember = async (workspaceId, userId, role = 'MEMBER') => {
  const member = await prisma.workspaceMember.create({
    data : {
      workspaceId,
      userId,
      role,
    },
  });

  return member;

};

const getMember = async (workspaceId, userId) => {
  const member = await prisma.workspaceMember.findUnique({
    where : {
      workspaceId_userId : {
        workspaceId,
        userId,
      },
    },
  });

  return member;

};

const updateRole = async (workspaceId, userId, role) => {
  const updatedRole = await prisma.workspaceMember.update({
    where : {
      workspaceId_userId : {
        workspaceId,
        userId
      },
    },

    data : {
      role
    },
  });
};

const removeMember = async (workspaceId, userId) => {
  const removed = await prisma.workspaceMember.delete({
    where : {
      workspaceId_userId : {
        workspaceId,
        userId
      }
    }
  });
};

export default {
  addMember,
  getMember,
  updateRole,
  removeMember
}
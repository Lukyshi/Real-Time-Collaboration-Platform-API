import { prisma } from '../../config/prisma.js';


const createWorkspace = async (data, userId) => {

  try {
    const workspaceCreated = await prisma.$transaction(async (tx) => {

    const workspace = await tx.workspace.create({
      data : {
        name : data.name,
        description : data.description,
        ownerId : data.userId
      },
    });

    await tx.workspaceMember.create({
      data : {
        workspaceId : workspace.id,
        userId: data.userId,
        role : "OWNER",
      },
    });

    return workspace;
    
  });

  return workspaceCreated;
  
  }catch(error) {
    throw new Error('Failed to create workspace');
  }
};

// gets all workspaces belonging to the current user.
const getWorkspaces = async (userId) => {
  const workspaces = await prisma.workspace.findMany({
    where : {
      members : {
        some : {
          userId,
        },
      },
    },
  });

  return workspaces;

};

const getWorkspaceById = async (id, userId) => {
  const workspace = await prisma.workspace.findFirst({
    where : { 
      id,
      members : {
        some : {
          userId,
        },
      },
    },

    select : {
      id : true,
      name : true,
      description : true,
      ownerId : true,
      createdAt : true,
      updatedAt : true
    }
  }); 

  if(!workspace) {
    throw new Error('Workspace not found');
  }

  return workspace;

};

const updateWorkspace = async (id, name, description) => {
  const updateWorkspace = await prisma.workspace.update({
    where : { id },
    data : {
      name,
      description,
    },
  });

  return updateWorkspace;
  
}

const deleteWorkspace = async (id) => {
  const deletedWorkspace = await prisma.workspace.delete({
    where : { id }
  });

  if(!deletedWorkspace) {
    throw new Error('Workspace not found');
  }

  return deletedWorkspace;

};

export default {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace
}









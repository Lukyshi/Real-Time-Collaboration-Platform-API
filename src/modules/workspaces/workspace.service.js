import { prisma } from '../../config/prisma.js';


const createWorkspace = async (data, userId) => {

  const workspaceCreated = await prisma.$transaction(async (tx) => {

    const workspace = await tx.workspace.create({
      data : {
        name : data.name,
        description : data.description,
        ownerId : userId
      },
    });

    await tx.workspaceMember.create({
      data : {
        workspaceId : workspace.id,
        userId,
        role : "OWNER",
      },
    });

    return workspace;
    
  });

  return workspaceCreated;

};

// gets all workspaces belonging to the current user.
const getWorkspaces = async () => {
  const workspaces = await prisma.workspace.findMany({
    where : {
      members : {
        some : {
          userId : req.user.id
        },
      },
    },
  });

  return workspaces;

};

const getWorkspaceById = async (id) => {
  const workspace = await prisma.workspace.findUnique({
    where : { id },
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

const updateWorkspace = async (id, data) => {
  const updateWorkspace = await prisma.workspace.update({
    where : { id },
    data : {
      name : data.name,
      description : data.description,
      updatedAt : true
    }
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









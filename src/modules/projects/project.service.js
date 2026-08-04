import { prisma } from "../../prisma.js";

const createProject = async (workspaceId, createdById, data) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) throw new Error("Workspace not found");

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: createdById,
      },
    },
  });

  if (!member) throw new Error("User is not a member of the workspace");

  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      workspaceId,
      createdById,
    },
  });
};

const getProject = async (userId) => {
  const projects = await prisma.project.findMany({
    where: {
      workspace: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });

  return projects;
};

const getProjectById = async (id, userId) => {
  const project = await prisma.project.findFirst({
    where: {
      id,
      workspace: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    select: {
      name: true,
      description: true,
      workspaceId: true,
      createdById: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return project;
};

const updateProject = async (id, data) => {
  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) throw new Error("Project not found");

  return prisma.project.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

const deleteProject = async (id) => {
  const projectExist = await prisma.project.findUnique({
    where: { id },
  });

  if (!projectExist) throw new Error("Project not found");

  return await prisma.project.delete({
    where: { id },
  });
};

export default {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  deleteProject,
};

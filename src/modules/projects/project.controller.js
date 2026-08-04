import projectService from "./project.service.js";

const createProject = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const createdById = req.user.id;
    const { name, description } = req.body;

    const project = await projectService.createProject(
      workspaceId,
      createdById,
      {
        name,
        description,
      },
    );

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const project = await projectService.getProject(userId);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await projectService.getProjectById(projectId, userId);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = await projectService.updateProject(projectId, {
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    await projectService.deleteProject(projectId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

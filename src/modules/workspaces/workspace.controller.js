import workspaceService  from "./workspace.service.js";

const createWorkspace = async (req, res, next) => {
  try {

    const userId  = req.user.id;
    const { name, description } = req.body; 
    
    const workspace = await workspaceService.createWorkspace({name, description, userId});

    res.status(201).json({
      success : true,
      data : workspace
    });
  }catch (error) {
    next(error)
  }
}

const getAllWorkspaces = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const workspace = await workspaceService.getWorkspaces(userId);

    res.status(200).json({
      success : true,
      data : workspace
    });
  }catch(error) {
    next(error);
  }
}

const getWorkspaceById = async (req, res, next) => {
  try {
    const id = req.params.workspaceId;
    const userId = req.user.id;

    const workspace = await workspaceService.getWorkspaceById(id, userId);

    res.status(200).json({
      success : true,
      data : workspace
    });
  }catch(error) {
    next(error);
  }
}

const updateWorkspace = async (req, res, next) => {
  try {
    const id = req.params.workspaceId;
    const { name, description } = req.body;

    const workspace = await workspaceService.updateWorkspace(id, name, description);

    res.status(200).json({
      success : true,
      data : workspace
    });
  }catch(error) {
    next(error);
  }
}

// untested
const deleteWorkspace = async (req, res, next) => {
  try {
    const id = req.params.workspaceId;

    const workspace = await workspaceService.deleteWorkspace(id);

    res.status(200).json({
      success : true,
      message : 'Workspace deleted'
    });
  }catch(error) {
    next(error);
  }
};

export default {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace
}
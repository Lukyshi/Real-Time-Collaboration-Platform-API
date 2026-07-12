import workspaceService  from "./workspace.service";

const createWorkspace = async (req, res, next) => {
  try {
    const workspace = req.body;
    const userId = req.user.id;
    
    const workspace = await workspaceService.createWorkspace(workspace, userId);

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
    const workspace = await workspaceService.getWorkspaces();

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
    const id = Number(req.params.id);

    const workspace = await workspaceService.getWorkspaceById(id);

    req.status(200).json({
      success : true,
      data : workspace
    });
  }catch(error) {
    next(error);
  }
}

const updateWorkspace = async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const worspace = await workspaceService.updateWorkspace(id, body);

    req.status(200).json({
      success : true,
      data : worspace
    });
  }catch(error) {
    next(error);
  }
}

const deleteWorkspace = async (req, res, next) => {
  try {
    const id = req.params.id;

    const workspace = await workspaceService.deleteWorkspace(id);

    req.status(200).json({
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
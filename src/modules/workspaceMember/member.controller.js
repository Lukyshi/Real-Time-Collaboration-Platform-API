import memberService from "./member.service.js";

const addMember = async (req, res, next) => {

  try {
    const { workspaceId } = req.params;
    const { userId, role } = req.body;

    const member = await memberService.addMember(workspaceId, userId, role);

    return res.status(201).json({
      success : true,
      data : member
    });

  }catch(error) {
    next(error);
  }

};


const getMember = async (req, res, next) => {
  try {
    const { workspaceId, userId } = req.params;

    const member = await memberService.getMember(workspaceId, userId);

    if(!member) {
      return res.status(404).json({
        success : false,
        message : 'member not found'
      });
    }

    return res.status(200).json({
      success : true,
      data : member
    });
  }catch(error) {
    next(error);
  }
};


const updateRole = async (req, res, next) => {
  try {
    const { workspaceId, userId } = req.params;
    const { role } = req.body;

    const member = await memberService.updateRole(workspaceId, userId, role);

    return res.status(200).json({
      success : true,
      data : member
    });

  }catch(error) {
    next(error);
  }
};


const removeMember = async (req, res, next) => {
  try {
     const { workspaceId, userId } = req.params;

     const member = await memberService.removeMember(workspaceId, userId);

     if(!member) {
      return res.status(404).json({
        success : false,
        message : 'member doesnt exist'
      });
     }

     return res.status(200).json({
      success : true,
      message : 'member has been removed'
     });

  }catch(error) {
    next(error);
  }
};

export default {
  addMember,
  getMember,
  updateRole,
  removeMember
}
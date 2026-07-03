import userService from './user.service.js';

const getMe = async (req, res, next) => {

  try {
    const userId = req.user.id;
    const user = await userService.getMe(userId);

    res.status(200).json({
      success : true,
      data : user,
    });

  }catch(error) {
    next(error);
  }
};


const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userData = req.body;

    const updatedUser = await userService.updateProfile(userId, userData);

    if(!updatedUser) {
      return res.status(404).json({
        success : false, 
        message : "User not found"
      });
    };

    res.status(200).json({
      success : true,
      data : updatedUser,
    });

  }catch(error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {

  try{
    const userId = req.user.id;
    const { oldPass, newPass } = req.body;

    await authService.changePassword(userId, oldPass, newPass);

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  }catch(error) {
    next(error);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const deletedUser = await userService.deleteProfile(userId);

    res.status(200).json({
      success : true,
      message : "User profile deleted successfully"
    });

  }catch(error) {
    next(error);
  }
};

export default {
  getMe, 
  updateProfile,
  changePassword,
  deleteProfile
}
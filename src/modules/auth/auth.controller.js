import authService from "./auth.service";

const register = async (req, res, next) => {
  try { 
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  }catch(error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);

    res.status(200).json({
      success : true,
      data: user
    });
  }catch(error){
    next(error);
  }
};

const refreshToken = async (req, res, next) => {

  try{
    const token = req.cookies.refreshToken;

    const result = await authService.refreshToken(token);

    res.status(200).json({
      success: true,
      data: result
    });
  }catch(error) {
    next(error);
  }
};


const logout = async (req, res, next) => {

  try{
    const token = req.cookies.refreshToken;

    const result = await authService.logout(token);

    res.status(200).json({
      success: true,
      data: result
    });
  }catch(error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {

  try{

    const userId = req.user.id; // if i used req.user.id only user can update 
    const userData = req.body;

    const updatedProfile = await authService.updateProfile(userId, userData);

    if(!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProfile
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

export default {
  register,
  login,
  refreshToken,
  logout,
  updateProfile,
  changePassword
}
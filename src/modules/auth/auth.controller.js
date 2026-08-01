import { success } from "zod";
import authService from "./auth.service.js";

const register = async (req, res, next) => {
  try { 

    //
    const { email, password, name, inviteToken } = req.body;

    if ( !email || !password || !name ) {
      return res.status(404).json({
        success : false,
        message : "Email, password, and name are required",
      });
    }

    const user = await authService.register({email, password, name, inviteToken});

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

// Store refresh token in an HTTP-only cookie so the client can send it back
// automatically when requesting a new access token
    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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

    const result = await authService.refresh(token);

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
  changePassword
}
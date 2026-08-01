import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyToken } 
from '../../utils/jwt.js';
import invitationService from '../workspace-invitation/invitation.service.js';


const register = async ({ email, password, name, inviteToken }) => {

  const existingUser = await prisma.user.findUnique({
    where : { email }
  });

  if(existingUser) {
    throw new Error('user already exist')
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data : {
      email,
      passwordHash : hashedPassword,
      name,
      isVerified: false
    }
  });

  let invitationResult = null;
  if(inviteToken) {
    try {
      invitationResult = await invitationService.acceptInvitation(inviteToken, user);
    } catch (err) {
      console.log("Failed to auto-accept invitation after signup:", err.message);
    }
  }
  
  return {
    id : user.id,
    email : user.email,
    name : user.name
  };
};

const login = async ({email, password}) => {

  if(!email || !password) {
    throw new Error('email and password are required')
  }

  const user = await prisma.user.findUnique({
    where : { email }
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401
    throw error
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if(!isValid) {
    const error = new Error('Invalid credentials');
    error.status = 401
    throw error;
  }

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.refreshToken.create({
    data : {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 100)
    }
  });

  return {
    token,
    refreshToken,
    user : {
      id : user.id,
      email : user.email,
      name : user.name
    }
  };
};


const refresh = async (token) => {
  
  try {

  if (!token) throw new Error('No token');

  const stored = await prisma.refreshToken.findUnique({
    where : { token }
  });

  if (!stored) throw new Error("Invalid refresh token");
  
  const decoded = verifyRefreshToken(token);


  const accessToken = generateAccessToken({
    id: decoded.id
  });

  return {
    accessToken
  };

  }catch(error) {
    throw new Error('Invalid refresh token');
  }

};

const logout = async (token) => {
  await prisma.refreshToken.deleteMany({
    where: { token }
  });
  return true;
};


// later ill add forgot password
// and reset password

export default {
  register,
  login,
  refresh,
  logout,
}



/*
Authentication
Users
Workspaces
Projects
Tasks
*/


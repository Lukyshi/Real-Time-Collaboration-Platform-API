import prisma from '../../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyToken } 
from '../../utils/jwt.js';


const register = async ({ email, password, name }) => {

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

  if (!token) throw new Error('No token');

  const stored = await prisma.findUnique({
    where : { token }
  });

  if (!stored) throw new Error("Invalid refresh token");

  const decoded = verifyRefreshToken(token);

  const accessToken = generateAccessToken({id: decoded.id});

  return {
    accessToken
  };
};

const logout = async (token) => {
  await prisma.refreshToken.deleteMany({
    where: { token }
  });
  return true;
};


// ill split this later to my user service
const updateProfile = async (userId, data) => {
  return prisma.user.update({
    where : { id: userId },
    data
  });
};

const changePassword = async (userId, oldPass, newPass) => {
  const user = await prisma.user.findUnique({
    where : { id : userId }
  });

  const valid = await comparePassword(oldPass, user.passwordHash);

  if(!valid) throw new Error ('Invalid password');

  const hashed = await hashedPassword(newPass);

  await prisma.user.update({
    where : { id: userId },
    data : {
      passwordHash: hashed,
    },
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
  updateProfile,
  changePassword
}



/*
Authentication
Users
Workspaces
Projects
Tasks
*/


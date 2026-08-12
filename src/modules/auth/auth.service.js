import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyToken } 
from '../../utils/jwt.js';
import verify from '../emailVerification/emailVerification.service.js';
import e from 'express';

// what if in register they dont follow @gmail.com? 
// task tom : test regitser and login if they successful verify
// fix : if its fail to regsiter it shouldnt be save in db
const register = async ({ email, password, name }) => {

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where : { email : normalizedEmail }
  });

  if(existingUser) {
    throw new Error('user already exist')
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data : {
      email : normalizedEmail,
      passwordHash : hashedPassword,
      name,
      isVerified: false
    }
  });

  await verify.createVerification(user);

  return {
    id : user.id,
    email : user.email,
    name : user.name,
    isVerified : user.isVerified
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

  if(!user.isVerified) {
    const error = new Error(
      "Please verify your email before logging in"
    );

    error.code = "EMAIL_NOT_VERIFIED";

    throw error;
  }

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.refreshToken.create({
    data : {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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

// untested
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

// need to fix
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


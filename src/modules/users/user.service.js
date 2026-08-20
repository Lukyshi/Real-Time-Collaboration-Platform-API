import { prisma } from '../../config/prisma.js';
import { hashedPassword, comparePassword } from '../../utils/password.js';


const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select : {
      id: true,
      name: true,
      email: true,
      isVerified: true,
      createdAt: true, 
      updatedAt: true
    },
  });

  return user;
};

const updateProfile = async (userId, data) => {
  const allowedData = {
    name : data.name
  }

  return await prisma.user.update({
    where : { id: userId },
    data: allowedData,
    select : {
      id: true,
      name: true,
      email: true,
      createdAt : true,
      updatedAt : true
    },
  });
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where : { id : userId }
  });
  
  const valid = await comparePassword(oldPassword, user.passwordHash);

  if(!valid) throw new Error ('Invalid password');

  const newPasswordHashed = await hashedPassword(newPassword);

  await prisma.user.update({
    where : { id: userId },
    data : {
      passwordHash: newPasswordHashed,
    },
  });

  return true;
  
};

const deleteProfile = async (userId) => {
  return await prisma.user.delete({
    where : { id: userId },
  });
};

// later ill add patch me/avatar

export default {
  getMe,
  updateProfile,
  changePassword,
  deleteProfile
}
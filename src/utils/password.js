import bycrypt from 'bcrypt';

export const hashedPassword = async(password) => {
  return bycrypt.hash(password, 10);
};

export const comparePassword = async(hashedPassword, newPass) => {
  return bycrypt.compare(hashedPassword, newPass);
};
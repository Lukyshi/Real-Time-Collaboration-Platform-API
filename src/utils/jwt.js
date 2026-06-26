import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {

  return jwt.sign(
    { id : user.id, email : user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {id: user.id},
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d"}
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN);
};



import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },

    process.env.JWT_ACCESS_KEY,
    { expiresIn: "10m" }
  );
};
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },

    process.env.JWT_REFRESH_KEY,
    { expiresIn: "365d" }
  );
};

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/autoGenerateToken.js";

let refreshTokens = [];

const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      // Save to database after 5s
      const user = await newUser.save();
      const { isAdmin, password, ...filterInfo } = user._doc;
      setTimeout(async () => {
        return res.status(200).json(filterInfo);
      }, 5000);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  // LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res.status(401).json({ message: "Wrong username!" });
      }
      const validPassword = await bcrypt.compare(req.body.password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: "Wrong password!" });
      }

      if (user && validPassword) {
        // use jsonwebtoken in here

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        refreshTokens.push(refreshToken);
        // store refreshToken to cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // true if deloy to production
          sameSize: "strict",
        });

        const { password, ...orders } = user._doc;
        setTimeout(async () => {
          return res.status(200).json({ ...orders, accessToken });
        }, 2000);
      }
    } catch (error) {
      console.log("create new user failed");
      return res.status(500).json(error);
    }
  },
  // GET REFRESH TOKEN
  getRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "You're not authenticated" });
    if (!refreshTokens.includes(refreshToken))
      return res.status(401).json({ message: "Refresh Token is not valid" });
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
      if (err) {
        console.log(err);
      }

      // Delete current refresh token have been logon
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Create new access and refresh token
      const newAccessToken = await generateAccessToken(user);
      const newRefreshToken = await generateRefreshToken(user);

      refreshTokens.push(newAccessToken);

      // store refreshToken to cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false, // true if deloy to production
        sameSize: "strict",
      });

      // return access token to client
      return res.status(200).json({ accessToken: newAccessToken });
    });
  },
  // LOGOUT
  logoutUser: async (req, res) => {
    // Clear refresh token from cookie
    res.clearCookie("refreshToken");

    // delete refresh token from refreshTokens array
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);

    return res.status(200).json({ message: "Logout successfully!" });
  },
};

export default authController;

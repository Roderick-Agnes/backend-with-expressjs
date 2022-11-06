import express from "express";
import authController from "../controllers/authController.js";
import middleWare from "../middleware/middleWare.js";

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", middleWare.verifyToken, authController.getRefreshToken);
router.post("/logout", middleWare.verifyToken, authController.logoutUser);

export default router;

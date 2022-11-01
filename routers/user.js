import express from "express";
import userController from "../controllers/userController.js";
import middleWare from "../middleware/middleWare.js";

const router = express.Router();

router.get("/", middleWare.verifyToken, userController.getAllUsers);

router.delete("/:id", middleWare.verifyTokenAndAdminAuth, userController.deleteUser);

export default router;

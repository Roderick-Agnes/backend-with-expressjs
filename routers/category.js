import express from "express";
import middleWare from "../middleware/middleWare.js";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", middleWare.verifyToken, categoryController.getAllCategories);

export default router;

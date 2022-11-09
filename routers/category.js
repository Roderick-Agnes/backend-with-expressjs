import express from "express";
import middleWare from "../middleware/middleWare.js";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

// GET ALL CATEGORIES
router.get("/", categoryController.getAllCategories);

// CREATE NEW CATEGORY
router.post("/", middleWare.verifyTokenAndAdmin, categoryController.addCategory);

// UPDATE CATEGORY BY ID
router.put("/:id", middleWare.verifyTokenAndAdmin, categoryController.updateCategory);

// DELETE CATEGORY BY ID
router.delete(
  "/:id",
  middleWare.verifyTokenAndAdmin,
  categoryController.deleteCategoryById
);

export default router;

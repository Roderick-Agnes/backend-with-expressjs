import express from "express";
import middleWare from "../middleware/middleWare.js";
import productController from "../controllers/productController.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

// GET PRODUCT BY ID
router.get("/find/:id", productController.getProductById);

// GET PRODUCTS BY CATEGORY ID
router.get("/category/:id", productController.getProductsByCategoryId);

// CREATE NEW CATEGORY
router.post("/", middleWare.verifyTokenAndAdmin, productController.addProduct);

// UPDATE CATEGORY BY ID
router.put("/:id", middleWare.verifyTokenAndAdmin, productController.updateProduct);

// DELETE CATEGORY BY ID
router.delete("/:id", middleWare.verifyTokenAndAdmin, productController.deleteProduct);

export default router;

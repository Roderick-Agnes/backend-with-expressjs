import express from "express";
import middleWare from "../middleware/middleWare.js";
import cartController from "../controllers/cartController.js";

const router = express.Router();

// CREATE NEW CART
router.post("/", middleWare.verifyTokenAndAuthorization, cartController.addCart);

// UPDATE CART
router.put("/:id", middleWare.verifyTokenAndAuthorization, cartController.updateCart);

// DELETE CART
router.delete("/:id", middleWare.verifyTokenAndAuthorization, cartController.deleteCart);

// GET CART BY USER ID
router.get(
  "/find/:userId",
  middleWare.verifyTokenAndAuthorization,
  cartController.getCart
);

// GET ALL CARTS
router.get("/", middleWare.verifyTokenAndAdmin, cartController.getAllCarts);

export default router;

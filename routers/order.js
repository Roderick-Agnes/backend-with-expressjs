import express from "express";
import middleWare from "../middleware/middleWare.js";
import orderController from "../controllers/orderController.js";

const router = express.Router();

// GET USER ORDER
router.get(
  "/find/:userId",
  middleWare.verifyTokenAndAuthorization,
  orderController.getOrder
);

// GET ALL ORDERS
router.get("/", middleWare.verifyTokenAndAdmin, orderController.getAllOrders);

// CREATE NEW ORDER
router.post("/", middleWare.verifyTokenAndAdmin, orderController.addOrder);

// UPDATE ORDER BY ID
router.put("/:id", middleWare.verifyTokenAndAdmin, orderController.updateOrder);

// DELETE ORDER BY ID
router.delete("/:id", middleWare.verifyTokenAndAdmin, orderController.deleteOrder);

export default router;

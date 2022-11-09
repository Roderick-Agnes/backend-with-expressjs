import express from "express";
import middleWare from "../middleware/middleWare.js";
import collectionController from "../controllers/collectionController.js";

const router = express.Router();

// GET ALL COLLECTIONS
router.get("/", collectionController.getAllCollections);

// CREATE NEW COLLECTION
router.post("/", middleWare.verifyTokenAndAdmin, collectionController.addCollection);

// UPDATE COLLECTION BY ID
router.put("/:id", middleWare.verifyTokenAndAdmin, collectionController.updateCollection);

// DELETE COLLECTION BY ID
router.delete(
  "/:id",
  middleWare.verifyTokenAndAdmin,
  collectionController.deleteCollectionById
);

export default router;

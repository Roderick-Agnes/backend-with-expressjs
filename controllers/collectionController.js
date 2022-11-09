import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
import productController from "./productController.js";

const collectionController = {
  // GET ALL COLLECTIONS
  getAllCollections: async (req, res) => {
    try {
      const collections = await Collection.find();
      if (!collections) {
        return res.status(404).json({ message: "No collections found" });
      }
      const productsForYou = await productController.getRandomProducts(30);
      const hotDeals = await productController.getHotDeals(30);
      const cheapProducts = await productController.getCheapProducts(30);
      const newProducts = await productController.getNewProducts(30);

      // PUSH PRODUCTS TO COLLECTION
      collections.map((item) => {
        if (item.title === "Dành cho bạn") {
          item.products = [];
          item.products = productsForYou;
          // && item.products.splice(0, item.products.length);
        }
        if (item.title === "Deal siêu hot") {
          item.products = [];
          item.products = hotDeals;
        }
        if (item.title === "Rẻ vô đối") {
          item.products = [];
          item.products = cheapProducts;
        }
        if (item.title === "Hàng mới") {
          item.products = [];
          item.products = newProducts;
        }

        return item;
      });
      console.log("newArr: ", collections[0].products);
      return res.status(200).json(collections);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // CREATE NEW COLLECTION
  addCollection: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(404).json({ message: "Collection required" });
      }

      // Create new collection
      const newCollection = new Collection({
        title: req.body.title,
        thumbnail_icon: req.body.thumbnail_icon,
        products: req.body.products,
      });

      // Save collection
      const collection = await newCollection.save();

      return res.status(200).json(collection);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // UPDATE COLLECTION
  updateCollection: async (req, res) => {
    try {
      const collection = await Collection.findByIdAndUpdate(
        req.params.id,
        {
          // $set: req.body,
          $set: {
            title: req.body.title,
            thumbnail_icon: req.body.thumbnail_icon,
            products: req.body.products,
          },
        },
        { new: true }
      );

      if (!collection) {
        return res.status(404).json({ message: "Collection id is not found" });
      }

      return res
        .status(200)
        .json({ message: "Update collection successfully", collection });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // DELETE CATEGORY BY ID
  deleteCollectionById: async (req, res) => {
    try {
      const collection = await Collection.findById(req.params.id);

      if (!collection) {
        return res.status(404).json({ message: "Collection is not found" });
      }

      await Collection.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default collectionController;

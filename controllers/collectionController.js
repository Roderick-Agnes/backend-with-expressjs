import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
import productController from "./productController.js";

const collectionController = {
  // GET COLLECTIONS BY ID
  getCollectionById: async (req, res) => {
    const start = req.query?._start || 0;
    const limit = req.query?._limit || 30;
    const id = req.params?.id;
    console.log(id);
    const collection = await Collection.findById(id);
    if (!collection)
      return res.status(404).json({ message: `Not found collection with id: ${id}` });

    let products;
    if (collection.title === "Dành cho bạn") {
      products = await productController.getRandomProducts(start, limit);
    }
    if (collection.title === "Deal siêu hot") {
      products = await productController.getHotDeals(start, limit);
    }
    if (collection.title === "Rẻ vô đối") {
      products = await productController.getCheapProducts(start, limit);
    }
    if (collection.title === "Hàng mới") {
      products = await productController.getNewProducts(start, limit);
    }
    collection.products = []; // RESET PRODUCT LIST
    collection.products = products;

    // COUNTER TOTAL PRODUCTS IN THIS COLLECTION
    // const count = await Collection.count();
    const pagination = {
      _page: start / limit + 1,
      _limit: limit,
      _total: 90,
    };
    return res.status(200).json({ data: collection, pagination });
  },
  // GET ALL COLLECTIONS
  getAllCollections: async (req, res) => {
    try {
      const start = req.query?._start || 0;
      const limit = req.query?._limit || 30;
      const collectionLimit = req.query?._collectionLimit || 8;

      const collections = await Collection.find().limit(collectionLimit);

      if (!collections) {
        return res.status(404).json({ message: "No collections found" });
      }
      const productsForYou = await productController.getRandomProducts(start, limit);

      const hotDeals = await productController.getHotDeals(start, limit);

      const cheapProducts = await productController.getCheapProducts(start, limit);

      const newProducts = await productController.getNewProducts(start, limit);

      // PUSH PRODUCTS TO COLLECTION
      collections.map((item) => {
        if (item.title === "Dành cho bạn") {
          item.products = [];
          item.products = productsForYou;
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
      const pagination = {
        _page: start / limit + 1,
        _limit: limit,
        _total: 90,
      };

      return res.status(200).json({ data: collections, pagination });
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

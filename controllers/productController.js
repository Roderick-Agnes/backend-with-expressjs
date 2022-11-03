import Product from "../models/Product.js";

const productController = {
  // GET ALL PRODUCTS
  getAllProducts: async (req, res) => {
    const _limit = req.query._limit;
    // const _sort = req.query._sort; // boolean: true if ascending, false if descending

    try {
      const products = _limit
        ? await Product.find().limit(_limit)
        : (await Product.find().limit(30)) || (await Product.find());
      if (!products) {
        return res.status(404).json({ message: "No products found" });
      }
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // CREATE NEW PRODUCT
  addProduct: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(404).json({ message: "Product required" });
      }

      // Create new product
      const newProduct = new Product({
        title: req.body.title,
        thumbnail: req.body.thumbnail,
        categoryId: req.body.categoryId,
        quantityInWarehouse: req.body.quantityInWarehouse,
        rootPrice: req.body.rootPrice || 0,
        information: req.body.information || "No information available",
        description: req.body.description || "No description available",
      });

      // Save product
      const product = await newProduct.save();

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // UPDATE PRODUCT
  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            categoryId: req.body.categoryId,
            quantityInWarehouse: req.body.quantityInWarehouse,
            rootPrice: req.body.rootPrice || 0,
            information: req.body.information || "No information available",
            description: req.body.description || "No description available",
          },
        },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product id is not found" });
      }

      return res.status(200).json({ message: "Update product successfully", product });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // DELETE PRODUCT BY ID
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product is not found" });
      }

      await Product.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default productController;

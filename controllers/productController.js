import Category from "../models/Category.js";
import Product from "../models/Product.js";
const date = new Date();
const productController = {
  // GET NEW PRODUCTS
  getNewProducts: async (start, size) => {
    const products = await Product.find({
      createdAt: {
        $lt: new Date(),
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)), // check product was created 7 days ago
      },
    })
      .limit(size)
      .skip(start);
    // console.log(products);
    return products;
  },
  // GET CHEAP PRODUCTS
  getCheapProducts: async (start, size) => {
    //[{ $skip: start }],
    const products = await Product.find({
      $or: [{ salePrice: { $lte: 100000 } }, { rootPrice: { $lte: 100000 } }],
    })
      .limit(size)
      .skip(start)
      .sort({ createdAt: -1 });
    return products;
  },
  // GET HOT DEALS
  getHotDeals: async (start, size) => {
    const products = await Product.find({
      "quantitySold.value": { $gt: 100 },
    })
      .limit(size)
      .skip(start)
      .sort({ createdAt: -1 });
    return products;
  },
  // GET RANDOM LIST PRODUCTS
  getRandomProducts: async (start, size) => {
    const products = await Product.find().limit(size).skip(start).sort({ createdAt: -1 });
    return products;
  },
  // GET ALL PRODUCTS
  getAllProducts: async (req, res) => {
    const _limit = req.query._limit;

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

  // GET PRODUCT BY ID
  getProductById: async (req, res) => {
    const product = await Product.aggregate([
      { $match: { id: req.params.id } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "id",
          as: "category",
        },
      },
    ]);
    if (!product)
      return res.status(400).json({
        status: "400",
        message: "Not found product with id: " + req.params.id,
        data: {},
      });
    return res.status(200).json({ status: "200", message: "Success", data: product });
  },

  // GET PRODUCTS BY CATEGORY ID
  getProductsByCategoryId: async (req, res) => {
    const start = parseInt(req.query?._start) || 0;
    const limit = parseInt(req.query?._limit) || 40;
    const page = req.query?._page || 1;
    const categoryId = req.params?.id;
    console.log(page);
    try {
      const products = await Category.aggregate([
        { $match: { id: categoryId } },
        {
          $lookup: {
            from: "products",
            localField: "id",
            foreignField: "category",
            as: "products",
            pipeline: [{ $sort: { createdAt: -1 } }, { $skip: start }, { $limit: limit }],
          },
        },
      ]);
      // COUNT PRODUCT BY CATEGORY_ID
      const productMaxCount = await Product.find({ category: categoryId });

      if (!products) {
        return res
          .status(400)
          .json({ status: "400", message: "No products found", data: [] });
      }
      return res.status(200).json({
        status: "200",
        message: "Success",
        data: {
          category: products,
          pagination: {
            _page: page,
            _limit: productMaxCount.length,
            _max_page: Math.ceil(productMaxCount.length / limit),
          },
        },
      });
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
        thumbnails: req.body.thumbnails,
        categories: req.body.categories,
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
            thumbnails: req.body.thumbnails,
            category: req.body.category,
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

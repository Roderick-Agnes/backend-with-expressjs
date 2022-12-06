import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { filterConstant } from "../utils/filterConstant.js";
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
    const filterCode = req.query?._filterBy;
    const rating = req.query?._rating;
    const priceRangeStart = parseInt(req.query?._priceRangeStart);
    const priceRangeEnd = parseInt(req.query?._priceRangeEnd);
    const brandNames = req.query?._brands;
    const categoryId = req.params?.id;

    try {
      let brands = [];

      // USE THIS CALL WHEN I NEED TO UPADTE PAGES NUMBER
      const maxPageNum = await Product.aggregate([
        {
          $match: {
            category: categoryId,
            rating_average:
              rating !== "all"
                ? {
                    $lte: parseInt(rating) + 0.9,
                    $gte: parseInt(rating),
                  }
                : { $gt: 0 },
            salePrice:
              priceRangeEnd !== 0
                ? {
                    $gte: priceRangeStart || 0,
                    $lte: priceRangeEnd,
                  }
                : { $gt: 0 },
            brand_name:
              brandNames && brandNames.length > 0
                ? {
                    $in: brandNames,
                  }
                : { $nin: ["null"] },
          },
        },
      ]);

      // USE THIS CALL WHEN I NEED TO GET ALL BRAND_NAME
      const tmpBrandNames = await Product.aggregate([
        {
          $match: {
            category: categoryId,
            rating_average:
              rating !== "all"
                ? {
                    $lte: parseInt(rating) + 0.9,
                    $gte: parseInt(rating),
                  }
                : { $gt: 0 },
            salePrice:
              priceRangeEnd !== 0
                ? {
                    $gte: priceRangeStart || 0,
                    $lte: priceRangeEnd,
                  }
                : { $gt: 0 },
          },
        },
      ]);

      // GET ALL BRAND_NAME
      await tmpBrandNames.map(async (product) => {
        if (!brands.includes(product.brand_name)) await brands.push(product.brand_name);
      });

      // GET CATEGORY INFORMATION AND PRODUCTS BY THIS CATEGORY
      const products = await Category.aggregate([
        { $match: { id: categoryId } },
        {
          $lookup: {
            from: "products",
            localField: "id",
            foreignField: "category",
            as: "products",
            pipeline: [
              {
                $match: {
                  rating_average:
                    rating !== "all"
                      ? {
                          $lte: parseInt(rating) + 0.9,
                          $gte: parseInt(rating),
                        }
                      : {
                          $gte: 0,
                        },
                  salePrice:
                    priceRangeEnd !== 0
                      ? {
                          $gte: priceRangeStart || 0,
                          $lte: priceRangeEnd,
                        }
                      : { $gt: 0 },
                  brand_name:
                    brandNames && brandNames.length > 0
                      ? {
                          $in: brandNames,
                        }
                      : { $in: brands },
                },
              },

              {
                $sort:
                  (filterCode === filterConstant.hot && {
                    "quantitySold.value": -1,
                  }) ||
                  (filterCode === filterConstant.new && { createdAt: -1 }) ||
                  (filterCode === filterConstant.asc &&
                    ({ salePrice: 1 } || {
                      rootPrice: 1,
                    })) ||
                  (filterCode === filterConstant.desc &&
                    ({ salePrice: -1 } || {
                      rootPrice: -1,
                    })),
              },
              { $skip: start },
              { $limit: limit },
            ],
          },
        },
      ]);

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
          brands,
          pagination: {
            _page: page,
            _total_max: maxPageNum.length, // COUNT PRODUCT BY CATEGORY_ID
            _max_page: Math.ceil(maxPageNum.length / limit),
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

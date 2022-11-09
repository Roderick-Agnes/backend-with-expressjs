import Category from "../models/Category.js";

const categoryController = {
  // GET ALL CATEGORIES
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      if (!categories) {
        return res.status(404).json({ message: "No categories found" });
      }

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // CREATE NEW CATEGORY
  addCategory: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(404).json({ message: "Category required" });
      }

      // Create new category
      const newCategory = new Category({
        title: req.body.title,
        thumbnail: req.body.thumbnail,
      });

      // Save category
      const category = await newCategory.save();

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // UPDATE CATEGORY
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
          // $set: req.body,
          $set: {
            title: req.body.title,
            thumbnail: req.body.thumbnail,
          },
        },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({ message: "Category id is not found" });
      }

      return res.status(200).json({ message: "Update category successfully", category });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // DELETE CATEGORY BY ID
  deleteCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({ message: "Category is not found" });
      }

      await Category.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default categoryController;

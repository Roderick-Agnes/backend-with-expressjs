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
};

export default categoryController;

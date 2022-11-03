import Cart from "../models/Cart.js";

const cartController = {
  // CREATE NEW CART
  addCart: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(404).json({ message: "Cart required" });
      }

      // Create new cart
      const newCart = new Cart({
        userId: req.body.userId,
        products: req.body.products, // array type
      });

      // Save cart
      const cart = await newCart.save();

      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // UPDATE CART
  updateCart: async (req, res) => {
    try {
      const cart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            userId: req.body.userId,
            products: req.body.products, // array type
          },
        },
        { new: true }
      );

      if (!cart) {
        return res.status(404).json({ message: "Cart id is not found" });
      }

      return res.status(200).json({ message: "Update cart successfully", cart });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // DELETE CART BY ID
  deleteCart: async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.id);

      if (!cart) {
        return res.status(404).json({ message: "Cart is not found" });
      }

      await Cart.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // GET CART BY USER ID
  getCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      if (!cart) {
        return res
          .status(404)
          .json({ message: `No cart found with user id: ${req.params.userId}` });
      }
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // GET ALL CARTS
  getAllCarts: async (req, res) => {
    const _limit = req.query._limit;
    // const _sort = req.query._sort; // boolean: true if ascending, false if descending

    try {
      const carts = _limit ? await Cart.find().limit(_limit) : await Cart.find();
      if (!carts) {
        return res.status(404).json({ message: "No carts found" });
      }
      return res.status(200).json(carts);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default cartController;

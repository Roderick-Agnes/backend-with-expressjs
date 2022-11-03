import Order from "../models/Order.js";

const orderController = {
  // CREATE NEW ORDER
  addOrder: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(404).json({ message: "Order required" });
      }

      // Create new order object
      const newOrder = new Order({
        userId: req.body.userId,
        products: req.body.products, // array type
        amount: req.body.amount,
        address: req.body.address,
        orderStatus: req.body.orderStatus,
        paymentStatus: req.body.paymentStatus,
      });

      // Save order
      const order = await newOrder.save();

      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // UPDATE ORDER
  updateOrder: async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            userId: req.body.userId,
            products: req.body.products, // array type
            amount: req.body.amount,
            address: req.body.address,
            orderStatus: req.body.orderStatus,
            paymentStatus: req.body.paymentStatus,
          },
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order id is not found" });
      }

      return res.status(200).json({ message: "Update order successfully", order });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // DELETE ORDER
  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order is not found" });
      }

      await Order.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // GET ORDER BY USER ID
  getOrder: async (req, res) => {
    try {
      const order = await Cart.findOne({ userId: req.params.userId });
      if (!order) {
        return res
          .status(404)
          .json({ message: `No order found with user id: ${req.params.userId}` });
      }
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // GET ALL ORDERS
  getAllOrders: async (req, res) => {
    const _limit = req.query._limit;
    // const _sort = req.query._sort; // boolean: true if ascending, false if descending

    try {
      const orders = _limit ? await Order.find().limit(_limit) : await Order.find();
      if (!orders) {
        return res.status(404).json({ message: "No orders found" });
      }
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default orderController;

import User from "../models/User.js";

const userController = {
  // GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      if (!users) {
        return res.status(404).json({ message: "No users found" });
      }
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // DELERE USER BY ID
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(500).json({ message: "User not found" });
      }
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Delete successful" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default userController;

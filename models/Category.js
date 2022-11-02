import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: "string",
      required: true,
      minlength: 1,
      unique: true,
    },
    thumbnail: {
      type: "string",
      minlength: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);

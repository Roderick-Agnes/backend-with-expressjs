import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: "string",
    },
    title: {
      type: "string",
      required: true,
      unique: true,
    },
    thumbnail: {
      type: "string",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);

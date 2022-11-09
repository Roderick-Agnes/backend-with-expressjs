import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: "string",
      required: true,
      unique: true,
    },
    thumbnail_icon: {
      type: "string",
    },
    products: {
      type: "array",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Collection", collectionSchema);

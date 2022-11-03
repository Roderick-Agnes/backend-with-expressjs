import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: "string",
      required: true,
    },
    thumbnail: {
      type: "array",
      default: [],
    },
    categories: {
      type: "array",
      required: true,
    },
    quantityInWarehouse: {
      type: "number",
      required: true,
    },
    quantitySold: {
      type: "number",
      default: 0,
    },
    rate: {
      type: "number",
      default: 0,
    },
    rootPrice: {
      type: "number",
      default: 0,
    },
    discountRate: {
      type: "number",
      default: 0,
    },
    salePrice: {
      type: "number",
      default: 0,
    },
    inputDay: {
      type: "date",
      default: Date.now(),
    },
    isNew: {
      type: "boolean",
      default: Date.now() - inputDay <= 7 ? true : false,
    },
    information: {
      type: "object",
    },
    description: {
      type: "object",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);

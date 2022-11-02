import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: "string",
      required: true,
      minlength: 1,
    },
    thumbnail: {
      type: "array",
      default: [],
    },
    categoryId: {
      type: "string",
      required: true,
    },
    quantityInWarehouse: {
      type: "number",
      required: true,
      minlength: 1,
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
      default: 0,
    },
    isNew: {
      type: "boolean",
      default: Date.now() - inputDay <= 7 ? true : false,
    },
    information: {
      type: "array",
      maxlenght: 2550,
    },
    description: {
      type: "object",
      maxlenght: 2550,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);

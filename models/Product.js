import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: "string",
      unique: true,
    },
    title: {
      type: "string",
    },
    thumbnails: {
      type: "array",
      default: [],
    },
    category: {
      type: "string",
      required: true,
    },
    brand_name: {
      type: "string",
      required: true,
    },
    quantityInWarehouse: {
      type: "number",
      default: 1000,
    },
    quantitySold: {
      type: "object",
      default: {},
    },
    rootPrice: {
      type: "number",
      default: 0,
    },
    discountRate: {
      type: "number",
      default: 0,
    },
    discount: {
      // = rootPrice - salePrice
      type: "number",
      default: 0,
    },
    salePrice: {
      type: "number",
      default: 0,
    },
    information: {
      type: "array",
      default: "No information available",
    },
    description: {
      type: "string",
      default: "No description available",
    },
    shortDescription: {
      type: "string",
      default: "No short description available",
    },
    rating_average: {
      type: "number",
      default: 0,
    },
    review_count: {
      type: "number",
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);

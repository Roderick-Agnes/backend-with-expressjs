import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoute from "./routers/auth.js";
import userRoute from "./routers/user.js";
import categoryRoute from "./routers/category.js";
import collectionRoute from "./routers/collection.js";
import productRoute from "./routers/product.js";
import cartRoute from "./routers/cart.js";
import orderRoute from "./routers/order.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: (_, callback) => callback(null, true),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// mongoose config
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongo db");
  })
  .catch((err) => {
    console.log("connect to mongo db failed\n", err);
  });

// ROUTES
app.use("/api/auth", authRoute);

app.use("/api/users", userRoute);

app.use("/api/categories", categoryRoute);

app.use("/api/collections", collectionRoute);

app.use("/api/products", productRoute);

app.use("/api/carts", cartRoute);

app.use("/api/orders", orderRoute);

// APP RUNNING
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

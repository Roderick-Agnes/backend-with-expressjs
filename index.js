import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoute from "./routers/auth.js";
import userRoute from "./routers/user.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
app.use("/v1/auth", authRoute);

app.use("/v1/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

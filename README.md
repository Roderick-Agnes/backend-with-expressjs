# First we need to do

1. yarn init
2. add to package.json:
   "scripts": {
   "start": "nodemon index.js"
   },

# Install basic dependencies

-> yarn add express cors nodemon dotenv bcrypt cookie-parser body-parser jsonwebtoken mongoose

# To use 'import', we need to add the following dependencies on top in package.json:

-> "type": "module",

# Basic configuration in index.js file

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoute from "./routers/auth.js";

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

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

// "start": "nodemon --exec babel-node index.js"

# Create .env file with

MONGO_URI = YOUR_MONGO_URI

JWT_ACCESS_KEY = YOUR_SECRET_ACCESS_KEY

JWT_REFRESH_KEY = YOUR_SECRET_REFRESH_KEY

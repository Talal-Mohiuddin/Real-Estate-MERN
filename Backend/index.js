import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorMiddleware } from "./src/middlewares/error.middileware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const renderUrl = "https://real-estate-mern-agf1.onrender.com";
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONT_END_URL, process.env.Dashboard_URL, renderUrl],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGOURL).then(() => {
      console.log("Database connected");
    });
  } catch (error) {
    console.log(error);
  }
}

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

const _dirname = path.resolve();

import userRouter from "./src/routes/user.route.js";
app.use("/user", userRouter);

import listingRouter from "./src/routes/listing.route.js";
app.use("/listing", listingRouter);

app.use(express.static(path.join(_dirname, "../Frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "../Frontend/dist/index.html"));
});

app.use(errorMiddleware);
export default app;

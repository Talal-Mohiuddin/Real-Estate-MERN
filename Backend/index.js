import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

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



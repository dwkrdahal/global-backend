import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      autoIndex: true
    });
    console.log("mongoose connected successfully");
  } catch (error) {
    console.log("db error", error);
    process.exit(0)
  }
};

export default connectdb;

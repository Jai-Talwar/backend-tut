import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(connectionInstance.connection.readyState);
  } catch (e) {
    console.log("mongo error", e);
    process.exit(1);
  }
};
export default connectDB;

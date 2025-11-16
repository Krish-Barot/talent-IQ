import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("DB_URL is not defined in environment variables");
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB", error);
    process.exit(1); 
  }
};
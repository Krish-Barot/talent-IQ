import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// Cache the connection to avoid reconnecting on every serverless invocation
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async() => {
    try {
        if(!process.env.MONGODB_URI){
            console.error("MONGODB_URI environment variable is not set")
            throw new Error("MONGODB_URI is not configured")
        }

        // If already connected, return the existing connection
        if (cached.conn) {
            return cached.conn;
        }

        // If connection is in progress, wait for it
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
            };

            cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
                console.log("✅ Connected to MongoDB");
                return mongoose;
            });
        }

        try {
            cached.conn = await cached.promise;
        } catch (e) {
            cached.promise = null;
            throw e;
        }

        return cached.conn;
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        throw error;
    }
}
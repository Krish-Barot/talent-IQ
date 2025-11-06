import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

// Start server only when running locally (not on Vercel)
const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 8080;
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => console.log(`✅ Server running on port ${port}`));
    } else {
      console.log("✅ Running in Vercel serverless environment");
    }
  } catch (error) {
    console.error("❌ Error starting the server -> ", error);
  }
};

startServer();

export default app;

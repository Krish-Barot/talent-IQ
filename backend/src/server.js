import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express"
import { inngest, functions } from "./lib/inngest.js";

dotenv.config()

const app = express()

// middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use("/api/inngest", serve({client: inngest, functions}))

app.get("/health", (req, res) => {
    res.status(200).json({ message: "API is running!" })
});

const startServer = async () => {
    try {
        await connectDB();
        console.log(`Server running on port ${process.env.PORT}`)
    } catch (error) {
        console.error("Error starting the server -> ", error)
    }
}

startServer();
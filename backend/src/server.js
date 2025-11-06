import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";

dotenv.config()

const app = express()

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
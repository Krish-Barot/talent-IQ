import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();

const app = express();


// middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = [
      process.env.CLIENT_URL,
      "https://talent-iq-frontend-eosin.vercel.app",
    ];

    // allow ANY Vercel preview domain like https://projectname-git-branch-username.vercel.app
    if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running 🎉" });
});


const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => console.log("Server is running on port:", process.env.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};



startServer();
import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
// credentials:true meaning?? => server allows a browser to include cookies on request
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PREVIEW,
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
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
  res.status(200).json({ messaage: "api is up and running" });
});

app.get("/", (req, res) => {
  res.status(200).json({messaage: "Backend is UP !"});
})


const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => console.log("Server is running on port:", process.env.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();

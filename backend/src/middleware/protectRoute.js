import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      // IMPORTANT: req.auth is NOT a function in serverless
      const auth = req.auth;
      const clerkId = auth?.userId;

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized - invalid Clerk token" });
      }

      // find user in db by Clerk ID
      const user = await User.findOne({ clerkId });

      if (!user) {
        return res.status(404).json({ message: "User not found in database" });
      }

      // attach user to req for use in controllers
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

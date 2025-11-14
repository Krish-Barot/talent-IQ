import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // get Clerk auth from request
    const { userId } = getAuth(req);

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid or missing token" });
    }

    // fetch user linked to Clerk userId
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // attach to request
    req.user = user;

    next();
  } catch (error) {
    console.error("protectRoute error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return next();
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select("-passwordHash");
  } catch (err) {}
  return next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  next();
};

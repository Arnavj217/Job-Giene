import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersafesecret_job_giene_jwt_auth_key";

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  try {
    // Try Authorization header first
    const authHeader = req.headers.authorization;
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fallback: check x-user-email header for backward compat during transition
    if (!token && req.headers["x-user-email"]) {
      const email = (req.headers["x-user-email"] as string).trim().toLowerCase();
      // Look up user by email and proceed without JWT validation
      User.findOne({ email }).then(user => {
        if (user) {
          req.user = { id: user._id.toString(), email: user.email, role: user.role };
          next();
        } else {
          res.status(401).json({ error: "User not found. Please log in again." });
        }
      }).catch(() => {
        res.status(401).json({ error: "Authentication failed." });
      });
      return;
    }

    if (!token) {
      res.status(401).json({ error: "Access denied. No authentication token provided." });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Session expired. Please log in again." });
    } else {
      res.status(401).json({ error: "Invalid authentication token." });
    }
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    // Check against hardcoded admin emails OR role field
    const adminEmails = ["aravjain2107@gmail.com", "arnavjain2107@gmail.com"];
    const isAdminEmail = adminEmails.includes(req.user.email.toLowerCase());

    if (!isAdminEmail && req.user.role !== "admin") {
      res.status(403).json({ error: "Access Denied. You do not have valid administrative credentials." });
      return;
    }

    next();
  } catch (error) {
    res.status(403).json({ error: "Admin verification failed." });
  }
}

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { env } from "../config/env";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    try {
        const decoded = verifyToken(token);
        (req as any).user = decoded; // attach user to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
};

export const adminOnly = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = (req as any).user;
    if (user?.role !== "admin") {
        res.status(403).json({ message: "Admin access denied" });
        return;
    }
    next();
};
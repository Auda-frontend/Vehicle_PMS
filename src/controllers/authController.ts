import { Request, Response } from "express";
import { AuthPayload } from "../models/userTypes";
import * as authService from "../services/authService";
import { PrismaClient } from "../../generated/prisma";
import { userByRole } from "../services/authService";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
try {
        const { role, ...rest } = req.body;

        if (role === "admin") {
            // Check if an admin already exists in the database
            const existingAdmin = await userByRole.findUserByRole("admin");
            if (existingAdmin) {
                res.status(403).json({ message: "Cannot register as admin directly" });
                return;
            }
        }

        // Register the user (either as admin if no admin exists or as user)
        const user = await authService.registerUser({ ...rest, role: role || "user" });
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = await authService.loginUser(req.body);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    const user = (req as any).user;
    res.status(200).json(user);
};

export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const currentUser = (req as any).user;
        if (currentUser?.role !== "admin") {
            res.status(403).json({ message: "Admin access required" });
            return;
        }

        const user = await authService.registerUser({ ...req.body, role: "admin" });

        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
import { Request, Response } from "express";
import { AuthPayload } from "../models/userTypes";
import * as authService from "../services/authService";

export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUser(req.body);
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
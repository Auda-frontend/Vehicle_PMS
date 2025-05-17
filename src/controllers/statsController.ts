import { Request, Response } from "express";
import { getSystemStats } from "../services/statsService";

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getSystemStats();
        res.status(200).json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
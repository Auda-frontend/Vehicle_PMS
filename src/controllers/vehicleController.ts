import { Request, Response } from "express";
import * as vehicleService from "../services/vehicleService";
import { createVehicleSchema, updateVehicleSchema } from "../validations/vehicleValidation";

export const createVehicle = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;
        const validatedData = createVehicleSchema.parse(req.body);
        const vehicle = await vehicleService.addVehicle({ ...validatedData, userId });

        res.status(201).json(vehicle);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const listVehicles = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const vehicles = await vehicleService.getVehicles(userId, page, limit);

        res.status(200).json(vehicles);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = updateVehicleSchema.parse(req.body);
        const vehicle = await vehicleService.updateVehicle(id, validatedData);

        res.status(200).json(vehicle);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await vehicleService.deleteVehicle(id);

        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
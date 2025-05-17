import { Request, Response } from "express";
import * as requestService from "../services/requestService";
import { createRequestSchema, approveRequestSchema } from "../validations/requestValidation";

export const createRequest = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;
        const { vehicleId } = createRequestSchema.parse(req.body);
        const request = await requestService.createRequest(userId, vehicleId);

        res.status(201).json(request);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const approveRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { slotId } = approveRequestSchema.parse(req.body);
        const result = await requestService.approveRequest(id, slotId);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const rejectRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const request = await requestService.rejectRequest(id, reason);

        res.status(200).json(request);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const listRequests = async (req: Request, res: Response) => {
    try {
        const { userId, role } = (req as any).user;
        const { status, page, limit } = req.query;

        //Admins can seel all requests, users can only see their own
        const filterUserId = role === 'admin' ? undefined : userId;

        const result = await requestService.listRequests(filterUserId, {
            status: status?.toString(),
            page: page ? parseInt(page.toString()) : 1,
            limit: limit ? parseInt(limit.toString()) : 10,
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};